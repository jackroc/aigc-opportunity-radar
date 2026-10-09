export const PLAN_KEY = 'radar-participation-v1';
export const PLAN_REVISION = '2026-10-09';
export const CHECKS = [
  { id: 'eligibility', zh: '资格：年龄、地区、组别、个人或团队均已核对', en: 'Eligibility: age, region, division and team rules checked' },
  { id: 'ai', zh: 'AI 边界：允许的工具、披露要求和原创要求已确认', en: 'AI rules: tools, disclosure and originality confirmed' },
  { id: 'rights', zh: '素材权利：代码、图片、音乐和人物授权已确认', en: 'Rights: code, images, music and people cleared' },
  { id: 'cost', zh: '费用与奖励：报名费、奖项条件和领取限制已核对', en: 'Costs: entry fees, award conditions and payout restrictions checked' },
  { id: 'dates', zh: '时间：注册、提交、答辩的日期及官方时区已确认', en: 'Dates: registration, submission, presentation and official time zone checked' },
  { id: 'delivery', zh: '交付：格式、尺寸、时长、链接权限和提交回执已核对', en: 'Delivery: format, size, duration, link access and receipt checked' },
];
export const escapeHtml = value => String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
export function safeHttps(value) {
  try { const u = new URL(value); return u.protocol === 'https:' ? u.href : '#'; } catch { return '#'; }
}
export function localDay(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
function dayNumber(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value ?? '')) return NaN;
  const n = Date.parse(`${value}T00:00:00Z`);
  return Number.isFinite(n) && new Date(n).toISOString().slice(0, 10) === value ? n / 86400000 : NaN;
}
export function verificationAge(value, today = localDay()) {
  const days = dayNumber(today) - dayNumber(value);
  return Number.isFinite(days) ? Math.max(0, days) : null;
}
export function availableContests(records, today = localDay()) {
  return records.filter(r => Number.isFinite(dayNumber(r.deadline)) && r.deadline >= today).sort((a, b) => a.deadline.localeCompare(b.deadline) || a.id.localeCompare(b.id));
}
export function computePlan({ today = localDay(), deadline, hours = 2, effort = 12, buffer = 2 } = {}) {
  const from = dayNumber(today), until = dayNumber(deadline);
  hours = Number(hours); effort = Number(effort); buffer = Number(buffer);
  if (!Number.isFinite(from) || !Number.isFinite(until) || !Number.isFinite(hours) || hours <= 0 || hours > 24 || !Number.isFinite(effort) || effort <= 0 || effort > 10000 || !Number.isInteger(buffer) || buffer < 0 || buffer > 30) return { valid: false };
  const daysLeft = until - from;
  // Exclude the deadline day; its exact cutoff and the user's time zone may differ.
  const workDays = Math.max(0, daysLeft - buffer);
  const capacity = Math.round(workDays * hours * 100) / 100;
  const target = new Date((until - buffer) * 86400000).toISOString().slice(0, 10);
  return { valid: true, daysLeft, workDays, capacity, effort, buffer, target, status: daysLeft < 0 ? 'expired' : capacity < effort ? 'tight' : 'possible' };
}
export function cleanDraft(raw = {}) {
  if (!raw || typeof raw !== 'object') raw = {};
  return {
    hours: typeof raw.hours === 'string' || typeof raw.hours === 'number' ? String(raw.hours).slice(0, 10) : '2',
    effort: typeof raw.effort === 'string' || typeof raw.effort === 'number' ? String(raw.effort).slice(0, 10) : '12',
    buffer: typeof raw.buffer === 'string' || typeof raw.buffer === 'number' ? String(raw.buffer).slice(0, 10) : '2',
    notes: typeof raw.notes === 'string' ? raw.notes.slice(0, 4000) : '',
    checked: CHECKS.filter(c => Array.isArray(raw.checked) && raw.checked.includes(c.id)).map(c => c.id),
  };
}
export function localizedRecord(record, lang = 'zh') {
  return lang === 'en' ? { ...record, ...record.en, id: record.id, deadline: record.deadline, verified_on: record.verified_on } : record;
}
export function comparisonCard(record, lang = 'zh', today = localDay()) {
  const r = localizedRecord(record, lang), zh = lang === 'zh';
  const facts = [[zh ? '提交日期' : 'Submission date', r.deadline], [zh ? '官方时区说明' : 'Official time-zone note', r.timezone], [zh ? '资格' : 'Eligibility', r.eligibility], [zh ? '费用' : 'Fees', r.fee], [zh ? '奖励' : 'Awards', r.prize]];
  const age = verificationAge(r.verified_on, today);
  return `<article class="planner-opportunity"><h3>${escapeHtml(r.title)}</h3><dl>${facts.map(([k,v]) => `<div><dt>${k}</dt><dd>${escapeHtml(v)}</dd></div>`).join('')}</dl><p class="source-age">${zh ? '来源资料核验于' : 'Source record checked'} ${escapeHtml(r.verified_on)}${age !== null && age > 30 ? ` · ${zh ? '超过 30 天，请重新打开官方规则确认' : 'over 30 days ago; recheck the official rules'}` : ''}</p><a href="${safeHttps(r.rules_url)}" target="_blank" rel="noopener noreferrer">${zh ? '打开官方规则' : 'Open official rules'} ↗</a></article>`;
}
export function exportPlan(record, draft, lang = 'zh', today = localDay()) {
  const r = localizedRecord(record, lang), d = cleanDraft(draft), zh = lang === 'zh';
  const p = computePlan({ ...d, deadline: r.deadline, today });
  const lines = [`# ${r.title}`, '', `${zh ? '计划生成日期' : 'Plan date'}: ${today}`, `${zh ? '目录提交日期（不是精确截止时刻）' : 'Listed submission date (not an exact cutoff)'}: ${r.deadline}`, `${zh ? '官方时区说明' : 'Official time-zone note'}: ${r.timezone}`, `${zh ? '规则来源' : 'Official rules'}: ${safeHttps(r.rules_url)}`, `${zh ? '来源核验日期' : 'Source verification date'}: ${r.verified_on}`, '', `## ${zh ? '我的时间预算' : 'My time budget'}`];
  if (p.valid) lines.push(`${zh ? '每天可投入' : 'Hours per day'}: ${d.hours}`, `${zh ? '预计工作量（小时）' : 'Estimated work (hours)'}: ${d.effort}`, `${zh ? '预留缓冲天数' : 'Buffer days'}: ${d.buffer}`, `${zh ? '不含截止当天的可用小时' : 'Available hours, excluding deadline day'}: ${p.capacity}`, `${zh ? '建议自定完成日' : 'Personal target date'}: ${p.target}`);
  else lines.push(zh ? '时间预算未填写完整。' : 'Time budget is incomplete.');
  lines.push('', `## ${zh ? '我的核对清单' : 'My checks'}`, ...CHECKS.map(c => `- [${d.checked.includes(c.id) ? 'x' : ' '}] ${c[lang]}`), '', `## ${zh ? '我的依据与待确认事项' : 'My evidence and open questions'}`, d.notes, '', zh ? '此清单是个人准备记录，不代表主办方确认资格，也不会替你报名。时间预算只是按日估算；注册和提交截止时刻请分别以官方规则为准。' : 'This is a personal preparation record, not eligibility approval or registration. Capacity is a calendar-day estimate. Check registration and submission cutoffs separately in the official rules.');
  return lines.join('\n');
}
