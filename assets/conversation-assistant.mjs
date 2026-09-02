import { buildTaskPlan, normalizeProfile } from "./opportunity-matcher.mjs";

function includesAny(value, words) {
  const normalized = String(value ?? "").normalize("NFKC").toLocaleLowerCase();
  return words.some((word) => normalized.includes(word));
}

function rewardText(task, language) {
  if (!Number.isFinite(task.reward?.amount_min)) return language === "en" ? "The amount is not stated." : "公开信息没有注明金额。";
  const value = `${task.reward.amount_min} ${task.reward.currency || ""}`.trim();
  return language === "en" ? `The published amount is ${value}.` : `公开标价为 ${value}。`;
}

export function buildRuleAssistantReply(task, profile, question, language = "zh") {
  const plan = buildTaskPlan(task, normalizeProfile(profile));
  const aiQuestion = includesAny(question, ["ai", "人工智能", "模型", "agent", "智能体"]);
  const rewardQuestion = includesAny(question, ["reward", "payout", "bounty", "money", "赏金", "报酬", "钱", "付款"]);
  const competitionQuestion = includesAny(question, ["competition", "chance", "竞争", "成功率", "概率"]);

  if (language === "en") {
    if (aiQuestion) {
      const policy = task.ai_policy || "unknown";
      return `The published AI-use boundary is “${policy}”. Treat it as a lead, not final permission: confirm what assistance is allowed, what must be disclosed, and whether generated deliverables are accepted on the official task page before using a model.`;
    }
    if (rewardQuestion) {
      return `${rewardText(task, language)} The directory does not treat payout as guaranteed. Confirm that the task is still unassigned, who decides acceptance, the exact deliverables, the payout method, and when payment is released before investing substantial time.`;
    }
    if (competitionQuestion) {
      const level = task.competition?.level || "unknown";
      const discussions = Number.isFinite(task.competition?.comment_count) ? task.competition.comment_count : "unknown";
      return `Visible competition is “${level}” with ${discussions} public discussions. This is not an acceptance probability. Differentiate early with a reproducible sample or concise approach, and wait for assignment or confirmation before doing high-effort work.`;
    }
    return `Start with a small, reversible checkpoint: (1) confirm availability, acceptance, reward, and AI rules; (2) restate the scope and share an approach; (3) build the smallest verifiable sample; (4) submit evidence against every official requirement. This rule-based answer is saved in your conversation history and does not call a model.`;
  }

  if (aiQuestion) {
    const policy = task.ai_policy || "unknown";
    return `公开记录中的 AI 使用边界是“${policy}”。这只能作为线索，不能替代最终许可：使用模型前，请在官方任务页面确认允许哪些辅助、需要披露什么，以及是否接受生成式交付物。`;
  }
  if (rewardQuestion) {
    return `${rewardText(task, language)}目录不会把付款视为已担保。投入大量时间前，请确认任务是否仍可认领、谁负责验收、具体交付物、付款方式与付款时间。`;
  }
  if (competitionQuestion) {
    const level = task.competition?.level || "unknown";
    const discussions = Number.isFinite(task.competition?.comment_count) ? task.competition.comment_count : "未知";
    return `当前可见竞争度为“${level}”，公开讨论数为 ${discussions}。这不是成功概率。建议先用可复现样例或简短方案证明差异，并在得到认领或确认后再投入高强度工作。`;
  }
  return `建议从一个小而可撤回的检查点开始：（1）确认名额、验收、赏金和 AI 规则；（2）复述范围并先发方案；（3）完成最小可验证样例；（4）逐项对照官方要求提交证据。本回答由规则助手生成并保存进对话历史，没有调用模型。计划共包含 ${plan.preflight.length + plan.prepare.length + plan.execute.length + plan.submit.length} 个检查项。`;
}

export async function loadAssistantCapabilities(fetcher = globalThis.fetch?.bind(globalThis)) {
  if (!fetcher) return { localCodex: false, platformConfigured: false, byokSupported: false };
  try {
    const response = await fetcher("/api/assistant", { method: "GET", cache: "no-store" });
    if (response.status === 404) {
      const localResponse = await fetcher("/api/assistant/status", { method: "GET", cache: "no-store" });
      if (!localResponse.ok) throw new Error(`status_${localResponse.status}`);
      return localResponse.json();
    }
    if (!response.ok) throw new Error(`status_${response.status}`);
    return response.json();
  } catch {
    return { localCodex: false, platformConfigured: false, byokSupported: false };
  }
}

export async function callAssistant(input, fetcher = globalThis.fetch?.bind(globalThis)) {
  if (!fetcher) throw new Error("assistant_unavailable");
  const response = await fetcher("/api/assistant", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(data?.error?.code || `assistant_${response.status}`);
    error.code = data?.error?.code || "assistant_request_failed";
    throw error;
  }
  return data;
}
