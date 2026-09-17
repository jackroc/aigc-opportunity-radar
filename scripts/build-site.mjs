import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderContestSnapshot, resolveOpportunityDatasets } from '../assets/site.js';
import { renderTaskSnapshot } from '../assets/tasks.js';
import { contentPath, EDITORIAL_DATE, GUIDES, INFORMATION, REPOSITORY, SITE_URL } from '../lib/editorial.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const escape = (value) => String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
export const safeJson = (value) => JSON.stringify(value).replaceAll('<', '\\u003c').replaceAll('>', '\\u003e').replaceAll('&', '\\u0026');
const read = (path) => readFile(join(root, path), 'utf8');
const json = async (path) => JSON.parse(await read(path));

export async function loadContestRecords() {
  const core = await json('data/contests.json');
  const selected = resolveOpportunityDatasets(await json('data/opportunity-selection.json'), await json('data/opportunities/manifest.json'));
  const extensions = await Promise.all(selected.map(async (dataset) => {
    const records = await json(`data/opportunities/${dataset.path}`);
    if (!Array.isArray(records) || records.length !== dataset.record_count) throw new Error(`Invalid dataset ${dataset.id}`);
    return records.map((record) => ({ ...record, __dataset: dataset.id }));
  }));
  const seen = new Set();
  return [...core, ...extensions.flat()].filter((record) => {
    if (!record?.id || seen.has(record.id)) return false;
    seen.add(record.id);
    return true;
  }).map((record, index) => ({ ...record, __index: index }));
}

function guideCards(lang) {
  return `<div class="guide-grid">${GUIDES.map((guide, index) => `<a class="guide-card" href="${contentPath(`guides/${guide.slug}`, lang)}"><span class="section-kicker">0${index + 1}</span><h3>${escape(guide[lang].title)}</h3><p>${escape(guide[lang].description)}</p><span class="guide-read">${lang === 'zh' ? '阅读指南' : 'Read guide'} →</span></a>`).join('')}</div>`;
}

function guideBand(lang = 'zh') {
  return `<section class="section guide-band" data-editorial-language="${lang}" ${lang === 'en' ? 'hidden' : ''} aria-labelledby="guides-heading-${lang}"><div class="section-heading"><div><p class="section-kicker">${lang === 'zh' ? '从发现到行动' : 'From discovery to a decision'}</p><h2 id="guides-heading-${lang}">${lang === 'zh' ? '先判断，再投入' : 'Make an informed start'}</h2></div><a class="card-link" href="${contentPath('guides', lang)}">${lang === 'zh' ? '全部参赛指南' : 'All participation guides'} →</a></div>${guideCards(lang)}<p class="editorial-note">${lang === 'zh' ? '目录负责更新机会，指南帮助你判断资格、准备材料与确认交付。以下是本站编辑建议，具体要求请以官方规则为准。' : 'The directory tracks opportunities; the guides help you evaluate eligibility, prepare material and agree on delivery. These are editorial suggestions, not a substitute for official rules.'}</p></section>`;
}

function metadata(path, title, description, lang, counterpart) {
  return `<meta name="description" content="${escape(description)}"><link rel="canonical" href="${SITE_URL}${path}">
    <link rel="alternate" hreflang="${lang === 'zh' ? 'zh-CN' : 'en'}" href="${SITE_URL}${path}"><link rel="alternate" hreflang="${lang === 'zh' ? 'en' : 'zh-CN'}" href="${SITE_URL}${counterpart}"><link rel="alternate" hreflang="x-default" href="${SITE_URL}${lang === 'zh' ? path : counterpart}">
    <meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description)}"><meta property="og:type" content="article"><meta property="og:url" content="${SITE_URL}${path}"><meta property="og:image" content="${SITE_URL}/assets/social-preview.png">
    <meta name="twitter:card" content="summary_large_image"><meta name="google-adsense-account" content="ca-pub-9565558700858500">`;
}

function bodySections(copy) {
  return `<p class="reading-intro">${escape(copy.intro)}</p>${copy.sections.map(([heading, paragraphs], index) => `<section id="section-${index + 1}"><h2>${escape(heading)}</h2>${paragraphs.map((paragraph) => `<p>${escape(paragraph)}</p>`).join('')}</section>`).join('')}`;
}

function usefulLinks(slug, lang) {
  const zh = lang === 'zh';
  const links = slug === 'privacy' ? [
    ['Vercel · Privacy', 'https://vercel.com/legal/privacy-policy'],
    ['Supabase · Privacy', 'https://supabase.com/privacy'],
    [zh ? '本站隐私反馈' : 'Website privacy questions', contentPath('contact', lang)],
  ] : [
    [zh ? '官网问题与指南纠错' : 'Website & guide corrections', `${REPOSITORY}/issues/new`],
    [zh ? '比赛目录与资料来源' : 'Contest directory & source records', 'https://github.com/MartinDelophy/Awesome-AIGC-Creative-Contests'],
    [zh ? '公开任务与资料来源' : 'Public tasks & source records', 'https://github.com/jackroc/aigc-opportunity-tasks'],
  ];
  return `<section class="reading-links"><h2>${zh ? '相关资料与反馈' : 'References & feedback'}</h2><ul>${links.map(([label, url]) => `<li><a href="${escape(url)}">${escape(label)} →</a></li>`).join('')}</ul></section>`;
}

function editorialPage(slug, copy, lang, body, isArticle = false) {
  const zh = lang === 'zh';
  const path = contentPath(slug, lang);
  const counterpart = contentPath(slug, zh ? 'en' : 'zh');
  const brand = zh ? 'AIGC 机会雷达' : 'AIGC Opportunity Radar';
  const home = zh ? '/' : '/?lang=en';
  const navigation = [['guides', zh ? '参赛指南' : 'Guides'], ['about', zh ? '关于与收录方法' : 'About & methodology'], ['privacy', zh ? '隐私政策' : 'Privacy'], ['contact', zh ? '联系与纠错' : 'Contact & corrections']];
  const schema = { '@context': 'https://schema.org', '@type': isArticle ? 'Article' : 'WebPage', name: copy.title, headline: copy.title, description: copy.description, inLanguage: zh ? 'zh-CN' : 'en', url: `${SITE_URL}${path}`, dateModified: EDITORIAL_DATE, ...(isArticle ? { datePublished: EDITORIAL_DATE, author: { '@type': 'Organization', name: brand, url: `${SITE_URL}${contentPath('about', lang)}` } } : {}) };
  return `<!doctype html><html lang="${zh ? 'zh-CN' : 'en'}" data-theme="light"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escape(copy.title)} | ${brand}</title>${metadata(path, copy.title, copy.description, lang, counterpart)}<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/assets/site.css"><script type="module" src="/assets/editorial.js"></script><script type="application/ld+json">${safeJson(schema)}</script></head><body>
    <a class="skip-link" href="#main-content">${zh ? '跳到主要内容' : 'Skip to content'}</a>
    <header class="site-header"><div class="header-inner editorial-header"><a class="brand" href="${home}"><img src="/assets/favicon.svg" alt="" width="36" height="36"><span class="brand-copy"><strong>${brand}</strong></span></a><nav class="primary-nav" aria-label="${zh ? '主要导航' : 'Main navigation'}"><a class="nav-link" href="${home}#directory">${zh ? '比赛机会' : 'Contests'}</a><a class="nav-link" href="/tasks/${zh ? '' : '?lang=en'}">${zh ? '任务平台' : 'Tasks'}</a><a class="nav-link" href="${contentPath('guides', lang)}">${zh ? '参赛指南' : 'Guides'}</a></nav><a class="language-button" href="${counterpart}" hreflang="${zh ? 'en' : 'zh-CN'}">${zh ? 'English' : '中文'}</a></div></header>
    <main id="main-content" class="${slug === 'guides' ? 'section guide-index' : 'reading'}"><p class="section-kicker">${zh ? '雷达 · 参赛与交付' : 'RADAR · PARTICIPATION & DELIVERY'}</p><h1>${escape(copy.title)}</h1><p class="reading-meta">${brand} · ${zh ? '更新' : 'Updated'} <time datetime="${EDITORIAL_DATE}">${EDITORIAL_DATE}</time></p>${body}</main>
    <footer class="site-footer"><div class="footer-inner"><div><a class="brand" href="${home}">${brand}</a><p class="footer-note">${zh ? '独立的信息索引。参赛、验收与奖励以官方条件为准。' : 'An independent directory. Official terms govern entry, acceptance and rewards.'}</p></div><nav class="footer-links" aria-label="${zh ? '网站信息' : 'Site information'}">${navigation.map(([target, label]) => `<a href="${contentPath(target, lang)}">${label}</a>`).join('')}</nav></div></footer></body></html>`;
}

function replaceGrid(html, id, cards) {
  const re = new RegExp(`(<div[^>]+id="${id}"[^>]*>)[\\s\\S]*?(\\n        </div>)`);
  if (!re.test(html)) throw new Error(`Missing ${id} template boundary`);
  return html.replace(re, (_, opening, closing) => opening.replace('aria-busy="true"', 'aria-busy="false"') + cards + closing);
}

function setText(html, id, value) {
  return html.replace(new RegExp(`(<[^>]+id="${id}"[^>]*>)[\\s\\S]*?(</[^>]+>)`), (_, open, close) => open.replace(' data-i18n="loading"', '') + escape(value) + close);
}

export async function buildSite({ output = join(root, 'public'), now = new Date() } = {}) {
  await rm(output, { recursive: true, force: true });
  await mkdir(output, { recursive: true });
  for (const file of ['assets', 'data', 'feed.xml', 'deadlines.ics', 'ads.txt']) await cp(join(root, file), join(output, file), { recursive: true });
  await mkdir(join(output, 'tasks'), { recursive: true });
  for (const file of ['feed.xml', 'deadlines.ics']) await cp(join(root, 'tasks', file), join(output, 'tasks', file));
  const publish = async (path, html) => { const file = join(output, path, 'index.html'); await mkdir(dirname(file), { recursive: true }); await writeFile(file, html); };

  const contests = await loadContestRecords();
  const contestView = renderContestSnapshot(contests, { today: now });
  let home = replaceGrid(await read('index.html'), 'contest-grid', contestView.cards || '<p>当前没有有效比赛，请阅读参赛指南或稍后回来查看。</p>');
  for (const [id, value] of Object.entries({ 'hero-total': contestView.count, 'hero-urgent': contestView.urgent, 'hero-categories': contestView.categories, 'hero-verified': contestView.latest, 'results-count': contestView.result })) home = setText(home, id, value);
  home = home.replace('</head>', `<link rel="canonical" href="${SITE_URL}/"><script type="application/json" id="initial-contests">${safeJson(contests)}</script><noscript><style>.filter-panel,.header-actions{display:none}</style></noscript></head>`);
  home = home.replace('<section class="subscription-strip"', `${guideBand()}${guideBand('en')}<section class="subscription-strip"`);
  await publish('', home);

  const directory = { tasks: await json('data/tasks.json'), platforms: await json('data/task-platforms.json'), sources: await json('data/task-sources.json') };
  const taskView = renderTaskSnapshot(directory, { now });
  let tasks = replaceGrid(await read('tasks/index.html'), 'task-grid', taskView.cards || '<p>当前没有可用任务。可浏览下方官方平台入口。</p>');
  tasks = replaceGrid(tasks, 'platform-grid', taskView.platforms);
  for (const [id, value] of Object.entries({ 'task-total': taskView.count, 'task-priced': taskView.priced, 'task-sources': taskView.sources, 'task-latest': taskView.latest, 'task-results-count': taskView.result })) tasks = setText(tasks, id, value);
  tasks = tasks.replace('</head>', `<link rel="canonical" href="${SITE_URL}/tasks/"><script type="application/json" id="initial-tasks">${safeJson(directory)}</script><noscript><style>.filter-panel,.header-actions,.task-plan-button,.matching-workspace,[href="#opportunity-matcher"]{display:none}</style></noscript></head>`);
  tasks = tasks.replace('</main>', `${guideBand()}${guideBand('en')}</main>`);
  await publish('tasks', tasks);

  const pages = [];
  for (const lang of ['zh', 'en']) {
    const zh = lang === 'zh';
    const indexCopy = { title: zh ? '参赛与任务指南' : 'Participation & task guides', description: zh ? '从选择机会到准备提交，用具体步骤安排创作投入。' : 'Practical steps for choosing opportunities and preparing a complete delivery.' };
    await publish(contentPath('guides', lang), editorialPage('guides', indexCopy, lang, `<p class="reading-intro">${indexCopy.description}</p>${guideCards(lang)}<p class="editorial-note">${zh ? '指南独立维护；目录继续跟随上游自动同步，无需每天手动更新官网。' : 'Guides are maintained independently; the directory continues to follow upstream updates automatically.'}</p>`));
    pages.push(contentPath('guides', lang));
    for (const guide of GUIDES) {
      const slug = `guides/${guide.slug}`;
      const copy = guide[lang];
      const toc = `<nav class="reading-toc" aria-label="${zh ? '本文目录' : 'In this guide'}"><ol>${copy.sections.map(([heading], i) => `<li><a href="#section-${i + 1}">${escape(heading)}</a></li>`).join('')}</ol></nav>`;
      await publish(contentPath(slug, lang), editorialPage(slug, copy, lang, `${toc}${bodySections(copy)}<aside class="editorial-note">${zh ? '本文为本站编辑建议，未承诺具体赛事接受某类作品或任务必然支付。资料字段与来源处理方式见' : 'This editorial guide does not promise that a particular contest accepts an entry or a task will pay. See our'} <a href="${contentPath('about', lang)}">${zh ? '收录方法' : 'methodology'}</a>${zh ? '。' : '.'}</aside>${usefulLinks(slug, lang)}`, true));
      pages.push(contentPath(slug, lang));
    }
    for (const [slug, copies] of Object.entries(INFORMATION)) {
      await publish(contentPath(slug, lang), editorialPage(slug, copies[lang], lang, bodySections(copies[lang]) + usefulLinks(slug, lang)));
      pages.push(contentPath(slug, lang));
    }
  }
  await writeFile(join(output, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${SITE_URL}/sitemap.xml\n`);
  await writeFile(join(output, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['/', '/tasks/', ...pages].map((path) => `<url><loc>${SITE_URL}${path}</loc>${pages.includes(path) ? `<lastmod>${EDITORIAL_DATE}</lastmod>` : ''}</url>`).join('')}</urlset>`);
  return { contests: contestView.count, tasks: taskView.count, editorialPages: pages.length, output };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) console.log(await buildSite());
