import { randomUUID } from "node:crypto";

import { isUuid } from "./device-session.mjs";
import { supabaseRequest } from "./supabase-rest.mjs";

function boundedInteger(value, fallback, minimum, maximum) {
  const number = Math.floor(Number(value));
  return Number.isFinite(number) ? Math.min(maximum, Math.max(minimum, number)) : fallback;
}

function text(value, maxLength) {
  return String(value ?? "").replaceAll("\u0000", "").trim().slice(0, maxLength);
}

function tokenCount(value) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? Math.floor(number) : null;
}

export function platformAiConfig(environment = process.env) {
  return {
    enabled: environment.PLATFORM_AI_ENABLED === "true" && Boolean(environment.OPENAI_API_KEY),
    dailyLimit: boundedInteger(environment.PLATFORM_AI_DAILY_LIMIT, 10, 1, 200),
  };
}

export function utcDayStart(value = new Date()) {
  const date = value instanceof Date ? new Date(value) : new Date(value);
  if (Number.isNaN(date.getTime())) throw new TypeError("Invalid date");
  date.setUTCHours(0, 0, 0, 0);
  return date.toISOString();
}

export async function requireOwnedThread(database, input) {
  if (!isUuid(input.threadId)) {
    const error = new Error("A valid conversation thread is required");
    error.code = "conversation_thread_required";
    error.status = 400;
    throw error;
  }
  const rows = await supabaseRequest(
    database,
    `conversation_threads?id=eq.${encodeURIComponent(input.threadId)}&owner_device_id=eq.${encodeURIComponent(input.deviceId)}&select=id,opportunity_id,context_snapshot&limit=1`,
  );
  const thread = rows?.[0];
  if (!thread) {
    const error = new Error("The conversation thread was not found for this device");
    error.code = "conversation_thread_not_found";
    error.status = 404;
    throw error;
  }
  return thread;
}

export async function startAiRun(database, input, options = {}) {
  if (input.provider === "platform") {
    const limit = boundedInteger(options.dailyLimit, 10, 1, 200);
    const rows = await supabaseRequest(
      database,
      `ai_runs?owner_device_id=eq.${encodeURIComponent(input.deviceId)}&provider=eq.platform&created_at=gte.${encodeURIComponent(utcDayStart(options.now))}&select=id&limit=${limit}`,
    );
    if ((rows?.length ?? 0) >= limit) {
      const error = new Error("The daily platform AI limit has been reached for this device");
      error.code = "platform_daily_limit_reached";
      error.status = 429;
      throw error;
    }
  }
  const id = randomUUID();
  await supabaseRequest(database, "ai_runs", {
    method: "POST",
    prefer: "return=minimal",
    body: {
      id,
      thread_id: input.threadId,
      owner_device_id: input.deviceId,
      provider: input.provider,
      model: text(input.model, 160) || null,
      status: "pending",
    },
  });
  return id;
}

export async function finishAiRun(database, input) {
  const usage = input.usage && typeof input.usage === "object" ? input.usage : {};
  return supabaseRequest(
    database,
    `ai_runs?id=eq.${encodeURIComponent(input.id)}&owner_device_id=eq.${encodeURIComponent(input.deviceId)}`,
    {
      method: "PATCH",
      prefer: "return=minimal",
      body: {
        status: input.status === "completed" ? "completed" : "failed",
        model: text(input.model, 160) || null,
        request_id: text(input.requestId, 200) || null,
        input_tokens: tokenCount(usage.input_tokens),
        output_tokens: tokenCount(usage.output_tokens),
        cached_input_tokens: tokenCount(usage.input_tokens_details?.cached_tokens),
        latency_ms: boundedInteger(input.latencyMs, 0, 0, 3_600_000),
        error_code: text(input.errorCode, 120) || null,
      },
    },
  );
}
