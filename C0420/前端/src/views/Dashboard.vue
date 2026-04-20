<template>
  <div>
    <h2 class="page-title">数据大盘</h2>
    <div class="card-grid">
      <div class="metric page-panel">
        <p>在办案件总数</p>
        <h3>{{ allCases.length }}</h3>
      </div>
      <div class="metric page-panel">
        <p>黄色预警数</p>
        <h3>{{ summary.warning }}</h3>
      </div>
      <div class="metric page-panel">
        <p>橙色预警数</p>
        <h3>{{ summary.alert }}</h3>
      </div>
      <div class="metric page-panel">
        <p>红色超期数</p>
        <h3>{{ summary.danger }}</h3>
      </div>
    </div>

    <div class="chart-grid">
      <div class="page-panel chart-box">
        <h4>各部门办案量</h4>
        <EChartPanel :option="deptOption" />
      </div>
      <div class="page-panel chart-box">
        <h4>案件类型分布</h4>
        <EChartPanel :option="chargeOption" />
      </div>
      <div class="page-panel chart-box full">
        <h4>近7天预警趋势</h4>
        <EChartPanel :option="trendOption" height="320px" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCaseStore } from '../stores/case'
import { warningTrendData, warningTrendDays } from '../data/mock'
import EChartPanel from '../components/EChartPanel.vue'

const caseStore = useCaseStore()
const allCases = computed(() => caseStore.cases)
const summary = computed(() => caseStore.warningSummary)

const deptOption = computed(() => {
  const map = {}
  allCases.value.forEach((item) => {
    map[item.department] = (map[item.department] || 0) + 1
  })
  return {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: Object.keys(map),
      axisLabel: { color: '#b7ddff' }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#b7ddff' },
      splitLine: { lineStyle: { color: 'rgba(183, 221, 255, 0.2)' } }
    },
    series: [
      {
        type: 'bar',
        data: Object.values(map),
        itemStyle: { color: '#2ec7ff' },
        barWidth: 26
      }
    ]
  }
})

const chargeOption = computed(() => {
  const map = {}
  allCases.value.forEach((item) => {
    map[item.charge] = (map[item.charge] || 0) + 1
  })
  return {
    tooltip: { trigger: 'item' },
    legend: { bottom: 0, textStyle: { color: '#b7ddff' } },
    series: [
      {
        type: 'pie',
        radius: ['35%', '65%'],
        data: Object.entries(map).map(([name, value]) => ({ name, value })),
        label: { color: '#d6ecff' }
      }
    ]
  }
})

const trendOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  xAxis: {
    type: 'category',
    data: warningTrendDays,
    axisLabel: { color: '#b7ddff' }
  },
  yAxis: {
    type: 'value',
    axisLabel: { color: '#b7ddff' },
    splitLine: { lineStyle: { color: 'rgba(183, 221, 255, 0.2)' } }
  },
  series: [
    {
      type: 'line',
      smooth: true,
      data: warningTrendData,
      lineStyle: { color: '#f7b23b', width: 3 },
      areaStyle: { color: 'rgba(247, 178, 59, 0.2)' },
      symbolSize: 8
    }
  ]
}))
</script>

<style scoped>
.card-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(160px, 1fr));
  gap: 12px;
  margin-bottom: 14px;
}

.metric {
  padding: 14px;
}

.metric p {
  margin: 0;
  color: #9bc6f2;
}

.metric h3 {
  margin: 8px 0 0;
  font-size: 32px;
}

.chart-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(260px, 1fr));
  gap: 12px;
}

.chart-box {
  padding: 12px;
}

.chart-box h4 {
  margin: 0 0 10px;
}

.full {
  grid-column: 1 / -1;
}

@media (max-width: 1000px) {
  .card-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .chart-grid {
    grid-template-columns: 1fr;
  }
}
</style>
