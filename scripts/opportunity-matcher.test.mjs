import assert from "node:assert/strict";
import test from "node:test";

import {
  buildAssistantPrompt,
  buildOutreachTemplate,
  buildTaskPlan,
  normalizeProfile,
  scoreTaskAgainstProfile,
} from "../assets/opportunity-matcher.mjs";

const baseTask = {
  id: "sample-task",
  title: "Add an AWS integration to the JavaScript SDK",
  summary: "Implement the API client, TypeScript types, documentation, and tests.",
  application_url: "https://github.com/example/project/issues/12",
  categories: ["development", "ai-automation"],
  skills: ["JavaScript", "TypeScript", "AWS"],
  reward: { amount_min: 100, currency: "USD", confirmed: false },
  competition: { level: "medium", comment_count: 8 },
  ai_policy: "unknown",
  source_repo: "example/project",
  source_updated_at: "2026-08-27T00:00:00.000Z",
};

test("profiles are normalized and unsupported values are removed", () => {
  const profile = normalizeProfile({
    categories: ["development", "development", "not-real"],
    skillKeywords: " TypeScript，AWS, typescript ",
    weeklyHours: 7,
    goal: "not-real",
    rewardPreference: "priced",
    competitionTolerance: "low",
    aiPreference: "clear",
  });

  assert.deepEqual(profile.categories, ["development"]);
  assert.deepEqual(profile.skillKeywords, ["TypeScript", "AWS"]);
  assert.equal(profile.weeklyHours, 5);
  assert.equal(profile.goal, "balanced");
  assert.equal(profile.rewardPreference, "priced");
});

test("matching rewards evidence-based category and keyword overlap", () => {
  const profile = {
    categories: ["development"],
    skillKeywords: ["typescript", "aws"],
    weeklyHours: 10,
    goal: "reward",
    rewardPreference: "priced",
    competitionTolerance: "medium",
    aiPreference: "any",
  };
  const matched = scoreTaskAgainstProfile(baseTask, profile, { now: "2026-08-29T00:00:00.000Z" });
  const mismatched = scoreTaskAgainstProfile(
    { ...baseTask, categories: ["writing"], skills: ["Copywriting"], title: "Write a launch article", summary: "Draft copy." },
    profile,
    { now: "2026-08-29T00:00:00.000Z" },
  );

  assert.ok(matched.score > mismatched.score);
  assert.ok(matched.signals.some((entry) => entry.code === "category-match"));
  assert.ok(matched.signals.some((entry) => entry.code === "keyword-match"));
  assert.ok(matched.cautions.some((entry) => entry.code === "reward-unconfirmed"));
});

test("task plans include explicit confirmation and category-specific work", () => {
  const plan = buildTaskPlan(baseTask, { categories: ["development"], weeklyHours: 2 });
  assert.ok(plan.preflight.includes("confirm-reward"));
  assert.ok(plan.preflight.includes("confirm-ai-policy"));
  assert.ok(plan.prepare.includes("timebox-small"));
  assert.ok(plan.execute.includes("prototype-and-tests"));
  assert.ok(plan.submit.includes("include-evidence"));
});

test("copyable templates preserve uncertainty instead of promising a payout", () => {
  const outreach = buildOutreachTemplate(baseTask, { skillKeywords: ["TypeScript"] });
  const prompt = buildAssistantPrompt(baseTask, { categories: ["development"] }, "zh");

  assert.match(outreach, /Is a reward still available/);
  assert.match(outreach, /wait to be assigned/);
  assert.match(prompt, /不要声称赏金、验收或成功概率有保证/);
  assert.match(prompt, /https:\/\/github\.com\/example\/project\/issues\/12/);
  assert.doesNotMatch(prompt, /保证获得赏金/);
});
