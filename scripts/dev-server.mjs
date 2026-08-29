import { createServer } from "node:http";
import { mkdir, readFile } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

import { Codex } from "@openai/codex-sdk";

import { allowedProviderUrl, buildCodexPrompt, callResponsesProvider, sanitizeAssistantMessages } from "../lib/assistant-core.mjs";

const projectRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const assistantWorkspace = join(tmpdir(), "aigc-opportunity-radar-assistant");
const port = Number(process.env.RADAR_DEV_PORT || 8000);
const host = "127.0.0.1";
const codex = new Codex();

await mkdir(assistantWorkspace, { recursive: true });

const contentTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".mjs", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".png", "image/png"],
  [".xml", "application/xml; charset=utf-8"],
  [".ics", "text/calendar; charset=utf-8"],
]);

function json(response, status, payload) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  });
  response.end(JSON.stringify(payload));
}

async function readRequestJson(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > 350_000) throw Object.assign(new Error("Request body is too large"), { status: 413 });
    chunks.push(chunk);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw Object.assign(new Error("Request body must be valid JSON"), { status: 400 });
  }
}

function assertLocalOrigin(request) {
  const origin = request.headers.origin;
  if (!origin) return;
  const expected = new Set([`http://${host}:${port}`, `http://localhost:${port}`]);
  if (!expected.has(origin)) throw Object.assign(new Error("Cross-origin requests are not allowed"), { status: 403 });
}

function localProviderHosts(baseUrl) {
  try {
    return ["api.openai.com", new URL(baseUrl).hostname];
  } catch {
    return ["api.openai.com"];
  }
}

async function runLocalCodex(payload) {
  const resume = typeof payload.providerThreadId === "string" && payload.providerThreadId.length > 10;
  const threadOptions = {
    workingDirectory: assistantWorkspace,
    skipGitRepoCheck: true,
    sandboxMode: "read-only",
    approvalPolicy: "never",
    networkAccessEnabled: false,
    webSearchMode: "disabled",
    modelReasoningEffort: "medium",
    threadSource: "aigc-opportunity-radar",
  };
  const thread = resume
    ? codex.resumeThread(payload.providerThreadId, threadOptions)
    : codex.startThread(threadOptions);
  const result = await thread.run(buildCodexPrompt(payload.task, payload.messages, payload.language, { resume }));
  return {
    provider: "local-codex",
    content: result.finalResponse,
    model: null,
    providerThreadId: thread.id,
    usage: result.usage,
  };
}

async function handleAssistant(request, response, url) {
  if (request.method === "GET" && url.pathname === "/api/assistant/status") {
    return json(response, 200, {
      localCodex: true,
      platformConfigured: Boolean(process.env.OPENAI_API_KEY),
      byokSupported: true,
      byokAllowedHosts: ["api.openai.com", "localhost", "127.0.0.1"],
      storageRequired: false,
    });
  }
  if (request.method !== "POST" || url.pathname !== "/api/assistant") return false;
  assertLocalOrigin(request);
  const payload = await readRequestJson(request);
  if (payload.provider === "local-codex") return json(response, 200, await runLocalCodex(payload));
  if (payload.provider !== "platform" && payload.provider !== "byok") {
    throw Object.assign(new Error("Unsupported provider"), { status: 400 });
  }
  const providerConfig = payload.provider === "platform"
    ? {
        baseUrl: "https://api.openai.com/v1",
        apiKey: process.env.OPENAI_API_KEY,
        model: process.env.OPENAI_MODEL || "gpt-5.6",
      }
    : payload.providerConfig;
  const providerHosts = localProviderHosts(providerConfig?.baseUrl);
  const baseUrl = allowedProviderUrl(providerConfig?.baseUrl, {
    allowedHosts: providerHosts,
    allowLocal: true,
  });
  const result = await callResponsesProvider({
    ...providerConfig,
    baseUrl,
    task: payload.task,
    messages: sanitizeAssistantMessages(payload.messages),
    language: payload.language,
  }, { allowedHosts: providerHosts, allowLocal: true });
  return json(response, 200, { ...result, provider: payload.provider });
}

function staticPath(pathname) {
  const decoded = decodeURIComponent(pathname);
  const route = decoded === "/" ? "/index.html" : decoded.endsWith("/") ? `${decoded}index.html` : decoded;
  const allowed = route === "/index.html"
    || route === "/feed.xml"
    || route === "/deadlines.ics"
    || route.startsWith("/assets/")
    || route.startsWith("/data/")
    || route.startsWith("/tasks/");
  if (!allowed || route.includes("..")) return null;
  const filePath = normalize(join(projectRoot, route));
  return filePath.startsWith(projectRoot) ? filePath : null;
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host || `${host}:${port}`}`);
  try {
    const handled = await handleAssistant(request, response, url);
    if (handled !== false) return;
    if (url.pathname === "/api/session") return json(response, 200, { configured: false, storage: "local" });
    if (url.pathname.startsWith("/api/")) return json(response, 404, { error: { code: "not_found" } });
    if (request.method !== "GET" && request.method !== "HEAD") return json(response, 405, { error: { code: "method_not_allowed" } });
    const filePath = staticPath(url.pathname);
    if (!filePath) return json(response, 404, { error: { code: "not_found" } });
    const body = await readFile(filePath);
    response.writeHead(200, {
      "Content-Type": contentTypes.get(extname(filePath)) || "application/octet-stream",
      "Cache-Control": "no-cache",
      "X-Content-Type-Options": "nosniff",
    });
    response.end(request.method === "HEAD" ? undefined : body);
  } catch (error) {
    const status = Number(error.status) || (error.code === "ENOENT" ? 404 : 500);
    json(response, status, { error: { code: error.code || "request_failed", message: status >= 500 ? "Request failed" : error.message } });
  }
});

server.listen(port, host, () => {
  process.stdout.write(`AIGC Opportunity Radar: http://${host}:${port}/\n`);
  process.stdout.write("Local Codex is available through the task assistant. Press Ctrl+C to stop.\n");
});
