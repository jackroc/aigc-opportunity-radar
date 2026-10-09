import assert from 'node:assert/strict';
import test from 'node:test';
import { CHECKS, cleanDraft, computePlan, availableContests, verificationAge, comparisonCard, exportPlan } from '../assets/participation-core.mjs';
import { participationBody } from '../lib/participation-page.mjs';

const record = { id: 'sample', title: '样例', deadline: '2026-10-17', verified_on: '2026-08-26', timezone: '时刻待确认', eligibility: '未知', fee: '待确认', prize: '以规则为准', rules_url: 'https://example.com/rules', en: { title: 'Example', timezone: 'Exact time unknown', eligibility: 'Unknown', fee: 'Unknown', prize: 'See rules' } };
test('time budget excludes deadline day and buffer, including leap-day boundaries', () => {
  assert.deepEqual(computePlan({ today: '2026-10-09', deadline: '2026-10-17' }), { valid: true, daysLeft: 8, workDays: 6, capacity: 12, effort: 12, buffer: 2, target: '2026-10-15', status: 'possible' });
  assert.equal(computePlan({ today: '2026-10-17', deadline: '2026-10-17' }).capacity, 0);
  assert.equal(computePlan({ today: '2026-10-18', deadline: '2026-10-17' }).status, 'expired');
  assert.equal(computePlan({ today: '2028-02-28', deadline: '2028-03-01', buffer: 0 }).workDays, 2);
  assert.equal(computePlan({ today: '2026-10-09', deadline: '2026-10-17', effort: 13 }).status, 'tight');
});
test('invalid, non-finite and impossible inputs cannot create a plausible plan', () => {
  for (const changed of [{ hours: '' }, { hours: 0 }, { hours: 25 }, { effort: Infinity }, { effort: -1 }, { buffer: -1 }, { buffer: 1.5 }, { buffer: 31 }, { today: '2026-02-30' }, { deadline: 'invalid' }]) assert.equal(computePlan({ today: '2026-10-09', deadline: '2026-10-17', ...changed }).valid, false);
});
test('new plans exclude expired or malformed dates, while old verification dates remain visible', () => {
  assert.equal(availableContests([record, { ...record, id: 'old', deadline: '2026-10-08' }, { ...record, id: 'bad', deadline: '2026-02-30' }], '2026-10-09').length, 1);
  assert.equal(verificationAge('2026-08-26', '2026-10-09'), 44);
  assert.match(comparisonCard(record, 'zh', '2026-10-09'), /超过 30 天/);
  assert.match(comparisonCard(record, 'en', '2026-10-09'), /Exact time unknown/);
});
test('source text is escaped and unsafe rule URLs are not rendered as executable links', () => {
  const card = comparisonCard({ ...record, title: '<img src=x onerror=alert(1)>', rules_url: 'javascript:alert(1)' });
  assert.match(card, /&lt;img/); assert.doesNotMatch(card, /<img|javascript:/);
});
test('stored drafts are bounded and exports preserve independent confirmation and source provenance', () => {
  assert.equal(cleanDraft(null).hours, '2');
  const d = cleanDraft({ checked: ['eligibility', 'fake'], notes: 'a'.repeat(5000), hours: { malicious: true } });
  assert.equal(d.notes.length, 4000); assert.deepEqual(d.checked, ['eligibility']); assert.equal(d.hours, '2');
  const text = exportPlan(record, d, 'en', '2026-10-09');
  assert.match(text, /Source verification date: 2026-08-26/);
  assert.match(text, /\[x\] Eligibility/); assert.match(text, /not eligibility approval/);
  assert.equal((text.match(/^- \[/gm) || []).length, CHECKS.length);
});
test('the planner stays informative without scripts and has a useful empty-directory state', () => {
  const html = participationBody([], 'en', '2026-10-09', JSON.stringify);
  assert.match(html, /No current opportunities/); assert.match(html, /<noscript>/); assert.match(html, /How to use the plan/);
  assert.doesNotMatch(html, /adsbygoogle|<iframe/);
});
