window.DAY_CONTENT = {
  tasksPerDay(dayNo) {
    if (dayNo <= 10) return 5;
    return Math.min(15, 5 + Math.ceil((dayNo - 10) / 2));
  },
  scripted: {
    1: {
      morning: "第一天上班有点紧张，但我拿到了工位和办公用品。主人，今天一起帮我稳稳开局吧。",
      night: "第一天顺利收工！虽然累，但同事很友好，我也更有信心了。",
      tasks: [
        {
          type: "choice",
          title: "新人阶段边界",
          prompt: "入职第一周，不应该独立处理哪项工作？",
          problem: "我怕一上来就做错边界，主人帮我判断。",
          options: ["熟悉公司环境", "记住直属领导联系方式", "独立处理客户投诉", "学习归档标准"],
          answer: 2,
          explain: "新人阶段不应独立处理投诉。"
        },
        {
          type: "boolean",
          title: "考勤判断",
          prompt: "8:30-9:00打卡，8:55到公司不算迟到。",
          problem: "这个考勤判断我有点拿不准。",
          answer: true,
          explain: "9:00前打卡属于正常。"
        },
        {
          type: "typo",
          title: "入职公告校对",
          prompt: "请改正段落中的错别字。",
          problem: "我写的通知里有错字，主人帮我修一修。",
          paragraph: "今天是我入职的第一天，我到前台登计了个人信息，经理介绍了公司的发张历程。",
          wrongWords: ["登计", "发张"],
          expectedWords: ["登记", "发展"],
          explain: "应改为“登记”“发展”。"
        },
        {
          type: "choice",
          title: "打印机卡纸",
          prompt: "发现打印机卡纸，最合适的处理方式是？",
          problem: "打印机卡纸了，我有点慌。",
          options: ["大声喊IT", "按设备指引先自行处理", "直接换部门打印机", "等别人处理"],
          answer: 1,
          explain: "先按规范步骤处理。"
        },
        {
          type: "fill",
          title: "快捷键基础",
          prompt: "填写：保存快捷键 + 撤销快捷键。",
          problem: "主人，帮我记住最常用的两个快捷键。",
          placeholders: ["保存", "撤销"],
          expectedWords: ["ctrl+s", "ctrl+z"],
          explain: "保存是 Ctrl+S，撤销是 Ctrl+Z。"
        }
      ]
    },
    2: {
      morning: "今天我开始学习文档分类和系统归档，命名规则让我头大。",
      night: "文件管理终于有点上手了，规范命名真的能省很多时间。",
      tasks: [
        {
          type: "choice",
          title: "命名规范",
          prompt: "以下哪个文件命名更规范？",
          problem: "我总怕文件命名不标准。",
          options: ["2024.3.1会议记录.docx", "会议记录_20240301_部门例会.docx", "会议记录(1).docx", "今天开会记录.docx"],
          answer: 1,
          explain: "结构化命名最利于检索。"
        },
        {
          type: "boolean",
          title: "审核流程",
          prompt: "正式文件经理不在时可先发出，回头补签。",
          problem: "经理不在时，流程能不能先跳过？",
          answer: false,
          explain: "正式文件必须先审核后发送。"
        },
        {
          type: "typo",
          title: "会议通知格式",
          prompt: "改正通知中的不规范表达。",
          problem: "通知写法像聊天记录，想改正式一点。",
          paragraph: "时间：二零二四年三月五日下午两点。请各参会。",
          wrongWords: ["二零二四", "两点", "各参会"],
          expectedWords: ["2024", "14:00", "各部门参会人员"],
          explain: "公文应使用阿拉伯数字、24小时制、完整称谓。"
        },
        {
          type: "choice",
          title: "会议冲突协调",
          prompt: "10人会议有3人冲突，最合适做法？",
          problem: "有人时间冲突，我要不要直接按原计划？",
          options: ["坚持原时间", "询问冲突时间并协调", "取消会议", "只通知能来的人"],
          answer: 1,
          explain: "先收集冲突信息再协调。"
        },
        {
          type: "fill",
          title: "邮件术语",
          prompt: "填写：CC 表示___，BCC 表示___。",
          problem: "邮件缩写我总记混。",
          placeholders: ["CC", "BCC"],
          expectedWords: ["抄送", "密送"],
          explain: "CC=抄送，BCC=密送。"
        }
      ]
    },
    3: {
      morning: "今天正式接手邮箱，50多封邮件看得我眼花，但我在学着分类处理。",
      night: "客户回复感谢时，我突然觉得认真沟通真的有价值。",
      tasks: [
        {
          type: "choice",
          title: "邮件主题",
          prompt: "发送报价单时，哪个主题更合适？",
          problem: "我怕邮件主题不够专业。",
          options: ["你好", "产品报价", "【报价】关于XX公司2024年度服务报价单", "报价单2024.3.3"],
          answer: 2,
          explain: "主题需明确事项与对象。"
        },
        {
          type: "boolean",
          title: "回复时效",
          prompt: "即便不能马上处理，也应24小时内先回复已收到。",
          problem: "我是不是可以等忙完再统一回？",
          answer: true,
          explain: "及时确认能降低沟通焦虑。"
        },
        {
          type: "typo",
          title: "邮件规范补全",
          prompt: "把邮件改成更正式完整。",
          problem: "这封邮件太短太随意了。",
          paragraph: "主题：报价资料。王先生您好！附件是您需要的资料，请查收。",
          wrongWords: ["报价资料"],
          expectedWords: ["【报价】", "联系方式", "礼貌结束语"],
          explain: "主题需明确，正文要有结尾和联系方式。"
        },
        {
          type: "choice",
          title: "发送前检查",
          prompt: "重要邮件点击发送前最应该做什么？",
          problem: "我总担心发错附件或收件人。",
          options: ["直接发送", "检查收件人/附件/内容", "存草稿明天发", "请同事代发"],
          answer: 1,
          explain: "发送前复核是关键习惯。"
        },
        {
          type: "fill",
          title: "附件命名",
          prompt: "补全命名模板：____ _ ____ _ 文件名.扩展名",
          problem: "主人，我想把附件命名统一起来。",
          placeholders: ["字段1", "字段2"],
          expectedWords: ["日期", "客户名"],
          explain: "统一模板为“日期_客户名_文件名”。"
        }
      ]
    },
    4: {
      morning: "今天第一次做会议纪要，我发现“抓重点”比“全抄”更难。",
      night: "我开始知道纪要不等于流水账，而是要记录决议和行动项。",
      tasks: [
        {
          type: "choice",
          title: "纪要要素",
          prompt: "以下哪项不是会议纪要必须内容？",
          problem: "我不知道哪些信息该写进纪要。",
          options: ["时间地点人员", "主要讨论内容", "每个人全部发言细节", "会议决议与行动项"],
          answer: 2,
          explain: "纪要重结论与行动，不追求逐字记录。"
        },
        {
          type: "boolean",
          title: "发送时效",
          prompt: "会议纪要应在2个工作日内发给参会人并抄送相关领导。",
          problem: "纪要是当天发还是可以拖几天？",
          answer: true,
          explain: "及时发送可避免执行偏差。"
        },
        {
          type: "typo",
          title: "纪要格式修正",
          prompt: "改正时间和参会人书写。",
          problem: "纪要格式总被说不规范。",
          paragraph: "时间：二零二四年三月四日下午两点；参会人：王部长、李经理。",
          wrongWords: ["二零二四", "两点", "王部长", "李经理"],
          expectedWords: ["2024", "14:00", "王建国部长", "李明经理"],
          explain: "时间与姓名需规范完整。"
        },
        {
          type: "choice",
          title: "会议准备",
          prompt: "明天10点会议，今天下午最合理安排？",
          problem: "我想知道会前准备的优先顺序。",
          options: ["明天再准备", "提前订会议室+资料+通知", "只订会议室", "让经理自己准备"],
          answer: 1,
          explain: "会前准备要完整闭环。"
        },
        {
          type: "fill",
          title: "纪要核心",
          prompt: "填写会议记录三要素：___、___、___。",
          problem: "主人，帮我把纪要框架记牢。",
          placeholders: ["1", "2", "3"],
          expectedWords: ["议题", "决议", "行动项"],
          explain: "核心是议题、结论和执行动作。"
        }
      ]
    },
    5: {
      morning: "今天学Excel，函数一多我就有点晕，但我想把数据表做好。",
      night: "拖拽填充和函数真的太省时间了，我开始喜欢数据工作。",
      tasks: [
        {
          type: "choice",
          title: "查找函数",
          prompt: "查找员工“张三”的部门应使用哪个函数？",
          problem: "这个查找我手动翻太慢了。",
          options: ["SUM", "VLOOKUP", "AVERAGE", "COUNT"],
          answer: 1,
          explain: "跨表查找常用 VLOOKUP。"
        },
        {
          type: "boolean",
          title: "日期录入",
          prompt: "输入 2024.3.5 会被系统自动识别为日期格式。",
          problem: "日期格式总被识别成文本。",
          answer: false,
          explain: "点号常导致文本格式。"
        },
        {
          type: "typo",
          title: "公式修正",
          prompt: "修复错误公式。",
          problem: "我的公式结果不对，帮我找错。",
          paragraph: "=SUM(A1:A5)+(B1:B5)",
          wrongWords: ["(B1:B5)"],
          expectedWords: ["SUM(B1:B5)"],
          explain: "区域求和需使用 SUM。"
        },
        {
          type: "choice",
          title: "批量计算",
          prompt: "100行“销量×单价”最快做法是？",
          problem: "我不想再一行行算了。",
          options: ["逐行手算", "首行公式后向下填充", "计算器逐个算", "让别人算"],
          answer: 1,
          explain: "公式填充是标准做法。"
        },
        {
          type: "fill",
          title: "数据格式",
          prompt: "日期列设为___格式；金额列设为___格式。",
          problem: "表格看起来不专业，怎么规范？",
          placeholders: ["日期列", "金额列"],
          expectedWords: ["日期", "货币"],
          explain: "基础格式统一能显著提升可读性。"
        }
      ]
    },
    6: {
      morning: "今天轮到我接电话了，我在练习语气和记录细节。",
      night: "投诉电话也能被安抚好，我第一次觉得自己能稳住场面。",
      tasks: [
        { type: "choice", title: "电话开场", prompt: "哪种接听开场更专业？", problem: "主人，接电话第一句怎么说最稳妥？", options: ["喂，哪位", "你好，XX公司，请问有什么可以帮您", "说吧什么事", "喂，这里XX公司"], answer: 1, explain: "规范问候+服务导向。" },
        { type: "boolean", title: "来电记录", prompt: "忙时可以先记脑子里，晚点再处理。", problem: "我怕来不及写记录。", answer: false, explain: "必须即时记录关键信息。" },
        { type: "typo", title: "电话记录规范", prompt: "修正记录中的时间表达。", problem: "我的记录看起来不够正式。", paragraph: "客户来电：二零二四年三月六日下午两点，回复下周。", wrongWords: ["二零二四", "两点", "下周"], expectedWords: ["2024", "14:00", "下周一（3月11日）"], explain: "时间要具体明确。" },
        { type: "choice", title: "客户到访接待", prompt: "经理在会中，客户到访应如何处理？", problem: "客户来了但经理不在，我该怎么接待？", options: ["让客户门口等", "请到会议室等候并告知等待时间", "让客户改天再来", "带进会议室后离开"], answer: 1, explain: "接待要体现专业与尊重。" },
        { type: "fill", title: "留言要点", prompt: "电话留言需记录：姓名、联系方式、___。", problem: "留言时我总怕漏关键字段。", placeholders: ["字段"], expectedWords: ["留言内容"], explain: "留言内容必须完整可执行。" }
      ]
    },
    7: {
      morning: "今天学习公文写作，我想把语气写得既正式又清晰。",
      night: "公文不只是“严肃”，而是为了准确传达和避免歧义。",
      tasks: [
        { type: "choice", title: "公文字体", prompt: "常见正式公文配置哪项正确？", problem: "字体格式我总记不住。", options: ["标题三号黑体/正文四号宋体", "标题二号黑体/正文三号宋体", "标题四号黑体/正文小四宋体", "标题二号宋体/正文三号黑体"], answer: 1, explain: "标准化格式便于统一管理。" },
        { type: "boolean", title: "正式称呼", prompt: "给上级写正式邮件，称呼“XX总”比“王总”更合适。", problem: "我不确定正式称呼应该怎么写。", answer: false, explain: "正式场景应使用姓氏+职务。" },
        { type: "typo", title: "通知措辞修正", prompt: "把通知改得更规范。", problem: "这段通知太口语化了。", paragraph: "从明天开始大家都要打卡，不准迟到，否则扣钱。", wrongWords: ["明天", "不准", "扣钱"], expectedWords: ["具体日期", "请", "按公司考勤制度执行"], explain: "公文应具体、客观、规范。" },
        { type: "choice", title: "全员通知渠道", prompt: "全员大会通知最有效方式？", problem: "只发群消息会不会漏人？", options: ["口头转达", "邮件全员+群公告同步", "只发群消息", "贴公告栏"], answer: 1, explain: "多渠道保证触达率。" },
        { type: "fill", title: "公文结构", prompt: "正式公文基本结构：___、正文、落款。", problem: "结构顺序总记混。", placeholders: ["结构"], expectedWords: ["标题"], explain: "标题是基本结构入口。" }
      ]
    },
    8: {
      morning: "今天我学档案管理，感觉自己在整理公司的“记忆”。",
      night: "流程规范后，找档案速度明显快了。",
      tasks: [
        { type: "choice", title: "归档体系", prompt: "哪种归档方式更科学？", problem: "档案分法太多，我想选长期可维护的。", options: ["全部按时间", "全部按项目", "部门-年份-类别三级归档", "随意归档"], answer: 2, explain: "三级结构兼顾检索与扩展。" },
        { type: "boolean", title: "档案保密", prompt: "同事关系好，可以私下借阅人事档案。", problem: "同事来借档案我不好拒绝。", answer: false, explain: "保密档案必须按审批流程。"},
        { type: "typo", title: "编号规范", prompt: "修正档案编号写法。", problem: "我写的编号格式总被退回。", paragraph: "二零二四-三-五-会议记录-零零一", wrongWords: ["二零二四", "三-五", "会议记录", "零零一"], expectedWords: ["2024", "0305", "HYJL", "001"], explain: "编号需统一编码规则。" },
        { type: "choice", title: "借阅审批", prompt: "经理不在但急需查档，应如何处理？", problem: "流程和效率怎么兼顾？", options: ["直接给看", "等经理回来", "联系经理电子审批后办理", "让同事自己找经理"], answer: 2, explain: "先审批后借阅，留痕可追溯。" },
        { type: "fill", title: "三专原则", prompt: "三专：专人负责、专室保管、___。", problem: "档案管理口诀我差最后一项。", placeholders: ["第三项"], expectedWords: ["专柜存放"], explain: "专柜管理是三专的重要环节。" }
      ]
    },
    9: {
      morning: "今天练时间管理，我想把“忙”变成“有序推进”。",
      night: "有了优先级后，整天不再手忙脚乱。",
      tasks: [
        {
          type: "choice",
          title: "优先级排序",
          prompt: "任务1：经理10点要报表（30分钟）；任务2：客户资料（14:00前，2小时）；任务3：日常邮件20封（40分钟）；任务4：同事紧急打印（5分钟）。以下顺序哪个更合理？",
          problem: "任务一多我就容易乱，主人帮我排个优先级。",
          options: ["1-4-3-2", "4-1-2-3", "1-2-3-4", "3-1-4-2"],
          answer: 0,
          explain: "先紧急重要，再处理中短时任务。"
        },
        { type: "boolean", title: "缓冲时间", prompt: "日程中应预留缓冲，避免任务无缝硬拼接。", problem: "我以前排太满，一有突发就崩。", answer: true, explain: "缓冲是稳定执行的关键。" },
        { type: "typo", title: "日程具体化", prompt: "把日程写得可执行。", problem: "我的日程总是太笼统。", paragraph: "上午：开会；下午：做报表；晚上：待定", wrongWords: ["上午", "开会", "待定"], expectedWords: ["09:00-10:30", "部门例会", "具体安排"], explain: "时间、主题、结果都要具体。" },
        { type: "choice", title: "临时任务冲突", prompt: "2点临时接待客户，原计划3点报告，怎么做？", problem: "冲突时我总怕沟通不好。", options: ["拒绝经理", "调整日程并同步预计完成时间", "悄悄延到明天", "不汇报直接加班"], answer: 1, explain: "先同步预期，再执行调整。" },
        { type: "fill", title: "四象限", prompt: "既紧急又重要属于第___象限。", problem: "四象限口诀我记不牢。", placeholders: ["数字"], expectedWords: ["一", "1"], explain: "第一象限=紧急且重要。" }
      ]
    },
    10: {
      morning: "第10天了，我想做一次阶段总结，看看自己到底成长了什么。",
      night: "谢谢你一直陪我练习，这10天让我从慌乱走向有序。",
      tasks: [
        { type: "choice", title: "周报表达", prompt: "向经理汇报周成果，哪种方式更有效？", problem: "我汇报时总怕说不到重点。", options: ["列全部过程", "突出关键成果并量化", "只说都完成了", "重点讲困难"], answer: 1, explain: "成果导向+数据最有说服力。" },
        { type: "boolean", title: "每日复盘", prompt: "下班前5分钟复盘是有效习惯。", problem: "复盘到底值不值得坚持？", answer: true, explain: "复盘能持续减少重复错误。" },
        { type: "typo", title: "周报改写", prompt: "把周报写得更可衡量。", problem: "我写周报总被说“太空”。", paragraph: "本周整理了文件，发了邮件，下周继续努力。", wrongWords: ["整理了文件", "发了邮件", "继续努力"], expectedWords: ["整理了50份档案", "发送30封客户邮件", "下周明确目标"], explain: "周报要量化成果和下一步动作。" },
        { type: "choice", title: "复盘态度", prompt: "犯错后复盘最正确做法？", problem: "我不太会向上汇报自己的错误。", options: ["避而不谈", "分析原因并给改进措施", "强调客观原因", "只说以后注意"], answer: 1, explain: "复盘重在机制改进，不是甩锅。" },
        { type: "fill", title: "PDCA", prompt: "PDCA：计划、执行、检查、___。", problem: "最后一步我总记混。", placeholders: ["第四步"], expectedWords: ["处理", "改进", "行动"],
          explain: "A 对应处理/改进行动。" }
      ]
    }
  }
};
