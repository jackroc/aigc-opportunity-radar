import { randomUUID } from "node:crypto";

import {
  createDeviceSessionToken,
  readDeviceSession,
  serializeDeviceSessionCookie,
} from "../lib/server/device-session.mjs";
import { errorResponse, json } from "../lib/server/http.mjs";
import { getDatabaseConfig, registerDevice, touchDevice } from "../lib/server/supabase-rest.mjs";

const INSTALLATION_ID_PATTERN = /^dvc_[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default {
  async fetch(request) {
    if (request.method !== "GET") return json({ error: { code: "method_not_allowed" } }, { status: 405 });
    try {
      const database = getDatabaseConfig();
      const secret = String(process.env.DEVICE_SESSION_SECRET ?? "");
      if (!database.configured) {
        return json({ configured: false, storage: "local", reason: "cloud_not_configured" });
      }
      if (secret.length < 32) {
        const error = new Error("Device session signing is not configured");
        error.code = "session_not_configured";
        error.status = 503;
        throw error;
      }
      const installationId = request.headers.get("x-installation-id");
      if (!INSTALLATION_ID_PATTERN.test(installationId ?? "")) {
        const error = new Error("A valid installation id is required");
        error.status = 400;
        throw error;
      }
      const existing = readDeviceSession(request, secret);
      const deviceId = existing?.deviceId ?? randomUUID();
      if (existing) await touchDevice(database, deviceId);
      else await registerDevice(database, { id: deviceId, installationId });
      const secure = new URL(request.url).protocol === "https:";
      const headers = existing
        ? undefined
        : { "Set-Cookie": serializeDeviceSessionCookie(createDeviceSessionToken({ deviceId }, secret), { secure }) };
      return json({
        configured: true,
        storage: "cloud",
        device: { label: deviceId.slice(-6).toUpperCase() },
      }, { headers });
    } catch (error) {
      return errorResponse(error);
    }
  },
};
