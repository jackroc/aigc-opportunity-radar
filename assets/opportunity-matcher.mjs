export const PROFILE_STORAGE_KEY = "opportunity-profile-v1";

export const PROFILE_CATEGORIES = Object.freeze([
  "development",
  "ai-automation",
  "writing",
  "video",
  "design",
  "data",
  "research",
  "testing",
]);

const PROFILE_GOALS = new Set(["balanced", "reward", "lower-competition"]);
const REWARD_PREFERENCES = new Set(["any", "priced"]);
const COMPETITION_TOLERANCES = new Set(["low", "medium", "high"]);
const AI_PREFERENCES = new Set(["any", "clear", "human-only"]);
const WEEKLY_HOURS = new Set([2, 5, 10, 20]);
const COMPETITION_RANK = Object.freeze({ low: 1, medium: 2, high: 3 });

function unique(values) {
  return [...new Set(values)];
}

function normalizedText(value) {
  return String(value ?? "").normalize("NFKC").trim().toLocaleLowerCase();
}

export function parseSkillKeywords(value) {
  const values = Array.isArray(value) ? value : String(value ?? "").split(/[,，;；\n]/u);
  const seen = new Set();
  const keywords = [];
  for (const value of values) {
    const display = String(value ?? "").normalize("NFKC").trim();
    const key = normalizedText(display);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    keywords.push(display);
  }
  return keywords.slice(0, 12);
}

export function normalizeProfile(input = {}) {
  const categories = unique(
    (Array.isArray(input.categories) ? input.categories : []).filter((category) => PROFILE_CATEGORIES.includes(category)),
  );
  const weeklyHours = Number(input.weeklyHours);
  return {
    categories,
    skillKeywords: parseSkillKeywords(input.skillKeywords),
    weeklyHours: WEEKLY_HOURS.has(weeklyHours) ? weeklyHours : 5,
    goal: PROFILE_GOALS.has(input.goal) ? input.goal : "balanced",
    rewardPreference: REWARD_PREFERENCES.has(input.rewardPreference) ? input.rewardPreference : "any",
    competitionTolerance: COMPETITION_TOLERANCES.has(input.competitionTolerance)
      ? input.competitionTolerance
      : "medium",
    aiPreference: AI_PREFERENCES.has(input.aiPreference) ? input.aiPreference : "any",
  };
}

function taskText(task) {
  return normalizedText(
    [
      task.title,
      task.summary,
      task.source_repo,
      ...(task.categories || []),
      ...(task.skills || []),
    ].join(" "),
  );
}

function freshnessScore(task, now) {
  const updatedAt = Date.parse(task.source_updated_at);
  if (!Number.isFinite(updatedAt)) return 0;
  const days = Math.max(0, (now.valueOf() - updatedAt) / 86_400_000);
  if (days <= 7) return 10;
  if (days <= 30) return 7;
  if (days <= 90) return 4;
  return 1;
}

function competitionFit(level, tolerance) {
  const rank = COMPETITION_RANK[level] || 3;
  const allowedRank = COMPETITION_RANK[tolerance] || 2;
  if (rank <= allowedRank) return 10;
  return rank - allowedRank === 1 ? 4 : 0;
}

function aiFit(policy, preference) {
  if (preference === "any") return null;
  if (preference === "clear") return policy === "unknown" ? 2 : 10;
  if (policy === "human-only") return 10;
  if (policy === "unknown") return 5;
  if (policy === "limited") return 4;
  return 2;
}

function addSignal(target, code, values = []) {
  if (!target.some((entry) => entry.code === code)) target.push({ code, values });
}

export function scoreTaskAgainstProfile(task, inputProfile, options = {}) {
  const profile = normalizeProfile(inputProfile);
  const now = options.now instanceof Date ? options.now : new Date(options.now || Date.now());
  const signals = [];
  const cautions = [];
  let earned = 0;
  let possible = 0;

  if (profile.categories.length) {
    possible += 45;
    const matches = (task.categories || []).filter((category) => profile.categories.includes(category));
    if (matches.length) {
      earned += 45;
      addSignal(signals, "category-match", matches);
    } else {
      earned += 5;
      addSignal(cautions, "category-miss");
    }
  }

  if (profile.skillKeywords.length) {
    possible += 20;
    const haystack = taskText(task);
    const matches = profile.skillKeywords.filter((keyword) => haystack.includes(normalizedText(keyword)));
    earned += 20 * (matches.length / profile.skillKeywords.length);
    if (matches.length) addSignal(signals, "keyword-match", matches);
    else addSignal(cautions, "keyword-miss");
  }

  possible += 15;
  if (profile.goal === "reward") {
    if (Number.isFinite(task.reward?.amount_min)) {
      earned += 15;
      addSignal(signals, "reward-visible");
    } else {
      earned += 3;
      addSignal(cautions, "reward-unknown");
    }
  } else if (profile.goal === "lower-competition") {
    const fit = competitionFit(task.competition?.level, "low");
    earned += Math.min(15, fit * 1.5);
    if (task.competition?.level === "low") addSignal(signals, "lower-competition");
    else addSignal(cautions, "competition-above-goal");
  } else {
    earned += 10;
  }

  if (profile.rewardPreference === "priced") {
    possible += 10;
    if (Number.isFinite(task.reward?.amount_min)) {
      earned += 10;
      addSignal(signals, "reward-visible");
    } else {
      addSignal(cautions, "reward-unknown");
    }
  }

  possible += 10;
  const competitionPoints = competitionFit(task.competition?.level, profile.competitionTolerance);
  earned += competitionPoints;
  if (competitionPoints === 10) addSignal(signals, "competition-fit");
  else addSignal(cautions, "competition-high");

  const aiPoints = aiFit(task.ai_policy, profile.aiPreference);
  if (aiPoints !== null) {
    possible += 10;
    earned += aiPoints;
    if (aiPoints === 10) addSignal(signals, "ai-policy-fit");
    else addSignal(cautions, "ai-policy-check");
  }

  possible += 10;
  const freshPoints = freshnessScore(task, now);
  earned += freshPoints;
  if (freshPoints >= 7) addSignal(signals, "recently-active");
  else addSignal(cautions, "stale-activity");

  if (task.reward?.confirmed !== true) addSignal(cautions, "reward-unconfirmed");
  if (task.ai_policy === "unknown") addSignal(cautions, "ai-policy-check");
  if (task.competition?.level === "high") addSignal(cautions, "competition-high");

  const score = possible > 0 ? Math.max(0, Math.min(100, Math.round((earned / possible) * 100))) : 0;
  const band = score >= 75 ? "strong" : score >= 50 ? "possible" : "explore";
  return { score, band, signals: signals.slice(0, 3), cautions: cautions.slice(0, 4) };
}

export function buildTaskPlan(task, inputProfile) {
  const profile = normalizeProfile(inputProfile);
  const preflight = ["confirm-availability", "confirm-acceptance"];
  if (task.reward?.confirmed !== true) preflight.push("confirm-reward");
  preflight.push(task.ai_policy === "unknown" ? "confirm-ai-policy" : "follow-ai-policy");

  const prepare = ["summarize-requirements", "share-approach"];
  if (profile.weeklyHours <= 5) prepare.push("timebox-small");
  else prepare.push("timebox-weekly");
  if (task.competition?.level === "high") prepare.push("differentiate-early");

  const execute = [];
  const categories = new Set(task.categories || []);
  if (categories.has("development") || categories.has("ai-automation")) execute.push("prototype-and-tests");
  if (categories.has("writing")) execute.push("outline-and-sources");
  if (categories.has("video")) execute.push("storyboard-and-sample");
  if (categories.has("design") || categories.has("image")) execute.push("concept-and-variants");
  if (!execute.length) execute.push("smallest-verifiable-sample");
  execute.push("post-progress-evidence");

  const submit = ["verify-deliverables", "include-evidence", "self-review"];
  return { preflight, prepare, execute, submit, weeklyHours: profile.weeklyHours };
}

function profileSummary(profile) {
  const values = [
    profile.categories.length ? `strengths: ${profile.categories.join(", ")}` : "strengths: not specified",
    profile.skillKeywords.length ? `keywords: ${profile.skillKeywords.join(", ")}` : "keywords: not specified",
    `available time: ${profile.weeklyHours} hours/week`,
    `goal: ${profile.goal}`,
  ];
  return values.join("; ");
}

export function buildOutreachTemplate(task, inputProfile) {
  const profile = normalizeProfile(inputProfile);
  const strengthLine = profile.skillKeywords.length
    ? `My relevant skills include ${profile.skillKeywords.join(", ")}.`
    : profile.categories.length
      ? `My relevant strengths are ${profile.categories.join(", ")}.`
      : "I can share a short implementation plan before I begin.";
  const rewardQuestion = task.reward?.confirmed === true
    ? "Is the stated reward and payout process still current?"
    : "Is a reward still available, and what are the acceptance and payout conditions?";

  return [
    `Hi maintainers — I’m interested in working on “${task.title}”.`,
    "",
    strengthLine,
    "Before I start, could you please confirm:",
    "1. Is the task still open for a new contributor, and should I wait to be assigned?",
    `2. ${rewardQuestion}`,
    "3. Are there any task-specific rules for AI-assisted tools or generated content?",
    "4. What evidence or deliverables will be used for acceptance?",
    "",
    "If it is available, I’ll first share a concise scope and progress checkpoint before investing significant time.",
  ].join("\n");
}

export function buildAssistantPrompt(task, inputProfile, language = "zh") {
  const profile = normalizeProfile(inputProfile);
  const reward = Number.isFinite(task.reward?.amount_min)
    ? `${task.reward.amount_min} ${task.reward.currency || ""}`.trim()
    : "not stated";
  const facts = [
    `Title: ${task.title}`,
    `Official URL: ${task.application_url}`,
    `Summary: ${task.summary || "not provided"}`,
    `Categories: ${(task.categories || []).join(", ") || "not provided"}`,
    `Skills: ${(task.skills || []).join(", ") || "not provided"}`,
    `Reward: ${reward}; confirmed: ${task.reward?.confirmed === true ? "yes" : "no"}`,
    `Visible competition: ${task.competition?.level || "unknown"}; public discussions: ${task.competition?.comment_count ?? "unknown"}`,
    `AI-use policy: ${task.ai_policy || "unknown"}`,
    `My profile: ${profileSummary(profile)}`,
  ].join("\n");

  if (language === "en") {
    return `Act as a cautious opportunity coach. Analyze the task below without claiming that the reward, acceptance, or success probability is guaranteed. Clearly label unknowns and ask me to verify the official rules.\n\n${facts}\n\nReturn: (1) fit analysis with evidence, (2) questions to ask before starting, (3) the smallest verifiable execution plan, (4) submission checklist, and (5) a concise maintainer message. Do not invent requirements or payout terms.`;
  }
  return `你是一名谨慎的任务机会教练。请分析下面的任务，但不要声称赏金、验收或成功概率有保证；未知信息必须明确标注，并提醒我核对官方规则。\n\n${facts}\n\n请输出：（1）有证据的匹配分析；（2）开工前要确认的问题；（3）最小可验证执行方案；（4）提交检查清单；（5）发给维护者的简短消息。不要编造任务要求或付款条件。`;
}
