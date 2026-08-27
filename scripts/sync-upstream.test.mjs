import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  validateCalendar,
  validateContestData,
  validateFeed,
} from "./sync-upstream.mjs";

const schema = JSON.parse(await readFile(new URL("../data/schema.json", import.meta.url), "utf8"));
const contests = JSON.parse(await readFile(new URL("../data/contests.json", import.meta.url), "utf8"));

test("the checked-in contest mirror matches the upstream schema", () => {
  assert.equal(validateContestData(schema, contests), contests.length);
});

test("missing required contest fields are rejected", () => {
  const invalid = structuredClone(contests);
  delete invalid[0].organizer;
  assert.throws(() => validateContestData(schema, invalid), /organizer is required/);
});

test("duplicate contest IDs are rejected", () => {
  const invalid = [...structuredClone(contests), structuredClone(contests[0])];
  assert.throws(() => validateContestData(schema, invalid), /duplicate contest IDs/);
});

test("unsupported future schema keywords fail closed", () => {
  const unsupported = structuredClone(schema);
  unsupported.items.maxProperties = 20;
  assert.throws(() => validateContestData(unsupported, contests), /unsupported JSON Schema keyword/);
});

test("checked-in subscription files have complete envelopes", async () => {
  const [feed, calendar] = await Promise.all([
    readFile(new URL("../feed.xml", import.meta.url), "utf8"),
    readFile(new URL("../deadlines.ics", import.meta.url), "utf8"),
  ]);
  assert.doesNotThrow(() => validateFeed(feed));
  assert.doesNotThrow(() => validateCalendar(calendar));
});
