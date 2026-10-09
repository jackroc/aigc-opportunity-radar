import { PLAN_KEY, CHECKS, cleanDraft, computePlan, comparisonCard, exportPlan, localDay } from './participation-core.mjs';

const payload = document.querySelector('#planner-data');
if (payload) {
  const { records, lang } = JSON.parse(payload.textContent);
  const zh = lang === 'zh', form = document.querySelector('#planner-form');
  const select = form.elements.contest, summary = document.querySelector('#plan-summary'), saveStatus = document.querySelector('#plan-save-status');
  const today = localDay();
  let saved = {};
  try { const parsed = JSON.parse(localStorage.getItem(PLAN_KEY)); if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) saved = parsed; } catch { /* Storage is optional. */ }
  const selected = new URLSearchParams(location.search).get('contest');
  if (selected && records.some(r => r.id === selected)) select.value = selected;
  let activeId = select.value;
  const active = () => records.find(r => r.id === activeId);
  const readDraft = () => cleanDraft({ hours: form.elements.hours.value, effort: form.elements.effort.value, buffer: form.elements.buffer.value, notes: form.elements.notes.value, checked: CHECKS.filter(c => form.elements[c.id].checked).map(c => c.id) });
  function restore() {
    const d = cleanDraft(Object.hasOwn(saved, activeId) ? saved[activeId] : {});
    for (const name of ['hours', 'effort', 'buffer', 'notes']) form.elements[name].value = d[name];
    for (const check of CHECKS) form.elements[check.id].checked = d.checked.includes(check.id);
  }
  function save() {
    Object.defineProperty(saved, activeId, { value: readDraft(), writable: true, enumerable: true, configurable: true });
    try { localStorage.setItem(PLAN_KEY, JSON.stringify(saved)); saveStatus.textContent = zh ? '已保存到此浏览器；不会上传。' : 'Saved in this browser; not uploaded.'; }
    catch { saveStatus.textContent = zh ? '浏览器不允许保存；仍可下载清单。' : 'Browser storage is unavailable; you can still download your plan.'; }
  }
  function render() {
    const r = active(); if (!r) return;
    document.querySelector('#plan-opportunity').innerHTML = comparisonCard(r, lang, today);
    const d = readDraft(), p = computePlan({ ...d, deadline: r.deadline, today });
    document.querySelector('#plan-print-notes').textContent = d.notes;
    const status = zh ? { possible: '按当前估算，时间预算可覆盖工作量', tight: '当前时间预算不足，建议缩小范围或调整安排', expired: '目录日期已过，请先确认是否延期' } : { possible: 'Your estimated capacity covers the work', tight: 'Your estimate exceeds available capacity', expired: 'Listed date has passed; check for an extension' };
    summary.dataset.status = p.valid ? p.status : 'invalid';
    const message = p.valid ? `${status[p.status]}${zh ? '。' : '.'} ${zh ? `可用 ${p.workDays} 天，约 ${p.capacity} 小时；预计需要 ${p.effort} 小时。个人完成目标：${p.target}。` : `${p.workDays} work days, about ${p.capacity} hours available; ${p.effort} hours estimated. Personal target: ${p.target}.`}` : (zh ? '请填写有效预算：每天大于 0 且不超过 24 小时；工作量大于 0；缓冲为 0–30 的整数。' : 'Enter a valid budget: more than 0 and at most 24 hours/day, positive effort, and an integer buffer of 0–30 days.');
    summary.textContent = message;
    document.querySelector('#plan-progress').textContent = zh ? `已自行核对 ${d.checked.length} / ${CHECKS.length} 项` : `${d.checked.length} / ${CHECKS.length} self-checks completed`;
    document.querySelector('#plan-download').disabled = !p.valid;
  }
  form.addEventListener('submit', e => e.preventDefault());
  select.addEventListener('change', () => {
    save(); activeId = select.value; restore();
    const url = new URL(location.href); url.searchParams.set('contest', activeId); history.replaceState(null, '', url); render();
  });
  form.addEventListener('input', e => { if (e.target === select) return; render(); save(); });
  document.querySelector('#plan-reset').addEventListener('click', () => { delete saved[activeId]; restore(); render(); save(); });
  document.querySelector('#plan-download').addEventListener('click', () => {
    const r = active(); if (!r) return;
    const blob = new Blob([exportPlan(r, readDraft(), lang, today)], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob), link = document.createElement('a'); link.href = url; link.download = `radar-plan-${r.id}.md`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  document.querySelector('#plan-print').addEventListener('click', () => window.print());
  restore(); render(); form.hidden = records.length === 0;
}
