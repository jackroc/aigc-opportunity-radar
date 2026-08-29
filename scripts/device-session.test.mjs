import assert from "node:assert/strict";
import test from "node:test";

import {
  createDeviceSessionToken,
  parseCookies,
  serializeDeviceSessionCookie,
  verifyDeviceSessionToken,
} from "../lib/server/device-session.mjs";

const secret = "test-only-device-session-secret-123456789";
const deviceId = "123e4567-e89b-42d3-a456-426614174000";

test("signed device sessions reject tampering and expiration", () => {
  const token = createDeviceSessionToken({ deviceId, issuedAt: 1_000 }, secret);
  assert.equal(verifyDeviceSessionToken(token, secret, { now: 1_100 }).deviceId, deviceId);
  assert.equal(verifyDeviceSessionToken(`${token}x`, secret, { now: 1_100 }), null);
  assert.equal(verifyDeviceSessionToken(token, secret, { now: 2_000, maxAge: 100 }), null);
});

test("device cookie is HttpOnly, same-site, and secure", () => {
  const token = createDeviceSessionToken({ deviceId, issuedAt: 1_000 }, secret);
  const cookie = serializeDeviceSessionCookie(token);
  assert.match(cookie, /HttpOnly/);
  assert.match(cookie, /SameSite=Lax/);
  assert.match(cookie, /Secure/);
  assert.equal(parseCookies(`theme=dark; opportunity_device_session=${encodeURIComponent(token)}`).opportunity_device_session, token);
});
