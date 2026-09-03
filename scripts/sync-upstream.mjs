import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath, pathToFileURL } from "node:url";

const REPOSITORY_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEFAULT_UPSTREAM_BASE =
  "https://raw.githubusercontent.com/MartinDelophy/Awesome-AIGC-Creative-Contests/main";
const UPSTREAM_BASE = (process.env.UPSTREAM_BASE_URL || DEFAULT_UPSTREAM_BASE).replace(/\/$/, "");

const CORE_RESOURCES = Object.freeze([
  { source: "data/schema.json", target: "data/schema.json", kind: "json" },
  { source: "data/contests.json", target: "data/contests.json", kind: "json" },
  { source: "feed.xml", target: "feed.xml", kind: "feed" },
  { source: "deadlines.ics", target: "deadlines.ics", kind: "calendar" },
]);
const OPPORTUNITY_METADATA_RESOURCES = Object.freeze([
  {
    source: "data/opportunities/manifest.json",
    target: "data/opportunities/manifest.json",
    kind: "json",
  },
  {
    source: "data/opportunities/manifest.schema.json",
    target: "data/opportunities/manifest.schema.json",
    kind: "json",
  },
  {
    source: "data/opportunities/schema.json",
    target: "data/opportunities/schema.json",
    kind: "json",
  },
]);
const OPPORTUNITY_SELECTION_TARGET = "data/opportunity-selection.json";

const SUPPORTED_SCHEMA_KEYS = new Set([
  "$schema",
  "$id",
  "title",
  "description",
  "type",
  "items",
  "additionalProperties",
  "required",
  "properties",
  "pattern",
  "minLength",
  "minItems",
  "uniqueItems",
  "enum",
  "format",
  "const",
  "minimum",
]);

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function assertSupportedSchema(schema, location = "$schema") {
  if (!isObject(schema)) {
    throw new TypeError(`${location} must be an object`);
  }

  for (const key of Object.keys(schema)) {
    if (!SUPPORTED_SCHEMA_KEYS.has(key)) {
      throw new Error(`${location} uses unsupported JSON Schema keyword: ${key}`);
    }
  }

  if (schema.items) assertSupportedSchema(schema.items, `${location}.items`);
  if (schema.properties) {
    if (!isObject(schema.properties)) throw new TypeError(`${location}.properties must be an object`);
    for (const [name, propertySchema] of Object.entries(schema.properties)) {
      assertSupportedSchema(propertySchema, `${location}.properties.${name}`);
    }
  }
}

function matchesType(value, type) {
  switch (type) {
    case "array":
      return Array.isArray(value);
    case "object":
      return isObject(value);
    case "string":
      return typeof value === "string";
    case "number":
      return typeof value === "number" && Number.isFinite(value);
    case "integer":
      return Number.isInteger(value);
    case "boolean":
      return typeof value === "boolean";
    case "null":
      return value === null;
    default:
      throw new Error(`Unsupported JSON Schema type: ${type}`);
  }
}

function isCalendarDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
}

function isUri(value) {
  try {
    const parsed = new URL(value);
    return Boolean(parsed.protocol && parsed.hostname);
  } catch {
    return false;
  }
}

function validateValue(schema, value, location, errors) {
  if (schema.type && !matchesType(value, schema.type)) {
    errors.push(`${location} must be of type ${schema.type}`);
    return;
  }

  if (Object.hasOwn(schema, "const") && !Object.is(schema.const, value)) {
    errors.push(`${location} must equal ${JSON.stringify(schema.const)}`);
  }

  if (schema.enum && !schema.enum.some((candidate) => Object.is(candidate, value))) {
    errors.push(`${location} must be one of: ${schema.enum.join(", ")}`);
  }

  if (typeof value === "string") {
    if (schema.minLength !== undefined && value.length < schema.minLength) {
      errors.push(`${location} must contain at least ${schema.minLength} character(s)`);
    }
    if (schema.pattern && !new RegExp(schema.pattern, "u").test(value)) {
      errors.push(`${location} must match ${schema.pattern}`);
    }
    if (schema.format === "date" && !isCalendarDate(value)) {
      errors.push(`${location} must be a valid YYYY-MM-DD date`);
    }
    if (schema.format === "uri" && !isUri(value)) {
      errors.push(`${location} must be a valid URI`);
    }
  }

  if (typeof value === "number" && schema.minimum !== undefined && value < schema.minimum) {
    errors.push(`${location} must be at least ${schema.minimum}`);
  }

  if (Array.isArray(value)) {
    if (schema.minItems !== undefined && value.length < schema.minItems) {
      errors.push(`${location} must contain at least ${schema.minItems} item(s)`);
    }
    if (schema.uniqueItems) {
      const serialized = value.map((item) => JSON.stringify(item));
      if (new Set(serialized).size !== serialized.length) {
        errors.push(`${location} must contain unique items`);
      }
    }
    if (schema.items) {
      value.forEach((item, index) => validateValue(schema.items, item, `${location}[${index}]`, errors));
    }
  }

  if (isObject(value)) {
    for (const requiredName of schema.required || []) {
      if (!Object.hasOwn(value, requiredName)) errors.push(`${location}.${requiredName} is required`);
    }

    const properties = schema.properties || {};
    for (const [name, propertyValue] of Object.entries(value)) {
      if (properties[name]) {
        validateValue(properties[name], propertyValue, `${location}.${name}`, errors);
      } else if (schema.additionalProperties === false) {
        errors.push(`${location}.${name} is not allowed`);
      }
    }
  }
}

export function validateContestData(schema, contests, options = {}) {
  const { allowEmpty = false, label = "Contest data" } = options;
  assertSupportedSchema(schema);
  const errors = [];
  validateValue(schema, contests, "$", errors);

  if (Array.isArray(contests)) {
    if (!allowEmpty && contests.length === 0) errors.push("$ must not be an empty contest directory");

    const ids = contests.map((contest) => contest?.id).filter(Boolean);
    const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
    if (duplicateIds.length > 0) errors.push(`$ contains duplicate contest IDs: ${duplicateIds.join(", ")}`);
  }

  if (errors.length > 0) {
    const displayed = errors.slice(0, 25);
    const remainder = errors.length - displayed.length;
    const suffix = remainder > 0 ? `\n...and ${remainder} more validation error(s)` : "";
    throw new Error(`${label} validation failed:\n- ${displayed.join("\n- ")}${suffix}`);
  }

  return contests.length;
}

export function validateFeed(feed) {
  const trimmed = feed.trim();
  if (!trimmed.includes("<rss") || !trimmed.includes("<channel>") || !trimmed.endsWith("</rss>")) {
    throw new Error("feed.xml is not a complete RSS document");
  }
}

export function validateCalendar(calendar) {
  const normalized = calendar.replace(/\r\n/g, "\n").trim();
  if (
    !normalized.startsWith("BEGIN:VCALENDAR") ||
    !normalized.includes("\nVERSION:2.0\n") ||
    !normalized.endsWith("END:VCALENDAR")
  ) {
    throw new Error("deadlines.ics is not a complete iCalendar document");
  }
}

function parseJson(text, label) {
  try {
    return JSON.parse(text.replace(/^\uFEFF/, ""));
  } catch (error) {
    throw new SyntaxError(`${label} is not valid JSON: ${error.message}`);
  }
}

export function validateOpportunitySelection(selection) {
  if (!isObject(selection) || Object.keys(selection).length !== 1 || !Array.isArray(selection.dataset_ids)) {
    throw new Error("data/opportunity-selection.json must contain only a dataset_ids array");
  }
  if (selection.dataset_ids.length === 0) {
    throw new Error("data/opportunity-selection.json must opt into at least one dataset");
  }
  if (selection.dataset_ids.some((id) => typeof id !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id))) {
    throw new Error("data/opportunity-selection.json contains an invalid dataset id");
  }
  if (new Set(selection.dataset_ids).size !== selection.dataset_ids.length) {
    throw new Error("data/opportunity-selection.json contains duplicate dataset ids");
  }
  return selection.dataset_ids;
}

export function validateOpportunityManifest(schema, manifest) {
  assertSupportedSchema(schema);
  const errors = [];
  validateValue(schema, manifest, "$", errors);
  if (errors.length > 0) {
    throw new Error(`Opportunity manifest validation failed:\n- ${errors.slice(0, 25).join("\n- ")}`);
  }

  const datasets = new Map();
  for (const dataset of manifest.datasets) {
    if (path.posix.basename(dataset.path) !== dataset.path || !dataset.path.endsWith(".json")) {
      throw new Error(`Opportunity dataset ${dataset.id} has an unsafe path: ${dataset.path}`);
    }
    if (dataset.default_included !== false) {
      throw new Error(`Opportunity dataset ${dataset.id} must remain opt-in`);
    }
    if (datasets.has(dataset.id)) throw new Error(`Duplicate opportunity dataset id: ${dataset.id}`);
    datasets.set(dataset.id, dataset);
  }
  return datasets;
}

function resourceMap(resources) {
  return new Map(resources.map((resource) => [resource.target, resource.content]));
}

function selectedShardResources(resources) {
  const byTarget = resourceMap(resources);
  const manifestSchema = parseJson(
    byTarget.get("data/opportunities/manifest.schema.json"),
    "data/opportunities/manifest.schema.json",
  );
  const manifest = parseJson(
    byTarget.get("data/opportunities/manifest.json"),
    "data/opportunities/manifest.json",
  );
  const selection = parseJson(
    byTarget.get(OPPORTUNITY_SELECTION_TARGET),
    OPPORTUNITY_SELECTION_TARGET,
  );
  const datasets = validateOpportunityManifest(manifestSchema, manifest);
  const selectedIds = validateOpportunitySelection(selection);
  return selectedIds.map((id) => {
    const dataset = datasets.get(id);
    if (!dataset) throw new Error(`Selected opportunity dataset does not exist upstream: ${id}`);
    return {
      source: `data/opportunities/${dataset.path}`,
      target: `data/opportunities/${dataset.path}`,
      kind: "opportunity-shard",
      dataset,
    };
  });
}

function normalizedOfficialUrl(value) {
  return new URL(value).href.replace(/\/$/, "");
}

export function validateCrossDatasetUniqueness(coreContests, optionalContests) {
  const ids = new Set(coreContests.map((contest) => contest.id));
  const urls = new Set(coreContests.map((contest) => normalizedOfficialUrl(contest.official_url)));
  for (const contest of optionalContests) {
    if (ids.has(contest.id)) throw new Error(`Duplicate contest id across core and opt-in data: ${contest.id}`);
    ids.add(contest.id);
    const url = normalizedOfficialUrl(contest.official_url);
    if (urls.has(url)) throw new Error(`Duplicate official_url across core and opt-in data: ${url}`);
    urls.add(url);
  }
}

function validateResources(resources) {
  const byTarget = resourceMap(resources);
  const schema = parseJson(byTarget.get("data/schema.json"), "data/schema.json");
  const contests = parseJson(byTarget.get("data/contests.json"), "data/contests.json");
  const coreCount = validateContestData(schema, contests);

  const opportunitySchema = parseJson(
    byTarget.get("data/opportunities/schema.json"),
    "data/opportunities/schema.json",
  );
  const shardResources = selectedShardResources(resources);
  const optionalContests = [];
  for (const resource of shardResources) {
    const records = parseJson(byTarget.get(resource.target), resource.target);
    validateContestData(opportunitySchema, records, {
      allowEmpty: true,
      label: `Opportunity dataset ${resource.dataset.id}`,
    });
    if (records.length !== resource.dataset.record_count) {
      throw new Error(
        `Opportunity dataset ${resource.dataset.id} expected ${resource.dataset.record_count} records but received ${records.length}`,
      );
    }
    optionalContests.push(...records);
  }
  validateCrossDatasetUniqueness(contests, optionalContests);
  validateFeed(byTarget.get("feed.xml"));
  validateCalendar(byTarget.get("deadlines.ics"));
  return { coreCount, optionalCount: optionalContests.length, shardCount: shardResources.length };
}

async function fetchText(source, attempts = 3) {
  const url = `${UPSTREAM_BASE}/${source}`;
  const parsedUrl = new URL(url);
  if (parsedUrl.protocol === "file:") {
    const content = await readFile(fileURLToPath(parsedUrl), "utf8");
    if (content.trim().length === 0) throw new Error(`${url} was empty`);
    return content.endsWith("\n") ? content : `${content}\n`;
  }
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: { "user-agent": "aigc-opportunity-radar-data-sync" },
        signal: AbortSignal.timeout(20_000),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status} ${response.statusText}`);
      const content = await response.text();
      if (content.trim().length === 0) throw new Error("response was empty");
      return content.endsWith("\n") ? content : `${content}\n`;
    } catch (error) {
      lastError = error;
      if (attempt < attempts) await delay(attempt * 1_000);
    }
  }

  throw new Error(`Unable to fetch ${url} after ${attempts} attempts: ${lastError.message}`);
}

async function loadLocalResources() {
  const baseResources = [
    ...CORE_RESOURCES,
    ...OPPORTUNITY_METADATA_RESOURCES,
    { target: OPPORTUNITY_SELECTION_TARGET, kind: "selection", managed: false },
  ];
  const loaded = await Promise.all(
    baseResources.map(async (resource) => ({
      ...resource,
      content: await readFile(path.join(REPOSITORY_ROOT, resource.target), "utf8"),
    })),
  );
  const shards = selectedShardResources(loaded);
  const loadedShards = await Promise.all(
    shards.map(async (resource) => ({
      ...resource,
      content: await readFile(path.join(REPOSITORY_ROOT, resource.target), "utf8"),
    })),
  );
  return [...loaded, ...loadedShards];
}

async function loadUpstreamResources() {
  const fetched = await Promise.all(
    [...CORE_RESOURCES, ...OPPORTUNITY_METADATA_RESOURCES].map(async (resource) => ({
      ...resource,
      content: await fetchText(resource.source),
    })),
  );
  const selection = {
    target: OPPORTUNITY_SELECTION_TARGET,
    kind: "selection",
    managed: false,
    content: await readFile(path.join(REPOSITORY_ROOT, OPPORTUNITY_SELECTION_TARGET), "utf8"),
  };
  const baseResources = [...fetched, selection];
  const shards = selectedShardResources(baseResources);
  const fetchedShards = await Promise.all(
    shards.map(async (resource) => ({
      ...resource,
      content: await fetchText(resource.source),
    })),
  );
  return [...baseResources, ...fetchedShards];
}

async function writeChangedResources(resources) {
  const changed = [];

  for (const resource of resources) {
    if (resource.managed === false) continue;
    const targetPath = path.join(REPOSITORY_ROOT, resource.target);
    let current = null;
    try {
      current = await readFile(targetPath, "utf8");
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }

    if (current === resource.content) continue;

    await mkdir(path.dirname(targetPath), { recursive: true });
    const temporaryPath = `${targetPath}.tmp-${process.pid}`;
    try {
      await writeFile(temporaryPath, resource.content, "utf8");
      await rename(temporaryPath, targetPath);
    } finally {
      await rm(temporaryPath, { force: true });
    }
    changed.push(resource.target);
  }

  return changed;
}

async function main() {
  const mode = process.argv[2] || "--sync";
  if (!new Set(["--sync", "--check"]).has(mode)) {
    throw new Error("Usage: node scripts/sync-upstream.mjs [--sync|--check]");
  }

  const resources = mode === "--check" ? await loadLocalResources() : await loadUpstreamResources();
  const counts = validateResources(resources);

  if (mode === "--check") {
    console.log(
      `Validated ${counts.coreCount} core contests and ${counts.optionalCount} opt-in opportunities ` +
      `from ${counts.shardCount} selected shards, plus the local subscription files.`,
    );
    return;
  }

  const changed = await writeChangedResources(resources);
  if (changed.length === 0) {
    console.log(
      `Upstream is unchanged; ${counts.coreCount} core contests and ${counts.optionalCount} opt-in opportunities validated.`,
    );
  } else {
    console.log(
      `Validated ${counts.coreCount} core contests and ${counts.optionalCount} opt-in opportunities; ` +
      `updated: ${changed.join(", ")}`,
    );
  }
}

const invokedAsScript = process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;
if (invokedAsScript) {
  main().catch((error) => {
    console.error(error.stack || error.message);
    process.exitCode = 1;
  });
}
