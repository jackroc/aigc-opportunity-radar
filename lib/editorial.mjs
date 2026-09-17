export const SITE_URL = 'https://aigccreative.com';
export const EDITORIAL_DATE = '2026-09-17';
export const REPOSITORY = 'https://github.com/jackroc/aigc-opportunity-radar';
export const contentPath = (slug, lang = 'zh') => `${lang === 'en' ? '/en' : ''}/${slug}/`;

// Editorial advice is maintained separately from the automatically mirrored
// opportunity data. No prize, deadline or test experience is invented here.
export const GUIDES = [
  {
    slug: 'choose-a-contest',
    zh: {
      title: '先筛资格，再看奖金：怎样选一场值得投入的比赛',
      description: '把参赛资格、AI 使用边界、交付工作量和奖励拆开比较，避免被奖池数字带偏。',
      intro: '同样是“创作比赛”，有人要一张图片，有人要完整短片，也有人要求可以运行的应用。把它们按奖金从高到低排列，不能告诉你哪一场适合自己。更有用的顺序是：先排除不能参加的，再比较能否按时交付，最后才看奖励。下面是一套可以直接用在雷达目录上的判断方法。',
      sections: [
        ['第一步：把硬条件写成可回答的问题', ['打开官方规则，逐项确认年龄、所在地区、个人或团队、在校身份、原创要求，以及是否允许已经公开的作品。不要把“全球开放”理解为所有组别都没有资格限制。', '如果规则要求已上线应用，而你现在只有演示视频，两者之间缺的是产品交付，不只是补一份报名表。把“已满足、需要补充、尚不明确”分开记录；尚不明确的关键资格，应先向主办方确认。']],
        ['第二步：单独检查 AI 的边界', ['“主题与 AI 有关”“允许 AI 辅助”和“必须用指定工具创作”是三件事。分别检查生成工具、后期修改、素材来源、过程记录和模型使用披露要求。', '目录中的“待确认”不是允许使用。若规则没有回答你准备怎样使用 AI，例如合成配音、生成角色或代码辅助，就把这个具体用法写进咨询问题，而不要只问一句“能不能用 AI”。']],
        ['第三步：按交付倒排时间', ['先列最小可提交版本，再估算制作、整理材料、检查和上传四段时间。工具试用、团队分工和账号审核也可能占用准备期。', '举个排期示例：还有十天，不应默认十天都能用于制作。可以先分两天验证方向、五天完成主体、一天检查成品，最后两天留给修改和提交。这只是规划示例；是否足够取决于你的作品和赛事要求。']],
        ['第四步：读清奖励的单位', ['总奖池不是单个参赛者的奖金，最高奖也不是参与即可获得的收益。把现金、证书、算力额度、展示机会分别记录，并检查名额、领取条件和可能发生的报名成本。', '时间投入已经很大时，免费报名也不等于没有成本。比较两个机会时，先比较作品能否同时服务于你的作品集、技能目标或已有项目，再考虑名次带来的额外收益。']],
        ['把目录当作筛选工具，把规则当作提交依据', ['先用类别缩小范围，再看报名状态和费用；点进官网复核剩下的少数候选。雷达的“核验日期”是资料中的记录日期，不表示维护者今天重新访问过每一个页面。', '最后留下一个简单结论：我满足哪些条件、还缺什么、准备交付什么、最晚何时提交。无法写清这些问题的机会，先放回候选列表，通常比立刻开始完整制作更节省时间。']],
      ],
    },
    en: {
      title: 'Choose a contest by eligibility and effort, then compare prizes',
      description: 'A practical screening order for eligibility, AI rules, deliverables and rewards before committing to a creative contest.',
      intro: 'A still image, a finished film and a working application are all creative submissions, but they require different preparation. Ranking their prize pools does not tell you which one fits. First rule out entries you cannot make, then check whether you can deliver on time, and only then compare rewards.',
      sections: [
        ['Turn eligibility into answerable questions', ['Read the official rules for age, region, individual or team entry, student status, originality and previous publication. “Worldwide” does not establish eligibility for every division.', 'A requirement for a published application is a product-delivery requirement, not merely a missing form if you only have a video. Mark each condition as met, needs work or unclear. Ask the organizer about unresolved conditions before producing the full entry.']],
        ['Check the AI boundary separately', ['An AI theme, permission to use AI assistance and a requirement to use a named tool are different conditions. Check generation tools, editing, source material, process evidence and disclosure.', 'An unknown policy is not permission. Ask about the use you actually intend—such as synthetic narration, generated characters or coding assistance—instead of asking only whether AI is allowed.']],
        ['Schedule backward from the deliverable', ['Define the smallest complete submission, then estimate production, packaging, checking and upload time separately. Tool access, team coordination and account review can also consume the preparation window.', 'For example, a ten-day window could reserve two days for a feasibility sample, five for production, one for checking and two for corrections and submission. This is a planning example, not a claim that every entry can be completed in ten days.']],
        ['Read the unit behind the reward', ['A total pool is not a per-person award, and a maximum award is not expected income. Separate cash, certificates, compute credits and exposure; check available places, eligibility for payment and entry costs.', 'A free entry can still consume significant time. Compare how the work supports your portfolio, skills or an existing project before treating a possible prize as the main reason to participate.']],
        ['Use the directory to shortlist and the rules to submit', ['Filter by category, status and fee, then check the official pages of the remaining candidates. A verification date is a date in the source record; it does not mean the maintainer revisited every page today.', 'Finish with four answers: which conditions you meet, what is missing, what you will deliver and when you will submit. If these remain unclear, keep the opportunity on a shortlist instead of starting full production.']],
      ],
    },
  },
  {
    slug: 'prepare-a-submission',
    zh: {
      title: '作品做好之后：整理一份能提交的 AIGC 参赛包',
      description: '把成片、素材记录、创作过程和报名信息组织起来，减少临近截止时的返工。',
      intro: '完成作品与完成提交之间，还有一段容易被低估的工作。文件格式不符、链接权限错误、过程记录缺失，都可能让一个已经完成的作品无法按计划提交。这篇指南给出通用的整理顺序，具体材料仍应以你所参加比赛的官方要求为准。',
      sections: [
        ['先把规则转成提交清单', ['将规则中的要求分成作品规格、配套材料、过程说明和报名信息四组。例如时长、分辨率和格式属于作品规格，简介和封面属于配套材料。不要把其他赛事的模板直接当成本场要求。', '给每项要求记下出处、自己的文件名与完成状态。出现“可能需要”的项目时，先核实规则，不要为了显得完整而上传无关的私人材料。']],
        ['保留能解释创作过程的记录', ['在制作过程中保存关键版本、使用工具、重要提示词或参数、人工修改的主要步骤。记录的目标是解释作品如何形成，不是堆满所有聊天历史。', '如果使用第三方音乐、字体、图片或团队成员提供的素材，整理来源和对应使用条件。公开下载不等于可以用于所有参赛或商业场景；遇到不清楚的条款，应换用范围明确的素材或向提供方核实。']],
        ['把最终成品与过程文件分开', ['用独立文件夹保存最终提交版本，避免把测试片段当成成片。文件名可以包含作品名、用途和版本，例如 title-film-v03.mp4；不要只用“最终版”“最终版2”来区分。', '交付前用目标平台或常见播放器重新打开文件，检查开头与结尾、字幕、画幅、声音和损坏问题。如果规则允许分享链接，用退出登录后的窗口检查是否能访问。']],
        ['做一次模拟提交', ['提前走一遍表单，看看是否需要团队成员确认、额外证明、文字长度限制或大文件上传。保存草稿不等于报名成功，上传完成也不一定等于最终提交。', '给上传留出可重新导出和重传的时间。记录赛事给出的截止时区与具体时刻；只有日期、没有时刻的条目，应回到主办方页面确认，不能默认当天 23:59。']],
        ['提交后留下可核对的凭据', ['保存提交编号、确认页面或确认邮件，并记录最终文件版本。后续修改先看比赛是否允许更新，不要用新文件覆盖已经锁定的共享链接却不保留记录。', '雷达只帮助发现和理解机会，不代收作品，也不替主办方确认报名结果。判断是否提交成功，仍应以官方平台的最终状态为准。']],
      ],
    },
    en: {
      title: 'From finished work to a complete AI-assisted submission',
      description: 'Organize final files, source records, process notes and entry information before the deadline becomes an upload emergency.',
      intro: 'Finishing the creative work does not finish the submission. An incompatible file, inaccessible link or missing process note can still interrupt delivery. Use this general packaging workflow alongside the official requirements of your particular contest.',
      sections: [
        ['Turn the rules into a delivery checklist', ['Separate work specifications, supporting material, process evidence and entry information. Duration and format are specifications; a description and cover are supporting materials. Another contest’s checklist is not evidence of what this one requires.', 'Record the rule source, your corresponding file and its status. Verify ambiguous requirements rather than uploading unrelated personal documents to make the entry look complete.']],
        ['Keep useful process evidence', ['Save key versions, tools, important prompts or parameters and the major human editing steps during production. The aim is to explain how the result was made, not to export every conversation.', 'Record the sources and stated use conditions of third-party music, fonts, images and team-provided assets. Public download availability does not establish permission for every submission or commercial use. Clarify uncertain conditions or use material with a clearly suitable scope.']],
        ['Separate final assets from working files', ['Keep final delivery assets in their own folder so a test clip does not become the submitted film. Names such as title-film-v03.mp4 communicate more than “final-final”.', 'Reopen the export and check its beginning and ending, subtitles, aspect ratio, audio and file integrity. If links are accepted, test access in a signed-out window.']],
        ['Rehearse the submission path', ['Inspect the form early for team confirmations, extra evidence, text limits and file upload restrictions. A saved draft is not necessarily a completed entry; a finished upload may still need a final submit action.', 'Reserve time for a new export and upload. Record the stated time zone and exact deadline. When a listing gives only a date, confirm the time with the organizer instead of assuming 23:59.']],
        ['Keep a submission receipt', ['Save an entry number, confirmation page or email alongside the final file version. Before changing an already submitted link, check whether revisions are allowed and retain the earlier version.', 'The radar helps discover and interpret opportunities. It does not collect entries or confirm submission on an organizer’s behalf. The official platform’s final state is the relevant confirmation.']],
      ],
    },
  },
  {
    slug: 'public-bounty-preflight',
    zh: {
      title: '公开赏金任务：开工前先确认这六件事',
      description: '区分开放 Issue、可领取赏金和明确验收，用小范围确认减少无效投入。',
      intro: '公开 Issue 让你看见需求，但“仍然开放”并不等于奖金仍有效、没有其他人接手，或任何提交都会获得报酬。雷达的任务页把来源、可见竞争和 AI 规则放在一起，是为了帮助做决定；它不是收益承诺。',
      sections: [
        ['1. 确认任务现在还需要解决', ['先读最新讨论，而不只看标题和最初描述。寻找已经合并的实现、重复问题、范围变更以及维护者最近的回复。如果任务存在很久，尤其需要确认需求是否仍然有效。']],
        ['2. 把赏金确认与任务状态分开', ['开工前确认金额、币种、领取条件、支付主体以及是否已被认领。目录标注金额待确认时，不要把显示的数字当成付款承诺。', '可见评论数仅反映公开讨论，不等于真实参与人数。很多评论可能是需求交流，一个人也可能多次留言；它可以帮助你安排阅读优先级，不能换算成中标概率。']],
        ['3. 写清最小验收结果', ['将需求拆成可验证的行为、输入输出和测试方法。先确认需要代码、设计稿、文档还是部署后的服务，以及应提交到哪个分支或入口。', '一个简短的确认可以包含：准备解决的范围、打算如何验证、预计交付内容，以及希望确认的赏金条件。不要先完成几天工作，才发现双方对“完成”的定义不同。']],
        ['4. 单独问清 AI 与信息使用要求', ['项目允许公开贡献，不代表允许把未公开资料传给任意模型服务。核对 AI 辅助、外部依赖、许可证和数据使用边界。规则没有写清时，先问你打算采用的具体方法。', '本站任务助手可以帮助整理计划，但生成的回复不能替代维护者确认，也不能证明某个任务一定可做或可领奖。']],
        ['5. 先做小验证，再扩大投入', ['先验证能否运行项目、复现问题以及执行测试。若安装环境就无法完成，应该尽早反馈，而不是继续承诺完整交付。', '把环境验证与正式实现分开安排，给自己一个明确的继续或停止节点。不要用已经投入的时间，代替对后续工作是否仍有价值的判断。']],
        ['6. 留下交付和沟通记录', ['提交说明应包含改了什么、如何验证、尚存什么限制，并链接到相关讨论。等待维护者按约定验收；不要把提交 PR、PR 合并和赏金到账视为同一件事。', '雷达不托管款项、不收取任务佣金，也不参与任务验收。涉及任务条件和付款的问题，应联系官方任务发布者。']],
      ],
    },
    en: {
      title: 'Six checks before starting a public bounty task',
      description: 'Separate an open issue from an available bounty and agreed acceptance criteria before committing substantial work.',
      intro: 'A public issue reveals a request. An open state does not prove that funding remains available, nobody else has claimed it or every submission will be paid. The task directory brings source, visible discussion and AI-policy signals together to support a decision, not to promise income.',
      sections: [
        ['1. Check whether the work is still needed', ['Read recent discussion as well as the original description. Look for merged implementations, duplicates, scope changes and maintainer responses. Long-standing requests especially need current confirmation.']],
        ['2. Confirm the bounty independently', ['Check the amount, currency, claiming conditions, payer and whether someone already holds the task. A displayed amount marked unconfirmed is not a payment commitment.', 'A comment count measures visible discussion, not competitors. One person may comment repeatedly and many comments may clarify requirements. Use it to prioritize reading, not to calculate a probability of being selected.']],
        ['3. Agree on a minimum acceptance result', ['Describe testable behavior, inputs, outputs and a verification method. Confirm whether the deliverable is code, a design, documentation or a deployed service, and identify the expected submission destination.', 'A concise clarification can state intended scope, verification, deliverables and the bounty conditions you need confirmed. Avoid spending days implementing before discovering that “finished” means different things to each party.']],
        ['4. Clarify AI and information boundaries', ['Permission to contribute publicly does not establish permission to send private material to arbitrary model services. Check AI assistance, dependencies, licensing and data-use conditions for the particular task.', 'The radar’s assistant can organize a plan. Its generated answer cannot replace maintainer agreement or prove that a task will be accepted and paid.']],
        ['5. Validate a small slice first', ['Check that you can run the project, reproduce the problem and execute its tests before taking on the full change. If the environment cannot be made to work, report that limitation early.', 'Separate feasibility from implementation and set a clear decision point for continuing. Time already spent is not evidence that further work will be useful.']],
        ['6. Keep delivery and discussion records', ['Explain what changed, how it was verified and what remains limited; link to the relevant discussion. Submitting a pull request, merging it and receiving a payment are separate events.', 'The radar does not hold payments, charge a task commission or make acceptance decisions. Discuss task conditions and payment with the official task publisher.']],
      ],
    },
  },
];

export const INFORMATION = {
  about: {
    zh: {
      title: '关于雷达与收录方法', description: '说明目录来源、核验日期、AI 政策标签和本站指南的编辑原则。',
      intro: 'AIGC 机会雷达是一个社区维护的创作机会索引，官网代码由 jackroc/aigc-opportunity-radar 维护。比赛数据来自 Awesome AIGC Creative Contests，公开任务数据来自 AIGC Opportunity Tasks。本站不是赛事主办方、招聘方或付款平台。',
      sections: [
        ['目录怎样更新', ['定时工作流计划每 15 分钟检查一次上游数据；实际执行可能延迟。通过校验的变更进入版本库并触发网站构建，首页和任务页将同一份数据输出为可直接阅读的 HTML，浏览器再提供搜索与筛选。', '核心赛事与主动选择的扩展目录分别维护。扩展条目可能是允许 AI 参与的一般机会，并不一定以 AIGC 为主题。来源暂不可用时保留最近发布的资料；同步不等于重新核验每一条规则。']],
        ['怎样理解日期和标签', ['核验日期来自条目的 verified_on 或来源检查字段。页面构建日期与资料核验日期是不同的时间。一个很久没有更新的官方说明，不会因为重新同步而自动变成今天核验。', '报名状态按已知日期计算，具体截止时刻和时区以官方规则为准。费用或 AI 政策未说明时保留未知，不将未知写成免费或允许。公开任务的开放状态、可见评论和赏金是否确认也分别呈现。']],
        ['本站增加了什么', ['参赛指南是独立维护的编辑内容，解释选择、交付与开工前的判断方法，不把自动目录改写成虚构的亲历评测。指南中的规划示例会明确说明是示例。', 'AI 工具可以辅助整理、翻译和开发；事实仍需回到具体来源，不能用生成内容冒充主办方承诺、真实奖金领取记录或用户评价。']],
        ['纠错、利益关系与使用边界', ['发现失效链接、过期信息或不准确说明，可以通过联系页面向对应仓库反馈。目录来源与本站编辑内容分别维护，修正源数据才能进入后续自动同步。', '本站不代收报名费、不托管赏金，也不保证参赛或接单结果。广告或商业合作如在后续引入，应明确区分于目录和编辑内容。当前版本仅保留 AdSense 验证信息，没有加载广告投放脚本。']],
      ],
    },
    en: {
      title: 'About the radar & our methodology', description: 'Sources, verification dates, AI-policy labels and the distinction between the live directory and editorial guidance.',
      intro: 'AIGC Opportunity Radar is a community-maintained discovery directory. The website is maintained in jackroc/aigc-opportunity-radar. Contest records come from Awesome AIGC Creative Contests; public task records come from AIGC Opportunity Tasks. We are not an organizer, recruiter or payment platform.',
      sections: [
        ['How the directory updates', ['Scheduled workflows aim to check upstream data every fifteen minutes; actual execution may be delayed. Validated changes are versioned and trigger a website build. The homepage and task page publish readable HTML from that same data, with browser search and filters added afterward.', 'The core list and explicitly selected extensions are separate. An extension may be a general opportunity that accepts AI work rather than an AI-themed contest. Source failures retain the latest published records. Synchronization is not a new verification of every rule.']],
        ['What dates and labels mean', ['Verification dates come from a record’s verified_on or source-check fields. A page build date is different. Reading an old record again does not make its verification current.', 'Status follows known calendar dates; exact deadlines and time zones require the official rules. Unstated fees and AI policies remain unknown. An open task, its visible comments and a confirmed reward are also separate signals.']],
        ['What the website adds', ['Separately maintained guides explain opportunity selection, submission preparation and task preflight. Automatically mirrored records are not presented as first-hand reviews. Planning examples are explicitly identified as examples.', 'AI tools may help organize, translate and develop content. Factual claims still require a source and must not invent organizer commitments, payment experiences or user testimonials.']],
        ['Corrections and independence', ['Report unavailable links, outdated information or incorrect explanations through the contact page. Source records and website editorial content are maintained separately; correcting the source lets future syncs carry the change.', 'We do not collect entry fees, hold bounty funds or guarantee outcomes. Future advertising or commercial placements must be distinguished from editorial content. This version retains AdSense verification information without loading ad-delivery scripts.']],
      ],
    },
  },
  privacy: {
    zh: {
      title: '隐私与本地数据说明', description: '浏览、偏好、任务助手、可选云端同步和外部服务的数据处理方式。',
      intro: '本说明覆盖 aigccreative.com 雷达主站。游戏子站及外部赛事、任务平台另有说明。浏览公开目录不要求注册；任务助手会涉及额外的本地存储和可能启用的服务端处理。',
      sections: [
        ['浏览与托管', ['Vercel 托管网站，访问请求会向托管基础设施提供 IP 地址、请求头等技术信息，服务商可能处理运行与安全日志。我们不将“无需登录”描述为完全不处理数据。', '搜索和筛选在浏览器内执行，部分筛选条件写入地址栏，便于分享。复制页面地址前请检查是否包含不希望公开的搜索词。打开官方入口后适用对应平台的隐私规则。']],
        ['保存在浏览器里的内容', ['主题、语言和任务匹配画像使用 localStorage；任务会话主要保存在 IndexedDB，无法使用时可能退回本地存储。任务页还会生成随机设备标识，用于区分设备会话，并非浏览器指纹。', '可以通过页面的画像清除、会话删除功能管理相应记录，也可以清除本站浏览器数据。清除浏览器数据不等于删除可能已同步到云端的记录，还可能使你失去访问原设备会话的能力。']],
        ['可选云端历史和模型服务', ['如果部署启用了 Supabase，会话标题、消息、任务上下文、设备标识及时间等可同步至云端。代码使用 HttpOnly 设备会话 Cookie 识别该设备；未配置云端时使用本地存储。助手界面显示当前存储状态。', '选择平台 AI 或自带 API 时，发送的任务上下文和消息会经本站服务端传给相应模型服务。自带 API 密钥用于该请求；界面代码将其保留在当前页面内存中，而不是作为会话正文保存。不要把密码、证件或无权提供的任务资料发给助手。', '对话删除会尝试删除该会话的本地与已配置云端记录；服务商日志、备份及模型服务的数据处理仍受各自政策约束。当前没有可承诺的统一自动删除期限。需要涉及已提交信息的处理，可通过联系入口提出不含敏感信息的请求。']],
        ['广告、外部反馈与更新', ['本版本只提供 AdSense 所有权验证标签和 ads.txt，不加载 Google 广告投放脚本。验证信息不是用户同意机制。以后启用广告时，需要按实际合作方补充 Cookie、标识符和同意管理说明。', 'GitHub 反馈可能公开，请勿在 Issue 中贴密钥、设备会话 Cookie、个人证件或私人聊天记录。网站数据处理方式变化时会更新本页；页面日期是说明修订时间。']],
      ],
    },
    en: {
      title: 'Privacy & browser-stored data', description: 'Browsing, preferences, the task assistant, optional cloud history and external services.',
      intro: 'This notice covers the radar at aigccreative.com. The games subdomain and external contest/task platforms have separate notices. Public browsing does not require registration; the task assistant involves additional local storage and potentially server-side services.',
      sections: [
        ['Browsing and hosting', ['Vercel hosts the site. Requests provide IP addresses, headers and other technical information to its infrastructure; operational and security logs may be processed. No-login browsing is not the same as processing no data.', 'Search and filters run in the browser. Some filter values are placed in the URL for sharing, so check a copied address for search terms you do not want to disclose. External official links lead to services with their own privacy practices.']],
        ['Data stored in your browser', ['Theme, language and task-matching preferences use localStorage. Conversations primarily use IndexedDB with a local-storage fallback. The task page creates a random device identifier for device sessions, not a browser fingerprint.', 'Use profile-clear and conversation-delete controls for the corresponding records, or clear this site’s browser data. Clearing local data does not delete previously synced cloud records and may remove access to an earlier device session.']],
        ['Optional cloud history and model services', ['When Supabase is configured, conversation titles, messages, task context, device identifiers and timestamps may sync to cloud storage. An HttpOnly device-session cookie identifies the device. Without cloud configuration, storage remains local; the assistant displays its current storage state.', 'Platform AI and bring-your-own-API requests send task context and messages through this site’s server to the selected model provider. A supplied API key is used for that request and kept in page memory by the interface, rather than saved as conversation text. Do not send credentials, identity documents or task information you are not authorized to disclose.', 'Deleting a conversation attempts to remove its local and configured cloud records. Provider logs, backups and model-service processing remain governed by their respective policies. We cannot promise a single automatic retention period. Use the contact channel for a non-sensitive request concerning information you submitted.']],
        ['Advertising, feedback and changes', ['This version supplies an AdSense ownership meta tag and ads.txt without loading Google ad-delivery scripts. Verification is not a consent mechanism. Advertising would require disclosures and consent controls reflecting the actual partners, cookies and identifiers.', 'GitHub feedback may be public. Never post API keys, session cookies, identity documents or private conversation records in an issue. This notice changes when site practices change; its date is the notice revision date.']],
      ],
    },
  },
  contact: {
    zh: {
      title: '联系、纠错与内容反馈', description: '将网页故障、错误赛事信息和内容权利问题反馈给相应维护者。',
      intro: '官网功能、比赛资料和任务资料分别维护。请选择下方对应入口，提供相关页面、具体问题和支持更正的公开依据。',
      sections: [
        ['官网和指南', ['页面无法使用、指南存在错误、隐私疑问或本站展示素材的权利问题，请提交到官网仓库。注明受影响的网址、问题表现与希望如何更正。', '公开 Issue 不适合处理敏感信息。如果需要私下提供资料，先用不含个人细节的描述请求合适渠道。本站尚未公布独立客服邮箱，不要向自称维护者的陌生账号发送账号凭据。']],
        ['赛事或公开任务资料', ['赛事日期、费用、资格或入口有误，请向比赛数据仓库反馈官方依据。任务状态、来源和赏金标签的问题交给任务数据仓库；实际报名、交付验收和付款问题应联系官方发布者。', '权利反馈请指出具体页面和素材、它与原作的关系及可公开的依据。仓库开源不意味着每项第三方材料都可自由使用；收到有依据的反馈需要进一步核实处理。']],
      ],
    },
    en: {
      title: 'Contact, corrections & content reports', description: 'Route website failures, incorrect opportunity records and rights concerns to the appropriate maintainers.',
      intro: 'The website, contest dataset and task dataset have separate maintainers. Use the corresponding link below with a page URL, a specific issue and public evidence for a correction.',
      sections: [
        ['Website and guides', ['Report broken website behavior, guide corrections, privacy questions or rights concerns about site material to the website repository. Identify the affected URL, what happened and the correction requested.', 'Public issues are not suitable for sensitive information. Start with a non-sensitive description and request an appropriate private channel when needed. No separate support email is currently published; do not send credentials to an unsolicited account claiming to be a maintainer.']],
        ['Contest or public-task records', ['For contest dates, fees, eligibility or official links, send the contest repository supporting official evidence. Task states, sources and reward labels belong in the task-data repository. Registration, acceptance and payment questions belong with the official publisher.', 'A rights report should identify the page and material, its relationship to the original and available public evidence. An open-source repository does not clear every third-party asset; substantiated reports need assessment and correction.']],
      ],
    },
  },
};
