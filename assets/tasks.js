const DIRECTORY_SOURCES = Object.freeze({
  tasks: "/data/tasks.json",
  platforms: "/data/task-platforms.json",
  sources: "/data/task-sources.json",
});

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
    beta: "首批上线",
    heroEyebrow: "公开来源 · 每 15 分钟自动检查",
    heroTitle: "找到值得做的任务，<em>先看清回报和规则。</em>",
    heroLede: "聚合公开、可核验的赏金任务，同时展示报酬是否明确、可见竞争度、来源可信信号和 AI 使用边界。",
    browseTasks: "浏览实时任务",
    subscribeRss: "订阅 RSS",
    trustListLabel: "任务目录原则",
    trustPublic: "只读取公开来源",
    trustExpiry: "自动移除关闭或失活任务",
    trustOptionalAi: "AI 辅助始终可选且服从规则",
    statsLabel: "任务数据概览",
    radarNow: "任务雷达",
    activeTasks: "项公开任务",
    autoSync: "自动同步",
    pricedTasks: "明确标价",
    liveSources: "实时来源",
    latestActivity: "最近活动",
    statsNote: "任务开放不等于赏金已担保；开始前请在官方页面确认名额、验收与付款状态。",
    directoryKicker: "Live task directory",
    directoryTitle: "先判断值不值得做",
    directoryIntro: "第一阶段先接入精选 GitHub 公开赏金。排序和信号用于辅助判断，不代表平台承诺或成功概率。",
    phaseNoteTitle: "为什么首批任务不多？",
    phaseNoteText: "我们主动排除已领奖、仅限特定参与者和疑似刷量条目；账号内任务会等到官方 API、Feed 或合作接入后再上线。",
    filterPanelLabel: "筛选任务",
    searchLabel: "搜索任务",
    searchPlaceholder: "搜索名称、技能或项目",
    clearSearch: "清空搜索",
    categoryFilterLabel: "任务类型",
    categoryAll: "全部",
    categoryDevelopment: "开发",
    categoryAi: "AI / 自动化",
    categoryWriting: "内容写作",
    categoryVideo: "视频",
    categoryDesign: "设计",
    categoryImage: "图像",
    categoryAudio: "音频",
    categoryTranslation: "翻译",
    categoryData: "数据",
    categoryResearch: "调研",
    categoryTesting: "测试",
    categoryEvaluation: "AI 评测",
    categoryOther: "其他",
    rewardFilterLabel: "报酬信息",
    rewardAll: "全部",
    rewardPriced: "已标价",
    rewardUnpriced: "金额待确认",
    aiFilterLabel: "AI 使用边界",
    aiAll: "全部",
    aiAllowed: "明确允许",
    aiLimited: "有限允许",
    aiHumanOnly: "需本人完成",
    aiUnknown: "需核对规则",
    competitionFilterLabel: "可见竞争度",
    competitionAll: "全部",
    competitionLow: "较低",
    competitionMedium: "中等",
    competitionHigh: "较高",
    sortLabel: "排序方式",
    sortUpdated: "最近活动",
    sortReward: "报酬从高到低",
    sortCompetition: "竞争度从低到高",
    loading: "正在读取最新任务…",
    resetFilters: "清除筛选",
    emptyTitle: "暂时没有匹配的任务",
    emptyText: "试试减少筛选条件，或先查看已收录的平台入口。",
    errorTitle: "最新任务暂时无法载入",
    errorText: "自动同步不会用空结果覆盖上一次有效快照。",
    viewDataRepo: "查看数据仓库",
    platformKicker: "Source coverage",
    platformTitle: "没有公开接口的平台，也先给你可靠入口",
    platformIntro: "登录后才能看到的任务不会被冒险抓取。这里保留官方入口与接入状态，后续优先通过 API、Feed 或合作方式补齐。",
    assistantKicker: "Phase two",
    assistantTitle: "私人任务助理会加入，但不会成为门槛",
    assistantText: "后续对话能力将基于真实任务数据，按你的能力和时间做匹配、拆解要求与提交前检查。你也可以完全不使用它，只订阅任务资讯。",
    assistantStatus: "规划中 · 可选使用",
    subscribeKicker: "Stay in the loop",
    subscribeTitle: "让任务主动找到你",
    subscribeText: "RSS 会推送目录变化；有明确截止时间的任务会同时进入日历订阅。",
    subscribeCalendar: "添加到日历",
    footerTagline: "开放、可核验、持续更新",
    footerNote: "任务状态、赏金和平台规则可能随时变化。投入时间前，请在官方页面重新确认。",
    footerNavLabel: "页脚导航",
    suggestTask: "推荐任务",
    openSourceNote: "数据与代码开放维护",
    switchDark: "切换深色模式",
    switchLight: "切换浅色模式",
    switchEnglish: "Switch to English",
    taskOpen: "开放任务",
    updated: "活动",
    project: "项目",
    reward: "报酬",
    rewardUnknown: "金额未注明",
    rewardNeedsCheck: "需向维护者确认",
    visibleCompetition: "可见竞争",
    aiBoundary: "AI 使用边界",
    publicSource: "精选公开来源",
    payoutNotGuaranteed: "赏金未担保，开始前先确认",
    viewTask: "查看任务与规则",
    platformLive: "实时接入",
    platformDirectoryOnly: "仅官方入口",
    accessPublic: "公开可读",
    accessAccount: "需登录查看",
    platformAi: "AI 边界",
    skillsLabel: "所需技能",
    checkOfficialRules: "以具体任务规则为准",
    visitPlatform: "访问官方平台",
    noPlatforms: "平台目录暂时无法载入。",
    resultSummary: (shown, total) => `显示 ${shown} / ${total} 项有效任务`,
    commentCount: (count) => `${count} 条公开讨论`,
    taskLinkLabel: (title) => `打开 ${title} 的官方任务页面`,
    platformLinkLabel: (name) => `打开 ${name} 官方平台`,
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
    beta: "Beta",
    heroEyebrow: "Public sources · checked every 15 minutes",
    heroTitle: "Find work worth doing. <em>See the reward and rules first.</em>",
    heroLede: "Browse public, auditable bounties with reward clarity, visible competition, trust signals, and AI-use boundaries.",
    browseTasks: "Browse live tasks",
    subscribeRss: "Subscribe via RSS",
    trustListLabel: "Task directory principles",
    trustPublic: "Public sources only",
    trustExpiry: "Closed or inactive tasks expire automatically",
    trustOptionalAi: "AI help stays optional and rule-aware",
    statsLabel: "Task data overview",
    radarNow: "Task radar",
    activeTasks: "public tasks",
    autoSync: "Auto-sync",
    pricedTasks: "Priced",
    liveSources: "Live sources",
    latestActivity: "Latest activity",
    statsNote: "An open issue does not guarantee a funded reward. Confirm availability, acceptance, and payout before starting.",
    directoryKicker: "Live task directory",
    directoryTitle: "Decide whether the work is worth it",
    directoryIntro: "Phase one starts with curated public GitHub bounties. Signals support judgment; they are not platform promises or success probabilities.",
    phaseNoteTitle: "Why is the first directory intentionally small?",
    phaseNoteText: "We exclude rewarded, contributor-locked, and suspicious high-volume leads. Account-only tasks wait for an official API, feed, or partnership.",
    filterPanelLabel: "Filter tasks",
    searchLabel: "Search tasks",
    searchPlaceholder: "Search title, skill, or repository",
    clearSearch: "Clear search",
    categoryFilterLabel: "Task type",
    categoryAll: "All",
    categoryDevelopment: "Development",
    categoryAi: "AI / automation",
    categoryWriting: "Writing",
    categoryVideo: "Video",
    categoryDesign: "Design",
    categoryImage: "Image",
    categoryAudio: "Audio",
    categoryTranslation: "Translation",
    categoryData: "Data",
    categoryResearch: "Research",
    categoryTesting: "Testing",
    categoryEvaluation: "AI evaluation",
    categoryOther: "Other",
    rewardFilterLabel: "Reward details",
    rewardAll: "All",
    rewardPriced: "Price shown",
    rewardUnpriced: "Amount to confirm",
    aiFilterLabel: "AI-use boundary",
    aiAll: "All",
    aiAllowed: "Explicitly allowed",
    aiLimited: "Limited use",
    aiHumanOnly: "Human-only",
    aiUnknown: "Check the rules",
    competitionFilterLabel: "Visible competition",
    competitionAll: "All",
    competitionLow: "Lower",
    competitionMedium: "Medium",
    competitionHigh: "Higher",
    sortLabel: "Sort by",
    sortUpdated: "Recent activity",
    sortReward: "Highest reward",
    sortCompetition: "Lowest competition",
    loading: "Loading the latest tasks…",
    resetFilters: "Clear filters",
    emptyTitle: "No tasks match yet",
    emptyText: "Try fewer filters or browse the verified platform entries below.",
    errorTitle: "The latest tasks could not be loaded",
    errorText: "The sync pipeline never replaces the last valid snapshot with an empty result.",
    viewDataRepo: "View data repository",
    platformKicker: "Source coverage",
    platformTitle: "Reliable official entries, even without a public API",
    platformIntro: "We do not scrape account-only work. These official entries show integration status while we prioritize APIs, feeds, and partnerships.",
    assistantKicker: "Phase two",
    assistantTitle: "A private task assistant will arrive, but it will never be required",
    assistantText: "Future conversations will use real task data to match work to your skills and time, clarify requirements, and check submissions. You can also skip it entirely and only subscribe to listings.",
    assistantStatus: "Planned · always optional",
    subscribeKicker: "Stay in the loop",
    subscribeTitle: "Let the right tasks find you",
    subscribeText: "RSS carries directory updates; tasks with explicit deadlines also appear in the calendar feed.",
    subscribeCalendar: "Add to calendar",
    footerTagline: "Open, verifiable, continuously updated",
    footerNote: "Task status, rewards, and platform rules can change at any time. Re-check the official page before investing effort.",
    footerNavLabel: "Footer navigation",
    suggestTask: "Suggest a task",
    openSourceNote: "Open data and open-source code",
    switchDark: "Switch to dark mode",
    switchLight: "Switch to light mode",
    switchEnglish: "切换为中文",
    taskOpen: "Open task",
    updated: "Active",
    project: "Repository",
    reward: "Reward",
    rewardUnknown: "Amount not stated",
    rewardNeedsCheck: "Confirm with maintainer",
    visibleCompetition: "Visible competition",
    aiBoundary: "AI-use boundary",
    publicSource: "Curated public source",
    payoutNotGuaranteed: "Reward not guaranteed — confirm first",
    viewTask: "View task and rules",
    platformLive: "Live integration",
    platformDirectoryOnly: "Official entry only",
    accessPublic: "Publicly readable",
    accessAccount: "Account required",
    platformAi: "AI boundary",
    skillsLabel: "Relevant skills",
    checkOfficialRules: "Follow the task-specific rules",
    visitPlatform: "Visit official platform",
    noPlatforms: "The platform directory could not be loaded.",
    resultSummary: (shown, total) => `Showing ${shown} of ${total} active tasks`,
    commentCount: (count) => `${count} public discussions`,
    taskLinkLabel: (title) => `Open the official task page for ${title}`,
    platformLinkLabel: (name) => `Open the official ${name} platform`,
  },
};

const validCategories = new Set(["all", "development", "ai-automation", "writing", "video"]);
const validRewards = new Set(["all", "priced", "unpriced"]);
const validAiPolicies = new Set(["all", "allowed", "limited", "human-only", "unknown"]);
const validCompetition = new Set(["all", "low", "medium", "high"]);
const validSorts = new Set(["updated", "reward", "competition"]);

const state = {
  tasks: [],
  platforms: [],
  sources: [],
  query: "",
  category: "all",
  reward: "all",
  ai: "all",
  competition: "all",
  sort: "updated",
  lang: "zh",
  now: new Date(),
};

let searchTimer;

function t(key, ...args) {
  const value = translations[state.lang][key] ?? translations.zh[key] ?? key;
  return typeof value === "function" ? value(...args) : value;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function safeUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.href : "#";
  } catch {
    return "#";
  }
}

function normalizeSearch(value) {
  return String(value ?? "").normalize("NFKC").trim().toLocaleLowerCase();
}

function formatDate(value, options = {}) {
  const locale = state.lang === "en" ? "en-US" : "zh-CN";
  return new Intl.DateTimeFormat(locale, {
    year: options.withYear === false ? undefined : "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

function formatReward(task) {
  const reward = task.reward || {};
  if (!Number.isFinite(reward.amount_min) || !reward.currency) return t("rewardUnknown");
  try {
    return new Intl.NumberFormat(state.lang === "en" ? "en-US" : "zh-CN", {
      style: "currency",
      currency: reward.currency,
      maximumFractionDigits: Number.isInteger(reward.amount_min) ? 0 : 2,
    }).format(reward.amount_min);
  } catch {
    return reward.display || t("rewardUnknown");
  }
}

function categoryLabel(category) {
  const keys = {
    development: "categoryDevelopment",
    "ai-automation": "categoryAi",
    writing: "categoryWriting",
    video: "categoryVideo",
    design: "categoryDesign",
    image: "categoryImage",
    audio: "categoryAudio",
    translation: "categoryTranslation",
    data: "categoryData",
    research: "categoryResearch",
    testing: "categoryTesting",
    "ai-evaluation": "categoryEvaluation",
    other: "categoryOther",
  };
  return t(keys[category] || "categoryOther");
}

function aiPolicyLabel(policy) {
  const keys = { allowed: "aiAllowed", limited: "aiLimited", "human-only": "aiHumanOnly", unknown: "aiUnknown" };
  return t(keys[policy] || "aiUnknown");
}

function competitionLabel(level) {
  const keys = { low: "competitionLow", medium: "competitionMedium", high: "competitionHigh" };
  return t(keys[level] || "competitionAll");
}

function isActive(task) {
  return task.status === "open" && Date.parse(task.expires_at) >= state.now.valueOf();
}

function matchesSearch(task, query) {
  if (!query) return true;
  return normalizeSearch(
    [task.title, task.summary, task.source_repo, ...(task.categories || []), ...(task.skills || [])].join(" "),
  ).includes(query);
}

function rewardAmount(task) {
  return Number.isFinite(task.reward?.amount_min) ? task.reward.amount_min : -1;
}

function filterAndSortTasks() {
  const query = normalizeSearch(state.query);
  const tasks = state.tasks.filter((task) => {
    if (!isActive(task) || !matchesSearch(task, query)) return false;
    if (state.category !== "all" && !task.categories.includes(state.category)) return false;
    const priced = Number.isFinite(task.reward?.amount_min);
    if (state.reward === "priced" && !priced) return false;
    if (state.reward === "unpriced" && priced) return false;
    if (state.ai !== "all" && task.ai_policy !== state.ai) return false;
    if (state.competition !== "all" && task.competition?.level !== state.competition) return false;
    return true;
  });

  return tasks.sort((left, right) => {
    if (state.sort === "reward") {
      return rewardAmount(right) - rewardAmount(left) || right.source_updated_at.localeCompare(left.source_updated_at);
    }
    if (state.sort === "competition") {
      return (left.competition?.comment_count ?? 9999) - (right.competition?.comment_count ?? 9999) ||
        right.source_updated_at.localeCompare(left.source_updated_at);
    }
    return right.source_updated_at.localeCompare(left.source_updated_at) || left.id.localeCompare(right.id);
  });
}

function externalIcon() {
  return '<svg viewBox="0 0 18 18" aria-hidden="true"><path d="M10 3h5v5M15 3l-7 7M8 5H4v9h9v-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
}

function renderTaskCard(task) {
  const title = escapeHtml(task.title);
  const url = escapeHtml(safeUrl(task.application_url));
  const categories = (task.categories || [])
    .map((category) => `<span class="task-category-badge">${escapeHtml(categoryLabel(category))}</span>`)
    .join("");
  const skills = (task.skills || [])
    .slice(0, 4)
    .map((skill) => `<span class="task-skill-badge">${escapeHtml(skill)}</span>`)
    .join("");
  const competition = task.competition || { comment_count: 0, level: "unknown" };
  const reward = formatReward(task);

  return `
    <article class="task-card" data-competition="${escapeHtml(competition.level)}">
      <div class="task-card-accent" aria-hidden="true"></div>
      <div class="task-card-body">
        <div class="task-card-topline">
          <span class="task-status-badge">${escapeHtml(t("taskOpen"))}</span>
          <span class="task-updated">${escapeHtml(t("updated"))} ${escapeHtml(formatDate(task.source_updated_at))}</span>
        </div>
        <h3>${title}</h3>
        <p class="task-project">${escapeHtml(t("project"))} · ${escapeHtml(task.source_repo)} #${escapeHtml(task.source_number)}</p>
        <div class="task-card-tags">
          ${categories}
          <span class="task-policy-badge" data-policy="${escapeHtml(task.ai_policy)}">${escapeHtml(aiPolicyLabel(task.ai_policy))}</span>
        </div>
        <p class="task-summary">${escapeHtml(task.summary)}</p>
        ${skills ? `<div class="task-skill-list" aria-label="${escapeHtml(t("skillsLabel"))}">${skills}</div>` : ""}
        <div class="task-facts">
          <div>
            <span>${escapeHtml(t("reward"))}</span>
            <strong>${escapeHtml(reward)}</strong>
            <small>${escapeHtml(t("rewardNeedsCheck"))}</small>
          </div>
          <div>
            <span>${escapeHtml(t("visibleCompetition"))}</span>
            <strong>${escapeHtml(competitionLabel(competition.level))}</strong>
            <small>${escapeHtml(t("commentCount", competition.comment_count))}</small>
          </div>
          <div>
            <span>${escapeHtml(t("aiBoundary"))}</span>
            <strong>${escapeHtml(aiPolicyLabel(task.ai_policy))}</strong>
            <small>${escapeHtml(task.ai_policy_basis === "explicit-task-label" ? t("aiAllowed") : t("checkOfficialRules"))}</small>
          </div>
        </div>
        <div class="task-trust-row">
          <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 2.8 16 5v4.5c0 3.8-2.4 6.4-6 7.7-3.6-1.3-6-3.9-6-7.7V5l6-2.2Z" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="m7 10 2 2 4-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <span><strong>${escapeHtml(t("publicSource"))}</strong> · ${escapeHtml(t("payoutNotGuaranteed"))}</span>
        </div>
        <a class="task-card-link" href="${url}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(t("taskLinkLabel", task.title))}">
          <span>${escapeHtml(t("viewTask"))}</span>${externalIcon()}
        </a>
      </div>
    </article>`;
}

function renderPlatformCard(platform) {
  const name = state.lang === "en" ? platform.name_en || platform.name : platform.name;
  const note = state.lang === "en" ? platform.notes_en || platform.notes : platform.notes;
  const live = platform.integration === "live";
  const categories = (platform.categories || [])
    .slice(0, 4)
    .map((category) => `<span>${escapeHtml(categoryLabel(category))}</span>`)
    .join("");
  const policy = platform.ai_policy === "per-task" ? t("aiUnknown") : aiPolicyLabel(platform.ai_policy);

  return `
    <article class="platform-card">
      <div class="platform-card-topline">
        <span class="platform-integration-badge" data-live="${String(live)}">
          <span aria-hidden="true"></span>${escapeHtml(live ? t("platformLive") : t("platformDirectoryOnly"))}
        </span>
        <span class="platform-access">${escapeHtml(platform.access === "public" ? t("accessPublic") : t("accessAccount"))}</span>
      </div>
      <h3>${escapeHtml(name)}</h3>
      <div class="platform-category-list">${categories}</div>
      <p>${escapeHtml(note)}</p>
      <div class="platform-policy"><span>${escapeHtml(t("platformAi"))}</span><strong>${escapeHtml(policy)}</strong></div>
      <a class="text-link" href="${escapeHtml(safeUrl(platform.url))}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(t("platformLinkLabel", name))}">
        <span>${escapeHtml(t("visitPlatform"))}</span>${externalIcon()}
      </a>
    </article>`;
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
  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.placeholder = t(element.dataset.i18nPlaceholder);
  });
  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
    element.setAttribute("aria-label", t(element.dataset.i18nAriaLabel));
  });
  const languageButton = document.querySelector("#language-toggle");
  languageButton.textContent = state.lang === "zh" ? "EN" : "中";
  languageButton.setAttribute("aria-label", t("switchEnglish"));
  updateThemeButton();
}

function updateThemeButton() {
  const button = document.querySelector("#theme-toggle");
  const isDark = document.documentElement.dataset.theme === "dark";
  button.setAttribute("aria-label", isDark ? t("switchLight") : t("switchDark"));
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]').content = theme === "dark" ? "#121016" : "#6d28d9";
  window.localStorage.setItem("opportunity-theme", theme);
  updateThemeButton();
}

function updateStatistics() {
  const active = state.tasks.filter(isActive);
  const priced = active.filter((task) => Number.isFinite(task.reward?.amount_min));
  const latest = active.reduce(
    (value, task) => (task.source_updated_at > value ? task.source_updated_at : value),
    "",
  );
  document.querySelector("#task-total").textContent = String(active.length);
  document.querySelector("#task-priced").textContent = String(priced.length);
  document.querySelector("#task-sources").textContent = String(state.sources.length);
  document.querySelector("#task-latest").textContent = latest ? formatDate(latest, { withYear: false }) : "—";
}

function hasActiveFilters() {
  return Boolean(
    state.query ||
      state.category !== "all" ||
      state.reward !== "all" ||
      state.ai !== "all" ||
      state.competition !== "all" ||
      state.sort !== "updated",
  );
}

function syncControls() {
  document.querySelector("#task-search").value = state.query;
  document.querySelector("#task-search-clear").hidden = !state.query;
  document.querySelector("#task-reward-filter").value = state.reward;
  document.querySelector("#task-ai-filter").value = state.ai;
  document.querySelector("#task-competition-filter").value = state.competition;
  document.querySelector("#task-sort-select").value = state.sort;
  document.querySelector("#task-reset-filters").hidden = !hasActiveFilters();
  document.querySelectorAll("[data-category]").forEach((button) => {
    const active = button.dataset.category === state.category;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function updateUrl() {
  const params = new URLSearchParams();
  if (state.query) params.set("q", state.query);
  if (state.category !== "all") params.set("category", state.category);
  if (state.reward !== "all") params.set("reward", state.reward);
  if (state.ai !== "all") params.set("ai", state.ai);
  if (state.competition !== "all") params.set("competition", state.competition);
  if (state.sort !== "updated") params.set("sort", state.sort);
  if (state.lang === "en") params.set("lang", "en");
  const query = params.toString();
  window.history.replaceState(null, "", `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`);
}

function renderPlatforms() {
  const grid = document.querySelector("#platform-grid");
  const platforms = [...state.platforms].sort((left, right) => {
    if (left.integration === right.integration) return left.name.localeCompare(right.name);
    return left.integration === "live" ? -1 : 1;
  });
  grid.setAttribute("aria-busy", "false");
  grid.innerHTML = platforms.length ? platforms.map(renderPlatformCard).join("") : `<p>${escapeHtml(t("noPlatforms"))}</p>`;
}

function render() {
  const activeTotal = state.tasks.filter(isActive).length;
  const tasks = filterAndSortTasks();
  const grid = document.querySelector("#task-grid");
  const empty = document.querySelector("#task-empty-state");
  const error = document.querySelector("#task-error-state");
  error.hidden = true;
  grid.setAttribute("aria-busy", "false");
  grid.innerHTML = tasks.map(renderTaskCard).join("");
  grid.hidden = tasks.length === 0;
  empty.hidden = tasks.length !== 0;
  document.querySelector("#task-results-count").textContent = t("resultSummary", tasks.length, activeTotal);
  renderPlatforms();
  syncControls();
  updateStatistics();
  updateUrl();
}

function resetFilters() {
  state.query = "";
  state.category = "all";
  state.reward = "all";
  state.ai = "all";
  state.competition = "all";
  state.sort = "updated";
  render();
  document.querySelector("#task-search").focus();
}

function readInitialState() {
  const params = new URLSearchParams(window.location.search);
  const savedLanguage = window.localStorage.getItem("opportunity-language");
  state.query = params.get("q")?.slice(0, 120) || "";
  state.category = validCategories.has(params.get("category")) ? params.get("category") : "all";
  state.reward = validRewards.has(params.get("reward")) ? params.get("reward") : "all";
  state.ai = validAiPolicies.has(params.get("ai")) ? params.get("ai") : "all";
  state.competition = validCompetition.has(params.get("competition")) ? params.get("competition") : "all";
  state.sort = validSorts.has(params.get("sort")) ? params.get("sort") : "updated";
  state.lang = params.get("lang") === "en" || (!params.has("lang") && savedLanguage === "en") ? "en" : "zh";
}

function bindEvents() {
  document.querySelector("#task-search").addEventListener("input", (event) => {
    state.query = event.target.value.slice(0, 120);
    document.querySelector("#task-search-clear").hidden = !state.query;
    window.clearTimeout(searchTimer);
    searchTimer = window.setTimeout(render, 140);
  });
  document.querySelector("#task-search-clear").addEventListener("click", () => {
    state.query = "";
    render();
    document.querySelector("#task-search").focus();
  });
  document.querySelector("#task-category-chips").addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    state.category = button.dataset.category;
    render();
  });
  document.querySelector("#task-reward-filter").addEventListener("change", (event) => {
    state.reward = event.target.value;
    render();
  });
  document.querySelector("#task-ai-filter").addEventListener("change", (event) => {
    state.ai = event.target.value;
    render();
  });
  document.querySelector("#task-competition-filter").addEventListener("change", (event) => {
    state.competition = event.target.value;
    render();
  });
  document.querySelector("#task-sort-select").addEventListener("change", (event) => {
    state.sort = event.target.value;
    render();
  });
  document.querySelector("#task-reset-filters").addEventListener("click", resetFilters);
  document.querySelector("#task-empty-reset").addEventListener("click", resetFilters);
  document.querySelector("#theme-toggle").addEventListener("click", () => {
    applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
  });
  document.querySelector("#language-toggle").addEventListener("click", () => {
    state.lang = state.lang === "zh" ? "en" : "zh";
    window.localStorage.setItem("opportunity-language", state.lang);
    applyTranslations();
    render();
  });
}

function showLoadError(error) {
  console.error(error);
  const grid = document.querySelector("#task-grid");
  grid.setAttribute("aria-busy", "false");
  grid.hidden = true;
  document.querySelector("#task-empty-state").hidden = true;
  document.querySelector("#task-error-state").hidden = false;
  document.querySelector("#task-results-count").textContent = t("errorTitle");
  document.querySelector("#platform-grid").setAttribute("aria-busy", "false");
}

async function fetchJson(url) {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error(`${url} failed with ${response.status}`);
  return response.json();
}

async function loadDirectory() {
  const [tasks, platforms, sources] = await Promise.all([
    fetchJson(DIRECTORY_SOURCES.tasks),
    fetchJson(DIRECTORY_SOURCES.platforms),
    fetchJson(DIRECTORY_SOURCES.sources),
  ]);
  if (!Array.isArray(tasks) || !Array.isArray(platforms) || !Array.isArray(sources)) {
    throw new TypeError("Task directory payloads must be arrays");
  }
  state.tasks = tasks.filter(
    (task) => task && task.id && task.title && task.application_url && task.source_updated_at && task.expires_at,
  );
  state.platforms = platforms.filter((platform) => platform && platform.id && platform.name && platform.url);
  state.sources = sources.filter((source) => source && source.id && source.platform_id);
}

async function init() {
  readInitialState();
  const storedTheme = window.localStorage.getItem("opportunity-theme");
  const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  applyTheme(storedTheme === "dark" || storedTheme === "light" ? storedTheme : preferredTheme);
  applyTranslations();
  bindEvents();
  syncControls();
  document.querySelector("#current-year").textContent = String(new Date().getFullYear());
  try {
    await loadDirectory();
    render();
  } catch (error) {
    showLoadError(error);
  }
}

if (typeof document !== "undefined") init();
