import { assertSameOrigin, isUuid, readDeviceSession } from "../lib/server/device-session.mjs";
import { errorResponse, json, readJson } from "../lib/server/http.mjs";
import { getDatabaseConfig, supabaseRequest } from "../lib/server/supabase-rest.mjs";
import { getCanonicalTaskSnapshot } from "../lib/server/task-catalog.mjs";

const PROVIDERS = new Set(["rules", "local-codex", "platform", "byok"]);
const ROLES = new Set(["user", "assistant", "system"]);
const STATUSES = new Set(["pending", "completed", "failed"]);

function text(value, maxLength) {
  return String(value ?? "").replaceAll("\u0000", "").trim().slice(0, maxLength);
}

function requireSession(request) {
  const secret = String(process.env.DEVICE_SESSION_SECRET ?? "");
  const session = readDeviceSession(request, secret);
  if (!session) {
    const error = new Error("A valid device session is required");
    error.code = "device_session_required";
    error.status = 401;
    throw error;
  }
  return session;
}

function threadRow(thread, ownerDeviceId, existing) {
  if (!isUuid(thread?.id)) throw Object.assign(new Error("Invalid thread id"), { status: 400 });
  const requestedOpportunityId = text(thread.opportunityId ?? thread.contextSnapshot?.id, 180);
  const context = existing?.context_snapshot ?? getCanonicalTaskSnapshot(requestedOpportunityId);
  if (!context) {
    const error = new Error("The task is not present in the verified directory");
    error.code = "unknown_task";
    error.status = 400;
    throw error;
  }
  const provider = PROVIDERS.has(thread.provider) ? thread.provider : "rules";
  return {
    id: thread.id,
    owner_device_id: ownerDeviceId,
    opportunity_type: "task",
    opportunity_id: existing?.opportunity_id ?? context.id,
    title: existing?.title ?? context.title,
    provider,
    model: text(thread.model, 160) || null,
    provider_thread_id: text(thread.providerThreadId, 300) || null,
    context_snapshot: context,
    last_message_preview: text(thread.lastMessagePreview, 120),
    message_count: Math.max(0, Math.min(10000, Number(thread.messageCount) || 0)),
    client_created_at: thread.createdAt || new Date().toISOString(),
    client_updated_at: thread.updatedAt || new Date().toISOString(),
  };
}

async function existingThread(database, threadId) {
  const rows = await supabaseRequest(
    database,
    `conversation_threads?id=eq.${encodeURIComponent(threadId)}&select=id,owner_device_id,opportunity_id,title,context_snapshot&limit=1`,
  );
  return rows?.[0] ?? null;
}

async function assertMessageOwnership(database, messages, deviceId, threadId) {
  const ids = messages.map((message) => message.id).filter(isUuid);
  for (let offset = 0; offset < ids.length; offset += 75) {
    const chunk = ids.slice(offset, offset + 75);
    const rows = await supabaseRequest(
      database,
      `conversation_messages?id=in.(${chunk.join(",")})&select=id,owner_device_id,thread_id`,
    );
    if ((rows ?? []).some((row) => row.owner_device_id !== deviceId || row.thread_id !== threadId)) {
      const error = new Error("A conversation message belongs to another thread or device");
      error.code = "conversation_owner_mismatch";
      error.status = 403;
      throw error;
    }
  }
}

function messageRow(message, ownerDeviceId, threadId) {
  if (!isUuid(message?.id) || message.threadId !== threadId) {
    throw Object.assign(new Error("Invalid conversation message"), { status: 400 });
  }
  const role = ROLES.has(message.role) ? message.role : "user";
  const status = STATUSES.has(message.status) ? message.status : "completed";
  const content = text(message.content, 32000);
  if (!content && status !== "pending") throw Object.assign(new Error("Message content is required"), { status: 400 });
  return {
    id: message.id,
    thread_id: threadId,
    owner_device_id: ownerDeviceId,
    role,
    content,
    provider: PROVIDERS.has(message.provider) ? message.provider : null,
    model: text(message.model, 160) || null,
    provider_thread_id: text(message.providerThreadId, 300) || null,
    status,
    error_code: text(message.errorCode, 120) || null,
    usage: message.usage && typeof message.usage === "object" ? message.usage : null,
    client_created_at: message.createdAt || new Date().toISOString(),
    client_updated_at: message.updatedAt || new Date().toISOString(),
  };
}

async function loadHistory(database, deviceId) {
  const owner = encodeURIComponent(deviceId);
  const [threads, messages] = await Promise.all([
    supabaseRequest(database, `conversation_threads?owner_device_id=eq.${owner}&select=*&order=client_updated_at.desc&limit=100`),
    supabaseRequest(database, `conversation_messages?owner_device_id=eq.${owner}&select=*&order=client_created_at.asc&limit=2000`),
  ]);
  return { threads: threads ?? [], messages: messages ?? [] };
}

async function syncHistory(database, deviceId, payload) {
  const current = isUuid(payload.thread?.id) ? await existingThread(database, payload.thread.id) : null;
  if (current && current.owner_device_id !== deviceId) {
    const error = new Error("The conversation belongs to another device");
    error.code = "conversation_owner_mismatch";
    error.status = 403;
    throw error;
  }
  const thread = threadRow(payload.thread, deviceId, current);
  const messages = Array.isArray(payload.messages)
    ? payload.messages.slice(-500).map((message) => messageRow(message, deviceId, thread.id))
    : [];
  await assertMessageOwnership(database, messages, deviceId, thread.id);
  await supabaseRequest(database, "conversation_threads?on_conflict=id", {
    method: "POST",
    prefer: "resolution=merge-duplicates,return=minimal",
    body: thread,
  });
  if (messages.length) {
    await supabaseRequest(database, "conversation_messages?on_conflict=id", {
      method: "POST",
      prefer: "resolution=merge-duplicates,return=minimal",
      body: messages,
    });
  }
  return { synced: true, threadId: thread.id };
}

async function deleteHistory(database, deviceId, threadId) {
  if (!isUuid(threadId)) throw Object.assign(new Error("Invalid thread id"), { status: 400 });
  await supabaseRequest(
    database,
    `conversation_threads?id=eq.${encodeURIComponent(threadId)}&owner_device_id=eq.${encodeURIComponent(deviceId)}`,
    { method: "DELETE", prefer: "return=minimal" },
  );
  return { deleted: true, threadId };
}

export default {
  async fetch(request) {
    try {
      const database = getDatabaseConfig();
      if (!database.configured) {
        const error = new Error("Cloud conversation storage is not configured");
        error.code = "cloud_not_configured";
        error.status = 503;
        throw error;
      }
      const session = requireSession(request);
      if (request.method === "GET") return json(await loadHistory(database, session.deviceId));
      assertSameOrigin(request);
      if (request.method === "POST") {
        const payload = await readJson(request, { maxBytes: 700_000 });
        return json(await syncHistory(database, session.deviceId, payload));
      }
      if (request.method === "DELETE") {
        const payload = await readJson(request, { maxBytes: 10_000 });
        return json(await deleteHistory(database, session.deviceId, payload.threadId));
      }
      return json({ error: { code: "method_not_allowed" } }, { status: 405 });
    } catch (error) {
      return errorResponse(error);
    }
  },
};
