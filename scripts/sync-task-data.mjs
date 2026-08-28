import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath, pathToFileURL } from "node:url";

const REPOSITORY_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEFAULT_UPSTREAM_BASE = "https://raw.githubusercontent.com/jackroc/aigc-opportunity-tasks/main";
const UPSTREAM_BASE = (process.env.TASK_UPSTREAM_BASE_URL || DEFAULT_UPSTREAM_BASE).replace(/\/$/, "");

const RESOURCES = Object.freeze([
  { source: "data/schema.json", target: "data/tasks.schema.json" },
  { source: "data/tasks.json", target: "data/tasks.json" },
  { source: "data/platforms.json", target: "data/task-platforms.json" },
  { source: "data/sources.json", target: "data/task-sources.json" },
  { source: "tasks/feed.xml", target: "tasks/feed.xml" },
  { source: "tasks/deadlines.ics", target: "tasks/deadlines.ics" },
]);

const VALID_AI_POLICIES = new Set(["allowed", "limited", "human-only", "unknown"]);

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function parseJson(text, label) {
  try {
    return JSON.parse(text.replace(/^\uFEFF/, ""));
  } catch (error) {
    throw new SyntaxError(`${label} is not valid JSON: ${error.message}`);
  }
}

function assertHttps(value, label) {
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== "https:") throw new Error("HTTPS required");
  } catch {
    throw new TypeError(`${label} must be a valid HTTPS URL`);
  }
}

function assertDateTime(value, label) {
  if (typeof value !== "string" || Number.isNaN(Date.parse(value))) {
    throw new TypeError(`${label} must be an ISO date-time string`);
  }
}

function assertUnique(values, label) {
  if (new Set(values).size !== values.length) throw new Error(`${label} must contain unique values`);
}

export function validateTaskMirror(tasks, platforms, sources) {
  if (!Array.isArray(tasks) || tasks.length === 0) throw new Error("Task mirror must not be empty");
  if (!Array.isArray(platforms) || platforms.length === 0) throw new Error("Platform mirror must not be empty");
  if (!Array.isArray(sources) || sources.length === 0) throw new Error("Source mirror must not be empty");

  const platformIds = platforms.map((platform, index) => {
    if (!isObject(platform) || !platform.id || !platform.name) throw new Error(`platforms[${index}] is invalid`);
    assertHttps(platform.url, `platforms[${index}].url`);
    return platform.id;
  });
  assertUnique(platformIds, "Platform IDs");
  const platformSet = new Set(platformIds);

  const sourceIds = sources.map((source, index) => {
    if (!isObject(source) || !source.id || !platformSet.has(source.platform_id)) {
      throw new Error(`sources[${index}] is invalid`);
    }
    assertHttps(source.url, `sources[${index}].url`);
    return source.id;
  });
  assertUnique(sourceIds, "Source IDs");
  const sourceSet = new Set(sourceIds);

  const taskIds = [];
  const taskUrls = [];
  tasks.forEach((task, index) => {
    const label = `tasks[${index}]`;
    if (!isObject(task) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(task.id || "")) {
      throw new Error(`${label}.id is invalid`);
    }
    if (!platformSet.has(task.platform_id) || !sourceSet.has(task.source_id)) {
      throw new Error(`${label} references an unknown source or platform`);
    }
    if (!task.title || !task.summary || !Array.isArray(task.categories) || task.categories.length === 0) {
      throw new Error(`${label} is missing required content`);
    }
    if (!VALID_AI_POLICIES.has(task.ai_policy)) throw new Error(`${label}.ai_policy is invalid`);
    assertHttps(task.application_url, `${label}.application_url`);
    assertHttps(task.rules_url, `${label}.rules_url`);
    assertDateTime(task.published_at, `${label}.published_at`);
    assertDateTime(task.source_updated_at, `${label}.source_updated_at`);
    assertDateTime(task.expires_at, `${label}.expires_at`);
    if (task.deadline !== null) assertDateTime(task.deadline, `${label}.deadline`);
    if (!isObject(task.reward) || typeof task.reward.display !== "string") throw new Error(`${label}.reward is invalid`);
    if (!isObject(task.competition) || !Number.isInteger(task.competition.comment_count)) {
      throw new Error(`${label}.competition is invalid`);
    }
    taskIds.push(task.id);
    taskUrls.push(task.application_url);
  });
  assertUnique(taskIds, "Task IDs");
  assertUnique(taskUrls, "Task URLs");
  return { tasks: tasks.length, platforms: platforms.length, sources: sources.length };
}

export function validateFeed(feed) {
  const value = feed.trim();
  if (!value.startsWith("<?xml") || !value.includes("<rss") || !value.includes("<channel>") || !value.endsWith("</rss>")) {
    throw new Error("Task feed is not a complete RSS document");
  }
}

export function validateCalendar(calendar) {
  const value = calendar.replace(/\r\n/g, "\n").trim();
  if (!value.startsWith("BEGIN:VCALENDAR") || !value.includes("\nVERSION:2.0\n") || !value.endsWith("END:VCALENDAR")) {
    throw new Error("Task calendar is not a complete iCalendar document");
  }
}

function validateResources(resources) {
  const byTarget = new Map(resources.map((resource) => [resource.target, resource.content]));
  const schema = parseJson(byTarget.get("data/tasks.schema.json"), "data/tasks.schema.json");
  if (!isObject(schema) || schema.type !== "array") throw new Error("Task schema is invalid");
  const tasks = parseJson(byTarget.get("data/tasks.json"), "data/tasks.json");
  const platforms = parseJson(byTarget.get("data/task-platforms.json"), "data/task-platforms.json");
  const sources = parseJson(byTarget.get("data/task-sources.json"), "data/task-sources.json");
  const counts = validateTaskMirror(tasks, platforms, sources);
  validateFeed(byTarget.get("tasks/feed.xml"));
  validateCalendar(byTarget.get("tasks/deadlines.ics"));
  return counts;
}

async function fetchText(source, attempts = 3) {
  const url = `${UPSTREAM_BASE}/${source}`;
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: { "user-agent": "aigc-opportunity-radar-task-mirror" },
        signal: AbortSignal.timeout(20_000),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status} ${response.statusText}`);
      const content = await response.text();
      if (!content.trim()) throw new Error("response was empty");
      return content.endsWith("\n") ? content : `${content}\n`;
    } catch (error) {
      lastError = error;
      if (attempt < attempts) await delay(attempt * 1_000);
    }
  }
  throw new Error(`Unable to fetch ${url} after ${attempts} attempts: ${lastError.message}`);
}

async function loadLocalResources() {
  return Promise.all(
    RESOURCES.map(async (resource) => ({
      ...resource,
      content: await readFile(path.join(REPOSITORY_ROOT, resource.target), "utf8"),
    })),
  );
}

async function loadUpstreamResources() {
  return Promise.all(
    RESOURCES.map(async (resource) => ({ ...resource, content: await fetchText(resource.source) })),
  );
}

async function writeChangedResources(resources) {
  const changed = [];
  for (const resource of resources) {
    const target = path.join(REPOSITORY_ROOT, resource.target);
    let current = null;
    try {
      current = await readFile(target, "utf8");
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
    if (current === resource.content) continue;
    await mkdir(path.dirname(target), { recursive: true });
    const temporary = `${target}.tmp-${process.pid}`;
    try {
      await writeFile(temporary, resource.content, "utf8");
      await rename(temporary, target);
    } finally {
      await rm(temporary, { force: true });
    }
    changed.push(resource.target);
  }
  return changed;
}

async function main() {
  const mode = process.argv[2] || "--sync";
  if (!new Set(["--sync", "--check"]).has(mode)) {
    throw new Error("Usage: node scripts/sync-task-data.mjs [--sync|--check]");
  }
  const resources = mode === "--check" ? await loadLocalResources() : await loadUpstreamResources();
  const counts = validateResources(resources);
  if (mode === "--check") {
    console.log(`Validated ${counts.tasks} tasks, ${counts.platforms} platforms, and ${counts.sources} sources.`);
    return;
  }
  const changed = await writeChangedResources(resources);
  if (changed.length === 0) console.log(`Task upstream is unchanged; ${counts.tasks} tasks validated.`);
  else console.log(`Validated ${counts.tasks} tasks and updated: ${changed.join(", ")}`);
}

const invokedAsScript = process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;
if (invokedAsScript) {
  main().catch((error) => {
    console.error(error.stack || error.message);
    process.exitCode = 1;
  });
}
