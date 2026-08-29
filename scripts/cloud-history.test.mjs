import assert from "node:assert/strict";
import test from "node:test";

import { CloudHistoryClient } from "../assets/cloud-history.mjs";

const installationId = "dvc_123e4567-e89b-42d3-a456-426614174000";

test("cloud history bootstraps a device session and maps database rows", async () => {
  const calls = [];
  const client = new CloudHistoryClient({
    fetch: async (url, options = {}) => {
      calls.push({ url, options });
      if (url === "/api/session") {
        return Response.json({ configured: true, storage: "cloud", device: { label: "174000" } });
      }
      return Response.json({
        threads: [{
          id: "123e4567-e89b-42d3-a456-426614174001",
          opportunity_type: "task",
          opportunity_id: "task-1",
          title: "A saved task",
          provider: "platform",
          model: "gpt-test",
          provider_thread_id: null,
          context_snapshot: { id: "task-1", title: "A saved task" },
          message_count: 1,
          last_message_preview: "Hello",
          client_created_at: "2026-08-29T00:00:00.000Z",
          client_updated_at: "2026-08-29T00:01:00.000Z",
        }],
        messages: [{
          id: "123e4567-e89b-42d3-a456-426614174002",
          thread_id: "123e4567-e89b-42d3-a456-426614174001",
          role: "user",
          content: "Hello",
          provider: "platform",
          status: "completed",
          client_created_at: "2026-08-29T00:01:00.000Z",
          client_updated_at: "2026-08-29T00:01:00.000Z",
        }],
      });
    },
  });

  assert.equal((await client.bootstrap(installationId)).configured, true);
  const history = await client.loadHistory();

  assert.equal(calls[0].options.headers["X-Installation-Id"], installationId);
  assert.equal(history.threads[0].deviceId, installationId);
  assert.equal(history.threads[0].opportunityId, "task-1");
  assert.equal(history.messages[0].threadId, history.threads[0].id);
  assert.equal(history.messages[0].status, "completed");
});

test("cloud history stays a no-op when storage is not configured", async () => {
  const client = new CloudHistoryClient({
    fetch: async () => Response.json({ configured: false, storage: "local" }),
  });
  await client.bootstrap(installationId);
  assert.deepEqual(await client.loadHistory(), { threads: [], messages: [] });
  assert.deepEqual(await client.syncThread({ id: "thread" }, []), { synced: false, reason: "local_only" });
});
