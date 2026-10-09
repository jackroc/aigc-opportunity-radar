import assert from "node:assert/strict";
import test from "node:test";

import { platformAiConfig, utcDayStart } from "../lib/server/ai-runs.mjs";
import tasks from "../data/tasks.json" with { type: "json" };
import { sanitizeTaskContext } from "../lib/assistant-core.mjs";
import { getCanonicalTaskSnapshot } from "../lib/server/task-catalog.mjs";

test("platform AI requires an explicit enable flag and has a bounded daily limit", () => {
  assert.deepEqual(platformAiConfig({ OPENAI_API_KEY: "test-key" }), { enabled: false, dailyLimit: 10 });
  assert.deepEqual(platformAiConfig({
    OPENAI_API_KEY: "test-key",
    PLATFORM_AI_ENABLED: "true",
    PLATFORM_AI_DAILY_LIMIT: "7",
  }), { enabled: true, dailyLimit: 7 });
  assert.equal(platformAiConfig({ PLATFORM_AI_DAILY_LIMIT: "9999" }).dailyLimit, 200);
  assert.equal(utcDayStart("2026-08-29T18:32:00+08:00"), "2026-08-29T00:00:00.000Z");
});

test("hosted conversations use canonical task snapshots from the checked-in directory", () => {
  const source = tasks.find(task => task.platform_id === "github-bounties");
  assert.ok(source, "the public directory includes a GitHub task");
  const snapshot = getCanonicalTaskSnapshot(source.id);
  assert.deepEqual(snapshot, sanitizeTaskContext(source));
  snapshot.title = "mutated";
  assert.notEqual(getCanonicalTaskSnapshot(source.id).title, "mutated");
  assert.equal(getCanonicalTaskSnapshot("not-in-the-directory"), null);
});
