import { escapeHtml as e } from '../assets/participation-core.mjs';

export const WORKBOOK_DATE = '2026-10-20';
export const WORKBOOK_ROOT = '/downloads/creator-entry-workbook/';
const SOUND_ZH = ['桌面轻敲逐渐变成节拍。', '引入原创的两小节声音钩子。', '加入有适当授权的成人声音，不模仿真人。', '短暂留白，让喝水动作被看见。', '回到同一个声音主题，不另加新旋律。', '重复原创歌词方向：Take a sip, find your beat.', '让声音自然收束，避免突然切断。'];
export const SHOT_PLAN = [
  { start: 0, duration: 3, zh: '桌前的成年人忙着工作，水杯被搁在一旁。', en: 'An adult at a desk leaves a water cup untouched.', sound: 'A dry desk tap becomes a rhythm.' },
  { start: 3, duration: 4, zh: '虚构的“回声杯 EchoCup”转向镜头，杯底亮起一圈节拍。', en: 'The fictional EchoCup turns toward camera; a ring pulses at its base.', sound: 'Introduce the original two-bar hook.' },
  { start: 7, duration: 5, zh: '节拍带动桌上的纸片和铅笔，人物注意到杯子。', en: 'Paper and pencils follow the beat; the person notices the cup.', sound: 'Add a simple adult vocal, not an impersonation.' },
  { start: 12, duration: 5, zh: '同一人物拿起杯子，喝水，节奏暂时留白。', en: 'The same person takes a drink; the rhythm briefly pauses.', sound: 'A short pause makes room for the action.' },
  { start: 17, duration: 5, zh: '回到工作，人物轻敲杯子回应节拍；保持角色和道具一致。', en: 'Back at work, a tap on the cup answers the beat; preserve continuity.', sound: 'Return the same hook rather than adding a new tune.' },
  { start: 22, duration: 5, zh: '产品主镜头：名称、原创字标与杯子同时出现。', en: 'Product shot with name, an original wordmark and the cup together.', sound: 'Repeat the original lyric: “Take a sip, find your beat.”' },
  { start: 27, duration: 3, zh: '保留干净结尾与官方水印区域，标注这是虚构产品。', en: 'A clean end card reserves the official watermark area and labels the product fictional.', sound: 'Resolve the hook; avoid an abrupt cutoff.' },
].map((shot, index) => ({ ...shot, soundZh: SOUND_ZH[index] }));

const csv = (rows) => '\uFEFF' + rows.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\r\n') + '\r\n';

export const WORKBOOK_FILES = {
  'README.md': `# Creator entry preparation workbook / 创作参赛准备示范包

Revision / 修订：${WORKBOOK_DATE}

这是本站原创的纸上创作示范和准备模板。EchoCup 是虚构产品；情节、分镜与工作量是示范设计，不是已制作成片、真实参赛、用户测试或获奖记录。包中没有音视频、官方水印或提交回执。它帮助你组织自己的真实制作与材料。

This is an original paper-edit example and preparation workbook. EchoCup is fictional. The outline and estimates are illustrative, not a finished film, submitted entry, user test or award record. No media, official watermark or receipt is included.

## Use / 使用顺序
1. Read the current official rules; fill 01-rule-evidence.csv.
2. Adapt 08-project-brief.md; revise 02-shot-plan.csv to your own idea.
3. Make the work and replace all planned/pending entries with true evidence.
4. Complete the rights ledger, disclosure and export/link checks.
5. Submit yourself and keep the actual receipt in 07-submission-record.csv.

## Research basis / 规则研究依据
This example uses the 15–45-second brief of ElevenLabs The Search as a planning constraint. It is not an official entry kit or organizer endorsement. Their new-work rule means this public example should not be copied and submitted as a newly created personal work.

本示范借用 The Search 的 15–45 秒约束讲解准备方法。参赛要求作品专门创作；请用自己的新构思制作，不能把这份已公开示范作为个人新作直接参赛。

Official rules: https://elevenlabs.io/creative/thesearch/terms
Official activity: https://elevenlabs.io/creative/thesearch
Our analysis: https://www.aigccreative.com/opportunities/elevenlabs-the-search-2026/

The official pages differ on opening date and platform lists. X, Instagram, TikTok and YouTube appear in both platform lists; verify the current form and full terms. Fees, regional eligibility and rights must be checked for your own situation. A plan is not organizer approval.
`,
  '01-rule-evidence.csv': csv([
    ['requirement / 条件', 'official_url / 来源', 'checked_on / 核验日', 'evidence_or_section / 依据位置', 'my_status / 我的状态', 'next_action / 下一步'],
    ['Eligibility / 资格', '', '', '', '未核对 / unchecked', ''],
    ['Opening, closing and time zone / 起止与时区', '', '', '', '未核对 / unchecked', ''],
    ['Duration and format / 时长与格式', '', '', '', '未核对 / unchecked', ''],
    ['AI tools and disclosure / AI 工具与披露', '', '', '', '未核对 / unchecked', ''],
    ['Rights and premiere / 授权与首发', '', '', '', '未核对 / unchecked', ''],
    ['Fee, award and delivery / 费用、奖项与交付', '', '', '', '未核对 / unchecked', ''],
  ]),
  '02-shot-plan.csv': csv([
    ['shot', 'start_seconds', 'duration_seconds', 'end_seconds', 'visual_zh', 'visual_en', 'sound_direction_zh', 'sound_direction_en', 'production_status'],
    ...SHOT_PLAN.map((shot, index) => [index + 1, shot.start, shot.duration, shot.start + shot.duration, shot.zh, shot.en, shot.soundZh, shot.sound, '纸上示范；未制作 / paper edit; not produced']),
  ]),
  '03-rights-ledger.csv': csv([
    ['asset / 素材', 'intended_use / 用途', 'source_and_tool / 来源与工具', 'permission_proof / 权利凭据', 'status / 状态'],
    ['Product wordmark / 产品字标', 'On-screen identity', 'Design an original mark', '', '尚未制作、核对 / pending'],
    ['Adult character / 成人角色', 'Visual continuity', 'Original fictional character; no real-person reference', '', '尚未制作、核对 / pending'],
    ['Jingle music / 音乐', 'Original audio hook', 'Planned ElevenCreative generation', '', '未生成 / not generated'],
    ['Adult voice / 成人声音', 'Optional vocal', 'Choose a properly licensed non-impersonating adult voice', '', '尚未选择 / pending'],
    ['Official watermark / 官方水印', 'Contest-specific placement', 'Download from the current official contest page', '', '未下载；按主办方用途 / not downloaded'],
  ]),
  '04-ai-disclosure.md': `# AI disclosure worksheet / AI 使用说明

## Planning example — not a claim of production / 计划示范，不是制作事实
For the fictional EchoCup paper edit, the intended process is: develop the story and shot order, generate an original jingle in ElevenCreative, create consistent visual assets, select/revise outputs, edit timing and check the final links. No media has been generated for this workbook.

本示范只完成文字构思与分镜。计划使用的工具与实际使用过的工具要分开记录，不能把“准备使用”写成“已经完成”。

## Replace with your actual process / 按真实制作填写
- Project and final version / 作品与最终版本：
- Human decisions and credited contributors / 人工创作与参与者：
- Tools, models and versions actually used / 实际工具、模型与版本：
- Generated or materially changed elements / 生成或实质修改的部分：
- Human selection, editing and correction / 人工选择、剪辑与修正：
- Third-party images, voices, music and permissions / 第三方素材与授权：
- Evidence files or public project links / 证据文件或项目链接：

Only describe work actually done. If a source, model version or permission is unknown, record the unknown and resolve it before making a factual declaration. Requirements vary by event; this worksheet is not a substitute for its form.
`,
  '05-production-budget.csv': csv([
    ['task / 工作', 'illustrative_hours / 示范小时', 'actual_hours / 实际小时', 'cash_cost_and_currency / 现金成本与币种', 'notes / 说明'],
    ['Rule and rights preflight', 1, '', '', 'Example estimate, not an organizer standard'],
    ['Concept, lyric and paper edit', 2, '', '', 'Adapt to a new original concept'],
    ['Audio and visual tests', 3, '', '', 'Account for rejected versions and tool limits'],
    ['Asset production and continuity', 4, '', '', 'Replace with time measured on your test scene'],
    ['Editing and sound balance', 2, '', '', 'Include titles, watermark and transitions'],
    ['Export, link checks and submission', 2, '', '', 'Keep an upload and correction buffer'],
    ['TOTAL / 合计', 14, '', '', 'Illustrative planning only; never a universal production promise'],
  ]),
  '06-export-and-link-qa.md': `# Export and link checks / 导出与链接检查

The following checks apply to this paper-edit example. Confirm the actual event requirements first.

- [ ] Final work is my new original work, with eligible contributors and permissions.
- [ ] Duration is 15–45 seconds; paper-edit example totals exactly 30 seconds.
- [ ] Landscape 16:9; inspect the actual exported file, not just the editor canvas.
- [ ] The fictional product name, image and original mark are visible.
- [ ] Jingle was actually made in ElevenCreative, with a public share link and generation evidence.
- [ ] Official contest watermark uses the organizer-provided asset and required placement.
- [ ] Full terms concerning English voice/subtitles and prohibited child voices were checked.
- [ ] Raw video link is on a permitted host with view access enabled.
- [ ] At least two required social posts are public and include the required tags and handles.
- [ ] Video, music and post links work while signed out; keep them available for judging.
- [ ] The official entry form was completed and the real receipt was saved.

不要因为制作计划完成，就把生成证据、素材授权或正式投稿勾选为完成。不要在公开表格填写证件、密码、私密访问令牌或收款资料。
`,
  '07-submission-record.csv': csv([
    ['event / 活动', 'final_version / 最终版本', 'work_url / 作品链接', 'music_url / 音乐链接', 'post_1 / 发布1', 'post_2 / 发布2', 'submitted_at_with_zone / 提交时刻与时区', 'receipt_location / 回执位置', 'status / 状态'],
    ['', '', '', '', '', '', '', '', '未投稿 / not submitted'],
  ]),
  '08-project-brief.md': `# EchoCup / 回声杯 — original paper-edit example

Status: written planning example; no finished film, audio, user test or submission.
状态：原创文字规划示范，未制作成片或音乐，未测试产品，未投稿。

## Product / 虚构产品
A fictional cup whose rhythm reminds a busy adult to pause and drink water. It is a storytelling device, not a claim about a real device or a health outcome.
一只会用节拍提醒忙碌成年人停一停、喝口水的虚构杯子。不宣称真实产品能力或健康效果。

## One sentence / 一句话
A person ignores a cup until the desk begins following its beat; a small pause becomes the memorable action.
一个人忽略了水杯，直到桌上的物品都跟着杯子的节拍动起来；一次小小的停顿，成为记忆点。

## Original lyric direction / 原创歌词方向
Take a sip, find your beat.
This original text is a starting direction; no melody or performance has been made. Write and generate a new original jingle for your own work.

## Creative constraints / 创作约束
- One adult character, one desk, one cup, one repeated audio hook.
- One uninterrupted 30-second timeline: 3 + 4 + 5 + 5 + 5 + 5 + 3.
- Preserve the character, desk arrangement and product appearance across shots.
- Use a clearly fictional identity; do not imitate a real performer or existing brand.
- Reserve time for the product name and mark to be readable at normal playback speed.

## Decision log / 决策记录
The limited setting reduces continuity work. The pause at 12 seconds makes the drink an action, rather than a line of advertising copy. Repeating the same hook links the final product shot to the opening rhythm. These are editorial design decisions, not measured audience results or official judging predictions.

少场景用于减少连续性工作；中段留白让喝水成为可见动作；同一段声音回到片尾，让观众有机会建立关联。这些是创作设计理由，不是传播测试结果。
`,
};

export function workbookPreview(lang = 'zh') {
  const zh = lang === 'zh';
  return `<section><h2>${zh ? '30 秒纸上样片：可以逐行检查的时间轴' : 'A 30-second paper edit you can inspect'}</h2><p>${zh ? '虚构产品“回声杯 EchoCup”。以下是本站完成的原创文字分镜；音视频尚未制作。它示范怎样把创意、声音、连续性和交付检查放在同一张表上。' : 'EchoCup is fictional. This original written shot plan is complete as a paper edit; no film or audio has been produced. It connects concept, sound, continuity and delivery checks.'}</p><div class="review-table-wrap" role="region" aria-label="${zh ? '30 秒分镜表' : '30-second shot plan'}" tabindex="0"><table class="review-table"><caption>${zh ? '示范总长 30 秒；应为自己的参赛作品另写原创方案' : '30 seconds in total; write an original plan for your own entry'}</caption><thead><tr><th scope="col">${zh ? '时间' : 'Time'}</th><th scope="col">${zh ? '画面与动作' : 'Picture and action'}</th><th scope="col">${zh ? '声音方向' : 'Sound direction'}</th></tr></thead><tbody>${SHOT_PLAN.map((shot) => `<tr><th scope="row">${shot.start}–${shot.start + shot.duration}s</th><td>${e(shot[lang])}</td><td>${e(zh ? shot.soundZh : shot.sound)}</td></tr>`).join('')}</tbody></table></div><p><a class="button button-primary" href="${WORKBOOK_ROOT}creator-entry-workbook.zip" download>${zh ? `下载 ${Object.keys(WORKBOOK_FILES).length} 份示范资料与模板（ZIP）` : `Download ${Object.keys(WORKBOOK_FILES).length} example files and templates (ZIP)`}</a></p></section>`;
}

export function resourcesBody(lang = 'zh') {
  const zh = lang === 'zh';
  const descriptions = zh ? ['使用顺序、研究来源与示范边界', '把官方条件、证据位置和自己的状态分开记录', '完整 30 秒文字分镜，含逐镜声音方向', '素材、声音与生成内容的权利依据', '计划示范与真实制作说明的区别', '可改写的工作量与现金成本表', '导出文件、公开链接及投稿前检查', '保持空白的真实回执记录表', '原创虚构产品构思与创作决策说明'] : ['Usage, sources and limits', 'Official conditions, evidence and personal status', 'Complete 30-second paper edit with sound directions', 'Rights evidence for assets, voices and generated material', 'Planned process versus actual production disclosure', 'Editable effort and cash-cost budget', 'File, link and entry preflight', 'Blank real-submission receipt record', 'Original fictional brief and creative decision log'];
  return `<p class="reading-intro">${zh ? '把参赛准备落到可检查的文件。这里有一套本站原创的纸上创作示范，以及可以复制到自己项目的空白记录表。无需登录，下载不会上传你的资料。' : 'Make preparation inspectable. This original paper-edit example includes blank records for your own project. No login is required and downloading does not upload your data.'}</p><p><a class="button button-primary" href="${WORKBOOK_ROOT}creator-entry-workbook.zip" download>${zh ? '下载准备示范包（ZIP，9 份文件）' : 'Download the workbook (ZIP, 9 files)'}</a></p><aside class="editorial-note">${zh ? '示范包修订于 2026-10-20。它是准备资料，不是已完成成片或已提交作品。为自己的参赛作品另做新构思，并按实际制作填写工具与授权记录。' : 'Revised 2026-10-20. This is a preparation workbook, not a finished or submitted film. Develop your own new concept and record tools and rights from actual production.'}</aside>${workbookPreview(lang)}<section><h2>${zh ? '逐份下载，按需使用' : 'Download individual files'}</h2><ul class="resource-files">${Object.keys(WORKBOOK_FILES).map((file, index) => `<li><a href="${WORKBOOK_ROOT}${file}" download>${e(file)}</a><p>${e(descriptions[index])}</p></li>`).join('')}</ul></section><section><h2>${zh ? '和自己的机会连接起来' : 'Connect it to your opportunity'}</h2><p><a href="${lang === 'en' ? '/en' : ''}/opportunities/">${zh ? '先读资格、费用与作品要求' : 'Read eligibility, fees and deliverables first'} →</a></p><p><a href="${lang === 'en' ? '/en' : ''}/planner/">${zh ? '建立并保存自己的参赛计划' : 'Build and save a personal preparation plan'} →</a></p><p><a href="${lang === 'en' ? '/en' : ''}/guides/30-second-ad-workbook/">${zh ? '阅读示范方案的完整推导过程' : 'Read the reasoning behind the example'} →</a></p></section>`;
}
