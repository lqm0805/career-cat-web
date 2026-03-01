
const STORAGE_KEY = "careerCat.v7";
const DEBUG_MODE = true;
const DAY_UNLOCK_MS = 5 * 60 * 1000;
const TOTAL_DAYS = 30;

const YELLOW_CAT = {
  normal: "assets/cats/smile1.png",
  sad: "assets/cats/sad1.png",
  excited: "assets/cats/excited1.png"
};

const CAREERS = [
  { id: "clerk", name: "文员", base: 1.0, skills: ["文档规范", "细节校对", "信息整理", "沟通表达"] },
  { id: "programmer", name: "程序员", base: 1.06, skills: ["编码思维", "调试能力", "架构理解", "协作沟通"] },
  { id: "artist", name: "艺术家", base: 1.04, skills: ["构图表达", "色彩感知", "风格创作", "反馈迭代"] },
  { id: "doctor", name: "医生", base: 1.08, skills: ["病情判断", "流程执行", "沟通安抚", "风险控制"] },
  { id: "designer", name: "设计师", base: 1.04, skills: ["用户洞察", "交互设计", "视觉表达", "设计复盘"] },
  { id: "sales", name: "销售", base: 1.02, skills: ["需求挖掘", "谈判推进", "关系维护", "方案表达"] },
  { id: "analyst", name: "数据分析师", base: 1.05, skills: ["数据清洗", "统计推理", "业务洞察", "报告呈现"] }
];

const TASK_BANK = {
  common: {
    learn: [
      { title: "工作节奏", problem: "主人，我想把今天节奏理顺。", prompt: "先列出三件最重要的任务，再按时限排序。" },
      { title: "沟通表达", problem: "主人，我怕说得不清楚。", prompt: "先说结论，再补背景，最后给行动点。" },
      { title: "复盘习惯", problem: "主人，我想少犯重复错误。", prompt: "任务完成后写一句“哪里做得好，哪里要改进”。" }
    ],
    choice: [
      { title: "优先级判断", problem: "主人，先做哪件事更好？", prompt: "哪个任务优先级更高？", options: ["整理桌面", "处理今天截止的工作", "换主题色", "清空下载"], answer: 1, explain: "紧急且重要优先。" },
      { title: "信息准确", problem: "主人，我怕发错信息。", prompt: "发送前最该先检查什么？", options: ["字体颜色", "内容与时间是否正确", "表情数量", "段落长短"], answer: 1, explain: "准确性优先于样式。" }
    ],
    typo: [
      { title: "段落纠错", problem: "主人，这段话有错别字，帮我修一下。", prompt: "请修正错别字后提交。", paragraph: "明天上五十点我们开会，请大家准时参会。", wrongWords: ["上五十点"], expectedWords: ["上午十点"], explain: "应改为“上午十点”。" },
      { title: "公告校对", problem: "主人，帮我把这句通知修顺。", prompt: "请把错别字改正确。", paragraph: "请各位同事在周五前完成报表提教。", wrongWords: ["提教"], expectedWords: ["提交"], explain: "“提教”应改为“提交”。" }
    ]
  },
  clerk: {
    choice: [
      { title: "找错别字", problem: "主人，这条通知有个错字。", prompt: "哪个词是错别字？", options: ["事项安排", "报销流成", "会议纪要", "归档日期"], answer: 1, explain: "应为“报销流程”。" },
      { title: "格式优先", problem: "主人，我在排版上纠结了。", prompt: "通知标题最应该先保证什么？", options: ["花哨字体", "信息准确清晰", "颜色丰富", "段落多样"], answer: 1, explain: "文员场景下清晰优先。" }
    ],
    typo: [
      { title: "公告校对", problem: "主人，帮我改改这段公告。", prompt: "请修正错词后提交。", paragraph: "请各部门完成资枓归档并按规择命名。", wrongWords: ["资枓", "规择"], expectedWords: ["资料", "规则"], explain: "资枓->资料，规择->规则。" },
      { title: "会议纪要修正", problem: "主人，这段纪要有错别字。", prompt: "请直接改正文案。", paragraph: "今日会义决定下周一开始试形新流程。", wrongWords: ["会义", "试形"], expectedWords: ["会议", "试行"], explain: "会义->会议，试形->试行。" }
    ]
  }
};

const EVENT_BANK = {
  common: [
    {
      title: "突发加急",
      desc: "临时来了加急任务，猫咪有点紧张。",
      options: [
        { text: "你帮它拆任务", effects: { affection: 6, exp: 8, rewardScale: 0.08, mood: "excited", note: "被支持后状态回升。" } },
        { text: "让它自己硬扛", effects: { affection: -6, exp: -2, rewardScale: -0.06, mood: "sad", note: "压力过大，效率下降。" } }
      ]
    }
  ],
  programmer: [
    {
      title: "线上报警",
      desc: "系统突然报警，需要快速排查。",
      options: [
        { text: "陪它读日志", effects: { affection: 6, exp: 9, rewardScale: 0.1, mood: "excited", note: "定位更快了。" } },
        { text: "让它先顶着", effects: { affection: -5, exp: -3, rewardScale: -0.06, mood: "sad", note: "心态有些崩。" } }
      ]
    }
  ]
};

const MOOD_TEXT = {
  normal: "主人，今天也一起认真打工吧。",
  sad: "主人，我有点沮丧，可以拍拍我吗？",
  excited: "主人，我现在状态超好，继续冲！"
};

const DAY_CONTENT = window.DAY_CONTENT || { scripted: {}, tasksPerDay: () => 5 };

const el = {
  screens: {
    launch: document.getElementById("screen-launch"),
    career: document.getElementById("screen-career"),
    home: document.getElementById("screen-home"),
    task: document.getElementById("screen-task"),
    growth: document.getElementById("screen-growth")
  },
  launchPanel: document.getElementById("launch-panel"),
  careerGrid: document.getElementById("career-grid"),
  shareTop: document.getElementById("share-top"),
  resetProgress: document.getElementById("reset-progress"),
  catWrap: document.getElementById("cat-wrap"),
  taskCatWrap: document.getElementById("task-cat-wrap"),
  catPortrait: document.getElementById("cat-portrait"),
  taskCatPortrait: document.getElementById("task-cat-portrait"),
  catReaction: document.getElementById("cat-reaction"),
  taskBubbleText: document.getElementById("task-bubble-text"),
  statLevel: document.getElementById("stat-level"),
  statExp: document.getElementById("stat-exp"),
  statAffection: document.getElementById("stat-affection"),
  goTask: document.getElementById("go-task"),
  goGrowth: document.getElementById("go-growth"),
  daySubtitle: document.getElementById("day-subtitle"),
  toggleTimeline: document.getElementById("toggle-timeline"),
  timelineBody: document.getElementById("timeline-body"),
  nextCountdown: document.getElementById("next-countdown"),
  dayTimeline: document.getElementById("day-timeline"),
  debugDaySelect: document.getElementById("debug-day-select"),
  eventCard: document.getElementById("event-card"),
  eventTitle: document.getElementById("event-title"),
  eventDesc: document.getElementById("event-desc"),
  eventActions: document.getElementById("event-actions"),
  taskTitle: document.getElementById("task-title"),
  taskPrompt: document.getElementById("task-prompt"),
  taskMeta: document.getElementById("task-meta"),
  taskAction: document.getElementById("task-action"),
  nextTask: document.getElementById("next-task"),
  taskIndex: document.getElementById("task-index"),
  bottomNav: document.getElementById("bottom-nav"),
  skillList: document.getElementById("skill-list"),
  timeline: document.getElementById("timeline"),
  tabs: Array.from(document.querySelectorAll(".tab")),
  toast: document.getElementById("toast")
};

let state = loadState();
let countdownTimer = null;
let typingToken = 0;

migrateLegacyFillTasks();
ensurePlanWindow();
renderCareerChoices();
renderDaySelect();
bootstrapScreen();
bindEvents();
startCountdownLoop();

function defaultState() {
  return {
    selectedCareerId: null,
    pendingCareerId: null,
    level: 1,
    exp: 0,
    affection: 60,
    skillPoints: {},
    startDateKey: "",
    dayPlans: {},
    progress: {},
    dayMods: {},
    dayEvents: {},
    dayCompleteAt: {},
    unlockedDay: 0,
    activeDay: 0,
    activeTask: 0,
    lastInteraction: Date.now(),
    lastActionResult: "neutral",
    timeline: [withTime("职业猫旅程开始")]
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const merged = { ...defaultState(), ...JSON.parse(raw) };
    if (!merged.dayCompleteAt) merged.dayCompleteAt = {};
    if (typeof merged.unlockedDay !== "number") merged.unlockedDay = 0;
    return merged;
  } catch {
    return defaultState();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function bootstrapScreen() {
  if (state.selectedCareerId) {
    el.bottomNav.classList.remove("hidden");
    showScreen("home", false);
    renderAll();
  } else {
    el.bottomNav.classList.add("hidden");
    showScreen("launch", false);
  }
}

function bindEvents() {
  el.launchPanel.addEventListener("click", () => showScreen("career"));

  el.goTask.addEventListener("click", () => {
    showScreen("task");
    maybeTriggerEvent();
    renderTaskTimeline();
    renderTaskPanel();
  });

  el.goGrowth.addEventListener("click", () => showScreen("growth"));

  document.querySelectorAll("[data-nav]").forEach((btn) => {
    btn.addEventListener("click", () => showScreen(btn.dataset.nav));
  });

  el.tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      if (!state.selectedCareerId && tab.dataset.nav !== "launch") return;
      showScreen(tab.dataset.nav);
    });
  });

  el.catWrap.addEventListener("click", onPatCat);
  el.taskCatWrap.addEventListener("click", onPatCat);

  el.nextTask.addEventListener("click", () => switchTask(1));

  el.toggleTimeline.addEventListener("click", () => {
    el.timelineBody.classList.toggle("collapsed");
    el.toggleTimeline.textContent = el.timelineBody.classList.contains("collapsed") ? "展开" : "折叠";
  });

  el.debugDaySelect.addEventListener("change", () => {
    if (!DEBUG_MODE) return;
    state.activeDay = Number(el.debugDaySelect.value);
    state.activeTask = 0;
    el.timelineBody.classList.add("collapsed");
    el.toggleTimeline.textContent = "展开";
    renderTaskTimeline();
    renderTaskPanel();
    saveState();
  });

  el.shareTop.addEventListener("click", shareProgress);
  el.resetProgress.addEventListener("click", resetProgress);
}

function showScreen(name, rerender = true) {
  Object.entries(el.screens).forEach(([key, screen]) => screen.classList.toggle("active", key === name));
  el.tabs.forEach((tab) => tab.classList.toggle("active", tab.dataset.nav === name));
  if (!rerender) return;
  if (name === "home") renderHome();
  if (name === "task") {
    renderTaskTimeline();
    renderTaskPanel();
  }
  if (name === "growth") renderGrowth();
}
function renderAll() {
  renderHome();
  renderTaskTimeline();
  renderTaskPanel();
  renderGrowth();
  saveState();
}

function renderCareerChoices() {
  el.careerGrid.innerHTML = "";
  CAREERS.forEach((career) => {
    const card = document.createElement("article");
    const selected = state.pendingCareerId === career.id || state.selectedCareerId === career.id;
    card.className = `card choice-card ${selected ? "selected" : ""}`;
    card.innerHTML = `<h3>${career.name}</h3><p>核心技能：${career.skills.join(" / ")}</p><span class="choice-tag">点两次确认职业</span>`;
    card.addEventListener("click", () => {
      if (state.pendingCareerId === career.id) {
        state.selectedCareerId = career.id;
        state.pendingCareerId = null;
        state.startDateKey = dateKeyFromDate(new Date());
        state.level = 1;
        state.exp = 0;
        state.affection = 60;
        state.skillPoints = {};
        state.dayPlans = {};
        state.progress = {};
        state.dayMods = {};
        state.dayEvents = {};
        state.dayCompleteAt = {};
        state.unlockedDay = 0;
        state.activeDay = 0;
        state.activeTask = 0;
        ensurePlanWindow(true);
        addTimeline(`确认职业：${career.name}`);
        saveState();
        el.bottomNav.classList.remove("hidden");
        renderDaySelect();
        showScreen("home");
        renderAll();
        showToast(`已确认职业：${career.name}`);
      } else {
        state.pendingCareerId = career.id;
        renderCareerChoices();
        showToast(`再次点击“${career.name}”完成确认`);
      }
    });
    el.careerGrid.appendChild(card);
  });
}

async function renderHome() {
  const mood = currentMood();
  setCatVisual(mood);
  el.statLevel.textContent = `Lv.${state.level}`;
  el.statExp.textContent = `EXP ${state.exp}/${expNeed(state.level)}`;
  el.statAffection.textContent = `AFF ${state.affection}`;
  el.catWrap.classList.add("speaking");
  await typeTo(el.catReaction, MOOD_TEXT[mood], 20);
  el.catWrap.classList.remove("speaking");
}

function renderTaskTimeline() {
  const keys = dayKeys();
  const maxUnlocked = unlockedMaxDayIndex();
  if (state.activeDay > maxUnlocked) state.activeDay = maxUnlocked;
  el.dayTimeline.innerHTML = "";
  el.debugDaySelect.value = `${state.activeDay}`;

  keys.forEach((key, idx) => {
    const unlocked = idx <= maxUnlocked;
    const node = document.createElement("li");
    node.className = `day-node ${unlocked ? "unlocked" : "locked"} ${idx === state.activeDay ? "active" : ""}`;
    node.innerHTML = `
      <span class="day-dot"></span>
      <div class="day-content">
        <div class="top"><strong>${idx === 0 ? "今天" : `第${idx + 1}天`}</strong><span class="tiny-hint">${key}</span></div>
        <p class="tiny-hint">${unlocked ? `已完成 ${countDayDone(key)}/${dayTaskCount(key)}` : "未解锁"}</p>
      </div>
    `;

    const content = node.querySelector(".day-content");
    if (unlocked) {
      const btn = document.createElement("button");
      btn.className = "btn tiny";
      btn.textContent = idx === state.activeDay ? "当前" : "查看";
      btn.addEventListener("click", () => {
        state.activeDay = idx;
        state.activeTask = firstUndoneTaskIndex(currentDayTasks(), currentDayKey());
        el.timelineBody.classList.add("collapsed");
        el.toggleTimeline.textContent = "展开";
        maybeTriggerEvent();
        renderTaskTimeline();
        renderTaskPanel();
        saveState();
      });
      content.appendChild(btn);
    }
    el.dayTimeline.appendChild(node);
  });

  el.nextCountdown.textContent = buildNextUnlockText();
}

async function renderTaskPanel() {
  const key = currentDayKey();
  const tasks = currentDayTasks();
  el.daySubtitle.textContent = `${key} · 第${state.activeDay + 1}天`;
  renderEventCard();

  if (!tasks.length) {
    el.taskBubbleText.textContent = "先确认职业再开始任务。";
    el.taskTitle.textContent = "暂无任务";
    el.taskPrompt.textContent = "";
    el.taskMeta.textContent = "";
    el.taskAction.innerHTML = "";
    el.nextTask.disabled = true;
    return;
  }

  if (state.activeTask < 0) state.activeTask = 0;
  if (state.activeTask >= tasks.length) state.activeTask = tasks.length - 1;

  if (isDayCompleted(key)) {
    completeDayIfNeeded(key);
    const scripted = scriptedDayForActive();
    const token = ++typingToken;
    setCatVisual("excited");
    el.taskCatWrap.classList.add("speaking");
    await typeTo(el.taskBubbleText, "所有任务完成啦，我们今天收工。", 18, token);
    await typeTo(el.taskTitle, "所有任务完成啦", 16, token);
    await typeTo(el.taskPrompt, scripted && scripted.night ? scripted.night : "休息一下，准备迎接下一天的新任务。", 15, token);
    el.taskCatWrap.classList.remove("speaking");
    el.taskMeta.textContent = buildCurrentDayUnlockCountdown(key);
    el.taskIndex.textContent = `${tasks.length} / ${tasks.length}`;
    el.taskAction.innerHTML = `<p class="feedback">今天的 ${tasks.length} 个任务已全部完成。</p>`;
    el.nextTask.disabled = true;
    el.nextTask.textContent = "已完成";
    return;
  }

  const task = tasks[state.activeTask];
  const status = getTaskState(key, task.id);
  const scripted = scriptedDayForActive();

  setCatVisual(currentMood(task.careerId));
  el.taskCatWrap.classList.add("speaking");
  const token = ++typingToken;
  const intro = scripted && state.activeTask === 0 ? `${scripted.morning}\n\n` : "";
  await typeTo(el.taskBubbleText, `${intro}${task.problem}`, 19, token);
  await typeTo(el.taskTitle, `${task.title} · ${task.typeLabel}`, 16, token);
  await typeTo(el.taskPrompt, task.prompt, 15, token);
  el.taskMeta.textContent = `第${state.activeDay + 1}天 · ${task.difficulty}`;
  el.taskCatWrap.classList.remove("speaking");

  el.taskIndex.textContent = `${state.activeTask + 1} / ${tasks.length}`;
  renderTaskAction(key, task, status);
  const latest = getTaskState(key, task.id);
  if (latest.needAck) {
    el.nextTask.disabled = true;
    el.nextTask.textContent = "先确认答案";
  } else {
    el.nextTask.disabled = false;
    el.nextTask.textContent = state.activeTask === tasks.length - 1 ? "完成今日" : "下一个";
  }
}

function renderTaskAction(dayKey, task, status) {
  el.taskAction.innerHTML = "";
  if (status.done) {
    const p = document.createElement("p");
    p.className = "feedback";
    p.textContent = `已完成：+${task.reward.exp}经验，+${task.reward.affection}情感。${status.feedback || ""}`;
    el.taskAction.appendChild(p);
    if (status.answerText) {
      const ans = document.createElement("p");
      ans.className = "feedback";
      ans.textContent = `标准答案：${status.answerText}`;
      el.taskAction.appendChild(ans);
    }
    if (status.needAck) {
      const ack = document.createElement("button");
      ack.className = "btn btn-primary block";
      ack.textContent = "我知道了";
      ack.addEventListener("click", () => acknowledgeAnswer(dayKey, task.id));
      el.taskAction.appendChild(ack);
    }
    return;
  }

  if (task.type === "learn") {
    const btn = document.createElement("button");
    btn.className = "btn btn-primary block";
    btn.textContent = "我知道了";
    btn.addEventListener("click", () => completeLearn(dayKey, task));
    el.taskAction.appendChild(btn);
  }

  if (task.type === "choice") {
    const wrap = document.createElement("div");
    wrap.className = "option-list";
    task.options.forEach((opt, idx) => {
      const b = document.createElement("button");
      b.className = "option-btn";
      b.textContent = opt;
      if (typeof status.selected === "number") {
        if (idx === task.answer) b.classList.add("correct");
        if (idx === status.selected && idx !== task.answer) b.classList.add("wrong");
      }
      b.addEventListener("click", () => answerChoice(dayKey, task, idx));
      wrap.appendChild(b);
    });
    el.taskAction.appendChild(wrap);
  }

  if (task.type === "boolean") {
    const wrap = document.createElement("div");
    wrap.className = "option-list";
    [
      { label: "正确", value: true },
      { label: "错误", value: false }
    ].forEach((opt) => {
      const b = document.createElement("button");
      b.className = "option-btn";
      b.textContent = opt.label;
      if (typeof status.selected === "boolean") {
        if (opt.value === task.answer) b.classList.add("correct");
        if (opt.value === status.selected && opt.value !== task.answer) b.classList.add("wrong");
      }
      b.addEventListener("click", () => answerBoolean(dayKey, task, opt.value));
      wrap.appendChild(b);
    });
    el.taskAction.appendChild(wrap);
  }

  if (task.type === "typo") {
    const para = document.createElement("p");
    para.className = "feedback";
    para.textContent = `原文：${task.paragraph}`;
    el.taskAction.appendChild(para);

    const ta = document.createElement("textarea");
    ta.className = "text-input";
    ta.value = status.input || task.paragraph;
    el.taskAction.appendChild(ta);

    const submit = document.createElement("button");
    submit.className = "btn btn-primary block";
    submit.textContent = "提交纠错";
    submit.addEventListener("click", () => answerTypo(dayKey, task, ta.value));
    el.taskAction.appendChild(submit);
  }

  if (task.type === "fill") {
    const wrap = document.createElement("div");
    wrap.className = "option-list";
    const labels = task.placeholders && task.placeholders.length ? task.placeholders : ["答案1", "答案2"];
    const initial = Array.isArray(status.inputs) ? status.inputs : [];
    const refs = [];
    labels.forEach((label, idx) => {
      const row = document.createElement("div");
      row.className = "fill-line";
      row.style.display = "grid";
      row.style.gridTemplateColumns = "56px 1fr";
      row.style.gap = "8px";
      row.style.alignItems = "center";

      const t = document.createElement("span");
      t.className = "tiny-hint";
      t.textContent = label;
      row.appendChild(t);

      const input = document.createElement("input");
      input.className = "text-input";
      input.placeholder = `填写${label}`;
      input.value = initial[idx] || "";
      row.appendChild(input);
      refs.push(input);
      wrap.appendChild(row);
    });
    el.taskAction.appendChild(wrap);

    const submit = document.createElement("button");
    submit.className = "btn btn-primary block";
    submit.textContent = "提交答案";
    submit.addEventListener("click", () => answerFill(dayKey, task, refs.map((x) => x.value)));
    el.taskAction.appendChild(submit);
  }

  const reveal = document.createElement("button");
  reveal.className = "btn block";
  reveal.textContent = "不会，查看答案";
  reveal.addEventListener("click", () => revealAnswer(dayKey, task));
  el.taskAction.appendChild(reveal);

  if (status.feedback) {
    const feedback = document.createElement("p");
    feedback.className = "feedback";
    feedback.textContent = status.feedback;
    el.taskAction.appendChild(feedback);
  }
}

function acknowledgeAnswer(dayKey, taskId) {
  const st = getTaskState(dayKey, taskId);
  setTaskState(dayKey, taskId, { ...st, needAck: false });
  saveState();
  renderTaskResultWithoutTyping(dayKey, taskId);
}

function completeLearn(dayKey, task) {
  grantReward(task);
  setTaskState(dayKey, task.id, {
    done: true,
    needAck: true,
    answerText: formatTaskAnswer(task),
    feedback: "你认真听完了，我记得更牢了。"
  });
  state.lastActionResult = "success";
  state.lastInteraction = Date.now();
  addTimeline(`${dayKey} 完成学习任务：${task.title}`);
  maybeTriggerEvent(true);
  afterTaskCompletion(dayKey, "学习任务完成", task.id);
}

function answerChoice(dayKey, task, selected) {
  state.lastInteraction = Date.now();
  if (selected === task.answer) {
    grantReward(task);
    setTaskState(dayKey, task.id, {
      done: true,
      selected,
      needAck: true,
      answerText: formatTaskAnswer(task),
      feedback: `回答正确。${task.explain}`
    });
    state.lastActionResult = "success";
    addTimeline(`${dayKey} 协助完成：${task.title}`);
    maybeTriggerEvent(true);
    afterTaskCompletion(dayKey, "任务完成", task.id);
  } else {
    state.affection = clamp(state.affection - Math.round(4 * careerDifficulty(task.careerId)), 0, 100);
    setTaskState(dayKey, task.id, { done: false, selected, feedback: `这次不对。${task.explain}` });
    state.lastActionResult = "fail";
    addTimeline(`${dayKey} 任务失误：${task.title}`);
    showToast("答案不对，再试一次");
    saveState();
    renderHome();
    const taskNow = currentDayTasks()[state.activeTask];
    renderTaskAction(dayKey, taskNow, getTaskState(dayKey, task.id));
    renderGrowth();
  }
}

function answerBoolean(dayKey, task, selected) {
  state.lastInteraction = Date.now();
  if (selected === task.answer) {
    grantReward(task);
    setTaskState(dayKey, task.id, {
      done: true,
      selected,
      needAck: true,
      answerText: formatTaskAnswer(task),
      feedback: `判断正确。${task.explain}`
    });
    state.lastActionResult = "success";
    addTimeline(`${dayKey} 完成判断：${task.title}`);
    maybeTriggerEvent(true);
    afterTaskCompletion(dayKey, "判断正确", task.id);
  } else {
    state.affection = clamp(state.affection - Math.round(4 * careerDifficulty(task.careerId)), 0, 100);
    setTaskState(dayKey, task.id, { done: false, selected, feedback: `判断错误。${task.explain}` });
    state.lastActionResult = "fail";
    addTimeline(`${dayKey} 判断失误：${task.title}`);
    showToast("判断错误，再试一次");
    saveState();
    renderHome();
    const taskNow = currentDayTasks()[state.activeTask];
    renderTaskAction(dayKey, taskNow, getTaskState(dayKey, task.id));
    renderGrowth();
  }
}

function answerFill(dayKey, task, text) {
  state.lastInteraction = Date.now();
  const result = evaluateFillResult(task, text);
  if (result.pass) {
    grantReward(task);
    if (result.full) grantExtraReward(task, 0.35);
    setTaskState(dayKey, task.id, {
      done: true,
      needAck: true,
      answerText: formatTaskAnswer(task),
      inputs: Array.isArray(text) ? text : [text],
      feedback: result.full
        ? `填写全对，获得额外加分。${task.explain}`
        : `填写通过（命中 ${result.matched}/${result.total} 关键词）。${task.explain}`
    });
    state.lastActionResult = "success";
    addTimeline(`${dayKey} 完成填空：${task.title}`);
    maybeTriggerEvent(true);
    afterTaskCompletion(dayKey, "填写正确", task.id);
  } else {
    state.affection = clamp(state.affection - Math.round(4 * careerDifficulty(task.careerId)), 0, 100);
    setTaskState(dayKey, task.id, {
      done: false,
      inputs: Array.isArray(text) ? text : [text],
      feedback: `答案不完整（命中 ${result.matched}/${result.total}）。提示：${task.explain}`
    });
    state.lastActionResult = "fail";
    addTimeline(`${dayKey} 填空未通过：${task.title}`);
    showToast("答案还不完整，请再检查");
    saveState();
    renderHome();
    const taskNow = currentDayTasks()[state.activeTask];
    renderTaskAction(dayKey, taskNow, getTaskState(dayKey, task.id));
    renderGrowth();
  }
}

function answerTypo(dayKey, task, text) {
  state.lastInteraction = Date.now();
  const result = evaluateTypoResult(task, text);
  if (result.pass) {
    grantReward(task);
    if (result.full) grantExtraReward(task, 0.4);
    setTaskState(dayKey, task.id, {
      done: true,
      needAck: true,
      answerText: formatTaskAnswer(task),
      input: text,
      feedback: result.full
        ? `纠错全对，获得额外加分。${task.explain}`
        : `纠错通过（命中 ${result.matched}/${result.total} 关键词）。${task.explain}`
    });
    state.lastActionResult = "success";
    addTimeline(`${dayKey} 完成纠错：${task.title}`);
    maybeTriggerEvent(true);
    afterTaskCompletion(dayKey, "纠错成功", task.id);
  } else {
    state.affection = clamp(state.affection - Math.round(5 * careerDifficulty(task.careerId)), 0, 100);
    setTaskState(dayKey, task.id, { done: false, input: text, feedback: `还没完全改对。提示：${task.explain}` });
    state.lastActionResult = "fail";
    addTimeline(`${dayKey} 纠错未通过：${task.title}`);
    showToast("答案还不完整，请再检查");
    saveState();
    renderHome();
    const taskNow = currentDayTasks()[state.activeTask];
    renderTaskAction(dayKey, taskNow, getTaskState(dayKey, task.id));
    renderGrowth();
  }
}

function revealAnswer(dayKey, task) {
  state.lastInteraction = Date.now();
  grantReward(task, 0.35);
  setTaskState(dayKey, task.id, {
    done: true,
    usedHelp: true,
    needAck: true,
    answerText: formatTaskAnswer(task),
    feedback: "已查看答案。"
  });
  state.lastActionResult = "neutral";
  addTimeline(`${dayKey} 查看答案通过：${task.title}`);
  afterTaskCompletion(dayKey, "已展示答案并通过", task.id);
}

function afterTaskCompletion(dayKey, toastText, taskId = null) {
  if (isDayCompleted(dayKey)) completeDayIfNeeded(dayKey);
  showToast(toastText);
  saveState();
  renderHome();
  renderTaskTimeline();
  if (taskId && !isDayCompleted(dayKey)) {
    renderTaskResultWithoutTyping(dayKey, taskId);
  } else {
    renderTaskPanel();
  }
  renderGrowth();
}

function renderTaskResultWithoutTyping(dayKey, taskId) {
  const tasks = currentDayTasks();
  const task = tasks.find((x) => x.id === taskId) || tasks[state.activeTask];
  if (!task) return;
  const status = getTaskState(dayKey, task.id);
  el.taskIndex.textContent = `${state.activeTask + 1} / ${tasks.length}`;
  renderTaskAction(dayKey, task, status);
  if (isDayCompleted(dayKey)) {
    el.nextTask.disabled = true;
    el.nextTask.textContent = "已完成";
    return;
  }
  if (status.needAck) {
    el.nextTask.disabled = true;
    el.nextTask.textContent = "先确认答案";
  } else {
    el.nextTask.disabled = false;
    el.nextTask.textContent = state.activeTask === tasks.length - 1 ? "完成今日" : "下一个";
  }
}

function switchTask(step) {
  if (step <= 0) return;
  const key = currentDayKey();
  const tasks = currentDayTasks();
  if (!tasks.length) return;

  if (isDayCompleted(key)) {
    showToast("所有任务完成啦");
    return;
  }

  const current = tasks[state.activeTask];
  const currentState = current ? getTaskState(key, current.id) : null;
  if (!current || !currentState.done) {
    showToast("请先完成当前任务");
    return;
  }
  if (currentState.needAck) {
    showToast("请先确认答案");
    return;
  }

  if (state.activeTask < tasks.length - 1) {
    state.activeTask += 1;
  } else {
    completeDayIfNeeded(key);
  }

  renderTaskPanel();
  saveState();
}
function onPatCat() {
  state.lastInteraction = Date.now();
  const mood = currentMood();
  let text = "喵~";
  if (mood === "sad") {
    state.affection = clamp(state.affection + 3, 0, 100);
    text = "谢谢你拍拍我，我好些了。";
  } else if (mood === "excited") {
    state.affection = clamp(state.affection + 1, 0, 100);
    text = "我状态很好，我们继续！";
  } else {
    state.affection = clamp(state.affection + 2, 0, 100);
    text = "收到鼓励啦。";
  }
  setCatVisual(currentMood());
  el.catWrap.classList.add("speaking");
  typeTo(el.catReaction, text, 18).then(() => el.catWrap.classList.remove("speaking"));
  saveState();
}

function maybeTriggerEvent(onTaskFinish = false) {
  const dayKey = currentDayKey();
  if (state.dayEvents[dayKey] && !state.dayEvents[dayKey].resolved) return;
  if (Math.random() > (onTaskFinish ? 0.42 : 0.25)) return;

  const pool = EVENT_BANK[state.selectedCareerId] || EVENT_BANK.common;
  const pick = pool[Math.floor(Math.random() * pool.length)];
  state.dayEvents[dayKey] = { title: pick.title, desc: pick.desc, options: pick.options, resolved: false };
  addTimeline(`${dayKey} 触发突发事件：${pick.title}`);
  saveState();
}

function renderEventCard() {
  const dayKey = currentDayKey();
  const event = state.dayEvents[dayKey];
  if (!event || event.resolved) {
    el.eventCard.hidden = true;
    return;
  }

  el.eventCard.hidden = false;
  el.eventTitle.textContent = event.title;
  el.eventDesc.textContent = event.desc;
  el.eventActions.innerHTML = "";

  event.options.forEach((opt, idx) => {
    const b = document.createElement("button");
    b.className = `btn ${idx === 0 ? "btn-primary" : ""}`;
    b.textContent = opt.text;
    b.addEventListener("click", () => resolveEvent(dayKey, idx));
    el.eventActions.appendChild(b);
  });
}

function resolveEvent(dayKey, optionIndex) {
  const event = state.dayEvents[dayKey];
  if (!event || event.resolved) return;
  const chosen = event.options[optionIndex];
  const effects = chosen.effects;

  state.affection = clamp(state.affection + (effects.affection || 0), 0, 100);
  state.exp = Math.max(0, state.exp + (effects.exp || 0));
  if (!state.dayMods[dayKey]) state.dayMods[dayKey] = { rewardScale: 0 };
  state.dayMods[dayKey].rewardScale = clamp((state.dayMods[dayKey].rewardScale || 0) + (effects.rewardScale || 0), -0.35, 0.35);
  state.lastActionResult = effects.affection >= 0 ? "success" : "fail";
  state.lastInteraction = Date.now();
  event.resolved = true;

  addTimeline(`${dayKey} 事件处理：${chosen.text}（${effects.note}）`);
  setCatVisual(effects.mood || currentMood());
  typeTo(el.taskBubbleText, effects.note, 17);

  saveState();
  renderTaskPanel();
  renderHome();
  renderGrowth();
  showToast("事件处理完成");
}

function grantReward(task, scale = 1) {
  const diff = careerDifficulty(task.careerId);
  const dayKey = currentDayKey();
  const mod = (state.dayMods[dayKey] && state.dayMods[dayKey].rewardScale) || 0;
  const expGain = Math.max(1, Math.round((task.reward.exp * scale / diff) * (1 + mod)));
  const affectionGain = Math.max(1, Math.round((task.reward.affection * scale) * (1 + mod / 2)));
  const skillGain = Math.max(1, Math.round((task.reward.skill || 1) * scale));

  state.exp += expGain;
  state.affection = clamp(state.affection + affectionGain, 0, 100);
  state.skillPoints[task.skill] = (state.skillPoints[task.skill] || 0) + skillGain;
  settleLevelUp();
}

function settleLevelUp() {
  while (state.exp >= expNeed(state.level)) {
    state.exp -= expNeed(state.level);
    state.level += 1;
    state.affection = clamp(state.affection + 2, 0, 100);
    addTimeline(`升级到 Lv.${state.level}`);
  }
}

function grantExtraReward(task, scale) {
  grantReward(task, scale);
}

function renderGrowth() {
  const career = getCareer();
  const skills = career ? career.skills : [];
  el.skillList.innerHTML = "";
  skills.forEach((skill) => {
    const point = state.skillPoints[skill] || 0;
    const pct = Math.min(100, point * 10);
    const item = document.createElement("div");
    item.className = "skill-item";
    item.innerHTML = `<strong>${skill} · Lv.${Math.floor(point / 4) + 1}</strong><div class="skill-bar"><span style="width:${pct}%"></span></div>`;
    el.skillList.appendChild(item);
  });

  el.timeline.innerHTML = "";
  state.timeline.slice(-18).reverse().forEach((entry) => {
    const li = document.createElement("li");
    li.textContent = entry;
    el.timeline.appendChild(li);
  });
}

function ensurePlanWindow(force = false) {
  if (!state.selectedCareerId) return;
  if (!state.startDateKey) state.startDateKey = dateKeyFromDate(new Date());

  const keys = dayKeys();
  if (!force && keys.every((k) => state.dayPlans[k])) return;

  keys.forEach((key, idx) => {
    state.dayPlans[key] = buildDayPlan(state.selectedCareerId, key, idx);
    if (!state.progress[key]) state.progress[key] = {};
    if (!state.dayMods[key]) state.dayMods[key] = { rewardScale: 0 };
  });

  saveState();
}

function migrateLegacyFillTasks() {
  let changed = false;
  Object.keys(state.dayPlans || {}).forEach((dayKey) => {
    const tasks = state.dayPlans[dayKey] || [];
    tasks.forEach((task) => {
      if (task.type !== "fill") return;
      const converted = toChoiceFromFill(task);
      task.type = "choice";
      task.typeLabel = "协助";
      task.options = converted.options;
      task.answer = converted.answer;
      task.prompt = converted.prompt;
      changed = true;
    });
  });
  if (changed) saveState();
}

function buildDayPlan(careerId, dayKey, dayOffset) {
  const dayNo = dayOffset + 1;
  const profile = milestoneProfile(dayNo);
  const scripted = DAY_CONTENT.scripted && DAY_CONTENT.scripted[dayNo];
  if (careerId === "clerk" && scripted) {
    return scripted.tasks.map((task, idx) => composeTask(task.type, task, careerId, dayNo, idx + 1, profile));
  }

  const targetCount = taskCountForDay(dayNo);
  const base = TASK_BANK.common;
  const careerBank = TASK_BANK[careerId] || {};
  const seed = hash(`${careerId}-${dayKey}`);
  const choiceBank = [...(careerBank.choice || []), ...base.choice];
  const typoBank = [...(careerBank.typo || []), ...base.typo];
  const learnBank = base.learn;
  const taskTypes = ["learn", "choice", "typo", "choice", "fill", "boolean"];
  const tasks = [];

  for (let i = 0; i < targetCount; i += 1) {
    const type = taskTypes[i % taskTypes.length];
    if (type === "learn") {
      tasks.push(composeTask(type, pick(learnBank, seed + 100 + i), careerId, dayNo, i + 1, profile));
    } else if (type === "choice") {
      tasks.push(composeTask(type, pick(choiceBank, seed + 200 + i), careerId, dayNo, i + 1, profile));
    } else if (type === "typo") {
      tasks.push(composeTask(type, pick(typoBank, seed + 300 + i), careerId, dayNo, i + 1, profile));
    } else if (type === "fill") {
      tasks.push(
        composeTask(
          "fill",
          {
            title: "流程填空",
            problem: "主人，这个流程术语我总记不全。",
            prompt: "请填写：正式文档发送前需先完成___与___。",
            placeholders: ["步骤1", "步骤2"],
            expectedWords: ["审核", "校对"],
            explain: "发文前至少要审核与校对。"
          },
          careerId,
          dayNo,
          i + 1,
          profile
        )
      );
    } else {
      tasks.push(
        composeTask(
          "boolean",
          {
            title: "规范判断",
            problem: "我想确认这个做法是否符合规范。",
            prompt: "判断：紧急任务可以跳过流程，事后补审批。",
            answer: false,
            explain: "紧急不代表可以无流程。"
          },
          careerId,
          dayNo,
          i + 1,
          profile
        )
      );
    }
  }
  return tasks;
}

function milestoneProfile(dayNo) {
  if (dayNo <= 5) return { label: `入门期 D${dayNo}`, rewardScale: 1, challenge: 1 };
  if (dayNo === 15) return { label: "关键期 D15", rewardScale: 1.35, challenge: 1.3 };
  if (dayNo === 20) return { label: "关键期 D20", rewardScale: 1.6, challenge: 1.55 };
  if (dayNo === 25) return { label: "关键期 D25", rewardScale: 1.9, challenge: 1.85 };
  if (dayNo === 30) return { label: "终局 D30", rewardScale: 2.2, challenge: 2.2 };
  if (dayNo < 15) return { label: `成长期 D${dayNo}`, rewardScale: 1.15, challenge: 1.15 };
  if (dayNo < 20) return { label: `进阶期 D${dayNo}`, rewardScale: 1.45, challenge: 1.45 };
  if (dayNo < 25) return { label: `高压期 D${dayNo}`, rewardScale: 1.75, challenge: 1.75 };
  return { label: `专家期 D${dayNo}`, rewardScale: 2.0, challenge: 2.0 };
}

function composeTask(type, source, careerId, dayNo, order, profile) {
  const normalizedType = type === "fill" ? "choice" : type;
  const baseReward =
    normalizedType === "learn"
      ? { exp: 16, affection: 6, skill: 1 }
      : normalizedType === "typo"
      ? { exp: 32, affection: 9, skill: 2 }
      : normalizedType === "boolean"
      ? { exp: 20, affection: 7, skill: 1 }
      : { exp: 26, affection: 8, skill: 2 };
  const reward = {
    exp: Math.round(baseReward.exp * profile.rewardScale),
    affection: Math.round(baseReward.affection * (0.9 + profile.rewardScale * 0.2)),
    skill: Math.max(1, Math.round(baseReward.skill * Math.min(2.5, profile.rewardScale)))
  };

  const fillChoice = type === "fill" ? toChoiceFromFill(source) : null;
  const promptBase = fillChoice ? fillChoice.prompt : source.prompt;
  const prompt = buildPromptByDay(normalizedType, promptBase, dayNo, profile.challenge);

  return {
    id: `${careerId}-${dayNo}-${order}-${hash(source.title)}`,
    careerId,
    type: normalizedType,
    typeLabel: normalizedType === "learn" ? "学习" : normalizedType === "typo" ? "段落纠错" : normalizedType === "boolean" ? "判断" : "协助",
    title: source.title,
    problem: source.problem,
    prompt,
    options: fillChoice ? fillChoice.options : source.options || [],
    answer: fillChoice ? fillChoice.answer : source.answer,
    paragraph: source.paragraph,
    wrongWords: source.wrongWords || [],
    expectedWords: source.expectedWords || [],
    placeholders: source.placeholders || [],
    explain: source.explain || "",
    difficulty: profile.label,
    skill: inferSkill(careerId, type, source.title),
    reward
  };
}

function buildPromptByDay(type, basePrompt, dayNo, challenge) {
  if (type === "learn") {
    if (dayNo <= 5) return `${basePrompt}（完成后点“我知道了”）`;
    if (dayNo === 15) return `${basePrompt}（再补一句你会如何落地执行）`;
    if (dayNo >= 20) return `${basePrompt}（请结合你今天已做任务做一次复盘）`;
  }
  if (type === "typo") {
    if (dayNo <= 5) return `${basePrompt}（先改对 1-2 处错误）`;
    if (dayNo === 15) return `${basePrompt}（注意错字和语义都要通顺）`;
    if (dayNo >= 25) return `${basePrompt}（高难度：要求语义和格式都正确）`;
  }
  if (type === "choice") {
    if (dayNo <= 5) return `${basePrompt}（入门判断）`;
    if (dayNo >= 20) return `${basePrompt}（进阶判断：先想风险再作答）`;
  }
  if (type === "fill") {
    if (dayNo <= 5) return `${basePrompt}（填写关键术语）`;
    if (dayNo >= 20) return `${basePrompt}（要求术语完整准确）`;
  }
  if (type === "boolean") {
    if (dayNo <= 5) return `${basePrompt}（基础规则判断）`;
    if (dayNo >= 20) return `${basePrompt}（结合流程判断）`;
  }
  return `${basePrompt}（挑战系数 x${challenge.toFixed(1)}）`;
}

function inferSkill(careerId, type, title) {
  const career = CAREERS.find((c) => c.id === careerId);
  if (!career) return "通用";
  if (type === "typo") return career.skills[1] || career.skills[0];
  return career.skills[Math.abs(hash(title)) % career.skills.length];
}

function pick(list, seed, excludes = []) {
  const filtered = list.filter((item) => !excludes.includes(item.title));
  return filtered[seed % filtered.length];
}

function toChoiceFromFill(source) {
  const expected = source.expectedWords || [];
  const answerText = expected.join(" + ");
  const commonWrong = [
    expected.slice().reverse().join(" + "),
    expected.filter((_, idx) => idx % 2 === 0).join(" + "),
    expected.length ? `${expected[0]} + Ctrl+X` : "Ctrl+X + Ctrl+Y"
  ];
  const uniq = [];
  [answerText, ...commonWrong].forEach((x) => {
    const t = (x || "").trim();
    if (!t) return;
    if (!uniq.includes(t)) uniq.push(t);
  });
  while (uniq.length < 4) {
    uniq.push(`备选项${uniq.length + 1}`);
  }
  const options = uniq.slice(0, 4);
  const answer = options.indexOf(answerText);
  return {
    prompt: "以下哪组填写正确？",
    options,
    answer: answer >= 0 ? answer : 0
  };
}
function renderDaySelect() {
  el.debugDaySelect.innerHTML = "";
  for (let i = 0; i < TOTAL_DAYS; i += 1) {
    const option = document.createElement("option");
    option.value = `${i}`;
    option.textContent = `第${i + 1}天`;
    el.debugDaySelect.appendChild(option);
  }
  el.debugDaySelect.value = `${state.activeDay}`;
}

function setCatVisual(mood) {
  const src = YELLOW_CAT[mood] || YELLOW_CAT.normal;
  el.catPortrait.src = src;
  el.taskCatPortrait.src = src;
}

function currentMood(careerId = state.selectedCareerId) {
  const idleHours = (Date.now() - state.lastInteraction) / 3600000;
  const mismatch = careerId ? careerDifficulty(careerId) : 1;
  if (state.affection > 78 && state.lastActionResult === "success") return "excited";
  if (idleHours > 12 || state.affection < 40 || mismatch > 1.12 || state.lastActionResult === "fail") return "sad";
  return "normal";
}

function isDayCompleted(dayKey) {
  const tasks = state.dayPlans[dayKey] || [];
  if (!tasks.length) return false;
  return tasks.every((t) => (state.progress[dayKey] && state.progress[dayKey][t.id] && state.progress[dayKey][t.id].done));
}

function completeDayIfNeeded(dayKey) {
  if (!state.dayCompleteAt[dayKey]) {
    state.dayCompleteAt[dayKey] = Date.now();
    addTimeline(`${dayKey} 所有任务完成`);
    saveState();
  }
}

function buildCurrentDayUnlockCountdown(dayKey) {
  if (state.activeDay >= TOTAL_DAYS - 1) return "全部天数任务已到达。";
  if (!state.dayCompleteAt[dayKey]) return "";
  const left = state.dayCompleteAt[dayKey] + DAY_UNLOCK_MS - Date.now();
  if (left <= 0) return "下一天已解锁。";
  const total = Math.floor(left / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `所有任务完成啦，下一天将在 ${pad(m)}:${pad(s)} 后解锁。`;
}

function maybeAutoUnlockNextDay() {
  if (DEBUG_MODE) return false;
  const currentUnlockedKey = dayKeys()[state.unlockedDay];
  if (!currentUnlockedKey) return false;
  if (!isDayCompleted(currentUnlockedKey)) return false;
  completeDayIfNeeded(currentUnlockedKey);
  const doneAt = state.dayCompleteAt[currentUnlockedKey] || 0;
  if (Date.now() < doneAt + DAY_UNLOCK_MS) return false;
  if (state.unlockedDay >= TOTAL_DAYS - 1) return false;

  state.unlockedDay += 1;
  state.activeDay = state.unlockedDay;
  state.activeTask = 0;
  addTimeline(`解锁第${state.unlockedDay + 1}天任务`);
  saveState();
  return true;
}

function startCountdownLoop() {
  clearInterval(countdownTimer);
  countdownTimer = setInterval(() => {
    const unlocked = maybeAutoUnlockNextDay();
    if (!el.screens.task.classList.contains("active")) return;
    el.nextCountdown.textContent = buildNextUnlockText();
    if (unlocked) {
      renderTaskTimeline();
      renderTaskPanel();
    }
  }, 1000);
}

function currentDayKey() {
  return dayKeys()[state.activeDay] || dayKeys()[0];
}

function currentDayTasks() {
  return state.dayPlans[currentDayKey()] || [];
}

function getTaskState(dayKey, taskId) {
  return (state.progress[dayKey] && state.progress[dayKey][taskId]) || {};
}

function setTaskState(dayKey, taskId, value) {
  if (!state.progress[dayKey]) state.progress[dayKey] = {};
  state.progress[dayKey][taskId] = value;
}

function dayKeys() {
  const base = dateFromKey(state.startDateKey || dateKeyFromDate(new Date()));
  const arr = [];
  for (let i = 0; i < TOTAL_DAYS; i += 1) {
    arr.push(dateKeyFromDate(new Date(base.getTime() + i * 86400000)));
  }
  return arr;
}

function unlockedMaxDayIndex() {
  return DEBUG_MODE ? TOTAL_DAYS - 1 : state.unlockedDay;
}

function buildNextUnlockText() {
  const key = currentDayKey();
  if (!isDayCompleted(key)) return "";
  return buildCurrentDayUnlockCountdown(key);
}

function taskCountForDay(dayNo) {
  return DAY_CONTENT.tasksPerDay ? DAY_CONTENT.tasksPerDay(dayNo) : 5;
}

function scriptedDayForActive() {
  return (DAY_CONTENT.scripted && DAY_CONTENT.scripted[state.activeDay + 1]) || null;
}

function dayTaskCount(dayKey) {
  const tasks = state.dayPlans[dayKey] || [];
  return tasks.length || taskCountForDay(Math.max(1, dayKeys().indexOf(dayKey) + 1));
}

function evaluateFillResult(task, text) {
  const all = Array.isArray(text) ? text.join(" ") : `${text || ""}`;
  const normalized = normalize(all);
  const expected = task.expectedWords || [];
  const matched = expected.filter((w) => normalized.includes(normalize(w))).length;
  const passNeed = Math.max(1, Math.ceil(expected.length / 2));
  return {
    pass: matched >= passNeed,
    full: expected.length > 0 && matched >= expected.length,
    matched,
    total: expected.length
  };
}

function evaluateTypoResult(task, text) {
  const normalized = normalize(text);
  const expected = task.expectedWords || [];
  const wrong = task.wrongWords || [];
  const matched = expected.filter((w) => normalized.includes(normalize(w))).length;
  const removedWrong = wrong.filter((w) => !normalized.includes(normalize(w))).length;
  const passNeed = Math.max(1, Math.ceil(Math.max(expected.length, wrong.length) / 2));
  const pass = Math.max(matched, removedWrong) >= passNeed;
  const full = expected.length > 0 && wrong.length > 0 && matched >= expected.length && removedWrong >= wrong.length;
  return {
    pass,
    full,
    matched: Math.max(matched, removedWrong),
    total: Math.max(expected.length, wrong.length)
  };
}

function formatTaskAnswer(task) {
  if (task.type === "choice") return task.options && typeof task.answer === "number" ? task.options[task.answer] : "查看题目解析";
  if (task.type === "boolean") return task.answer ? "正确" : "错误";
  if (task.type === "typo") return (task.expectedWords || []).join("、") || task.explain || "请按提示修正";
  if (task.type === "fill") return (task.expectedWords || []).join("、") || "请参考解析";
  if (task.type === "learn") return task.prompt || task.explain || "请按任务提示完成";
  return task.explain || "请参考任务提示";
}

function firstUndoneTaskIndex(tasks, dayKey) {
  const idx = tasks.findIndex((task) => !getTaskState(dayKey, task.id).done);
  return idx === -1 ? tasks.length - 1 : idx;
}

function countDayDone(dayKey) {
  const map = state.progress[dayKey] || {};
  return Object.values(map).filter((x) => x.done).length;
}

function dateKeyFromDate(d) {
  return `${d.getFullYear()}-${`${d.getMonth() + 1}`.padStart(2, "0")}-${`${d.getDate()}`.padStart(2, "0")}`;
}

function dateFromKey(key) {
  const [y, m, d] = key.split("-").map((x) => Number(x));
  return new Date(y, m - 1, d, 0, 0, 0, 0);
}

function careerDifficulty(careerId) {
  const career = CAREERS.find((c) => c.id === careerId);
  return career ? career.base : 1;
}

function typeTo(target, text, speed = 18, token = null) {
  return new Promise((resolve) => {
    if (!target) return resolve();
    target.textContent = "";
    let i = 0;
    const t = setInterval(() => {
      if (token && token !== typingToken) {
        clearInterval(t);
        return resolve();
      }
      i += 1;
      target.textContent = text.slice(0, i);
      if (i >= text.length) {
        clearInterval(t);
        resolve();
      }
    }, speed);
  });
}

function shareProgress() {
  if (!state.selectedCareerId) return showToast("先开始游戏");
  const career = getCareer();
  const done = Object.values(state.progress).reduce((acc, day) => acc + Object.values(day).filter((x) => x.done).length, 0);
  const text = `我在职业猫中选择了${career.name}，当前Lv.${state.level}，情感值${state.affection}，已完成${done}个任务。`;
  if (navigator.share) return navigator.share({ title: "职业猫成长记录", text, url: window.location.href }).catch(() => {});
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(`${text} ${window.location.href}`).then(() => showToast("分享文案已复制"));
  showToast(text);
}

function resetProgress() {
  const ok = window.confirm("确认重置所有进度并回到初始状态吗？");
  if (!ok) return;
  state = defaultState();
  localStorage.removeItem(STORAGE_KEY);
  el.bottomNav.classList.add("hidden");
  renderCareerChoices();
  renderDaySelect();
  showScreen("launch", false);
  showToast("已重置进度");
}

function getCareer() {
  return CAREERS.find((c) => c.id === state.selectedCareerId) || null;
}

function expNeed(level) {
  return 100 + (level - 1) * 30;
}

function normalize(s) {
  return (s || "").replace(/\s+/g, "").replace(/[，。！？,.!?：:；;]/g, "").toLowerCase();
}

function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function pad(n) {
  return `${n}`.padStart(2, "0");
}

function addTimeline(text) {
  state.timeline.push(withTime(text));
  if (state.timeline.length > 120) state.timeline = state.timeline.slice(-120);
}

function withTime(text) {
  const d = new Date();
  return `${`${d.getHours()}`.padStart(2, "0")}:${`${d.getMinutes()}`.padStart(2, "0")} ${text}`;
}

let toastTimer = null;
function showToast(text) {
  el.toast.textContent = text;
  el.toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.toast.classList.remove("show"), 1600);
}
