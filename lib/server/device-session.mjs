import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";

export const DEVICE_SESSION_COOKIE = "opportunity_device_session";
export const DEVICE_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function encode(value) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function decode(value) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function signature(payload, secret) {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function safeEqual(left, right) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

export function isUuid(value) {
  return typeof value === "string" && UUID_PATTERN.test(value);
}

export function parseCookies(header) {
  return String(header ?? "")
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .reduce((cookies, part) => {
      const separator = part.indexOf("=");
      if (separator < 1) return cookies;
      const key = decodeURIComponent(part.slice(0, separator));
      const value = decodeURIComponent(part.slice(separator + 1));
      cookies[key] = value;
      return cookies;
    }, {});
}

export function createDeviceSessionToken(input, secret) {
  if (!secret || secret.length < 32) throw new Error("DEVICE_SESSION_SECRET must contain at least 32 characters");
  const deviceId = input.deviceId ?? randomUUID();
  if (!isUuid(deviceId)) throw new TypeError("Invalid device id");
  const issuedAt = Number(input.issuedAt ?? Math.floor(Date.now() / 1000));
  const payload = encode(JSON.stringify({ version: 1, deviceId, issuedAt }));
  return `${payload}.${signature(payload, secret)}`;
}

export function verifyDeviceSessionToken(token, secret, options = {}) {
  if (!secret || secret.length < 32 || typeof token !== "string") return null;
  const [payload, providedSignature, extra] = token.split(".");
  if (!payload || !providedSignature || extra || !safeEqual(providedSignature, signature(payload, secret))) return null;
  try {
    const session = JSON.parse(decode(payload));
    if (session.version !== 1 || !isUuid(session.deviceId) || !Number.isInteger(session.issuedAt)) return null;
    const now = Number(options.now ?? Math.floor(Date.now() / 1000));
    const maxAge = Number(options.maxAge ?? DEVICE_SESSION_MAX_AGE_SECONDS);
    if (session.issuedAt > now + 300 || now - session.issuedAt > maxAge) return null;
    return session;
  } catch {
    return null;
  }
}

export function serializeDeviceSessionCookie(token, options = {}) {
  const secure = options.secure !== false;
  return [
    `${DEVICE_SESSION_COOKIE}=${encodeURIComponent(token)}`,
    "Path=/",
    `Max-Age=${Number(options.maxAge ?? DEVICE_SESSION_MAX_AGE_SECONDS)}`,
    "HttpOnly",
    "SameSite=Lax",
    secure ? "Secure" : "",
  ].filter(Boolean).join("; ");
}

export function readDeviceSession(request, secret, options = {}) {
  const cookies = parseCookies(request.headers.get("cookie"));
  return verifyDeviceSessionToken(cookies[DEVICE_SESSION_COOKIE], secret, options);
}

export function assertSameOrigin(request) {
  const origin = request.headers.get("origin");
  if (!origin) return;
  const requestOrigin = new URL(request.url).origin;
  if (origin !== requestOrigin) {
    const error = new Error("Cross-origin requests are not allowed");
    error.status = 403;
    throw error;
  }
}
