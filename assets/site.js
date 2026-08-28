const DIRECTORY_SOURCES = Object.freeze({
  contests: {
    url: "./data/contests.json",
  },
});

const translations = {
  zh: {
    pageTitle: "AIGC 机会雷达｜创作比赛机会",
    skipLink: "跳到主要内容",
    homeLabel: "AIGC 机会雷达首页",
    brandName: "AIGC 机会雷达",
    brandTagline: "Creative Opportunity Radar",
    primaryNavLabel: "主要导航",
    navContests: "比赛机会",
    navTasks: "任务平台",
    comingSoon: "首批上线",
    heroEyebrow: "持续核验 · 最近更新优先",
    heroTitle: "把时间留给创作，<em>把机会交给雷达。</em>",
    heroLede: "聚合仍可报名或已官宣的 AIGC 创作比赛，快速看清截止日期、参赛门槛和官方入口。",
    browseContests: "浏览比赛",
    viewSource: "查看开源项目",
    trustLabel: "目录特点",
    trustOfficial: "优先引用官方来源",
    trustUpdated: "自动清理过期信息",
    radarLabel: "机会概览",
    radarNow: "当前雷达",
    activeOpportunities: "项有效机会",
    urgentLabel: "7 天内截止",
    categoryLabel: "创作类别",
    verifiedLabel: "最近核验",
    directoryKicker: "Opportunity directory",
    directoryTitle: "正在发生的创作机会",
    directoryIntro: "默认按最近核验时间排序。所有报名条件与日期仍请以官方规则为准。",
    filterPanelLabel: "筛选比赛",
    searchLabel: "搜索比赛",
    searchPlaceholder: "搜索名称、主办方、地区或资格",
    clearSearch: "清空搜索",
    categoryFilterLabel: "创作类别",
    categoryAll: "全部",
    categoryVideo: "视频",
    categoryImage: "图像",
    categoryAudio: "音频",
    categoryText: "文字",
    categoryApp: "应用",
    statusFilterLabel: "报名状态",
    statusAll: "全部状态",
    statusOpen: "报名中",
    statusUrgent: "7 天内截止",
    statusUpcoming: "即将开放",
    feeFilterLabel: "参赛费用",
    feeAll: "全部费用",
    feeFree: "免费",
    feePaid: "收费",
    feeUnknown: "待确认",
    sortLabel: "排序方式",
    sortVerified: "最近核验",
    sortDeadline: "截止时间",
    sortOpening: "开放时间",
    loading: "正在读取最新机会…",
    resetFilters: "清除筛选",
    emptyTitle: "暂时没有匹配的比赛",
    emptyText: "试试减少筛选条件，或搜索更宽泛的关键词。",
    errorTitle: "最新数据暂时无法载入",
    errorText: "你仍可以查看仓库中的完整比赛清单。",
    viewFullList: "查看完整清单",
    subscribeKicker: "Stay in the loop",
    subscribeTitle: "让机会主动找到你",
    subscribeText: "通过 RSS 或日历订阅，第一时间获取目录更新与截止日期。",
    subscribeRss: "订阅 RSS",
    subscribeCalendar: "添加到日历",
    footerTagline: "开放、可核验、持续更新",
    footerNote: "社区维护的信息索引，不隶属于任何赛事主办方。投稿前请重新核对官方规则。",
    footerNavLabel: "页脚导航",
    contribute: "参与共建",
    openSourceNote: "数据与代码开放维护",
    switchDark: "切换深色模式",
    switchLight: "切换浅色模式",
    switchEnglish: "Switch to English",
    organizer: "主办方",
    deadline: "截止",
    region: "地区 / 资格",
    prize: "奖励",
    officialSite: "活动官网",
    rules: "比赛规则",
    verifiedOn: "核验于",
    resultSummary: (shown, total) => `显示 ${shown} 项，共 ${total} 项有效机会`,
    urgentToday: "今天截止",
    urgentDays: (days) => `${days} 天后截止`,
    upcomingDays: (days) => `${days} 天后开放`,
    openDays: (days) => `报名中 · ${days} 天后截止`,
    externalOfficialLabel: (title) => `打开 ${title} 的活动官网`,
    externalRulesLabel: (title) => `打开 ${title} 的比赛规则`,
  },
  en: {
    pageTitle: "AIGC Opportunity Radar | Creative contests",
    skipLink: "Skip to main content",
    homeLabel: "AIGC Opportunity Radar home",
    brandName: "AIGC Opportunity Radar",
    brandTagline: "Creative Opportunity Radar",
    primaryNavLabel: "Primary navigation",
    navContests: "Contests",
    navTasks: "Task platforms",
    comingSoon: "Beta",
    heroEyebrow: "Continuously verified · Latest updates first",
    heroTitle: "Keep your time for making. <em>Let the radar find the openings.</em>",
    heroLede: "A focused directory of open and officially announced AIGC creative contests, with deadlines, eligibility, and official links in one place.",
    browseContests: "Browse contests",
    viewSource: "View open-source project",
    trustLabel: "Directory principles",
    trustOfficial: "Official sources first",
    trustUpdated: "Expired entries removed automatically",
    radarLabel: "Opportunity overview",
    radarNow: "Radar now",
    activeOpportunities: "active opportunities",
    urgentLabel: "Due in 7 days",
    categoryLabel: "Categories",
    verifiedLabel: "Last verified",
    directoryKicker: "Opportunity directory",
    directoryTitle: "Creative opportunities happening now",
    directoryIntro: "Sorted by the latest verification by default. Always re-check entry terms and dates in the official rules.",
    filterPanelLabel: "Filter contests",
    searchLabel: "Search contests",
    searchPlaceholder: "Search title, organizer, region, or eligibility",
    clearSearch: "Clear search",
    categoryFilterLabel: "Creative category",
    categoryAll: "All",
    categoryVideo: "Video",
    categoryImage: "Image",
    categoryAudio: "Audio",
    categoryText: "Writing",
    categoryApp: "Apps",
    statusFilterLabel: "Entry status",
    statusAll: "All statuses",
    statusOpen: "Open",
    statusUrgent: "Due in 7 days",
    statusUpcoming: "Opening soon",
    feeFilterLabel: "Entry fee",
    feeAll: "All fees",
    feeFree: "Free",
    feePaid: "Paid",
    feeUnknown: "To confirm",
    sortLabel: "Sort by",
    sortVerified: "Latest verified",
    sortDeadline: "Deadline",
    sortOpening: "Opening date",
    loading: "Loading the latest opportunities…",
    resetFilters: "Clear filters",
    emptyTitle: "No contests match yet",
    emptyText: "Try fewer filters or a broader search term.",
    errorTitle: "The latest data could not be loaded",
    errorText: "You can still view the complete directory in the repository.",
    viewFullList: "View full directory",
    subscribeKicker: "Stay in the loop",
    subscribeTitle: "Let opportunities find you",
    subscribeText: "Subscribe by RSS or calendar to follow directory updates and deadlines.",
    subscribeRss: "Subscribe via RSS",
    subscribeCalendar: "Add to calendar",
    footerTagline: "Open, verifiable, continuously updated",
    footerNote: "A community-maintained information index unaffiliated with any organizer. Re-check official rules before submitting.",
    footerNavLabel: "Footer navigation",
    contribute: "Contribute",
    openSourceNote: "Open data and open-source code",
    switchDark: "Switch to dark mode",
    switchLight: "Switch to light mode",
    switchEnglish: "切换为中文",
    organizer: "Organizer",
    deadline: "Deadline",
    region: "Region / eligibility",
    prize: "Prize",
    officialSite: "Official site",
    rules: "Rules",
    verifiedOn: "Verified",
    resultSummary: (shown, total) => `Showing ${shown} of ${total} active opportunities`,
    urgentToday: "Due today",
    urgentDays: (days) => `Due in ${days} days`,
    upcomingDays: (days) => `Opens in ${days} days`,
    openDays: (days) => `Open · ${days} days left`,
    externalOfficialLabel: (title) => `Open the official site for ${title}`,
    externalRulesLabel: (title) => `Open the rules for ${title}`,
  },
};

const validCategories = new Set(["video", "image", "audio", "text", "app"]);
const validStatuses = new Set(["all", "open", "urgent", "upcoming"]);
const validFees = new Set(["all", "free", "paid", "unknown"]);
const validSorts = new Set(["verified", "deadline", "opening"]);

const state = {
  contests: [],
  query: "",
  category: "all",
  status: "all",
  fee: "all",
  sort: "verified",
  lang: "zh",
  today: startOfDay(new Date()),
};

let searchTimer;

function startOfDay(value) {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
}

function parseLocalDate(value) {
  const [year, month, day] = String(value).split("-").map(Number);
  return new Date(year, month - 1, day, 12, 0, 0, 0);
}

function differenceInDays(later, earlier) {
  const millisecondsPerDay = 86_400_000;
  return Math.round((startOfDay(later) - startOfDay(earlier)) / millisecondsPerDay);
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

function classifyFee(contest) {
  const value = normalizeSearch(`${contest.fee} ${contest.en?.fee ?? ""}`);
  if (/收费|\bpaid\b|usd|cny|hkd|krw|\$|€|£|¥/.test(value)) return "paid";
  if (/免费|\bfree\b/.test(value)) return "free";
  return "unknown";
}

function getContestStatus(contest, referenceDate = state.today) {
  const startDate = parseLocalDate(contest.start_date);
  const deadline = parseLocalDate(contest.deadline);
  const daysUntilStart = differenceInDays(startDate, referenceDate);
  const daysUntilDeadline = differenceInDays(deadline, referenceDate);

  if (daysUntilDeadline < 0) {
    return { key: "expired", days: daysUntilDeadline };
  }
  if (daysUntilStart > 0) {
    return { key: "upcoming", days: daysUntilStart };
  }
  if (daysUntilDeadline <= 7) {
    return { key: "urgent", days: daysUntilDeadline };
  }
  return { key: "open", days: daysUntilDeadline };
}

function localizedContest(contest, lang = state.lang) {
  if (lang === "en") {
    return {
      ...contest,
      title: contest.en.title,
      region: contest.en.region,
      organizer: contest.en.organizer,
      timezone: contest.en.timezone,
      eligibility: contest.en.eligibility,
      fee: contest.en.fee,
      prize: contest.en.prize,
    };
  }
  return contest;
}

function matchesSearch(contest, query) {
  if (!query) return true;
  const fields = [
    contest.title,
    contest.region,
    contest.organizer,
    contest.eligibility,
    contest.prize,
    contest.fee,
    contest.en?.title,
    contest.en?.region,
    contest.en?.organizer,
    contest.en?.eligibility,
    contest.en?.prize,
    contest.en?.fee,
  ];
  return normalizeSearch(fields.join(" ")).includes(query);
}

function filterAndSortContests(contests, filters = state) {
  const query = normalizeSearch(filters.query);
  const filtered = contests.filter((contest) => {
    const status = getContestStatus(contest, filters.today);
    if (status.key === "expired") return false;
    if (!matchesSearch(contest, query)) return false;
    if (filters.category !== "all" && !contest.categories.includes(filters.category)) return false;
    if (filters.status === "open" && !["open", "urgent"].includes(status.key)) return false;
    if (!["all", "open"].includes(filters.status) && status.key !== filters.status) return false;
    if (filters.fee !== "all" && classifyFee(contest) !== filters.fee) return false;
    return true;
  });

  return filtered.sort((left, right) => {
    if (filters.sort === "deadline") {
      return left.deadline.localeCompare(right.deadline) || left.__index - right.__index;
    }
    if (filters.sort === "opening") {
      return right.start_date.localeCompare(left.start_date) || left.__index - right.__index;
    }
    return right.verified_on.localeCompare(left.verified_on) || left.__index - right.__index;
  });
}

function t(key, ...args) {
  const value = translations[state.lang][key] ?? translations.zh[key] ?? key;
  return typeof value === "function" ? value(...args) : value;
}

function formatDate(dateValue, options = {}) {
  const locale = state.lang === "en" ? "en-US" : "zh-CN";
  return new Intl.DateTimeFormat(locale, {
    year: options.withYear === false ? undefined : "numeric",
    month: "short",
    day: "numeric",
  }).format(parseLocalDate(dateValue));
}

function formatStatus(status) {
  if (status.key === "upcoming") return t("upcomingDays", status.days);
  if (status.key === "urgent") return status.days === 0 ? t("urgentToday") : t("urgentDays", status.days);
  return t("openDays", status.days);
}

function categoryLabel(category) {
  const keys = {
    video: "categoryVideo",
    image: "categoryImage",
    audio: "categoryAudio",
    text: "categoryText",
    app: "categoryApp",
  };
  return t(keys[category] ?? category);
}

function feeLabel(feeClass) {
  const keys = { free: "feeFree", paid: "feePaid", unknown: "feeUnknown" };
  return t(keys[feeClass]);
}

function externalIcon() {
  return '<svg viewBox="0 0 18 18" aria-hidden="true"><path d="M10 3h5v5M15 3l-7 7M8 5H4v9h9v-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
}

function renderCard(source) {
  const contest = localizedContest(source);
  const status = getContestStatus(source);
  const feeClass = classifyFee(source);
  const officialUrl = safeUrl(source.official_url);
  const rulesUrl = safeUrl(source.rules_url);
  const title = escapeHtml(contest.title);
  const categories = source.categories
    .filter((category) => validCategories.has(category))
    .map((category) => `<span class="category-badge">${escapeHtml(categoryLabel(category))}</span>`)
    .join("");

  return `
    <article class="contest-card" data-status="${status.key}">
      <div class="contest-card-accent" aria-hidden="true"></div>
      <div class="contest-card-body">
        <div class="card-topline">
          <span class="status-badge" data-status="${status.key}">${escapeHtml(formatStatus(status))}</span>
          <span class="verified-date">${escapeHtml(t("verifiedOn"))} ${escapeHtml(formatDate(source.verified_on))}</span>
        </div>
        <h3>${title}</h3>
        <p class="organizer">${escapeHtml(t("organizer"))} · ${escapeHtml(contest.organizer)}</p>
        <div class="card-tags">
          ${categories}
          <span class="fee-badge">${escapeHtml(feeLabel(feeClass))}</span>
        </div>
        <p class="eligibility">${escapeHtml(contest.eligibility)}</p>
        <div class="card-facts">
          <div class="fact">
            <span>${escapeHtml(t("deadline"))}</span>
            <strong>${escapeHtml(formatDate(source.deadline))}<br>${escapeHtml(contest.timezone)}</strong>
          </div>
          <div class="fact">
            <span>${escapeHtml(t("region"))}</span>
            <strong>${escapeHtml(contest.region)}</strong>
          </div>
          <div class="fact fact-wide">
            <span>${escapeHtml(t("prize"))}</span>
            <strong>${escapeHtml(contest.prize)}</strong>
          </div>
        </div>
        <div class="card-actions">
          <a class="card-link card-link-primary" href="${escapeHtml(officialUrl)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(t("externalOfficialLabel", contest.title))}">
            <span>${escapeHtml(t("officialSite"))}</span>${externalIcon()}
          </a>
          <a class="card-link" href="${escapeHtml(rulesUrl)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(t("externalRulesLabel", contest.title))}">
            <span>${escapeHtml(t("rules"))}</span>${externalIcon()}
          </a>
        </div>
      </div>
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
  const active = state.contests.filter((contest) => getContestStatus(contest).key !== "expired");
  const urgent = active.filter((contest) => getContestStatus(contest).key === "urgent");
  const categories = new Set(active.flatMap((contest) => contest.categories));
  const latestVerified = active.reduce(
    (latest, contest) => (contest.verified_on > latest ? contest.verified_on : latest),
    "",
  );

  document.querySelector("#hero-total").textContent = String(active.length);
  document.querySelector("#hero-urgent").textContent = String(urgent.length);
  document.querySelector("#hero-categories").textContent = String(categories.size);
  document.querySelector("#hero-verified").textContent = latestVerified ? formatDate(latestVerified, { withYear: false }) : "—";
}

function hasActiveFilters() {
  return Boolean(
    state.query || state.category !== "all" || state.status !== "all" || state.fee !== "all" || state.sort !== "verified",
  );
}

function syncControls() {
  const search = document.querySelector("#contest-search");
  search.value = state.query;
  document.querySelector("#search-clear").hidden = !state.query;
  document.querySelector("#status-filter").value = state.status;
  document.querySelector("#fee-filter").value = state.fee;
  document.querySelector("#sort-select").value = state.sort;
  document.querySelector("#reset-filters").hidden = !hasActiveFilters();

  document.querySelectorAll("[data-category]").forEach((button) => {
    const isActive = button.dataset.category === state.category;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function updateUrl() {
  const params = new URLSearchParams();
  if (state.query) params.set("q", state.query);
  if (state.category !== "all") params.set("category", state.category);
  if (state.status !== "all") params.set("status", state.status);
  if (state.fee !== "all") params.set("fee", state.fee);
  if (state.sort !== "verified") params.set("sort", state.sort);
  if (state.lang !== "zh") params.set("lang", state.lang);

  const query = params.toString();
  const nextUrl = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`;
  window.history.replaceState(null, "", nextUrl);
}

function render() {
  const grid = document.querySelector("#contest-grid");
  const empty = document.querySelector("#empty-state");
  const error = document.querySelector("#error-state");
  const activeTotal = state.contests.filter((contest) => getContestStatus(contest).key !== "expired").length;
  const contests = filterAndSortContests(state.contests);

  error.hidden = true;
  grid.setAttribute("aria-busy", "false");
  grid.innerHTML = contests.map(renderCard).join("");
  grid.hidden = contests.length === 0;
  empty.hidden = contests.length !== 0;
  document.querySelector("#results-count").textContent = t("resultSummary", contests.length, activeTotal);

  syncControls();
  updateStatistics();
  updateUrl();
}

function resetFilters() {
  state.query = "";
  state.category = "all";
  state.status = "all";
  state.fee = "all";
  state.sort = "verified";
  render();
  document.querySelector("#contest-search").focus();
}

function readInitialState() {
  const params = new URLSearchParams(window.location.search);
  const category = params.get("category");
  const status = params.get("status");
  const fee = params.get("fee");
  const sort = params.get("sort");
  const savedLanguage = window.localStorage.getItem("opportunity-language");

  state.query = params.get("q")?.slice(0, 120) ?? "";
  state.category = validCategories.has(category) ? category : "all";
  state.status = validStatuses.has(status) ? status : "all";
  state.fee = validFees.has(fee) ? fee : "all";
  state.sort = validSorts.has(sort) ? sort : "verified";
  state.lang = params.get("lang") === "en" || (!params.has("lang") && savedLanguage === "en") ? "en" : "zh";
}

function bindEvents() {
  document.querySelector("#contest-search").addEventListener("input", (event) => {
    state.query = event.target.value.slice(0, 120);
    document.querySelector("#search-clear").hidden = !state.query;
    window.clearTimeout(searchTimer);
    searchTimer = window.setTimeout(render, 140);
  });

  document.querySelector("#search-clear").addEventListener("click", () => {
    state.query = "";
    render();
    document.querySelector("#contest-search").focus();
  });

  document.querySelector("#category-chips").addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    state.category = button.dataset.category;
    render();
  });

  document.querySelector("#status-filter").addEventListener("change", (event) => {
    state.status = event.target.value;
    render();
  });
  document.querySelector("#fee-filter").addEventListener("change", (event) => {
    state.fee = event.target.value;
    render();
  });
  document.querySelector("#sort-select").addEventListener("change", (event) => {
    state.sort = event.target.value;
    render();
  });

  document.querySelector("#reset-filters").addEventListener("click", resetFilters);
  document.querySelector("#empty-reset").addEventListener("click", resetFilters);

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

function showLoadError() {
  const grid = document.querySelector("#contest-grid");
  grid.setAttribute("aria-busy", "false");
  grid.hidden = true;
  document.querySelector("#empty-state").hidden = true;
  document.querySelector("#error-state").hidden = false;
  document.querySelector("#results-count").textContent = t("errorTitle");
}

async function loadContests() {
  const response = await fetch(DIRECTORY_SOURCES.contests.url, { cache: "no-store" });
  if (!response.ok) throw new Error(`Contest data request failed with ${response.status}`);
  const payload = await response.json();
  if (!Array.isArray(payload)) throw new TypeError("Contest data must be an array");

  state.contests = payload
    .filter((contest) => contest && contest.id && contest.title && contest.deadline && contest.verified_on && contest.en)
    .map((contest, index) => ({ ...contest, __index: index }));
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
    await loadContests();
    render();
  } catch (error) {
    console.error(error);
    showLoadError();
  }
}

if (typeof document !== "undefined") {
  init();
}
