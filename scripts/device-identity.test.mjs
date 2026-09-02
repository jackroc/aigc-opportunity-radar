import assert from "node:assert/strict";
import test from "node:test";

import {
  createDeviceIdentity,
  deviceLabel,
  getOrCreateDeviceIdentity,
  isValidInstallationId,
} from "../assets/device-identity.mjs";

function createStorage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
}

const fixedUuid = "123e4567-e89b-42d3-a456-426614174000";

test("device identity uses a random installation id instead of fingerprint inputs", () => {
  const identity = createDeviceIdentity({
    randomUUID: () => fixedUuid,
    now: "2026-08-29T00:00:00.000Z",
  });
  assert.equal(identity.id, `dvc_${fixedUuid}`);
  assert.equal(isValidInstallationId(identity.id), true);
  assert.equal(deviceLabel(identity.id), "174000");
  assert.deepEqual(Object.keys(identity), ["version", "id", "createdAt", "lastSeenAt"]);
});

test("device identity persists and is reused on the same browser storage", () => {
  const storage = createStorage();
  const first = getOrCreateDeviceIdentity(storage, {
    randomUUID: () => fixedUuid,
    now: "2026-08-29T00:00:00.000Z",
  });
  const second = getOrCreateDeviceIdentity(storage, {
    randomUUID: () => "00000000-0000-4000-8000-000000000000",
    now: "2026-08-30T00:00:00.000Z",
  });
  assert.equal(first.isNew, true);
  assert.equal(second.isNew, false);
  assert.equal(second.identity.id, first.identity.id);
  assert.equal(second.identity.lastSeenAt, "2026-08-30T00:00:00.000Z");
});
