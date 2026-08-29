import { platformAiConfig, finishAiRun, requireOwnedThread, startAiRun } from "../lib/server/ai-runs.mjs";
import { callResponsesProvider } from "../lib/assistant-core.mjs";
import { assertSameOrigin, readDeviceSession } from "../lib/server/device-session.mjs";
import { errorResponse, json, readJson } from "../lib/server/http.mjs";
import { getDatabaseConfig } from "../lib/server/supabase-rest.mjs";

function allowedHosts() {
  return ["api.openai.com", ...String(process.env.AI_PROVIDER_ALLOWED_HOSTS ?? "").split(",")]
    .map((host) => host.trim())
    .filter(Boolean);
}

function requireDeviceSession(request) {
  const session = readDeviceSession(request, String(process.env.DEVICE_SESSION_SECRET ?? ""));
  if (!session) {
    const error = new Error("A valid device session is required before using AI");
    error.code = "device_session_required";
    error.status = 401;
    throw error;
  }
  return session;
}

export default {
  async fetch(request) {
    if (request.method === "GET") {
      const platform = platformAiConfig();
      return json({
        localCodex: false,
        platformConfigured: platform.enabled,
        platformDailyLimit: platform.dailyLimit,
        byokSupported: true,
        byokAllowedHosts: allowedHosts(),
        storageRequired: true,
      });
    }
    if (request.method !== "POST") return json({ error: { code: "method_not_allowed" } }, { status: 405 });
    try {
      assertSameOrigin(request);
      const session = requireDeviceSession(request);
      const database = getDatabaseConfig();
      if (!database.configured) {
        const error = new Error("Conversation storage is required before using hosted AI");
        error.code = "cloud_not_configured";
        error.status = 503;
        throw error;
      }
      const payload = await readJson(request, { maxBytes: 350_000 });
      if (payload.provider !== "platform" && payload.provider !== "byok") {
        const error = new Error("This AI provider is not available in the hosted runtime");
        error.code = "provider_unavailable";
        error.status = 400;
        throw error;
      }
      const platform = platformAiConfig();
      if (payload.provider === "platform" && !platform.enabled) {
        const error = new Error("Platform AI is not enabled");
        error.code = "platform_ai_not_enabled";
        error.status = 503;
        throw error;
      }
      const thread = await requireOwnedThread(database, {
        deviceId: session.deviceId,
        threadId: payload.threadId,
      });
      const providerConfig = payload.provider === "platform"
        ? {
            baseUrl: "https://api.openai.com/v1",
            apiKey: process.env.OPENAI_API_KEY,
            model: process.env.OPENAI_MODEL || "gpt-5.6",
          }
        : payload.providerConfig;
      const startedAt = Date.now();
      const runId = await startAiRun(database, {
        deviceId: session.deviceId,
        threadId: thread.id,
        provider: payload.provider,
        model: providerConfig?.model,
      }, { dailyLimit: platform.dailyLimit });
      try {
        const result = await callResponsesProvider({
          ...providerConfig,
          task: thread.context_snapshot,
          messages: payload.messages,
          language: payload.language,
        }, { allowedHosts: allowedHosts() });
        await finishAiRun(database, {
          id: runId,
          deviceId: session.deviceId,
          status: "completed",
          model: result.model,
          requestId: result.requestId,
          usage: result.usage,
          latencyMs: Date.now() - startedAt,
        }).catch(() => {});
        return json({ ...result, provider: payload.provider });
      } catch (error) {
        await finishAiRun(database, {
          id: runId,
          deviceId: session.deviceId,
          status: "failed",
          model: providerConfig?.model,
          errorCode: error.code || "provider_request_failed",
          latencyMs: Date.now() - startedAt,
        }).catch(() => {});
        throw error;
      }
    } catch (error) {
      return errorResponse(error);
    }
  },
};
