import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, access } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { buildSite, loadContestRecords, safeJson } from './build-site.mjs';
import { renderContestSnapshot } from '../assets/site.js';
import { renderTaskSnapshot } from '../assets/tasks.js';
import { GUIDES, INFORMATION, contentPath } from '../lib/editorial.mjs';

const fixtureDate = new Date('2026-09-17T12:00:00Z');
const readData = async (name) => JSON.parse(await readFile(new URL(`../data/${name}.json`, import.meta.url), 'utf8'));

test('published contest cards exclude expired entries and escape source text and unsafe URLs', async () => {
  const base = (await readData('contests'))[0];
  const records = [
    { ...base, id: 'active', title: '<img src=x onerror=alert(1)>', official_url: 'javascript:alert(1)', deadline: '2026-10-01' },
    { ...base, id: 'expired', title: 'Expired fixture', deadline: '2026-09-16' },
  ];
  const view = renderContestSnapshot(records, { today: fixtureDate });
  assert.equal(view.count, 1);
  assert.match(view.cards, /&lt;img src=x/);
  assert.doesNotMatch(view.cards, /<img src=x|javascript:|Expired fixture/);
  const english = renderContestSnapshot(records, { today: fixtureDate, lang: 'en' });
  assert.match(english.cards, /WeChat/);
  assert.equal(renderContestSnapshot([], { today: fixtureDate }).count, 0);
});

test('published tasks exclude closed and stale records without implying confirmed payment', async () => {
  const base = (await readData('tasks'))[0];
  const view = renderTaskSnapshot({ tasks: [
    { ...base, id: 'active', title: 'Unconfirmed fixture', reward: { ...base.reward, confirmed: false } },
    { ...base, id: 'closed', title: 'Closed fixture', status: 'closed' },
    { ...base, id: 'expired', title: 'Stale fixture', expires_at: '2026-09-16T00:00:00Z' },
  ], platforms: [], sources: [] }, { now: fixtureDate });
  assert.equal(view.count, 1);
  assert.match(view.cards, /Unconfirmed fixture/);
  assert.match(view.cards, /需向维护者确认/);
  assert.doesNotMatch(view.cards, /Closed fixture|Stale fixture/);
});

test('embedded snapshot JSON cannot close its script element', () => {
  const original = { title: '</script><img src=x onerror=alert(1)>', amp: '&' };
  const encoded = safeJson(original);
  assert.doesNotMatch(encoded, /[<>&]/);
  assert.deepEqual(JSON.parse(encoded), original);
});

test('a build publishes complete HTML, bilingual guides and a limited static output', async () => {
  const output = await mkdtemp(join(tmpdir(), 'radar-build-test-'));
  try {
    const result = await buildSite({ output, now: fixtureDate });
    const home = await readFile(join(output, 'index.html'), 'utf8');
    const tasks = await readFile(join(output, 'tasks/index.html'), 'utf8');
    assert.equal((home.match(/class="contest-card"/g) || []).length, result.contests);
    assert.equal((tasks.match(/class="task-card"/g) || []).length, result.tasks);
    assert.ok(result.contests > 0 && result.tasks > 0);
    for (const html of [home, tasks]) {
      assert.doesNotMatch(html, /skeleton-card|adsbygoogle\.js/);
      assert.match(html, /name="google-adsense-account"/);
      assert.match(html, /data-editorial-language="en" hidden/);
      assert.match(html, /rel="canonical"/);
    }
    const embedded = JSON.parse(home.match(/id="initial-contests">([\s\S]*?)<\/script>/)[1]);
    assert.deepEqual(embedded, await loadContestRecords());
    assert.equal(new Set(embedded.map((x) => x.id)).size, embedded.length);
    const sitemap = await readFile(join(output, 'sitemap.xml'), 'utf8');
    const slugs = ['guides', ...GUIDES.map((guide) => `guides/${guide.slug}`), ...Object.keys(INFORMATION)];
    for (const lang of ['zh', 'en']) for (const slug of slugs) {
      const path = contentPath(slug, lang);
      const page = await readFile(join(output, path, 'index.html'), 'utf8');
      assert.ok(sitemap.includes(`https://www.aigccreative.com${path}`));
      assert.match(page, new RegExp(`<html lang="${lang === 'zh' ? 'zh-CN' : 'en'}"`));
      assert.match(page, /hreflang="x-default"/);
      assert.ok(page.includes(`rel="canonical" href="https://www.aigccreative.com${path}"`));
      assert.doesNotMatch(page, /adsbygoogle\.js/);
    }
    assert.equal((sitemap.match(/<url>/g) || []).length, 16);
    assert.match(await readFile(join(output, 'robots.txt'), 'utf8'), /Sitemap: https:\/\/www.aigccreative.com\/sitemap.xml/);
    for (const privatePath of ['lib', 'api', '.git', 'scripts', 'package.json']) await assert.rejects(access(join(output, privatePath)));
  } finally { await rm(output, { recursive: true, force: true }); }
});
