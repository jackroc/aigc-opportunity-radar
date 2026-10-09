// Dated source research, not participation experience or organizer advice.
export const CASE_STUDIES = [
  {
    slug: 'browser-game-and-mini-program-entry', updated: '2026-10-09',
    sources: [{ label: '观猹 · 2026 微信小程序开发大赛活动说明', url: 'https://watcha.cn/activities/activity-74' }],
    zh: {
      title: '浏览器小游戏，能直接拿去报微信小程序大赛吗？',
      description: '把“网页能玩”“微信里能运行”和“满足参赛要求”分开判断，避免在错误的交付形式上投入。',
      intro: '作品目录里有不少打开网址就能玩的小游戏。看到“小程序开发大赛”，很容易把它理解为一个新的投稿入口。但作品可以在浏览器运行，只能证明它有网页版本；这不等于它已经是可提交的小程序。本文对照活动说明，给已有网页作品的创作者一条具体的判断路线。资料查阅于 2026 年 10 月 9 日，未实际报名。',
      sections: [
        ['先辨认交付物，不要先改标题', ['活动说明要求参赛作品采用微信小程序技术体系，不包含小游戏，并在提报阶段通过微信公众平台正式上线。说明列出的提报阶段为 7 月 17 日至 10 月 17 日；参与可以是个人或最多三人的团队。', '据此，只有游戏网址、代码仓库或试玩视频，都不能单独证明满足这项交付要求。给网页加一个微信分享按钮，或者把游戏改名为“工具”，也没有解决产品形式和实际用途的问题。']],
        ['已有作品可以走哪条路线', ['第一条路线是继续做游戏：保留当前玩法和浏览器发布方式，寻找明确接收网页游戏或交互作品的机会。这样把精力用于控制、加载、关卡和稳定性，而不是迁移到不相符的赛道。', '第二条路线是开发真正的工具类小程序，例如把你积累的创作经验做成素材管理、创作排期或参数记录工具。它应有独立的用户需求和可运行的流程，而不是用一页工具外壳包住原游戏。是否符合比赛定义，仍需主办方确认。']],
        ['上线是一个需要单独预留时间的里程碑', ['把计划拆成：确定使用场景、完成核心流程、适配运行环境、准备发布材料、正式上线、整理参赛材料。不要把“代码写完”同时当成“已上线”和“已提交”。', '建议准备一份最小验收表：新用户能否完成一次核心操作；异常输入是否有提示；退出再进入是否会丢失必要状态；说明中的能力是否都能在实际版本找到。它是本站的开发准备建议，不是主办方公布的评分表，也没有承诺审核需要几天。']],
        ['怎样处理页面上的多个日期', ['这类活动页面可能同时显示整体活动起止时间与作品提报阶段。做提交计划时，应找到与“作品提报”对应的日期，而不是直接用页面最上方的活动结束日。没有明确截止时刻时，不自行补成 23:59。', '在参赛准备工具里记录你实际看到的规则链接、阶段和时区，给上线与文件上传留出个人缓冲。如果剩余时间只能完成一个演示，先调整目标；不要把还没上线的状态勾选为完成。']],
      ],
    },
    en: {
      title: 'Can a browser game enter a WeChat mini-program competition?',
      description: 'Separate a playable website, a published mini program and an eligible competition entry before choosing a migration path.',
      intro: 'A browser demo proves that a web version exists. It does not establish that the project is already an eligible mini program. This source-based case study offers a decision path for creators with an existing web project. Sources were consulted on October 9, 2026; we did not register an entry.',
      sections: [
        ['Identify the deliverable before renaming the project', ['The activity description requires a WeChat mini-program implementation, excludes mini games and requires official publication through the WeChat public platform during the submission phase, July 17–October 17. Teams may have up to three people; solo participation is also described.', 'A demo URL, repository or video alone does not establish compliance with that deliverable. Adding a sharing button or calling a game a tool leaves the underlying product and publishing requirements unresolved.']],
        ['Choose between improving the game and building a different product', ['Keep the game as a browser project if the game loop is its purpose. Look for opportunities that explicitly accept browser games or interactive work, and spend your effort on controls, loading, levels and reliability.', 'A separate tool could address a real creator need such as asset organization, production scheduling or parameter records. It needs a useful workflow of its own rather than a tool-shaped wrapper around a game. Ask the organizer about eligibility when the product boundary is unclear.']],
        ['Treat publication as a separate milestone', ['Plan distinct steps for the user need, core workflow, platform adaptation, release materials, publication and competition submission. Code completion, a published version and a submitted entry are different states.', 'Our suggested preflight is to complete one core operation as a new user, exercise invalid input, revisit the project after leaving and compare its actual behavior with its description. This is a development checklist, not an official scoring rubric or a promise about review duration.']],
        ['Use the deadline for the relevant phase', ['An activity page can show an overall event period as well as a submission period. Locate the date explicitly attached to the deliverable instead of treating the event end date as the submission cutoff. Do not infer 23:59 when no exact time is stated.', 'Record the rule URL, phase and time-zone note in your preparation plan. Reserve your own publication and upload buffer. If your remaining time only supports a demo, revise the scope rather than marking an unpublished project as complete.']],
      ],
    },
  },
  {
    slug: 'registration-versus-submission-deadlines', updated: '2026-10-09',
    sources: [
      { label: 'NASA TechLeap · Challenge phases and timeline', url: 'https://occ.nasatechleap.org/challenge-phases-and-timeline/' },
      { label: 'NASA TechLeap · Rules, terms, and conditions', url: 'https://occ.nasatechleap.org/rules-terms-and-conditions/' },
    ],
    zh: {
      title: '为什么只收藏一个截止日期，可能仍然错过报名？',
      description: '以 Orbital Clarity Challenge 为例，拆开注册、提交和后续交付，建立可执行的赛事时间表。',
      intro: '机会目录用一行日期帮助你排序，但一场比赛可能有多个必须完成的节点。这里以 NASA TechLeap 的 Orbital Clarity Challenge 为例，说明怎样把日期卡片变成行动计划。资料查阅于 2026 年 10 月 9 日；本文是信息组织方法，不是参赛经历或资格审核意见。',
      sections: [
        ['注册与提交，是两个动作', ['官方时间表分别列出：2026 年 10 月 28 日美国东部时间 17:00 注册截止，以及 11 月 11 日美国东部时间 17:00 提交截止。', '因此，把提醒只设在提交前一天，可能已经错过注册。更稳妥的记录方式，是每个节点都写明日期、官方时区、需要完成的动作和能够证明完成的凭据。不要只记“还有一个月”。']],
        ['时区名称不能替代具体日期', ['跨地区参赛时，保留原始官方时区和原始时刻，再用日历或可靠的时区工具转换到自己所在地。不要把 ET 固定理解为某个全年不变的 UTC 偏移；不同日期可能受夏令时影响。', '本站的准备工具只做按日工作量估算，不把目录日期换算成精确截止时刻，也不自动报名。建议个人完成日是自定缓冲目标，不能替代主办方截止时间。']],
        ['奖金数字之前，还要过资格和交付两道门', ['这项机会面向轨道测量传感技术。官方规则另列身份、机构、团队与其他参与限制；看到“NASA”“AI”或较高奖池，都不能推断自己的软件或艺术作品适合参赛。', '先写出你要交付的成果和已经具备的能力，再逐条对照规则。遇到身份、知识产权或团队安排的问题，记录待确认事项并向主办方询问，不让一个目录上的“报名中”标签替你作资格结论。']],
        ['把长期赛事拆成三个列表', ['第一张是必须先完成的门槛表，例如注册和资格确认；第二张是本次提交的材料表，例如说明、文件和链接；第三张是晋级后才发生的工作表。三个列表分开，才不会把未来阶段的全部工作误算进首次提交，也不会忽略后续承担能力。', '每个任务再加“负责人、预计小时、依赖、个人完成日、完成凭据”五列。如果一个任务必须等待外部确认，就把它放在计划前面。这里给出的是可复用的规划方法，不能保证入围或获奖。']],
      ],
    },
    en: {
      title: 'One saved deadline can still mean a missed registration',
      description: 'Use the Orbital Clarity Challenge to separate registration, submission and later delivery milestones.',
      intro: 'A directory date is useful for sorting opportunities, but it can hide distinct actions. This source-based example turns a deadline card into a preparation plan. Sources were consulted on October 9, 2026; this is planning guidance, not participation experience or eligibility approval.',
      sections: [
        ['Registration and submission are different actions', ['The official timeline lists registration closing on October 28, 2026 at 5 p.m. ET and submissions closing on November 11, 2026 at 5 p.m. ET.', 'A reminder the day before submission may already be too late to register. Record a date, the official time zone, the required action and completion evidence for each milestone, rather than a single countdown.']],
        ['Keep the date attached to the time zone', ['Preserve the original date, time and official time-zone note, then convert with a calendar or a reliable time-zone tool. ET is not a fixed UTC offset throughout the year; daylight saving can matter.', 'Our preparation tool estimates whole-day capacity. It does not convert a listed date into an exact cutoff or register you. Its personal target date is your buffer, not an organizer deadline.']],
        ['Check eligibility and deliverables before the award pool', ['This opportunity concerns orbital measurement sensor technology. The official rules separately describe individual, entity, team and other participation restrictions. A NASA name, an AI connection or a large award pool does not establish that a software or art project fits.', 'Write down the intended deliverable and your existing capabilities before comparing them with the rules. Record unresolved identity, ownership and team questions for the organizer. An “open” directory label is not an eligibility decision.']],
        ['Create three lists for a multi-stage opportunity', ['Separate prerequisites such as registration, current submission materials and work that only occurs after advancement. This avoids treating all future work as part of the first submission while still considering later commitments.', 'For each task, record an owner, estimated hours, dependencies, a personal completion date and completion evidence. Put work that depends on external confirmation early. This reusable planning method cannot promise selection or an award.']],
      ],
    },
  },
];
