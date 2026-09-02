import assert from "node:assert/strict";
import test from "node:test";

import { platformAiConfig, utcDayStart } from "../lib/server/ai-runs.mjs";
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
  const snapshot = getCanonicalTaskSnapshot("github-tscircuit-jlcsearch-92");
  assert.equal(snapshot.id, "github-tscircuit-jlcsearch-92");
  assert.equal(snapshot.aiPolicy, "unknown");
  assert.match(snapshot.applicationUrl, /^https:\/\/github\.com\//);
  snapshot.title = "mutated";
  assert.notEqual(getCanonicalTaskSnapshot("github-tscircuit-jlcsearch-92").title, "mutated");
  assert.equal(getCanonicalTaskSnapshot("not-in-the-directory"), null);
});
