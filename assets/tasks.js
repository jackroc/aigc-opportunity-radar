const translations = {
  zh: {
    pageTitle: "任务平台｜AIGC 机会雷达",
    skipLink: "跳到主要内容",
    homeLabel: "AIGC 机会雷达首页",
    brandName: "AIGC 机会雷达",
    brandTagline: "Creative Opportunity Radar",
    primaryNavLabel: "主要导航",
    navContests: "比赛机会",
    navTasks: "任务平台",
    exploring: "探索中",
    taskKicker: "Product exploration",
    taskTitle: "不只找到任务，<em>还要更有把握地完成。</em>",
    taskIntro: "任务平台正在产品探索中。目标是把分散的赏金任务、创作征集和 AI 训练工作汇总起来，并提供清晰、合规、可复用的完成路径。",
    viewContests: "查看比赛机会",
    suggestPlatform: "推荐平台或任务",
    taskRoadmapLabel: "任务平台探索方向",
    discoverTitle: "发现合适任务",
    discoverText: "聚合公开、可核验的任务来源，并按能力、地区、语言、报酬、耗时和截止时间筛选。",
    pathTitle: "看清成功路径",
    pathText: "拆解资格、规则、交付规格和验收标准，形成可执行清单，降低理解偏差和无效投入。",
    toolTitle: "工具辅助与质检",
    toolText: "只在规则允许的范围内提供 Skills、Agents、模板和提交前检查，帮助创作者提高效率与交付质量。",
    footerTagline: "开放、可核验、持续更新",
    footerNote: "任务信息、平台规则与 AI 使用边界可能变化，参与前请重新核对官方要求。",
    footerNavLabel: "页脚导航",
    contribute: "参与共建",
    openSourceNote: "数据与代码开放维护",
    switchDark: "切换深色模式",
    switchLight: "切换浅色模式",
    switchEnglish: "Switch to English",
  },
  en: {
    pageTitle: "Task platforms | AIGC Opportunity Radar",
    skipLink: "Skip to main content",
    homeLabel: "AIGC Opportunity Radar home",
    brandName: "AIGC Opportunity Radar",
    brandTagline: "Creative Opportunity Radar",
    primaryNavLabel: "Primary navigation",
    navContests: "Contests",
    navTasks: "Task platforms",
    exploring: "Exploring",
    taskKicker: "Product exploration",
    taskTitle: "Do more than find the work. <em>Improve your odds of finishing it well.</em>",
    taskIntro: "This product direction is still being explored. The goal is to bring together verifiable bounties, creative calls, and AI-training work, then provide clear, compliant, reusable paths to completion.",
    viewContests: "View contest opportunities",
    suggestPlatform: "Suggest a platform or task",
    taskRoadmapLabel: "Task platform exploration areas",
    discoverTitle: "Discover relevant work",
    discoverText: "Aggregate public, verifiable sources and filter them by skill, region, language, payout, effort, and deadline.",
    pathTitle: "Understand the success path",
    pathText: "Turn eligibility, rules, deliverable specifications, and acceptance criteria into an actionable checklist.",
    toolTitle: "Tools and quality checks",
    toolText: "Offer skills, agents, templates, and pre-submission checks only where the rules allow them, improving efficiency and delivery quality.",
    footerTagline: "Open, verifiable, continuously updated",
    footerNote: "Task details, platform rules, and AI-use boundaries can change. Re-check the official requirements before participating.",
    footerNavLabel: "Footer navigation",
    contribute: "Contribute",
    openSourceNote: "Open data and open-source code",
    switchDark: "Switch to dark mode",
    switchLight: "Switch to light mode",
    switchEnglish: "切换为中文",
  },
};

const state = { lang: "zh" };

function t(key) {
  return translations[state.lang][key] ?? translations.zh[key] ?? key;
}

function updateThemeButton() {
  const button = document.querySelector("#theme-toggle");
  const isDark = document.documentElement.dataset.theme === "dark";
  button.setAttribute("aria-label", isDark ? t("switchLight") : t("switchDark"));
}

function applyTranslations() {
  document.documentElement.lang = state.lang === "en" ? "en" : "zh-CN";
  document.title = t("pageTitle");

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-html]").forEach((element) => {
    element.innerHTML = t(element.dataset.i18nHtml);
  });
  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
    element.setAttribute("aria-label", t(element.dataset.i18nAriaLabel));
  });

  const languageButton = document.querySelector("#language-toggle");
  languageButton.textContent = state.lang === "zh" ? "EN" : "中";
  languageButton.setAttribute("aria-label", t("switchEnglish"));
  updateThemeButton();
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]').content = theme === "dark" ? "#121016" : "#6d28d9";
  window.localStorage.setItem("opportunity-theme", theme);
  updateThemeButton();
}

function updateUrl() {
  const params = new URLSearchParams(window.location.search);
  if (state.lang === "en") params.set("lang", "en");
  else params.delete("lang");
  const query = params.toString();
  window.history.replaceState(null, "", `${window.location.pathname}${query ? `?${query}` : ""}`);
}

function init() {
  const params = new URLSearchParams(window.location.search);
  const savedLanguage = window.localStorage.getItem("opportunity-language");
  state.lang = params.get("lang") === "en" || (!params.has("lang") && savedLanguage === "en") ? "en" : "zh";

  const storedTheme = window.localStorage.getItem("opportunity-theme");
  const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  applyTheme(storedTheme === "dark" || storedTheme === "light" ? storedTheme : preferredTheme);
  applyTranslations();

  document.querySelector("#theme-toggle").addEventListener("click", () => {
    applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
  });

  document.querySelector("#language-toggle").addEventListener("click", () => {
    state.lang = state.lang === "zh" ? "en" : "zh";
    window.localStorage.setItem("opportunity-language", state.lang);
    applyTranslations();
    updateUrl();
  });

  document.querySelector("#current-year").textContent = String(new Date().getFullYear());
}

if (typeof document !== "undefined") {
  init();
}
