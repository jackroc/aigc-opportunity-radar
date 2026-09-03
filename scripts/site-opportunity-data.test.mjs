import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { classifyFee, resolveOpportunityDatasets, safeDatasetPath } from "../assets/site.js";


const manifest = JSON.parse(
  await readFile(new URL("../data/opportunities/manifest.json", import.meta.url), "utf8"),
);
const selection = JSON.parse(
  await readFile(new URL("../data/opportunity-selection.json", import.meta.url), "utf8"),
);

test("the browser resolves only explicitly selected opt-in datasets", () => {
  const resolved = resolveOpportunityDatasets(selection, manifest);
  assert.deepEqual(
    resolved.map((dataset) => dataset.id),
    ["global", "cn-national", "cn-local"],
  );
  assert.ok(resolved.every((dataset) => dataset.default_included === false));
});

test("the browser rejects unsafe, missing, or duplicate dataset selections", () => {
  assert.equal(safeDatasetPath("global.json"), true);
  assert.equal(safeDatasetPath("../global.json"), false);
  assert.throws(
    () => resolveOpportunityDatasets({ dataset_ids: ["missing"] }, manifest),
    /Invalid selected opportunity dataset/,
  );
  assert.throws(
    () => resolveOpportunityDatasets({ dataset_ids: ["global", "global"] }, manifest),
    /duplicate dataset ids/,
  );
});

test("all extension category filters remain native buttons with pressed state", async () => {
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
  for (const category of ["code", "research", "hardware", "business", "other"]) {
    assert.match(
      html,
      new RegExp(`<button[^>]+data-category="${category}"[^>]+aria-pressed="false"`),
    );
  }
});

test("an amount in an unconfirmed fee note is not misclassified as an entry fee", async () => {
  const globalRecords = JSON.parse(
    await readFile(new URL("../data/opportunities/global.json", import.meta.url), "utf8"),
  );
  const nasa = globalRecords.find((record) => record.id === "nasa-orbital-clarity-challenge-2026");
  assert.equal(classifyFee(nasa), "unknown");
  assert.equal(classifyFee({ fee: "免费", en: { fee: "Free" } }), "free");
  assert.equal(classifyFee({ fee: "报名费 ¥100", en: { fee: "CNY 100" } }), "paid");
});
