import assert from "node:assert/strict";
import test from "node:test";

import {
  LocalConversationStore,
  changeConversationProvider,
  createConversationMessage,
  createConversationThread,
  snapshotTask,
} from "../assets/conversation-store.mjs";

const task = {
  id: "github:example/repo:12",
  title: "Build a reproducible demo",
  summary: "Create a small demo with tests.",
  application_url: "https://github.com/example/repo/issues/12",
  source_repo: "example/repo",
  source_number: 12,
  source_updated_at: "2026-08-28T00:00:00Z",
  expires_at: "2026-10-01T00:00:00Z",
  categories: ["development"],
  skills: ["JavaScript"],
  reward: { amount_min: 100, currency: "USD", confirmed: false },
  ai_policy: "limited",
  competition: { level: "medium", comment_count: 4 },
};

function storage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
}

test("task snapshot preserves the facts used by a historical conversation", () => {
  const snapshot = snapshotTask(task);
  assert.equal(snapshot.title, task.title);
  assert.equal(snapshot.aiPolicy, "limited");
  assert.deepEqual(snapshot.reward, task.reward);
  task.reward.amount_min = 999;
  assert.equal(snapshot.reward.amount_min, 100);
});

test("local conversation store keeps all providers in one history", async () => {
  const store = new LocalConversationStore(storage());
  const thread = createConversationThread({
    id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    deviceId: "dvc_123e4567-e89b-42d3-a456-426614174000",
    task,
    provider: "local-codex",
  }, { now: "2026-08-29T01:00:00.000Z" });
  await store.putThread(thread);
  const user = createConversationMessage({
    id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
    threadId: thread.id,
    role: "user",
    content: "What should I confirm first?",
    provider: "local-codex",
  }, { now: "2026-08-29T01:01:00.000Z" });
  const assistant = createConversationMessage({
    id: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
    threadId: thread.id,
    role: "assistant",
    content: "Confirm assignment and payout.",
    provider: "byok",
  }, { now: "2026-08-29T01:02:00.000Z" });
  await store.putMessage(user);
  await store.putMessage(assistant);
  const savedThread = await store.getThread(thread.id);
  assert.equal(savedThread.messageCount, 2);
  assert.equal(savedThread.lastMessagePreview, assistant.content);
  assert.deepEqual((await store.listMessages(thread.id)).map((message) => message.provider), ["local-codex", "byok"]);
  const exported = await store.exportThread(thread.id);
  assert.equal(JSON.stringify(exported).includes("apiKey"), false);
  await store.deleteThread(thread.id);
  assert.equal(await store.getThread(thread.id), null);
});

test("switching providers clears provider-specific continuation state", () => {
  const thread = createConversationThread({
    id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    deviceId: "dvc_123e4567-e89b-42d3-a456-426614174000",
    task,
    provider: "local-codex",
    model: "codex-model",
    providerThreadId: "codex-thread-id",
  }, { now: "2026-08-29T01:00:00.000Z" });
  const switched = changeConversationProvider(thread, "byok", { now: "2026-08-29T02:00:00.000Z" });
  assert.equal(switched.provider, "byok");
  assert.equal(switched.model, null);
  assert.equal(switched.providerThreadId, null);
  assert.equal(switched.updatedAt, "2026-08-29T02:00:00.000Z");
});

test("a user message sorts before its assistant reply when timestamps collide", async () => {
  const store = new LocalConversationStore(storage());
  const thread = createConversationThread({
    id: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
    deviceId: "dvc_123e4567-e89b-42d3-a456-426614174000",
    task,
    provider: "rules",
  }, { now: "2026-08-29T03:00:00.000Z" });
  await store.putThread(thread);
  const assistant = createConversationMessage({
    id: "00000000-0000-4000-8000-000000000001",
    threadId: thread.id,
    role: "assistant",
    content: "Reply",
    provider: "rules",
  }, { now: "2026-08-29T03:01:00.000Z" });
  const user = createConversationMessage({
    id: "ffffffff-ffff-4fff-8fff-ffffffffffff",
    threadId: thread.id,
    role: "user",
    content: "Question",
    provider: "rules",
  }, { now: "2026-08-29T03:01:00.000Z" });
  await store.putMessage(assistant);
  await store.putMessage(user);
  assert.deepEqual((await store.listMessages(thread.id)).map((message) => message.role), ["user", "assistant"]);
});
