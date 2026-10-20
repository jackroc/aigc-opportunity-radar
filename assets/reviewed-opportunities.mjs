// Independently researched editorial records. Upstream sync never rewrites this file.
// A null opening date means it was not established, not that the event opens today.
export const RESEARCH_DATE = '2026-10-20';
const pair = (zh, en) => ({ zh, en });

export const OPPORTUNITY_REVIEWS = [
  {
    id: 'jingrui-ai-2026', start_date: '2026-09-17', deadline: '2026-11-22', categories: ['video'],
    title: pair('鲸锐 AI 创作大赛 2026', 'Jingrui AI Talent Competition 2026'),
    organizer: pair('虎鲸文娱集团', 'Hujing Entertainment'),
    region: pair('线上；中国居民身份证及 +86 手机号要求', 'Online; Chinese resident ID and +86 phone required'),
    timezone: pair('北京时间 23:59', '23:59 Beijing time (UTC+8)'),
    eligibility: pair('个人或团队；参赛者或团队代表须持有效中国居民身份证，并提供 +86 手机号。', 'Individuals or teams; the entrant or team representative needs a valid Chinese resident ID and a +86 phone number.'),
    fee: pair('官网未列报名费；制作、工具及线下安排需另行核对', 'No entry fee listed; check production, tool and any in-person costs'),
    prize: pair('税前总奖金池人民币 1000 万元；最高单项奖 200 万元', 'RMB 10 million total before tax; highest individual award RMB 2 million'),
    official_url: 'https://jingrui-ai-competition.youku.com/',
    rules_url: 'https://jingrui-ai-competition.youku.com/?view=rules',
    facts: [
      pair('成片至少 10 分钟，16:9 横版，至少 1920×1080，MOV 或 MP4，不能有 AI 工具品牌水印。', 'A complete film of at least 10 minutes, landscape 16:9, at least 1920×1080, MOV or MP4, without AI-tool branding watermarks.'),
      pair('AI 工具不限；原创完整故事；故事阐述至少 1000 字，简介 200 字以内。', 'No specified AI tool; an original complete story, a story statement of at least 1,000 Chinese characters and a biography within 200 characters.'),
      pair('赛事首发；提交后不能修改、撤回。获奖作品另有独家展映及合作优先洽谈条款。', 'Competition premiere required; submitted entries cannot be edited or withdrawn. Awarded work has separate exclusive-screening and first-negotiation terms.'),
    ],
    angle: pair('先判断能否交付十分钟故事，再考虑奖池。', 'Decide whether a ten-minute story is deliverable before weighing the prize pool.'),
    fit: pair('适合已有短片制作管线、能持续控制人物与叙事的个人或团队。只有几段漂亮镜头的作品，需要先补足故事结构。', 'A fit for creators with a repeatable short-film workflow and character continuity. A handful of polished shots still needs a complete story.'),
    effort: pair('本站建议先做一段包含对白、动作和场景衔接的测试，再按实际返工量估算全片。不要把十分钟简单换算为若干次生成。', 'Our planning suggestion: test a scene with dialogue, action and a transition, then estimate the whole film from the revisions it actually takes. Generation count alone is not a production estimate.'),
    steps: [pair('先核对证件、手机号与首发条件，保存当前规则。', 'Check identity, phone and premiere conditions; save the current terms.'), pair('锁定故事、人物设定与完整分场，再开始批量制作。', 'Lock the story, character references and scene outline before batch production.'), pair('制作成片及文字材料；提交前离线检查一遍，因为提交后不能修改。', 'Finish the film and written materials; review them offline before an irreversible submission.')],
    unknowns: pair('未核实统一的工具成本或线下差旅承担方式；税务、授权范围及最新规则请在提交前逐项阅读。', 'Tool costs and travel coverage were not established. Read current tax, licensing and submission terms before entering.'),
    sources: [{ label: '优酷 · 赛事首页与赛程', url: 'https://jingrui-ai-competition.youku.com/' }, { label: '优酷 · 活动细则', url: 'https://jingrui-ai-competition.youku.com/?view=rules' }],
  },
  {
    id: 'kling-glimmer-2026', start_date: '2026-09-04', deadline: '2026-11-01', categories: ['video'],
    title: pair('“看见微光”可灵 AI 公益影像大赛', 'Kling AI “See the Glimmer” Public-interest Film Contest'),
    organizer: pair('可灵 AI、快手公益', 'Kling AI and Kuaishou Public Welfare'),
    region: pair('线上；个人与团队', 'Online; individuals and teams'),
    timezone: pair('北京时间当日 24:00；以官方投稿状态为准', '24:00 Beijing time on the closing date; confirm successful submission'),
    eligibility: pair('面向关心公益的个人或团队；作品须显著使用可灵 AI，并符合完整活动规则。', 'Individuals or teams interested in public-interest stories; meaningful Kling AI use and the full activity rules apply.'),
    fee: pair('活动规则未列报名费；生成工具用量成本另计', 'No entry fee listed in the activity rules; tool usage may cost extra'),
    prize: pair('10 个现金奖项合计人民币 32 万元；最高 10 万元；灵感值单列', 'RMB 320,000 across 10 cash awards; highest RMB 100,000; platform credits are separate'),
    official_url: 'https://klingai.com/app/activity-zone/brand-activity?id=924015525368696877',
    rules_url: 'https://klingai.com/app/activity-zone/brand-activity?id=924015525368696877',
    facts: [pair('原创公益视频，至少 1 分钟、不低于 1080P，须有准确完整的中文字幕。', 'An original public-interest video, at least one minute and 1080p, with accurate complete Chinese subtitles.'), pair('AI 生成内容应占作品主体时长，或构成作品核心创意；官方未写固定百分比。', 'Generated material should occupy the main duration or form the core creative idea. The rules do not give a fixed percentage.'), pair('从官方活动页投稿；站外分享与添加话题不能替代正式投稿。', 'Submit on the official activity page; social posting and hashtags do not replace entry.')],
    angle: pair('用一个具体行动讲清公益价值，避免只有口号和奇观。', 'Show public value through a concrete action rather than a slogan montage.'),
    fit: pair('适合愿意围绕社区互助、环境或助老等题材做短篇叙事的创作者。选择你能核实的真实背景；合成的情节与人物要清楚区分。', 'Suitable for a short narrative about community support, the environment or care. Verify the factual background and distinguish synthetic scenes and people.'),
    effort: pair('本站建议先写出“谁遇到什么障碍、一个行动怎样改变结果”，再做少量连贯场景。把字幕、声音、素材权利和投稿检查计入工作量。', 'Our suggestion: define a person, an obstacle and an action that changes the outcome, then build a few coherent scenes. Budget for subtitles, sound, rights and submission checks.'),
    steps: [pair('选择具体议题，并列出能够查证的事实与纯属创作的部分。', 'Choose a specific issue and separate verifiable facts from creative invention.'), pair('用可灵 AI 完成核心表达，记录生成、选片与人工剪辑的分工。', 'Use Kling AI for the core expression and record generation, selection and human editing.'), pair('检查时长、1080P 和中文字幕；官网投稿后保留回执。', 'Check duration, 1080p and Chinese subtitles, then preserve the official submission receipt.')],
    unknowns: pair('官方规则以活动页图片展示。本次读取了赛程、作品要求和奖项；文件体积、全部授权条款及领奖条件需在投稿页再核对。', 'Rules are shown as images on the activity page. We read the schedule, work requirements and awards; check upload limits, full licensing and payment conditions before submitting.'),
    sources: [{ label: '可灵 AI · 官方活动规则、赛程与奖项（图片）', url: 'https://klingai.com/app/activity-zone/brand-activity?id=924015525368696877' }],
  },
  {
    id: 'elevenlabs-the-search-2026', fee_kind: 'free', start_date: '2026-10-05', deadline: '2026-11-01', categories: ['video', 'audio'],
    title: pair('ElevenLabs The Search：AI 广告与原创 Jingle 挑战', 'ElevenLabs The Search: AI Ad and Original Jingle Competition'),
    organizer: pair('ElevenLabs / ElevenCreative', 'ElevenLabs / ElevenCreative'),
    region: pair('全球征集；个人或团队，须核对完整资格条款', 'Global call; individuals or teams, subject to the full eligibility terms'),
    timezone: pair('官方写明 23:59 PST；按官方时区提前安排提交', 'Official announcement specifies 23:59 PST; preserve that time-zone wording'),
    eligibility: pair('至少 18 岁且达到居住地成年年龄；个人或合资格团队。制裁地区、政府工作人员及亲属等另有限制，须逐项阅读完整条款。', 'At least 18 and the local age of majority; individuals or eligible teams. Regional sanctions and exclusions for government personnel, relatives and others apply.'),
    fee: pair('免费投稿；官方明确不要求付费订阅。自选升级及制作成本自行承担', 'Free entry; a paid subscription is not required. Optional upgrades and production costs remain your responsibility'),
    prize: pair('总奖池 US$100,000，11 名获奖者；最高 US$50,000', 'US$100,000 across 11 winners; highest award US$50,000'),
    official_url: 'https://elevenlabs.io/blog/the-search-100000-for-the-worlds-catchiest-ad',
    rules_url: 'https://elevenlabs.io/creative/thesearch/terms',
    facts: [pair('15–45 秒、16:9 的全新原创广告；出现虚构产品名称、产品形象和标志。', 'A new original 15–45-second, 16:9 ad featuring a fictional product name, product image and logo.'), pair('原创 Jingle 须在 ElevenCreative 制作，并提交可公开访问的音乐链接。', 'The original jingle must be made in ElevenCreative, with a public music link supplied.'), pair('按官方要求添加水印、话题和账号标记，在指定平台中至少两个公开发布，再填写表单。', 'Use the required watermark, hashtags and account tags, publish on at least two specified platforms, then complete the entry form.')],
    angle: pair('先证明声音记忆点成立，再把画面做完整。', 'Make the audio hook work before expanding the visuals.'),
    fit: pair('适合有短广告构思、能把声音与画面统一起来的创作者。它要求公开发布，不适合同时保留首发资格给另一项排他赛事的同一作品。', 'A fit for short-form creators who can unite sound and visuals. Public posting needs to be reconciled with any exclusive-premiere plan for the same work.'),
    effort: pair('本站建议按约 30 秒做一次纸上样片：一句产品承诺、一个视觉动作、一个可重复的声音钩子。先排出完整时间轴，再决定需要多少素材。', 'Our suggestion: make a paper edit for roughly 30 seconds around one product promise, one visual action and one repeatable audio hook. Build the timeline before counting assets.'),
    steps: [pair('建立虚构品牌与原创声音概念，核对人物、商标和音乐素材来源。', 'Define the fictional brand and an original audio concept; check people, marks and music sources.'), pair('在 ElevenCreative 制作 Jingle，完成 15–45 秒横版广告并加入官方水印。', 'Make the jingle in ElevenCreative and finish the landscape ad with the official watermark.'), pair('完成两个指定平台的公开发布，检查链接可访问，再提交官方表单。', 'Publish on two supported platforms, verify the links and submit the official form.')],
    conflict: pair('官方博客把开始日写为 10 月 1 日，完整条款写为 10 月 5 日；平台名单也有四个平台与五个平台两种写法。为减少歧义，可在 X、Instagram、TikTok、YouTube 中选两个，并按当前表单复核所需链接。', 'The blog gives October 1 as the opening date; full terms give October 5. Platform lists also vary. Choose two of X, Instagram, TikTok and YouTube, which appear in both lists, and confirm the current form requirements.'),
    unknowns: pair('完整条款另要求原始视频的 Frame.io 或 Google Drive 可观看链接、AI 创作说明；非英语作品须满足英文配音或字幕要求。禁止儿童声音。账号地区及其他资格须由参赛者核对。', 'Full terms additionally require a viewable raw-video link on Frame.io or Google Drive and a process description. Check English voice/subtitle rules and the prohibition on children’s voices, as well as personal eligibility.'),
    sources: [{ label: 'ElevenLabs · 官方公告（10 月 12 日更新）', url: 'https://elevenlabs.io/blog/the-search-100000-for-the-worlds-catchiest-ad' }, { label: 'ElevenCreative · 比赛入口', url: 'https://elevenlabs.io/creative/thesearch' }, { label: 'ElevenCreative · 完整参赛条款', url: 'https://elevenlabs.io/creative/thesearch/terms' }],
  },
  {
    id: 'ai-creativity-awards-2026', start_date: '2026-06-01', deadline: '2026-11-01', categories: ['image', 'video', 'audio', 'text', 'app'],
    title: pair('AI Creativity Awards 2026', 'AI Creativity Awards 2026'), organizer: pair('Graphic Competitions', 'Graphic Competitions'),
    region: pair('全球；受当地法律及支付可用性限制', 'Worldwide, subject to law and payment availability'), timezone: pair('官网列 11 月 1 日，精确截止时刻待确认', 'November 1 listed; exact cutoff time not established'),
    eligibility: pair('18 岁以上，或有可同意条款的监护人、学校或工作室代表；作品须实质使用 AI 并拥有投稿权利。', '18+, or an authorized guardian, school or studio representative; material AI involvement and sufficient submission rights required.'),
    fee: pair('收费：标准每件 £35；在校生及近期毕业生每件 £15，资格可能需证明', 'Paid: £35 standard; £15 for students and recent graduates, with possible proof of status'),
    prize: pair('奖项称号、电子证书及入选展示；官网明确没有现金奖', 'Award titles, digital certificates and a showcase; the organizer explicitly states there is no cash prize'),
    official_url: 'https://aicreativityawards.com/', rules_url: 'https://aicreativityawards.com/rules',
    facts: [pair('八类作品包括图像、影像、声音、写作、交互体验等；选与主要交付物相符的类别。', 'Eight categories cover image, motion, sound, writing and interactive work; choose by the main deliverable.'), pair('须说明使用的 AI 工具或模型及作用；可以投已有作品，但必须有充分权利。', 'Explain the tools or models and their role; existing work may be entered with sufficient rights.'), pair('大型视频、音频使用外部链接；链接须在评审及结果发布期间保持有效。', 'Large video and audio use external links, kept available through judging and results.')],
    angle: pair('这是一项付费展示型机会，先确认作品集目标。', 'Treat this as a paid recognition opportunity and decide on the portfolio goal first.'),
    fit: pair('适合已有完整作品、希望接受跨类别评审的创作者。以现金回报为目标时，官网明确的无现金奖设置应先进入你的预算判断。', 'Suitable for an existing finished project seeking cross-category recognition. A cash-return goal should account for the stated absence of cash awards.'),
    effort: pair('本站建议先做一次无需付款的材料检查：匿名打开作品链接，核对简介与真实流程，再确认最合适的单个类别，避免重复付费。', 'Our suggestion: preflight the materials before paying. Open the work signed out, match the description to the real process and choose the best single category before considering additional entries.'),
    steps: [pair('选定完整作品与类别，检查投稿权利和支付地区。', 'Choose the completed work and category; check rights and payment availability.'), pair('准备简明 AI 使用说明、图片或 PDF，以及音视频链接。', 'Prepare concise AI disclosure, images or PDF and any audio/video links.'), pair('核对费用及学生优惠资格，再完成官方提交。', 'Check the fee and any student eligibility, then finish the official entry.')],
    unknowns: pair('精确截止时区、个别类别的文件上限及个人支付可用性需在提交前确认；不把证书权益折算成现金。', 'Confirm the precise time zone, category-specific upload limits and payment availability. Recognition benefits are not cash.'),
    sources: [{ label: 'AI Creativity Awards · 首页与奖项', url: 'https://aicreativityawards.com/' }, { label: '官方资格与 AI 规则', url: 'https://aicreativityawards.com/rules' }, { label: '官方收费说明', url: 'https://aicreativityawards.com/fees' }],
  },
  {
    id: 'impossible-film-festival-2026', start_date: '2026-07-01', deadline: '2026-11-05', categories: ['video'],
    title: pair('I’Mpossible Film Festival 2026', 'I’Mpossible Film Festival 2026'), organizer: pair('Nima Media Ltd', 'Nima Media Ltd'),
    region: pair('国际征集，FilmFreeway 投稿', 'International call via FilmFreeway'), timezone: pair('精确截止时刻以 FilmFreeway 列表为准', 'FilmFreeway controls the exact submission cutoff'),
    eligibility: pair('人类主导的已完成 AI 影像；18 岁以下需监护人提交或明确批准，并符合所选类别要求。', 'Completed human-led AI films; under-18 entries need guardian submission or express approval, and category conditions apply.'),
    fee: pair('收费；具体类别与阶段金额以 FilmFreeway 为准，可申请个别费用减免', 'Paid; category and deadline rates on FilmFreeway; individual waivers may be requested'),
    prize: pair('入选标识、电子证书及类别奖；无保证现金价值', 'Selection laurels, digital certificates and category awards; no guaranteed cash value'),
    official_url: 'https://impossiblefilmfest.com/', rules_url: 'https://impossiblefilmfest.com/submission-terms/',
    facts: [pair('微电影类别 60–100 秒；短片 3–15 分钟；实验及概念类 1–15 分钟；不同类别条件不能混用。', 'Microfilm: 60–100 seconds; short film: 3–15 minutes; experimental/concept: 1–15 minutes. Category requirements differ.'), pair('AI 须实质参与表达；不接受仅随机镜头、工具展示或未完成实验。', 'AI must make a meaningful creative contribution; random montages, tool demonstrations and unfinished tests are not sufficient.'), pair('非英语作品须有英文字幕；说明 AI 工具、生成部分及其必要性。', 'Non-English films need English subtitles; describe AI tools, generated elements and their creative purpose.')],
    angle: pair('先确认类别匹配，再决定是否付费投稿。', 'Establish category fit before paying for a submission.'),
    fit: pair('适合已经完成作品、能说明 AI 如何服务叙事的作者。写实微电影、动画实验与音乐视频应分别对照类别，而非只按时长选择。', 'A fit for a finished film with an explainable creative use of AI. Realistic microfilms, animated experiments and music videos need different category checks.'),
    effort: pair('本站建议把片长、视觉风格、字幕与 AI 作用做成四行检查表。不符合某类时，先询问正确类别，通常比急着重剪更有用。', 'Our suggestion: write four checks for runtime, visual style, subtitles and AI contribution. Ask about a suitable category before an unnecessary recut.'),
    steps: [pair('按作品风格和时长核对类别，并读取完整提交条款。', 'Match style and runtime to a category and read the full terms.'), pair('整理英文字幕、AI 说明及音乐和肖像等授权记录。', 'Prepare English subtitles, AI disclosure and rights records for music and people.'), pair('到 FilmFreeway 复核费率和精确时刻，提交后保存记录。', 'Confirm the fee and exact cutoff on FilmFreeway, then preserve the entry record.')],
    unknowns: pair('本次未进入支付页核实个别费率。入选、展映、实物奖杯和未来合作均有条件，不等于必定获得。', 'We did not enter checkout to verify an individual rate. Selection, screening, physical trophies and future opportunities are conditional.'),
    sources: [{ label: 'I’Mpossible · 官方赛程与类别', url: 'https://impossiblefilmfest.com/' }, { label: 'I’Mpossible · 完整提交条款', url: 'https://impossiblefilmfest.com/submission-terms/' }],
  },
  {
    id: 'horizon-interactive-2026', scope: 'ai-compatible', start_date: null, deadline: '2026-12-11', categories: ['video', 'app'],
    title: pair('第 25 届 Horizon Interactive Awards：AI 影像与交互', '25th Horizon Interactive Awards: AI Video and Interactive Work'),
    organizer: pair('Horizon Interactive Awards', 'Horizon Interactive Awards'), region: pair('国际作品；按具体媒体类别投稿', 'International work, submitted by media category'), timezone: pair('官网列 12 月 11 日；精确时刻待确认', 'December 11 listed; exact cutoff time not established'),
    eligibility: pair('作品须在过去两年上线、发布或实质更新，或从未参加本奖项；AI 影像和 AI 辅助作品可选适当类别。', 'Work launched, published or substantially updated in the past two years, or never entered before; AI work is accepted in appropriate categories.'),
    fee: pair('收费：每件每个类别 US$60，不退还；增加类别需另付 US$60', 'Paid: US$60 per entry per category, non-refundable; each added category costs US$60'),
    prize: pair('金、银、铜奖及类别、全场荣誉；参赛并不保证获奖', 'Gold, Silver, Bronze and category/show honors; entry does not guarantee an award'),
    official_url: 'https://www.horizoninteractiveawards.com/entry-information', rules_url: 'https://www.horizoninteractiveawards.com/entry-information',
    facts: [pair('明确设有 AI-Native Video、AI-Hybrid Video 和 AI-Powered Learning 类别。', 'Dedicated categories include AI-Native Video, AI-Hybrid Video and AI-Powered Learning.'), pair('视频提交可访问的在线地址；应用可用演示视频或合适的应用商店链接。', 'Video entries use accessible online links; applications may use walkthroughs or appropriate public-store links.'), pair('网站类参赛链接应至少保持到 2027 年 3 月 1 日可访问。', 'Website entry URLs should remain available through March 1, 2027.')],
    angle: pair('已有成品的作品集评审机会，预算按类别累计。', 'A portfolio-review opportunity for finished work, with a fee for each category.'),
    fit: pair('适合已上线网站、交互体验或完成的 AI 影像。只拥有构想时，应先把可实际体验或观看的交付物做出来。', 'Suitable for a published website, interactive experience or completed AI film. An idea needs a reviewable deliverable first.'),
    effort: pair('本站建议准备一条能展示核心流程的演示路线，清楚交代受众、目标和实际完成的能力。没有真实用户结果时，说明测试范围即可。', 'Our suggestion: prepare a walkthrough of the core flow with its audience, goal and implemented capabilities. Describe the actual test scope rather than inventing user outcomes.'),
    steps: [pair('核对作品发布时间和最适合的媒体类别。', 'Check the release window and most suitable medium.'), pair('准备稳定链接、演示路线与项目说明，检查未登录访问。', 'Prepare a stable link, walkthrough and description; test signed-out access.'), pair('按所选类别计算总费用，并在截止前完成材料和付款。', 'Calculate the total by category and complete materials and payment before closing.')],
    unknowns: pair('本页未确认统一年龄限制、现金奖金或精确截止时区；需要时先向官网联系人询问。', 'We did not establish a universal age limit, cash prize or exact cutoff zone. Ask the organizer when these affect the decision.'),
    sources: [{ label: 'Horizon · 官方类别、费率与投稿说明', url: 'https://www.horizoninteractiveawards.com/entry-information' }],
  },
  {
    id: 'aimee-awards-2026', start_date: '2026-08-01', deadline: '2026-12-31', categories: ['audio'],
    title: pair('AIMEE Awards 2026–2027：AI 音乐与声音', 'AIMEE Awards 2026–2027: AI Music and Sound'), organizer: pair('The Academy of AI Music', 'The Academy of AI Music'),
    region: pair('线上提交；具体类别及地区资格须核对规则', 'Online submissions; verify category and regional eligibility'), timezone: pair('美国太平洋时间 23:59（PT）', '23:59 Pacific Time (PT)'),
    eligibility: pair('作品或相关活动须在 2026 年首次公开或发生；须有充分权利及 AI 声明。声音仿冒或无授权素材不符合资格，未达法定能力者需授权代表。', 'Work first made public, or qualifying activity occurring, in 2026; sufficient rights and AI disclosure required. Unauthorized voices or material are ineligible; legal-capacity requirements apply.'),
    fee: pair('收费：非会员每件 US$10；会员 US$20/年含一次投稿，二者不要混算', 'Paid: US$10 per non-member entry; US$20/year membership includes one entry'),
    prize: pair('音乐奖项与行业认可；本次读取页面未列统一现金奖池', 'Music awards and recognition; the reviewed pages list no universal cash prize pool'),
    official_url: 'https://academyofaimusic.com/', rules_url: 'https://academyofaimusic.com/rules/',
    facts: [pair('官网列出音乐、制作、AI 创新、教育与责任等八个领域；并非所有奖项都接收同一种文件。', 'Eight fields include music, production, AI innovation, education and responsibility; deliverables vary.'), pair('投稿窗口截至 2026 年 12 月 31 日，评审及颁奖安排跨入 2027 年。', 'Entries close December 31, 2026; judging and the ceremony continue in 2027.'), pair('普通单件投稿与年度会员是不同选项，会员不是所有创作者的必选步骤。', 'A single entry and annual membership are separate options; membership is not the only submission route.')],
    angle: pair('先把声音权利和人机分工讲清，再选奖项。', 'Clarify sound rights and human/AI roles before choosing the award field.'),
    fit: pair('适合已经有完整音轨或声音项目、可以交代词曲、录音与合成过程的创作者。只有提示词而没有完成作品时，先不要付费提交。', 'A fit for a finished track or sound project with an explainable composition, recording and synthesis process. A prompt alone is not a finished submission.'),
    effort: pair('本站建议把作曲、歌词、演唱或合成、采样和后期分开记账；为每一部分记录工具与授权依据。先听完整导出，再检查评审链接。', 'Our suggestion: track composition, lyrics, performance/synthesis, samples and mastering separately, with tool and rights evidence. Listen to the complete export and test the review link.'),
    steps: [pair('选择与已完成作品相符的领域和类别。', 'Match the completed work to a field and category.'), pair('整理音轨、制作分工、素材及声音授权信息。', 'Collect the track, production roles and source/voice permissions.'), pair('从投稿页进入完整规则，确认资格、格式与费用后提交。', 'Read the full rules linked on the submission page and confirm eligibility, format and fee.')],
    unknowns: pair('具体类别另有资格文件；普通创作类与 Autonomous / Generative Work 的获奖主体不同，后者授予生成系统所属公司，不能直接当作提示词作者个人奖。上传平台以当前表单为准。', 'Category-specific eligibility also applies. Autonomous / Generative Work awards go to the generative-music company, not automatically the person who entered a prompt. Confirm accepted hosting platforms in the current form.'),
    sources: [{ label: 'Academy of AI Music · 官方赛季与截止日', url: 'https://academyofaimusic.com/' }, { label: 'AIMEE · 投稿与收费', url: 'https://academyofaimusic.com/submissions/' }, { label: 'AIMEE · 完整规则与 AI 披露要求', url: 'https://academyofaimusic.com/rules/' }],
  },
];

export function reviewedRecords() {
  return OPPORTUNITY_REVIEWS.map((review) => {
    const fields = ['title', 'organizer', 'region', 'timezone', 'eligibility', 'fee', 'prize'];
    return {
      id: review.id, start_date: review.start_date, deadline: review.deadline,
      categories: review.categories, official_url: review.official_url, rules_url: review.rules_url,
      ...(review.fee_kind ? { fee_kind: review.fee_kind } : {}),
      verified_on: RESEARCH_DATE, scope: review.scope || 'aigc-native', __dataset: 'editorial', review_slug: review.id,
      ...Object.fromEntries(fields.map((key) => [key, review[key].zh])),
      en: Object.fromEntries(fields.map((key) => [key, review[key].en])),
    };
  });
}

export function mergeReviewedRecords(records) {
  const reviewed = reviewedRecords();
  const selected = new Map(reviewed.map((record) => [record.id, record]));
  for (const record of records) if (!selected.has(record.id)) selected.set(record.id, record);
  return [...selected.values()].map((record, index) => ({ ...record, __index: index }));
}

export function reviewPath(slug, lang = 'zh') {
  return typeof slug === 'string' && OPPORTUNITY_REVIEWS.some((review) => review.id === slug)
    ? `${lang === 'en' ? '/en' : ''}/opportunities/${slug}/` : null;
}
