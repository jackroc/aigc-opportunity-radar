import assert from "node:assert/strict";
import test from "node:test";

import {
  allowedProviderUrl,
  buildAssistantInstructions,
  extractResponseText,
  sanitizeAssistantMessages,
} from "../lib/assistant-core.mjs";
import { buildRuleAssistantReply } from "../assets/conversation-assistant.mjs";

const task = {
  id: "task-1",
  title: "Example task",
  reward: { amount_min: 50, currency: "USD", confirmed: false },
  ai_policy: "unknown",
  competition: { level: "high", comment_count: 12 },
  categories: ["development"],
};

test("hosted BYOK endpoints require HTTPS and an explicit host allowlist", () => {
  assert.equal(allowedProviderUrl("https://api.openai.com/v1"), "https://api.openai.com/v1");
  assert.equal(allowedProviderUrl("http://api.openai.com/v1"), null);
  assert.equal(allowedProviderUrl("https://127.0.0.1/v1", { allowedHosts: ["127.0.0.1"] }), null);
  assert.equal(allowedProviderUrl("https://example.com/v1"), null);
  assert.equal(allowedProviderUrl("https://example.com/v1", { allowedHosts: ["example.com"] }), "https://example.com/v1");
});

test("assistant context remains task-bound and output parsing is deterministic", () => {
  const instructions = buildAssistantInstructions(task, "en");
  assert.match(instructions, /Never claim a probability/);
  assert.match(instructions, /"aiPolicy": "unknown"/);
  assert.deepEqual(sanitizeAssistantMessages([{ role: "tool", content: "secret" }, { role: "user", content: " hi " }]), [
    { role: "user", content: "hi" },
  ]);
  assert.equal(extractResponseText({ output: [{ content: [{ type: "output_text", text: "Answer" }] }] }), "Answer");
});

test("rule assistant answers are saved-provider compatible without claiming success odds", () => {
  const answer = buildRuleAssistantReply(task, {}, "赏金有保证吗？", "zh");
  assert.match(answer, /50 USD/);
  assert.match(answer, /不会把付款视为已担保/);
});
