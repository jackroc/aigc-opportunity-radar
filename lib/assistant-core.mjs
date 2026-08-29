import { isIP } from "node:net";

const PROVIDER_MESSAGES_LIMIT = 24;
const MESSAGE_LENGTH_LIMIT = 12000;

function clean(value, maxLength) {
  return String(value ?? "").replaceAll("\u0000", "").trim().slice(0, maxLength);
}

export function sanitizeAssistantMessages(messages) {
  if (!Array.isArray(messages)) return [];
  return messages
    .filter((message) => message && (message.role === "user" || message.role === "assistant"))
    .map((message) => ({ role: message.role, content: clean(message.content, MESSAGE_LENGTH_LIMIT) }))
    .filter((message) => message.content)
    .slice(-PROVIDER_MESSAGES_LIMIT);
}

export function sanitizeTaskContext(task) {
  const value = task && typeof task === "object" ? task : {};
  return {
    id: clean(value.id, 180),
    title: clean(value.title, 300),
    summary: clean(value.summary, 4000),
    applicationUrl: clean(value.applicationUrl ?? value.application_url, 2048),
    sourceRepo: clean(value.sourceRepo ?? value.source_repo, 300),
    sourceNumber: Number.isFinite(Number(value.sourceNumber ?? value.source_number))
      ? Number(value.sourceNumber ?? value.source_number)
      : null,
    sourceUpdatedAt: clean(value.sourceUpdatedAt ?? value.source_updated_at, 64),
    expiresAt: clean(value.expiresAt ?? value.expires_at, 64),
    categories: Array.isArray(value.categories) ? value.categories.map((item) => clean(item, 80)).slice(0, 20) : [],
    skills: Array.isArray(value.skills) ? value.skills.map((item) => clean(item, 120)).slice(0, 30) : [],
    reward: value.reward && typeof value.reward === "object" ? value.reward : null,
    aiPolicy: clean(value.aiPolicy ?? value.ai_policy, 80) || null,
    competition: value.competition && typeof value.competition === "object" ? value.competition : null,
  };
}

export function buildAssistantInstructions(task, language = "zh") {
  const context = sanitizeTaskContext(task);
  const rules = language === "en"
    ? [
        "Act as a cautious opportunity assistant for the task below.",
        "Base factual claims only on the supplied snapshot. Distinguish known facts from questions the user must confirm on the official page.",
        "Never claim a probability of acceptance, winning, or payment. Respect the stated AI-use policy and call out when it is unknown.",
        "Give concise, practical next steps. Do not use shell, file, network, or other tools.",
      ]
    : [
        "你是谨慎的任务机会助理，只围绕下方任务快照回答。",
        "事实只能来自给定快照；未知信息要明确标为需要去官方页面确认。",
        "不要预测中标、验收或付款概率；必须遵守任务的 AI 使用边界，边界未知时要提示核对。",
        "回答应简洁、可执行。不要使用 shell、文件、网络或其他工具。",
      ];
  return `${rules.join("\n")}\n\nTASK_SNAPSHOT\n${JSON.stringify(context, null, 2)}`;
}

export function buildCodexPrompt(task, messages, language = "zh", options = {}) {
  const sanitized = sanitizeAssistantMessages(messages);
  const latest = sanitized.filter((message) => message.role === "user").at(-1)?.content ?? "";
  if (options.resume) return latest;
  const transcript = sanitized.map((message) => `${message.role.toUpperCase()}: ${message.content}`).join("\n\n");
  return `${buildAssistantInstructions(task, language)}\n\nCONVERSATION\n${transcript}`;
}

export function allowedProviderUrl(value, options = {}) {
  try {
    const url = new URL(value);
    const hostname = url.hostname.toLowerCase();
    const allowLocal = options.allowLocal === true;
    const local = hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
    if (url.username || url.password || url.search || url.hash) return null;
    if (local && allowLocal && (url.protocol === "http:" || url.protocol === "https:")) {
      return url.href.replace(/\/+$/, "");
    }
    if (url.protocol !== "https:" || local || hostname.endsWith(".local")) return null;
    const ipVersion = isIP(hostname);
    if (ipVersion) return null;
    const allowedHosts = new Set(
      (options.allowedHosts ?? ["api.openai.com"])
        .map((host) => String(host).trim().toLowerCase())
        .filter(Boolean),
    );
    if (!allowedHosts.has(hostname)) return null;
    return url.href.replace(/\/+$/, "");
  } catch {
    return null;
  }
}

export function extractResponseText(response) {
  if (typeof response?.output_text === "string" && response.output_text.trim()) return response.output_text.trim();
  return (response?.output ?? [])
    .flatMap((item) => Array.isArray(item?.content) ? item.content : [])
    .filter((item) => item?.type === "output_text" && typeof item.text === "string")
    .map((item) => item.text)
    .join("\n")
    .trim();
}

export async function callResponsesProvider(input, options = {}) {
  const baseUrl = allowedProviderUrl(input.baseUrl, {
    allowedHosts: options.allowedHosts,
    allowLocal: options.allowLocal,
  });
  if (!baseUrl) {
    const error = new Error("The configured AI API endpoint is not allowed");
    error.code = "provider_endpoint_not_allowed";
    error.status = 400;
    throw error;
  }
  const apiKey = clean(input.apiKey, 500);
  const model = clean(input.model, 160);
  if (!apiKey || !model) {
    const error = new Error("An API key and model are required");
    error.code = "provider_configuration_required";
    error.status = 400;
    throw error;
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? 60_000);
  try {
    const response = await (options.fetch ?? fetch)(`${baseUrl}/responses`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        instructions: buildAssistantInstructions(input.task, input.language),
        input: sanitizeAssistantMessages(input.messages),
        max_output_tokens: 1400,
        store: false,
      }),
      signal: controller.signal,
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      const error = new Error("The AI provider rejected the request");
      error.code = "provider_request_failed";
      error.status = response.status >= 500 ? 503 : 400;
      error.providerStatus = response.status;
      throw error;
    }
    const content = extractResponseText(payload);
    if (!content) {
      const error = new Error("The AI provider returned an empty response");
      error.code = "provider_empty_response";
      error.status = 502;
      throw error;
    }
    return {
      content,
      model: payload.model ?? model,
      providerThreadId: payload.id ?? null,
      requestId: response.headers.get("x-request-id"),
      usage: payload.usage ?? null,
    };
  } finally {
    clearTimeout(timeout);
  }
}
