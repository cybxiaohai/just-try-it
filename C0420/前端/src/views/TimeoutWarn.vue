<template>
  <div>
    <h2 class="page-title">期限智能预警</h2>
    <div class="stats">
      <div class="page-panel stat">
        <div>预警总数</div>
        <strong>{{ summary.total }}</strong>
      </div>
      <div class="page-panel stat">
        <div>待处理</div>
        <strong>{{ waitHandle }}</strong>
      </div>
    </div>

    <div class="page-panel action-bar">
      <el-button type="primary" @click="exportCsv">导出</el-button>
      <el-button type="warning" @click="batchPreview">批量查看</el-button>
      <el-text type="info">规则：>3天绿，≤3天黄，≤1天橙，已过期红</el-text>
    </div>

    <div class="page-panel table-wrap">
      <el-table :data="warnList" border stripe @selection-change="onSelectionChange">
        <el-table-column type="selection" width="48" />
        <el-table-column prop="name" label="案件" min-width="180" />
        <el-table-column prop="node" label="节点" min-width="120" />
        <el-table-column prop="limitDay" label="法定期限" min-width="90">
          <template #default="{ row }">{{ row.limitDay }} 天</template>
        </el-table-column>
        <el-table-column prop="remainDay" label="剩余天数" min-width="90">
          <template #default="{ row }">{{ row.remainDay }} 天</template>
        </el-table-column>
        <el-table-column prop="prosecutor" label="承办人" min-width="110" />
        <el-table-column label="状态" min-width="100">
          <template #default="{ row }">
            <el-tag :class="['status-tag', getWarningLevel(row.remainDay).cls]">
              {{ getWarningLevel(row.remainDay).label }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-drawer v-model="drawer" title="批量案件预警预览" size="45%">
      <el-empty v-if="!selectedRows.length" description="请先勾选案件" />
      <el-timeline v-else>
        <el-timeline-item v-for="item in selectedRows" :key="item.id" :timestamp="item.caseNo">
          <div>{{ item.name }} ｜ {{ item.node }} ｜ 剩余 {{ item.remainDay }} 天</div>
        </el-timeline-item>
      </el-timeline>
    </el-drawer>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '../stores/auth'
import { useCaseStore } from '../stores/case'
import { getWarningLevel } from '../utils/case'

const auth = useAuthStore()
const caseStore = useCaseStore()

const selectedRows = ref([])
const drawer = ref(false)

const warnList = computed(() =>
  caseStore
    .getCasesByRole(auth.role, auth.username)
    .map((item) => ({
      id: item.id,
      caseNo: item.caseNo,
      name: item.name,
      node: item.node,
      limitDay: item.limitDay,
      remainDay: item.remainDay,
      prosecutor: item.prosecutor
    }))
    .filter((item) => item.remainDay <= 3)
)

const summary = computed(() => ({
  total: warnList.value.length,
  wait: warnList.value.filter((item) => item.remainDay <= 1).length
}))

const waitHandle = computed(() => summary.value.wait)

function onSelectionChange(rows) {
  selectedRows.value = rows
}

function batchPreview() {
  drawer.value = true
}

function exportCsv() {
  const header = ['案号', '案件', '节点', '法定期限', '剩余天数', '承办人']
  const rows = warnList.value.map((item) =>
    [item.caseNo, item.name, item.node, item.limitDay, item.remainDay, item.prosecutor].join(',')
  )
  const csv = [header.join(','), ...rows].join('\n')
  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = '期限预警清单.csv'
  link.click()
  URL.revokeObjectURL(link.href)
  caseStore.pushPermissionLog(auth.username, '导出期限预警清单')
  ElMessage.success('导出成功')
}
</script>

<style scoped>
.stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(180px, 260px));
  gap: 12px;
  margin-bottom: 12px;
}

.stat {
  padding: 12px;
}

.stat strong {
  display: block;
  margin-top: 8px;
  font-size: 30px;
}

.action-bar {
  margin-bottom: 12px;
  padding: 12px;
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.table-wrap {
  padding: 12px;
}
</style>
