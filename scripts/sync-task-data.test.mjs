import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { validateCalendar, validateFeed, validateTaskMirror } from "./sync-task-data.mjs";

const tasks = JSON.parse(await readFile(new URL("../data/tasks.json", import.meta.url), "utf8"));
const platforms = JSON.parse(await readFile(new URL("../data/task-platforms.json", import.meta.url), "utf8"));
const sources = JSON.parse(await readFile(new URL("../data/task-sources.json", import.meta.url), "utf8"));

test("the checked-in task mirror is internally consistent", () => {
  const counts = validateTaskMirror(tasks, platforms, sources);
  assert.equal(counts.tasks, tasks.length);
  assert.ok(counts.platforms >= 5);
  assert.ok(counts.sources >= 1);
});

test("duplicate task URLs are rejected", () => {
  const duplicate = [...structuredClone(tasks), structuredClone(tasks[0])];
  duplicate.at(-1).id = "a-different-stable-id";
  assert.throws(() => validateTaskMirror(duplicate, platforms, sources), /Task URLs must contain unique values/);
});

test("unknown source references are rejected", () => {
  const invalid = structuredClone(tasks);
  invalid[0].source_id = "missing-source";
  assert.throws(() => validateTaskMirror(invalid, platforms, sources), /unknown source or platform/);
});

test("checked-in task subscriptions have complete envelopes", async () => {
  const [feed, calendar] = await Promise.all([
    readFile(new URL("../tasks/feed.xml", import.meta.url), "utf8"),
    readFile(new URL("../tasks/deadlines.ics", import.meta.url), "utf8"),
  ]);
  assert.doesNotThrow(() => validateFeed(feed));
  assert.doesNotThrow(() => validateCalendar(calendar));
});
