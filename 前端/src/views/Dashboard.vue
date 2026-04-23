<template>
  <div>
    <div class="hero">
      <div>
        <p class="eyebrow">Case Process Dashboard</p>
        <h1>案件全流程可视化展示界面</h1>
      </div>
      <div class="toolbar">
        <button class="theme-btn" :class="{ 'is-active': currentTheme === 'neon' }" @click="switchTheme('neon')" type="button">
          夜间版
        </button>
        <button class="theme-btn" :class="{ 'is-active': currentTheme === 'sketch' }" @click="switchTheme('sketch')" type="button">
          日间版
        </button>
      </div>
    </div>

    <main class="dashboard">
      <section class="panel panel-overview">
        <div class="panel-title">
          <span class="panel-kicker"></span>
          <h2>案件总览</h2>
        </div>
        <div class="overview-grid">
          <div class="chart-container">
            <div class="chart-wrap">
              <svg class="donut" viewBox="0 0 240 240" aria-label="案件占比图">
                <g id="donut-segments"></g>
              </svg>
            </div>
            <div class="donut-text">
              <div class="donut-total">{{ totalCases }}</div>
              <div class="donut-label">案件总数</div>
            </div>
          </div>
          <div class="legend-list" id="legend-list"></div>
        </div>
        <div class="stat-row">
          <article class="mini-card">
            <span>本周新收</span>
            <strong>18 件</strong>
          </article>
          <article class="mini-card">
            <span>本周结案</span>
            <strong>11 件</strong>
          </article>
        </div>
      </section>

      <section class="panel panel-warning">
        <div class="panel-title">
          <span class="panel-kicker"></span>
          <h2>办理期限预警</h2>
        </div>
        <div class="table-card">
          <div class="table-head">
            <span>案件名称</span>
            <span>业务类型</span>
            <span>法定期限</span>
            <span>剩余天数</span>
            <span>状态</span>
          </div>
          <div class="table-body" id="warning-list"></div>
        </div>
      </section>

      <section class="panel panel-detail">
        <div class="panel-title">
          <span class="panel-kicker"></span>
          <h2>单案办理导图</h2>
        </div>
        <div class="detail-layout">
          <article class="detail-card">
            <h3>基础信息卡片</h3>
            <dl class="info-list">
              <div>
                <dt>承办人</dt>
                <dd>张某某</dd>
              </div>
              <div>
                <dt>收案时间</dt>
                <dd>2026-04-16</dd>
              </div>
              <div>
                <dt>当前状态</dt>
                <dd>审查起诉</dd>
              </div>
              <div>
                <dt>关键词</dt>
                <dd>涉案财物 / 程序超期</dd>
              </div>
            </dl>
          </article>
          <article class="detail-card timeline-card">
            <h3>单案时间轴</h3>
            <div class="timeline" id="case-timeline"></div>
          </article>
          <article class="detail-card detail-wide">
            <h3>异常与文书卡片</h3>
            <div class="detail-split">
              <div>
                <h4>异常问题详情</h4>
                <ul class="bullet-list">
                  <li>文书格式缺项，需补齐承办部门字段</li>
                  <li>程序流转超时 2 天，触发黄灯预警</li>
                  <li>涉案财物暂存未入库，待人工确认</li>
                </ul>
              </div>
              <div>
                <h4>关联文书</h4>
                <ul class="bullet-list">
                  <li>起诉意见书</li>
                  <li>证据目录</li>
                  <li>财物移交清单</li>
                </ul>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section class="panel panel-finance">
        <div class="panel-title">
          <span class="panel-kicker"></span>
          <h2>财务管理</h2>
        </div>
        <div class="finance-board">
          <article class="strip-card">
            <span>近期入库</span>
            <strong>24 件</strong>
          </article>
          <article class="strip-card">
            <span>暂存总数</span>
            <strong>11 件</strong>
          </article>
          <article class="strip-card">
            <span>待清理</span>
            <strong>5 件</strong>
          </article>
        </div>
      </section>

      <section class="panel panel-abnormal">
        <div class="panel-title">
          <span class="panel-kicker"></span>
          <h2>异常问题监控</h2>
        </div>
        <div class="table-card compact">
          <div class="table-head">
            <span>案号</span>
            <span>案件名称</span>
            <span>业务类型</span>
            <span>异常类型</span>
            <span>当前环节</span>
          </div>
          <div class="table-body" id="abnormal-list"></div>
        </div>
      </section>

      <section class="panel panel-flow">
        <div class="panel-title panel-title-wide">
          <span class="panel-kicker"></span>
          <h2>办案全流程法定期限对照表</h2>
        </div>
        <div class="flow-wrapper">
          <div class="flow-track" id="flow-track"></div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useCaseStore } from '../stores/case'

const caseStore = useCaseStore()
const allCases = computed(() => caseStore.cases)
const summary = computed(() => caseStore.warningSummary)
const currentTheme = ref('neon')

// 数据
const overviewData = [
  { name: "刑事检察", value: 42, color: "#4f9dff" },
  { name: "民事检察", value: 31, color: "#48d597" },
  { name: "行政检察", value: 19, color: "#ffb23d" },
  { name: "公益诉讼", value: 15, color: "#aa6fff" },
];

const warningData = [
  {
    name: "【案号A】刑事审查起诉",
    type: "刑事",
    limit: "15 天",
    remain: "剩余 1 天",
    status: "紧急",
    statusClass: "badge-danger",
  },
  {
    name: "【案号B】民事抗诉审查",
    type: "民事",
    limit: "30 天",
    remain: "剩余 5 天",
    status: "预警",
    statusClass: "badge-warning",
  },
  {
    name: "【案号C】行政监督立案",
    type: "行政",
    limit: "20 天",
    remain: "剩余 11 天",
    status: "正常",
    statusClass: "badge-normal",
  },
];

const abnormalData = [
  {
    code: "案号A",
    name: "刑事-审查起诉",
    type: "刑事",
    issue: "文书格式错误",
    step: "文书校验",
  },
  {
    code: "案号B",
    name: "民事-抗诉审查",
    type: "民事",
    issue: "程序流转超时",
    step: "流程节点",
  },
  {
    code: "案号C",
    name: "公益诉讼-线索核查",
    type: "公益",
    issue: "涉案财物未入库",
    step: "财物管理",
  },
];

const timelineData = [
  { date: "2026-04-16", title: "案件受理", desc: "系统录入并自动生成流程卡片" },
  { date: "2026-04-17", title: "文书校验", desc: "发现承办部门字段缺失，推送异常提醒" },
  { date: "2026-04-18", title: "财物登记", desc: "暂存涉案财物 3 件，待确认入库" },
  { date: "2026-04-19", title: "期限预警", desc: "当前节点剩余 1 天，进入红色预警" },
];

const flowData = [
  { stage: "受案登记", time: "1 个工作日", note: "案件录入 / 编号生成" },
  { stage: "材料分流", time: "2 个工作日", note: "按业务类型流转", alert: true },
  { stage: "文书校验", time: "3 个工作日", note: "规则校验 / 缺项提醒" },
  { stage: "财物管理", time: "5 个工作日", note: "暂存 / 入库 / 清退" },
  { stage: "期限审查", time: "1 个工作日", note: "剩余时限自动计算", alert: true },
  { stage: "结案归档", time: "2 个工作日", note: "归档 / 报表沉淀" },
];

// 计算案件总数
const totalCases = computed(() => {
  return overviewData.reduce((sum, item) => sum + item.value, 0);
});

// 渲染环形图
function renderDonut() {
  const total = overviewData.reduce((sum, item) => sum + item.value, 0);
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  const segmentWrap = document.getElementById("donut-segments");
  const legendList = document.getElementById("legend-list");

  if (segmentWrap && legendList) {
    segmentWrap.innerHTML = "";
    legendList.innerHTML = "";

    // 定义颜色数组
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

    overviewData.forEach((item, index) => {
      const percent = item.value / total;
      const dash = circumference * percent;
      
      // 创建环形图片段
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("class", "segment");
      circle.setAttribute("cx", "120");
      circle.setAttribute("cy", "120");
      circle.setAttribute("r", radius.toString());
      circle.setAttribute("stroke", colors[index % colors.length]);
      circle.setAttribute("stroke-width", "20");
      circle.setAttribute("stroke-dasharray", `${dash} ${circumference - dash}`);
      circle.setAttribute("stroke-dashoffset", `${-offset}`);
      circle.setAttribute("transform", "rotate(-90 120 120)");
      circle.setAttribute("fill", "none");
      segmentWrap.appendChild(circle);

      offset += dash;

      // 创建图例
      const legend = document.createElement("div");
      legend.className = "legend-item";
      legend.innerHTML = `
        <div class="legend-dot" style="background:${colors[index % colors.length]}"></div>
        <div class="legend-content">
          <div class="legend-name">${item.name}</div>
          <div class="legend-value">${item.value} 件 / ${Math.round(percent * 100)}%</div>
        </div>
      `;
      legendList.appendChild(legend);
    });
  }
}

// 渲染表格
function renderTable(listId, rows, mapper) {
  const container = document.getElementById(listId);
  if (container) {
    container.innerHTML = "";

    rows.forEach((row) => {
      const item = document.createElement("div");
      item.className = "table-row";
      // 确保mapper返回的HTML被正确解析
      const html = mapper(row).trim();
      item.innerHTML = html;
      container.appendChild(item);
    });
  }
}

// 渲染时间轴
function renderTimeline() {
  const timeline = document.getElementById("case-timeline");
  if (timeline) {
    timeline.innerHTML = "";

    timelineData.forEach((item) => {
      const node = document.createElement("article");
      node.className = "timeline-item";
      node.innerHTML = `
        <div class="timeline-date">${item.date}</div>
        <strong>${item.title}</strong>
        <div class="flow-meta">${item.desc}</div>
      `;
      timeline.appendChild(node);
    });
  }
}

// 渲染流程图
function renderFlow() {
  const track = document.getElementById("flow-track");
  if (track) {
    track.innerHTML = "";

    flowData.forEach((item) => {
      const node = document.createElement("article");
      node.className = `flow-node${item.alert ? " alert" : ""}`;
      node.innerHTML = `
        <div class="flow-stage">${item.stage}</div>
        <div class="flow-meta">法定期限：${item.time}</div>
        <div class="flow-meta">${item.note}</div>
      `;
      track.appendChild(node);
    });
  }
}

// 切换主题
function switchTheme(theme) {
  currentTheme.value = theme;
  document.body.dataset.theme = theme;
}

// 组件挂载后渲染
onMounted(() => {
  renderDonut();
  renderTable(
    "warning-list",
    warningData,
    (row) => `
      <span class="case-name">${row.name}</span>
      <span>${row.type}</span>
      <span>${row.limit}</span>
      <span>${row.remain}</span>
      <span class="badge ${row.statusClass}">${row.status}</span>
    `,
  );
  renderTable(
    "abnormal-list",
    abnormalData,
    (row) => `
      <span class="case-name">${row.code}</span>
      <span>${row.name}</span>
      <span>${row.type}</span>
      <span>${row.issue}</span>
      <span>${row.step}</span>
    `,
  );
  renderTimeline();
  renderFlow();
});
</script>

<style>
.hero {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 18px;
  margin-bottom: 22px;
}

.eyebrow {
  margin: 0 0 8px;
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 0.24em;
  font-size: 12px;
}

h1, h2, h3, h4 {
  margin: 0;
  font-weight: 700;
}

h1 {
  font-size: clamp(28px, 4vw, 52px);
  line-height: 1.06;
  letter-spacing: 0.03em;
}

.toolbar {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.theme-btn {
  border: 1px solid rgba(61, 150, 222, 0.35);
  background: rgba(13, 35, 64, 0.84);
  color: var(--text-main);
  padding: 12px 18px;
  border-radius: 999px;
  cursor: pointer;
  font: inherit;
  letter-spacing: 0.04em;
  transition: all 180ms ease; /* 统一过渡效果 */
  font-weight: 500; /* 基础加粗，提升文字可读性 */
}

.theme-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.14);
  background: rgba(46, 199, 255, 0.22);
  border-color: rgba(46, 199, 255, 0.6);
}
/* 激活态强化：比 hover 更突出 */
.theme-btn.is-active {
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
  background: rgba(46, 199, 255, 0.4); /* 加深背景透明度 */
  border-color: rgba(46, 199, 255, 0.8); /* 强化边框 */
  color: #ffffff; /* 强制白色文字，避免变量失效 */
  font-weight: 600; /* 激活态加粗，进一步区分 */
}
/* ========== 日间版（sketch）样式重点优化 ========== */
body[data-theme="sketch"] .theme-btn {
  border-radius: 6px;
  background: rgba(255, 251, 243, 0.95);
  border-color: rgba(63, 72, 96, 0.55);
  color: #273043; /* 深色文字，提升基础可读性 */
  font-weight: 500;
}

/* 日间版 hover：轻微变色，保留交互感 */
body[data-theme="sketch"] .theme-btn:hover {
  background: rgba(68, 83, 166, 0.15);
  border-color: rgba(68, 83, 166, 0.6);
  color: #273043;
}

/* 日间版激活态：强对比配色，一眼识别 */
body[data-theme="sketch"] .theme-btn.is-active {
  background: #4453a6; /* 深蓝色背景，和浅色界面形成强对比 */
  border-color: #4453a6; /* 同背景色边框，强化按钮感 */
  color: #ffffff !important; /* 白色文字，对比度拉满 */
  box-shadow: 0 4px 12px rgba(68, 83, 166, 0.3); /* 专属阴影，突出层级 */
  transform: translateY(-1px);
  font-weight: 600;
}

/* 移动端适配 */
@media (max-width: 820px) {
  .theme-btn {
    padding: 10px 14px; /* 缩小内边距 */
    font-size: 14px; /* 缩小字体 */
    letter-spacing: 0.02em; /* 减小字母间距 */
  }
  .theme-btn:hover,
  .theme-btn.is-active {
    transform: translateY(-0.5px); /* 减小位移 */
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* 缩小阴影 */
  }
}


.dashboard {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 16px;
}

.panel {
  position: relative;
  overflow: hidden;
  background: linear-gradient(160deg, rgba(18, 43, 74, 0.88), rgba(11, 27, 48, 0.92));
  border: 1px solid rgba(61, 150, 222, 0.35);
  border-radius: 18px;
  box-shadow: inset 0 0 20px rgba(38, 148, 255, 0.08), 0 8px 22px rgba(0, 0, 0, 0.2);
  padding: 18px;
}

.panel::after {
  content: "";
  position: absolute;
  inset: 10px;
  border: 1px solid rgba(61, 150, 222, 0.2);
  border-radius: 12px;
  pointer-events: none;
}

.panel-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}

.panel-title-wide {
  margin-bottom: 18px;
}

.panel-title h2 {
  font-size: 24px;
  letter-spacing: 0.05em;
}

.panel-kicker {
  width: 8px;
  height: 24px;
  border-radius: 999px;
  background: linear-gradient(180deg, var(--accent), transparent);
  box-shadow: 0 0 18px rgba(46, 199, 255, 0.35);
}

.panel-overview,
.panel-warning,
.panel-detail {
  grid-column: span 4;
  min-height: 356px;
}

.panel-finance {
  grid-column: span 4;
  min-height: 190px;
}

.panel-abnormal {
  grid-column: span 8;
  min-height: 190px;
}

.panel-flow {
  grid-column: 1 / -1;
  min-height: 260px;
}

.overview-grid {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 16px;
  align-items: center;
}

.chart-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 220px;
  height: 220px;
}

.chart-wrap {
  display: flex;
  justify-content: center;
  animation: rotate 2s ease-out forwards;
}

.donut-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  pointer-events: none;
  line-height: 1.2;
}

.donut-text .donut-total {
  font-size: 36px;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 4px;
}

.donut-text .donut-label {
  font-size: 14px;
  color: var(--text-soft);
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.donut {
  width: 220px;
  max-width: 100%;
  overflow: visible;
}

.donut-track {
  fill: transparent;
  stroke: rgba(61, 150, 222, 0.28);
  stroke-width: 26;
}

.donut-core {
  stroke: rgba(13, 35, 64, 0.95);
  stroke-width: 2;
  fill: rgba(18, 43, 74, 0.92);
}



.segment {
  fill: none;
  stroke-linecap: round;
  transition: opacity 220ms ease;
}

.legend-list {
  display: grid;
  gap: 10px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.05);
  position: relative;
}

.legend-item::after {
  content: '';
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-left: 4px solid var(--text-soft);
  border-top: 4px solid transparent;
  border-bottom: 4px solid transparent;
}

.legend-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-content {
  flex: 1;
}

.legend-name {
  color: var(--text-main);
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 2px;
}

.legend-value {
  color: var(--text-soft);
  font-size: 12px;
}

.stat-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-top: 16px;
}

.mini-card,
.strip-card,
.detail-card,
.table-head,
.table-row {
  background: rgba(21, 52, 92, 0.88);
  border: 1px solid rgba(61, 150, 222, 0.24);
}

.mini-card,
.strip-card {
  border-radius: 14px;
  padding: 14px 16px;
}

.mini-card span,
.strip-card span {
  display: block;
  color: var(--text-soft);
  margin-bottom: 8px;
}

.mini-card strong,
.strip-card strong {
  font-size: 28px;
}

.table-card {
  display: grid;
  gap: 10px;
}

.table-head,
.table-row {
  display: grid;
  grid-template-columns: 1.6fr 1fr 0.9fr 0.8fr 0.6fr;
  gap: 12px;
  align-items: center;
  border-radius: 14px;
  padding: 12px 14px;
  text-align: left;
}

.compact .table-head,
.compact .table-row {
  grid-template-columns: 0.8fr 1.4fr 0.8fr 1fr 0.7fr;
}

.table-head {
  color: var(--text-soft);
  font-size: 14px;
  font-weight: 600;
}

.table-row {
  font-size: 14px;
}

.table-body {
  display: grid;
  gap: 10px;
}

.case-name {
  font-weight: 700;
}

.badge {
  display: inline-flex;
  justify-content: center;
  min-width: 58px;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
  color: white;
}

.badge-danger {
  background: linear-gradient(135deg, #ff6c77, #d82b58);
}

.badge-warning {
  background: linear-gradient(135deg, #f4d254, #f09a26);
}

.badge-normal {
  background: linear-gradient(135deg, #62c0ff, #1b7ed1);
}

.detail-layout {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 14px;
}

.detail-card {
  border-radius: 14px;
  padding: 14px;
}

.detail-card h3 {
  font-size: 20px;
  margin-bottom: 12px;
}

.detail-card h4 {
  font-size: 16px;
  color: var(--accent);
  margin-bottom: 10px;
}

.detail-wide {
  grid-column: 1 / -1;
}

.detail-split {
  display: grid;
  grid-template-columns: 1.25fr 0.9fr;
  gap: 14px;
}

.info-list {
  display: grid;
  gap: 12px;
  margin: 0;
}

.info-list div {
  display: grid;
  grid-template-columns: 84px 1fr;
  gap: 10px;
}

.info-list dt {
  color: var(--text-soft);
}

.info-list dd {
  margin: 0;
}

.timeline {
  display: grid;
  gap: 14px;
  padding-left: 14px;
}

.timeline-item {
  position: relative;
  padding-left: 22px;
}

.timeline-item::before {
  content: "";
  position: absolute;
  left: 0;
  top: 5px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 14px rgba(46, 199, 255, 0.4);
}

.timeline-item::after {
  content: "";
  position: absolute;
  left: 4px;
  top: 18px;
  bottom: -16px;
  width: 2px;
  background: rgba(61, 150, 222, 0.38);
}

.timeline-item:last-child::after {
  display: none;
}

.timeline-date {
  color: var(--text-soft);
  font-size: 13px;
  margin-bottom: 4px;
}

.bullet-list {
  margin: 0;
  padding-left: 18px;
  display: grid;
  gap: 8px;
  color: var(--text-main);
}

.finance-board {
  display: grid;
  gap: 12px;
}

.strip-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.strip-card span {
  margin: 0;
}

.flow-wrapper {
  position: relative;
  padding: 18px;
  border-radius: 16px;
  background: rgba(21, 52, 92, 0.84);
  border: 1px solid rgba(61, 150, 222, 0.26);
}

.flow-track {
  display: grid;
  grid-template-columns: repeat(6, minmax(130px, 1fr));
  align-items: center;
  gap: 18px;
}

.flow-node {
  position: relative;
  padding: 18px 14px;
  border-radius: 14px;
  background: rgba(13, 35, 64, 0.88);
  border: 1px solid rgba(61, 150, 222, 0.28);
  min-height: 90px;
}

.flow-node:not(:last-child)::after {
  content: "";
  position: absolute;
  top: 50%;
  right: -19px;
  width: 20px;
  height: 2px;
  background: rgba(61, 150, 222, 0.6);
}

.flow-node.alert {
  border-color: rgba(255, 120, 124, 0.9);
  background: linear-gradient(180deg, rgba(255, 120, 124, 0.12), rgba(255, 120, 124, 0.06));
  box-shadow: 0 0 12px rgba(255, 120, 124, 0.3);
}

.flow-node.alert::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 14px;
  border: 1px solid rgba(255, 120, 124, 0.8);
}

.flow-stage {
  font-size: 17px;
  margin-bottom: 12px;
}

.flow-meta {
  color: var(--text-soft);
  line-height: 1.6;
  font-size: 14px;
}

/* 草图风格 */
body[data-theme="sketch"] .panel,
body[data-theme="sketch"] .mini-card,
body[data-theme="sketch"] .strip-card,
body[data-theme="sketch"] .detail-card,
body[data-theme="sketch"] .table-head,
body[data-theme="sketch"] .table-row,
body[data-theme="sketch"] .flow-node,
body[data-theme="sketch"] .legend-item,
body[data-theme="sketch"] .flow-wrapper {
  border-style: solid;
  background: rgba(255, 252, 245, 0.92);
  border-color: rgba(63, 72, 96, 0.55);
  color: #273043;
}

body[data-theme="sketch"] .panel::after {
  border-style: solid;
  border-color: rgba(63, 72, 96, 0.18);
}

body[data-theme="sketch"] .theme-btn {
  border-radius: 6px;
  background: rgba(255, 251, 243, 0.95);
  border-color: rgba(63, 72, 96, 0.55);
  color: #273043;
}

body[data-theme="sketch"] .theme-btn:hover,
body[data-theme="sketch"] .theme-btn.is-active {
  background: rgba(68, 83, 166, 0.22);
}

body[data-theme="sketch"] .panel-kicker {
  background: #4453a6;
  box-shadow: none;
}

body[data-theme="sketch"] .donut-track,
body[data-theme="sketch"] .donut-core {
  stroke-width: 20;
  stroke: rgba(63, 72, 96, 0.28);
}

body[data-theme="sketch"] .donut-core {
  stroke: rgba(255, 251, 243, 0.95) !important;
  fill: rgba(255, 252, 245, 0.92) !important;
}

body[data-theme="sketch"] .donut-total {
  fill: #273043;
}

body[data-theme="sketch"] .donut-label {
  fill: #596173;
}

body[data-theme="sketch"] .segment {
  stroke-linecap: butt;
  stroke-width: 20;
}

body[data-theme="sketch"] .legend-name {
  color: #273043;
}

body[data-theme="sketch"] .legend-value {
  color: #596173;
}

body[data-theme="sketch"] .mini-card span,
body[data-theme="sketch"] .strip-card span {
  color: #596173;
}

body[data-theme="sketch"] .table-head {
  color: #596173;
}

body[data-theme="sketch"] .info-list dt {
  color: #596173;
}

body[data-theme="sketch"] .timeline-date {
  color: #596173;
}

body[data-theme="sketch"] .bullet-list {
  color: #273043;
}

body[data-theme="sketch"] .flow-meta {
  color: #596173;
}

body[data-theme="sketch"] .timeline-item::before {
  box-shadow: none;
  background: #4453a6;
}

body[data-theme="sketch"] .timeline-item::after {
  background: rgba(63, 72, 96, 0.38);
}

body[data-theme="sketch"] .flow-node:not(:last-child)::after {
  background: rgba(63, 72, 96, 0.6);
}

body[data-theme="sketch"] .flow-node.alert::before {
  border-style: solid;
}

@media (max-width: 1180px) {
  .dashboard {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .panel-overview,
  .panel-warning,
  .panel-finance {
    grid-column: span 1;
  }

  .panel-abnormal,
  .panel-detail,
  .panel-flow {
    grid-column: 1 / -1;
  }

  .flow-track {
    grid-template-columns: repeat(3, minmax(140px, 1fr));
  }
}

@media (max-width: 820px) {
  .hero {
    flex-direction: column;
    align-items: flex-start;
  }

  .dashboard {
    grid-template-columns: 1fr;
  }

  .panel-flow,
  .panel-detail,
  .panel-abnormal,
  .panel-overview,
  .panel-warning,
  .panel-finance {
    grid-column: auto;
  }

  .overview-grid,
  .detail-layout,
  .detail-split {
    grid-template-columns: 1fr;
  }

  .table-head,
  .table-row,
  .compact .table-head,
  .compact .table-row {
    grid-template-columns: 1fr 1fr;
  }

  .flow-track {
    grid-template-columns: 1fr;
  }

  .flow-node:not(:last-child)::after {
    top: auto;
    left: 50%;
    bottom: -18px;
    width: 2px;
    height: 18px;
  }
}
</style>
