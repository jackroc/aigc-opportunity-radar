import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  validateCalendar,
  validateContestData,
  validateCrossDatasetUniqueness,
  validateFeed,
  validateOpportunityManifest,
  validateOpportunitySelection,
} from "./sync-upstream.mjs";

const schema = JSON.parse(await readFile(new URL("../data/schema.json", import.meta.url), "utf8"));
const contests = JSON.parse(await readFile(new URL("../data/contests.json", import.meta.url), "utf8"));
const opportunitySchema = JSON.parse(
  await readFile(new URL("../data/opportunities/schema.json", import.meta.url), "utf8"),
);
const opportunityManifestSchema = JSON.parse(
  await readFile(new URL("../data/opportunities/manifest.schema.json", import.meta.url), "utf8"),
);
const opportunityManifest = JSON.parse(
  await readFile(new URL("../data/opportunities/manifest.json", import.meta.url), "utf8"),
);
const opportunitySelection = JSON.parse(
  await readFile(new URL("../data/opportunity-selection.json", import.meta.url), "utf8"),
);

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

test("selected extension shards are explicit, opt-in, and independently valid", async () => {
  const datasets = validateOpportunityManifest(opportunityManifestSchema, opportunityManifest);
  const selectedIds = validateOpportunitySelection(opportunitySelection);
  const optionalContests = [];

  for (const id of selectedIds) {
    const dataset = datasets.get(id);
    assert.ok(dataset);
    assert.equal(dataset.default_included, false);
    const records = JSON.parse(
      await readFile(new URL(`../data/opportunities/${dataset.path}`, import.meta.url), "utf8"),
    );
    assert.equal(
      validateContestData(opportunitySchema, records, { allowEmpty: true, label: id }),
      dataset.record_count,
    );
    optionalContests.push(...records);
  }

  assert.doesNotThrow(() => validateCrossDatasetUniqueness(contests, optionalContests));
  assert.equal(optionalContests.length, 2);
});

test("core schema rejects extension records and extension schema allows empty shards", async () => {
  const extended = JSON.parse(
    await readFile(new URL("../data/opportunities/global.json", import.meta.url), "utf8"),
  );
  assert.throws(() => validateContestData(schema, extended), /scope is not allowed/);
  assert.equal(validateContestData(opportunitySchema, [], { allowEmpty: true }), 0);
});

test("selection and cross-dataset duplicates fail closed", () => {
  assert.throws(
    () => validateOpportunitySelection({ dataset_ids: ["global", "global"] }),
    /duplicate dataset ids/,
  );
  assert.throws(
    () => validateCrossDatasetUniqueness(contests, [{ ...contests[0] }]),
    /Duplicate contest id/,
  );
});

test("checked-in subscription files have complete envelopes", async () => {
  const [feed, calendar] = await Promise.all([
    readFile(new URL("../feed.xml", import.meta.url), "utf8"),
    readFile(new URL("../deadlines.ics", import.meta.url), "utf8"),
  ]);
  assert.doesNotThrow(() => validateFeed(feed));
  assert.doesNotThrow(() => validateCalendar(calendar));
});
