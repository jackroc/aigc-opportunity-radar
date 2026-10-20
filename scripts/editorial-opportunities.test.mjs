import assert from 'node:assert/strict';
import { access, mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { inflateRawSync } from 'node:zlib';
import test from 'node:test';
import { OPPORTUNITY_REVIEWS, RESEARCH_DATE, mergeReviewedRecords, reviewPath, reviewedRecords } from '../assets/reviewed-opportunities.mjs';
import { reviewBody, reviewedBand } from '../lib/opportunity-pages.mjs';
import { SHOT_PLAN, WORKBOOK_FILES, WORKBOOK_ROOT } from '../lib/workbook.mjs';
import { textZip } from '../lib/download-zip.mjs';
import { buildSite } from './build-site.mjs';
import { renderTaskSnapshot } from '../assets/tasks.js';
import { classifyFee } from '../assets/site.js';

test('upstream refreshes cannot erase, duplicate or silently re-date editorial records', () => {
  const local = reviewedRecords();
  const changed = { ...local[0], title: 'Unreviewed upstream version', verified_on: '2099-01-01' };
  const merged = mergeReviewedRecords([changed, { id: 'upstream-only', verified_on: '2026-09-01' }]);
  assert.equal(merged.filter((record) => record.id === changed.id).length, 1);
  assert.equal(merged[0].title, local[0].title);
  assert.equal(merged[0].verified_on, RESEARCH_DATE);
  assert.ok(merged.some((record) => record.id === 'upstream-only'));
  assert.equal(mergeReviewedRecords([]).length, local.length);
  assert.equal(classifyFee(local.find((record) => record.id === 'elevenlabs-the-search-2026')), 'free');
  for (const review of OPPORTUNITY_REVIEWS) {
    for (const source of review.sources) assert.equal(new URL(source.url).protocol, 'https:');
    for (const lang of ['zh', 'en']) {
      assert.ok(review.facts.length && review.facts.every((fact) => fact[lang]));
      assert.ok(review.unknowns[lang] && review.fit[lang] && review.effort[lang]);
    }
  }
});

test('closed research stays readable with an explicit closed state and no planning recommendation', () => {
  const html = reviewBody(OPPORTUNITY_REVIEWS[0], 'en', '2030-01-01');
  assert.match(html, /deadline has passed/);
  assert.match(html, /over 14 days old/);
  assert.doesNotMatch(html, /planner\/\?contest=/);
  assert.equal(reviewedBand('en', '2030-01-01'), '');
  assert.equal(reviewPath('../../private'), null);
  assert.equal(reviewPath('" onclick="alert(1)'), null);
});

test('workbook timeline is continuous and ZIP contains the actual UTF-8 resources', () => {
  let position = 0;
  for (const shot of SHOT_PLAN) { assert.equal(shot.start, position); position += shot.duration; }
  assert.equal(position, 30);
  const zip = textZip(WORKBOOK_FILES);
  let offset = 0;
  const entries = {};
  while (zip.readUInt32LE(offset) === 0x04034b50) {
    const size = zip.readUInt32LE(offset + 18), nameSize = zip.readUInt16LE(offset + 26), extraSize = zip.readUInt16LE(offset + 28);
    const start = offset + 30;
    const name = zip.subarray(start, start + nameSize).toString('utf8');
    const dataStart = start + nameSize + extraSize;
    const bytes = inflateRawSync(zip.subarray(dataStart, dataStart + size));
    assert.equal(bytes.length, zip.readUInt32LE(offset + 22));
    entries[name] = bytes.toString('utf8');
    offset = dataStart + size;
  }
  assert.equal(zip.readUInt32LE(offset), 0x02014b50);
  assert.equal(zip.readUInt32LE(zip.length - 22), 0x06054b50);
  assert.equal(zip.readUInt32LE(zip.length - 6), offset);
  assert.deepEqual(entries, WORKBOOK_FILES);
  assert.throws(() => textZip({ '../secret.txt': 'no' }), /Unsafe/);
});

test('historical tasks distinguish original publication from activity and unconfirmed reward', async () => {
  const base = JSON.parse(await readFile(new URL('../data/tasks.json', import.meta.url), 'utf8'))[0];
  const render = (published_at) => renderTaskSnapshot({ tasks: [{ ...base, published_at, expires_at: '2026-12-01T00:00:00Z' }], sources: [], platforms: [] }, { now: new Date('2026-10-20T12:00:00Z') }).cards;
  assert.match(render('2023-12-03T00:00:00Z'), /最初发布.*2023/);
  assert.match(render('2023-12-03T00:00:00Z'), /超过一年的历史议题/);
  assert.match(render('2023-12-03T00:00:00Z'), /需向维护者确认/);
  assert.doesNotMatch(render('2026-10-01T00:00:00Z'), /超过一年的历史议题/);
});

test('published navigation, reviews, downloads and language variants resolve without JavaScript', async () => {
  const output = await mkdtemp(join(tmpdir(), 'radar-content-check-'));
  try {
    await buildSite({ output, now: new Date('2026-10-20T12:00:00Z') });
    const files = [];
    async function walk(directory) {
      for (const entry of await readdir(directory, { withFileTypes: true })) {
        const target = join(directory, entry.name);
        if (entry.isDirectory()) await walk(target); else if (entry.name.endsWith('.html')) files.push(target);
      }
    }
    await walk(output);
    for (const filename of files) {
      const html = await readFile(filename, 'utf8');
      assert.match(html, /<main\b/);
      for (const [, raw] of html.matchAll(/\bhref="([^"]+)"/g)) {
        const url = new URL(raw.replaceAll('&amp;', '&'), 'https://www.aigccreative.com' + filename.slice(output.length));
        if (url.origin !== 'https://www.aigccreative.com' || !url.pathname.startsWith('/')) continue;
        const target = join(output, decodeURIComponent(url.pathname), url.pathname.endsWith('/') ? 'index.html' : '');
        await assert.doesNotReject(access(target), `${filename}: missing ${url.pathname}`);
      }
    }
    for (const [name, expected] of Object.entries(WORKBOOK_FILES)) assert.equal(await readFile(join(output, WORKBOOK_ROOT, name), 'utf8'), expected);
    const home = await readFile(join(output, 'index.html'), 'utf8');
    for (const review of OPPORTUNITY_REVIEWS) assert.ok(home.includes(reviewPath(review.id)));
    const calendar = await readFile(join(output, 'opportunities/deadlines.ics'), 'utf8');
    assert.equal((calendar.match(/BEGIN:VEVENT/g) || []).length, OPPORTUNITY_REVIEWS.length);
    assert.ok(calendar.split('\r\n').every((line) => Buffer.byteLength(line) <= 75));
    const feed = await readFile(join(output, 'opportunities/feed.xml'), 'utf8');
    assert.equal((feed.match(/<item>/g) || []).length, OPPORTUNITY_REVIEWS.length);
  } finally { await rm(output, { recursive: true, force: true }); }
});
