export const DEVICE_STORAGE_KEY = "opportunity-device-v1";

const DEVICE_ID_PATTERN = /^dvc_[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function toIsoString(value) {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

export function isValidInstallationId(value) {
  return typeof value === "string" && DEVICE_ID_PATTERN.test(value);
}

export function createDeviceIdentity(options = {}) {
  const randomUUID = options.randomUUID ?? globalThis.crypto?.randomUUID?.bind(globalThis.crypto);
  if (typeof randomUUID !== "function") throw new Error("A secure random UUID generator is required");
  const now = toIsoString(options.now ?? new Date());
  return {
    version: 1,
    id: `dvc_${randomUUID()}`,
    createdAt: now,
    lastSeenAt: now,
  };
}

export function readDeviceIdentity(storage, options = {}) {
  if (!storage?.getItem) return null;
  try {
    const value = JSON.parse(storage.getItem(options.storageKey ?? DEVICE_STORAGE_KEY) || "null");
    if (value?.version !== 1 || !isValidInstallationId(value.id)) return null;
    if (!value.createdAt || Number.isNaN(new Date(value.createdAt).getTime())) return null;
    return {
      version: 1,
      id: value.id,
      createdAt: toIsoString(value.createdAt),
      lastSeenAt: toIsoString(value.lastSeenAt ?? value.createdAt),
    };
  } catch {
    return null;
  }
}

export function getOrCreateDeviceIdentity(storage, options = {}) {
  const existing = readDeviceIdentity(storage, options);
  const identity = existing ?? createDeviceIdentity(options);
  identity.lastSeenAt = toIsoString(options.now ?? new Date());
  let persistent = false;
  try {
    storage?.setItem?.(options.storageKey ?? DEVICE_STORAGE_KEY, JSON.stringify(identity));
    persistent = storage?.getItem?.(options.storageKey ?? DEVICE_STORAGE_KEY) !== null;
  } catch {
    persistent = false;
  }
  return { identity, persistent, isNew: !existing };
}

export function deviceLabel(value) {
  if (!isValidInstallationId(value)) return "unknown";
  return value.slice(-6).toUpperCase();
}
