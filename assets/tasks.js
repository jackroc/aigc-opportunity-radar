import {
  PROFILE_STORAGE_KEY,
  buildAssistantPrompt,
  buildOutreachTemplate,
  buildTaskPlan,
  normalizeProfile,
  scoreTaskAgainstProfile,
} from "./opportunity-matcher.mjs";

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
    heroEyebrow: "公开来源 · 每 15 分钟自动检查",
    heroTitle: "找到值得做的任务，<em>先看清回报和规则。</em>",
    heroLede: "聚合公开、可核验的赏金任务，同时展示报酬是否明确、可见竞争度、来源可信信号和 AI 使用边界。",
    startMatching: "开始个性匹配",
    browseTasks: "直接浏览任务",
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
    directoryIntro: "公开任务继续完整展示；建立本地画像后，会额外显示匹配理由、风险和可执行行动方案。",
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
    sortMatch: "最适合我",
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
    matcherKicker: "Phase two · Opportunity matcher",
    matcherTitle: "不是替你接任务，而是先帮你避坑、排优先级",
    matcherText: "用你的强项、时间和目标计算可解释的匹配度，再为每条任务生成开工确认、执行和提交清单。你不建立画像也能继续浏览全部任务。",
    matcherPrivacyTitle: "画像只保存在当前浏览器",
    matcherPrivacyText: "不需要注册，不会上传个人资料；匹配度只是任务适配信号，不是获奖或付款概率。",
    profileStep: "你的机会画像",
    profileTitle: "告诉雷达你擅长什么",
    localOnly: "仅本地",
    strengthLegend: "主要强项（可多选）",
    strengthHelper: "不确定时可以先选一项，之后随时修改。",
    weeklyHoursLabel: "每周可投入时间",
    weeklyHours2: "约 2 小时",
    weeklyHours5: "约 5 小时",
    weeklyHours10: "约 10 小时",
    weeklyHours20: "20 小时以上",
    goalLabel: "当前优先目标",
    goalBalanced: "综合判断",
    goalReward: "优先明确报酬",
    goalCompetition: "优先较低竞争",
    advancedPreferences: "更多匹配偏好",
    skillKeywordsLabel: "技能关键词",
    skillKeywordsPlaceholder: "例如 TypeScript、AWS、技术写作",
    skillKeywordsHelper: "用逗号分隔；只用于当前浏览器中的匹配。",
    rewardPreferenceLabel: "报酬偏好",
    rewardPreferenceAny: "不影响匹配",
    rewardPreferencePriced: "优先已标价",
    competitionToleranceLabel: "竞争接受度",
    competitionToleranceLow: "只接受较低",
    competitionToleranceMedium: "接受中等",
    competitionToleranceHigh: "可接受较高",
    aiPreferenceLabel: "AI 辅助偏好",
    aiPreferenceAny: "不影响匹配",
    aiPreferenceClear: "优先规则明确",
    aiPreferenceHuman: "优先本人完成",
    applyProfile: "开始匹配任务",
    resetProfile: "清除画像",
    profileNotSaved: "尚未建立画像，任务仍会正常显示。",
    profileSaved: (count) => `画像已保存在本地，正在为 ${count} 条任务解释匹配度。`,
    profileStorageError: "画像已在本次访问中启用，但浏览器未允许本地保存。",
    matchLabel: "与你的匹配度",
    matchBandStrong: "优先查看",
    matchBandPossible: "可以评估",
    matchBandExplore: "探索选项",
    matchScoreNote: "基于公开信息和你的偏好，不代表成功概率",
    matchReasonCategory: "强项重合",
    matchReasonKeyword: "技能命中",
    matchReasonReward: "报酬已标明",
    matchReasonCompetition: "竞争在接受范围",
    matchReasonAi: "AI 规则符合偏好",
    matchReasonRecent: "近期仍有活动",
    matchCautionCategory: "主要强项暂未重合",
    matchCautionKeyword: "技能关键词暂未命中",
    matchCautionRewardUnknown: "金额需要确认",
    matchCautionCompetitionGoal: "竞争高于目标",
    matchCautionCompetitionHigh: "公开讨论较多",
    matchCautionAi: "AI 规则需确认",
    matchCautionStale: "近期活动较少",
    matchCautionRewardUnconfirmed: "赏金未担保",
    taskPlan: "生成行动方案",
    taskPlanLabel: (title) => `为 ${title} 生成行动方案`,
    planAssistantLabel: "本地任务助理 · 不调用模型",
    closePlan: "关闭行动方案",
    planKicker: "任务行动方案",
    planNoProfile: "未建立画像也可以使用这份基础清单；建立画像后会增加个性化匹配解释。",
    planMatchHeading: "为什么值得看",
    planCautionHeading: "开始前留意",
    planScoreDisclaimer: "匹配度衡量信息适配，不预测获奖、验收或付款结果。",
    planPreflight: "开工前确认",
    planPrepare: "定义范围",
    planExecute: "执行与沟通",
    planSubmit: "提交前检查",
    planItemConfirmAvailability: "确认任务仍开放，且没有其他人已经被指定。",
    planItemConfirmAcceptance: "确认验收人、交付物和判断完成的标准。",
    planItemConfirmReward: "确认赏金金额、资格、付款方式与付款时点。",
    planItemConfirmAiPolicy: "询问是否允许 AI 辅助，以及需要披露哪些使用情况。",
    planItemFollowAiPolicy: "把任务已说明的 AI 使用边界写进执行清单。",
    planItemSummarizeRequirements: "用自己的话复述需求、非目标和待确认项。",
    planItemShareApproach: "先发一份简短方案，得到认可后再投入主要时间。",
    planItemTimeboxSmall: "把首轮验证控制在较小时间盒内，先交可判断的样例。",
    planItemTimeboxWeekly: "按每周可投入时间拆里程碑，并约定进度同步点。",
    planItemDifferentiateEarly: "公开竞争较高，尽早用复现、样例或方案证明差异。",
    planItemPrototypeTests: "先完成最小实现或样例，同时准备可复现测试。",
    planItemOutlineSources: "先确认提纲、受众与引用来源，再扩展正文。",
    planItemStoryboardSample: "先提交分镜、风格样例或短片段确认方向。",
    planItemConceptVariants: "先提供概念方向与少量变体，避免完整返工。",
    planItemSmallestSample: "先提交最小可验证样例，确认方向后再扩展。",
    planItemPostEvidence: "每个进度点附上链接、截图、测试或可复现证据。",
    planItemVerifyDeliverables: "逐项对照官方要求，确认没有漏交文件或格式。",
    planItemIncludeEvidence: "提交时同时给出测试、演示、来源和变更说明。",
    planItemSelfReview: "从验收者视角自查一次，并明确仍存在的限制。",
    outreachTitle: "联系维护者模板（英文）",
    outreachDescription: "先确认名额、规则和付款，再开始高投入工作。",
    aiPromptTitle: "复制给任意 AI 助理",
    aiPromptDescription: "提示词只含公开任务信息和你的本地偏好，不会自动发送。",
    copyOutreach: "复制联系模板",
    copyAiPrompt: "复制分析提示词",
    copiedOutreach: "联系模板已复制。",
    copiedAiPrompt: "分析提示词已复制。",
    copyFailed: "复制失败，请展开内容后手动复制。",
    openOfficialTask: "打开官方任务页面",
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
    heroEyebrow: "Public sources · checked every 15 minutes",
    heroTitle: "Find work worth doing. <em>See the reward and rules first.</em>",
    heroLede: "Browse public, auditable bounties with reward clarity, visible competition, trust signals, and AI-use boundaries.",
    startMatching: "Start personal matching",
    browseTasks: "Browse all tasks",
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
    directoryIntro: "Every public task remains visible. A local profile adds match reasons, cautions, and an actionable plan.",
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
    sortMatch: "Best for me",
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
    matcherKicker: "Phase two · Opportunity matcher",
    matcherTitle: "It will not claim work for you. It helps you avoid traps and set priorities first.",
    matcherText: "Use your strengths, time, and goals to calculate an explainable fit, then create preflight, execution, and submission checklists. You can still browse everything without a profile.",
    matcherPrivacyTitle: "Your profile stays in this browser",
    matcherPrivacyText: "No account and no profile upload. Match scores are fit signals, never prize or payout probabilities.",
    profileStep: "Your opportunity profile",
    profileTitle: "Tell the radar what you do well",
    localOnly: "Local only",
    strengthLegend: "Core strengths (choose any)",
    strengthHelper: "Start with one if you are unsure. You can change it at any time.",
    weeklyHoursLabel: "Time available each week",
    weeklyHours2: "About 2 hours",
    weeklyHours5: "About 5 hours",
    weeklyHours10: "About 10 hours",
    weeklyHours20: "20+ hours",
    goalLabel: "Current priority",
    goalBalanced: "Balanced judgment",
    goalReward: "Clear rewards first",
    goalCompetition: "Lower competition first",
    advancedPreferences: "More matching preferences",
    skillKeywordsLabel: "Skill keywords",
    skillKeywordsPlaceholder: "For example TypeScript, AWS, technical writing",
    skillKeywordsHelper: "Separate with commas. They are only used for matching in this browser.",
    rewardPreferenceLabel: "Reward preference",
    rewardPreferenceAny: "Do not affect matching",
    rewardPreferencePriced: "Prefer a stated amount",
    competitionToleranceLabel: "Competition tolerance",
    competitionToleranceLow: "Lower only",
    competitionToleranceMedium: "Up to medium",
    competitionToleranceHigh: "Higher is acceptable",
    aiPreferenceLabel: "AI-assistance preference",
    aiPreferenceAny: "Do not affect matching",
    aiPreferenceClear: "Prefer clear rules",
    aiPreferenceHuman: "Prefer human-only work",
    applyProfile: "Match my tasks",
    resetProfile: "Clear profile",
    profileNotSaved: "No profile yet. Every task is still available.",
    profileSaved: (count) => `Saved locally. Explaining the fit for ${count} tasks.`,
    profileStorageError: "The profile is active for this visit, but the browser did not allow local storage.",
    matchLabel: "Fit for you",
    matchBandStrong: "Review first",
    matchBandPossible: "Worth assessing",
    matchBandExplore: "Exploratory",
    matchScoreNote: "Based on public facts and your preferences, not a success probability",
    matchReasonCategory: "Strength overlap",
    matchReasonKeyword: "Skill match",
    matchReasonReward: "Reward amount shown",
    matchReasonCompetition: "Competition fits your range",
    matchReasonAi: "AI policy fits your preference",
    matchReasonRecent: "Recently active",
    matchCautionCategory: "No core-strength overlap yet",
    matchCautionKeyword: "No skill keyword match yet",
    matchCautionRewardUnknown: "Amount needs confirmation",
    matchCautionCompetitionGoal: "Competition exceeds your goal",
    matchCautionCompetitionHigh: "Many public discussions",
    matchCautionAi: "AI rules need confirmation",
    matchCautionStale: "Less recent activity",
    matchCautionRewardUnconfirmed: "Reward is not guaranteed",
    taskPlan: "Create action plan",
    taskPlanLabel: (title) => `Create an action plan for ${title}`,
    planAssistantLabel: "Local task assistant · no model call",
    closePlan: "Close action plan",
    planKicker: "Task action plan",
    planNoProfile: "This baseline checklist works without a profile. Add one for personalized fit explanations.",
    planMatchHeading: "Why it may fit",
    planCautionHeading: "Check before starting",
    planScoreDisclaimer: "Fit measures information alignment. It does not predict awards, acceptance, or payment.",
    planPreflight: "Preflight checks",
    planPrepare: "Define the scope",
    planExecute: "Execute and communicate",
    planSubmit: "Before submission",
    planItemConfirmAvailability: "Confirm the task is still open and no contributor has already been selected.",
    planItemConfirmAcceptance: "Confirm the reviewer, deliverables, and definition of done.",
    planItemConfirmReward: "Confirm the reward, eligibility, payout method, and payout timing.",
    planItemConfirmAiPolicy: "Ask whether AI-assisted tools are allowed and what use must be disclosed.",
    planItemFollowAiPolicy: "Add the stated AI-use boundary to your execution checklist.",
    planItemSummarizeRequirements: "Restate the requirements, non-goals, and open questions in your own words.",
    planItemShareApproach: "Share a concise approach and get alignment before investing substantial time.",
    planItemTimeboxSmall: "Keep the first validation time-box small and share something evaluable.",
    planItemTimeboxWeekly: "Split work into weekly milestones and agree on progress checkpoints.",
    planItemDifferentiateEarly: "Visible competition is high. Differentiate early with a reproduction, sample, or plan.",
    planItemPrototypeTests: "Build the smallest implementation or sample and prepare reproducible tests.",
    planItemOutlineSources: "Confirm the outline, audience, and sources before expanding the draft.",
    planItemStoryboardSample: "Confirm direction with a storyboard, style sample, or short segment first.",
    planItemConceptVariants: "Share a concept direction and a few variants before full production.",
    planItemSmallestSample: "Share the smallest verifiable sample before expanding the work.",
    planItemPostEvidence: "Attach links, screenshots, tests, or reproducible evidence at each checkpoint.",
    planItemVerifyDeliverables: "Check every official requirement, file, and format before submission.",
    planItemIncludeEvidence: "Submit tests, demos, sources, and a concise change summary together.",
    planItemSelfReview: "Review from the evaluator's perspective and state any remaining limitations.",
    outreachTitle: "Maintainer outreach template",
    outreachDescription: "Confirm availability, rules, and payout before high-effort work.",
    aiPromptTitle: "Copy for any AI assistant",
    aiPromptDescription: "The prompt contains public task facts and local preferences only. It is never sent automatically.",
    copyOutreach: "Copy outreach template",
    copyAiPrompt: "Copy analysis prompt",
    copiedOutreach: "Outreach template copied.",
    copiedAiPrompt: "Analysis prompt copied.",
    copyFailed: "Copy failed. Expand the content and copy it manually.",
    openOfficialTask: "Open official task page",
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
const validSorts = new Set(["updated", "match", "reward", "competition"]);

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
  profile: normalizeProfile(),
  profileDraft: normalizeProfile(),
  profileActive: false,
  profileStorageFailed: false,
  planTaskId: "",
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

function matchBandLabel(band) {
  const keys = { strong: "matchBandStrong", possible: "matchBandPossible", explore: "matchBandExplore" };
  return t(keys[band] || "matchBandExplore");
}

function matchEntryLabel(entry) {
  const values = entry.values || [];
  const separator = state.lang === "en" ? ", " : "、";
  const colon = state.lang === "en" ? ": " : "：";
  const labels = {
    "reward-visible": t("matchReasonReward"),
    "lower-competition": t("matchReasonCompetition"),
    "competition-fit": t("matchReasonCompetition"),
    "ai-policy-fit": t("matchReasonAi"),
    "recently-active": t("matchReasonRecent"),
    "category-miss": t("matchCautionCategory"),
    "keyword-miss": t("matchCautionKeyword"),
    "reward-unknown": t("matchCautionRewardUnknown"),
    "competition-above-goal": t("matchCautionCompetitionGoal"),
    "competition-high": t("matchCautionCompetitionHigh"),
    "ai-policy-check": t("matchCautionAi"),
    "stale-activity": t("matchCautionStale"),
    "reward-unconfirmed": t("matchCautionRewardUnconfirmed"),
  };
  if (entry.code === "category-match") {
    return `${t("matchReasonCategory")}${colon}${values.map(categoryLabel).join(separator)}`;
  }
  if (entry.code === "keyword-match") {
    return `${t("matchReasonKeyword")}${colon}${values.join(separator)}`;
  }
  return labels[entry.code] || entry.code;
}

const planTranslationKeys = Object.freeze({
  "confirm-availability": "planItemConfirmAvailability",
  "confirm-acceptance": "planItemConfirmAcceptance",
  "confirm-reward": "planItemConfirmReward",
  "confirm-ai-policy": "planItemConfirmAiPolicy",
  "follow-ai-policy": "planItemFollowAiPolicy",
  "summarize-requirements": "planItemSummarizeRequirements",
  "share-approach": "planItemShareApproach",
  "timebox-small": "planItemTimeboxSmall",
  "timebox-weekly": "planItemTimeboxWeekly",
  "differentiate-early": "planItemDifferentiateEarly",
  "prototype-and-tests": "planItemPrototypeTests",
  "outline-and-sources": "planItemOutlineSources",
  "storyboard-and-sample": "planItemStoryboardSample",
  "concept-and-variants": "planItemConceptVariants",
  "smallest-verifiable-sample": "planItemSmallestSample",
  "post-progress-evidence": "planItemPostEvidence",
  "verify-deliverables": "planItemVerifyDeliverables",
  "include-evidence": "planItemIncludeEvidence",
  "self-review": "planItemSelfReview",
});

function planItemLabel(code) {
  return t(planTranslationKeys[code] || code);
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
    if (state.sort === "match" && state.profileActive) {
      const leftScore = scoreTaskAgainstProfile(left, state.profile, { now: state.now }).score;
      const rightScore = scoreTaskAgainstProfile(right, state.profile, { now: state.now }).score;
      return rightScore - leftScore || right.source_updated_at.localeCompare(left.source_updated_at);
    }
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
  const match = state.profileActive ? scoreTaskAgainstProfile(task, state.profile, { now: state.now }) : null;
  const matchMarkup = match
    ? `<div class="task-match-summary" data-band="${escapeHtml(match.band)}">
        <div class="task-match-score">
          <span>${escapeHtml(t("matchLabel"))}</span>
          <strong>${escapeHtml(match.score)}<small>%</small></strong>
          <em>${escapeHtml(matchBandLabel(match.band))}</em>
        </div>
        <ul>${match.signals.slice(0, 2).map((entry) => `<li>${escapeHtml(matchEntryLabel(entry))}</li>`).join("")}</ul>
        <small>${escapeHtml(t("matchScoreNote"))}</small>
      </div>`
    : "";

  return `
    <article class="task-card" data-competition="${escapeHtml(competition.level)}">
      <div class="task-card-accent" aria-hidden="true"></div>
      <div class="task-card-body">
        <div class="task-card-topline">
          <span class="task-status-badge">${escapeHtml(t("taskOpen"))}</span>
          <span class="task-updated">${escapeHtml(t("updated"))} ${escapeHtml(formatDate(task.source_updated_at))}</span>
        </div>
        ${matchMarkup}
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
        <div class="task-card-actions">
          <button class="task-plan-button" type="button" data-task-plan="${escapeHtml(task.id)}" aria-label="${escapeHtml(t("taskPlanLabel", task.title))}">
            <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 4.5h12v11H4zM7 2.5v4M13 2.5v4M7 10h6M7 13h4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span>${escapeHtml(t("taskPlan"))}</span>
          </button>
          <a class="task-card-link task-card-link-secondary" href="${url}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(t("taskLinkLabel", task.title))}">
            <span>${escapeHtml(t("viewTask"))}</span>${externalIcon()}
          </a>
        </div>
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

function readProfileDraft() {
  const categories = [...document.querySelectorAll("[data-profile-category][aria-pressed='true']")]
    .map((button) => button.dataset.profileCategory);
  return normalizeProfile({
    categories,
    skillKeywords: document.querySelector("#profile-skill-keywords").value,
    weeklyHours: document.querySelector("#profile-weekly-hours").value,
    goal: document.querySelector("#profile-goal").value,
    rewardPreference: document.querySelector("#profile-reward-preference").value,
    competitionTolerance: document.querySelector("#profile-competition-tolerance").value,
    aiPreference: document.querySelector("#profile-ai-preference").value,
  });
}

function syncProfileControls() {
  const profile = state.profileDraft;
  document.querySelectorAll("[data-profile-category]").forEach((button) => {
    const active = profile.categories.includes(button.dataset.profileCategory);
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  document.querySelector("#profile-weekly-hours").value = String(profile.weeklyHours);
  document.querySelector("#profile-goal").value = profile.goal;
  document.querySelector("#profile-skill-keywords").value = profile.skillKeywords.join(", ");
  document.querySelector("#profile-reward-preference").value = profile.rewardPreference;
  document.querySelector("#profile-competition-tolerance").value = profile.competitionTolerance;
  document.querySelector("#profile-ai-preference").value = profile.aiPreference;
  document.querySelector("#matcher-profile-reset").hidden = !state.profileActive;
  document.querySelector("#task-sort-match").disabled = !state.profileActive;
}

function renderProfileFeedback() {
  const feedback = document.querySelector("#profile-feedback");
  feedback.dataset.active = String(state.profileActive);
  if (!state.profileActive) {
    feedback.textContent = t("profileNotSaved");
    return;
  }
  const count = state.tasks.filter(isActive).length;
  feedback.textContent = state.profileStorageFailed ? t("profileStorageError") : t("profileSaved", count);
}

function applyProfile(event) {
  event.preventDefault();
  state.profileDraft = readProfileDraft();
  state.profile = normalizeProfile(state.profileDraft);
  state.profileActive = true;
  state.profileStorageFailed = false;
  try {
    window.localStorage.setItem(
      PROFILE_STORAGE_KEY,
      JSON.stringify({ version: 1, savedAt: new Date().toISOString(), profile: state.profile }),
    );
  } catch {
    state.profileStorageFailed = true;
  }
  state.sort = "match";
  render();
}

function resetProfile() {
  try {
    window.localStorage.removeItem(PROFILE_STORAGE_KEY);
  } catch {
    // The in-memory profile can still be cleared when storage is unavailable.
  }
  state.profile = normalizeProfile();
  state.profileDraft = normalizeProfile();
  state.profileActive = false;
  state.profileStorageFailed = false;
  if (state.sort === "match") state.sort = "updated";
  document.querySelector("#profile-advanced").open = false;
  render();
  document.querySelector("[data-profile-category]").focus();
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
  const defaultSort = state.profileActive ? "match" : "updated";
  return Boolean(
    state.query ||
      state.category !== "all" ||
      state.reward !== "all" ||
      state.ai !== "all" ||
      state.competition !== "all" ||
      state.sort !== defaultSort,
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
  syncProfileControls();
  renderProfileFeedback();
}

function updateUrl() {
  const params = new URLSearchParams();
  if (state.query) params.set("q", state.query);
  if (state.category !== "all") params.set("category", state.category);
  if (state.reward !== "all") params.set("reward", state.reward);
  if (state.ai !== "all") params.set("ai", state.ai);
  if (state.competition !== "all") params.set("competition", state.competition);
  if (state.sort !== "updated") params.set("sort", state.sort);
  if (state.planTaskId) params.set("task", state.planTaskId);
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

function renderPlanSection(titleKey, items) {
  return `<section class="task-plan-section">
    <h3>${escapeHtml(t(titleKey))}</h3>
    <ol>${items.map((item) => `<li><span aria-hidden="true"></span>${escapeHtml(planItemLabel(item))}</li>`).join("")}</ol>
  </section>`;
}

function renderTaskPlanDialog(task) {
  const container = document.querySelector("#task-plan-content");
  const plan = buildTaskPlan(task, state.profileActive ? state.profile : normalizeProfile());
  const match = state.profileActive ? scoreTaskAgainstProfile(task, state.profile, { now: state.now }) : null;
  const outreach = buildOutreachTemplate(task, state.profileActive ? state.profile : normalizeProfile());
  const assistantPrompt = buildAssistantPrompt(
    task,
    state.profileActive ? state.profile : normalizeProfile(),
    state.lang,
  );
  const matchBlock = match
    ? `<div class="plan-fit-grid">
        <div class="plan-fit-score" data-band="${escapeHtml(match.band)}">
          <span>${escapeHtml(t("matchLabel"))}</span>
          <strong>${escapeHtml(match.score)}<small>%</small></strong>
          <em>${escapeHtml(matchBandLabel(match.band))}</em>
        </div>
        <div class="plan-fit-reasons">
          <div><h3>${escapeHtml(t("planMatchHeading"))}</h3><ul>${match.signals.map((entry) => `<li>${escapeHtml(matchEntryLabel(entry))}</li>`).join("")}</ul></div>
          <div><h3>${escapeHtml(t("planCautionHeading"))}</h3><ul>${match.cautions.map((entry) => `<li>${escapeHtml(matchEntryLabel(entry))}</li>`).join("")}</ul></div>
        </div>
        <p>${escapeHtml(t("planScoreDisclaimer"))}</p>
      </div>`
    : `<p class="plan-no-profile">${escapeHtml(t("planNoProfile"))}</p>`;

  container.innerHTML = `
    <header class="task-plan-header">
      <p class="section-kicker">${escapeHtml(t("planKicker"))}</p>
      <h2 id="task-plan-title">${escapeHtml(task.title)}</h2>
      <p>${escapeHtml(t("project"))} · ${escapeHtml(task.source_repo)} #${escapeHtml(task.source_number)}</p>
    </header>
    ${matchBlock}
    <div class="task-plan-grid">
      ${renderPlanSection("planPreflight", plan.preflight)}
      ${renderPlanSection("planPrepare", plan.prepare)}
      ${renderPlanSection("planExecute", plan.execute)}
      ${renderPlanSection("planSubmit", plan.submit)}
    </div>
    <div class="plan-copy-grid">
      <details class="plan-copy-card">
        <summary><span><strong>${escapeHtml(t("outreachTitle"))}</strong><small>${escapeHtml(t("outreachDescription"))}</small></span><svg viewBox="0 0 20 20" aria-hidden="true"><path d="m6 8 4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></summary>
        <div><pre>${escapeHtml(outreach)}</pre><button class="button button-secondary" type="button" data-copy-plan="outreach">${escapeHtml(t("copyOutreach"))}</button></div>
      </details>
      <details class="plan-copy-card">
        <summary><span><strong>${escapeHtml(t("aiPromptTitle"))}</strong><small>${escapeHtml(t("aiPromptDescription"))}</small></span><svg viewBox="0 0 20 20" aria-hidden="true"><path d="m6 8 4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></summary>
        <div><pre>${escapeHtml(assistantPrompt)}</pre><button class="button button-secondary" type="button" data-copy-plan="prompt">${escapeHtml(t("copyAiPrompt"))}</button></div>
      </details>
    </div>
    <footer class="task-plan-footer">
      <a class="button button-primary" href="${escapeHtml(safeUrl(task.application_url))}" target="_blank" rel="noopener noreferrer">${escapeHtml(t("openOfficialTask"))}${externalIcon()}</a>
    </footer>`;
}

function openTaskPlan(taskId, options = {}) {
  const task = state.tasks.find((candidate) => candidate.id === taskId && isActive(candidate));
  if (!task) return;
  state.planTaskId = task.id;
  renderTaskPlanDialog(task);
  const dialog = document.querySelector("#task-plan-dialog");
  if (!dialog.open) dialog.showModal();
  if (options.updateUrl !== false) updateUrl();
}

function closeTaskPlan() {
  const dialog = document.querySelector("#task-plan-dialog");
  if (dialog.open) dialog.close();
}

async function copyPlanText(kind) {
  const task = state.tasks.find((candidate) => candidate.id === state.planTaskId);
  if (!task) return;
  const profile = state.profileActive ? state.profile : normalizeProfile();
  const text = kind === "outreach"
    ? buildOutreachTemplate(task, profile)
    : buildAssistantPrompt(task, profile, state.lang);
  const status = document.querySelector("#task-copy-status");
  try {
    await navigator.clipboard.writeText(text);
    status.textContent = t(kind === "outreach" ? "copiedOutreach" : "copiedAiPrompt");
  } catch {
    status.textContent = t("copyFailed");
  }
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
  if (state.planTaskId && document.querySelector("#task-plan-dialog").open) {
    const task = state.tasks.find((candidate) => candidate.id === state.planTaskId);
    if (task) renderTaskPlanDialog(task);
  }
}

function resetFilters() {
  state.query = "";
  state.category = "all";
  state.reward = "all";
  state.ai = "all";
  state.competition = "all";
  state.sort = state.profileActive ? "match" : "updated";
  render();
  document.querySelector("#task-search").focus();
}

function readInitialState() {
  const params = new URLSearchParams(window.location.search);
  const savedLanguage = window.localStorage.getItem("opportunity-language");
  let savedProfile = null;
  try {
    savedProfile = JSON.parse(window.localStorage.getItem(PROFILE_STORAGE_KEY) || "null");
  } catch {
    savedProfile = null;
  }
  if (savedProfile?.version === 1 && savedProfile.profile) {
    state.profile = normalizeProfile(savedProfile.profile);
    state.profileDraft = normalizeProfile(savedProfile.profile);
    state.profileActive = true;
  }
  state.query = params.get("q")?.slice(0, 120) || "";
  state.category = validCategories.has(params.get("category")) ? params.get("category") : "all";
  state.reward = validRewards.has(params.get("reward")) ? params.get("reward") : "all";
  state.ai = validAiPolicies.has(params.get("ai")) ? params.get("ai") : "all";
  state.competition = validCompetition.has(params.get("competition")) ? params.get("competition") : "all";
  state.sort = validSorts.has(params.get("sort")) ? params.get("sort") : state.profileActive ? "match" : "updated";
  if (state.sort === "match" && !state.profileActive) state.sort = "updated";
  state.planTaskId = params.get("task")?.slice(0, 180) || "";
  state.lang = params.get("lang") === "en" || (!params.has("lang") && savedLanguage === "en") ? "en" : "zh";
}

function bindEvents() {
  document.querySelector("#matcher-profile-form").addEventListener("submit", applyProfile);
  document.querySelector("#matcher-profile-reset").addEventListener("click", resetProfile);
  document.querySelector("#profile-category-chips").addEventListener("click", (event) => {
    const button = event.target.closest("[data-profile-category]");
    if (!button) return;
    const active = button.getAttribute("aria-pressed") !== "true";
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
    state.profileDraft = readProfileDraft();
  });
  document.querySelectorAll("#matcher-profile-form select").forEach((select) => {
    select.addEventListener("change", () => {
      state.profileDraft = readProfileDraft();
    });
  });
  document.querySelector("#profile-skill-keywords").addEventListener("input", () => {
    state.profileDraft = readProfileDraft();
  });
  document.querySelector("#task-grid").addEventListener("click", (event) => {
    const button = event.target.closest("[data-task-plan]");
    if (button) openTaskPlan(button.dataset.taskPlan);
  });
  document.querySelector("#task-plan-close").addEventListener("click", closeTaskPlan);
  document.querySelector("#task-plan-dialog").addEventListener("click", (event) => {
    if (event.target === event.currentTarget) closeTaskPlan();
    const copyButton = event.target.closest("[data-copy-plan]");
    if (copyButton) copyPlanText(copyButton.dataset.copyPlan);
  });
  document.querySelector("#task-plan-dialog").addEventListener("close", () => {
    state.planTaskId = "";
    updateUrl();
  });
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
    if (state.planTaskId) openTaskPlan(state.planTaskId, { updateUrl: false });
  } catch (error) {
    showLoadError(error);
  }
}

if (typeof document !== "undefined") init();
