<template>
  <div>
    <h2 class="page-title">涉案财物监控</h2>

    <div class="page-panel table-panel">
      <el-table :data="caseStore.propertyRecords" border stripe :row-class-name="rowClassName">
        <el-table-column prop="caseNo" label="案号" min-width="120" />
        <el-table-column prop="name" label="财物名称" min-width="120" />
        <el-table-column prop="count" label="数量" min-width="80" />
        <el-table-column prop="seizeDate" label="扣押日期" min-width="110" />
        <el-table-column prop="status" label="状态" min-width="110">
          <template #default="{ row }">
            <el-tag :type="tagType(row.status)">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="method" label="处置方式" min-width="110" />
        <el-table-column label="操作" width="140">
          <template #default="{ row }">
            <el-button type="primary" link @click="process(row)">处置</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="page-panel log-panel">
      <h3>全程留痕</h3>
      <el-table :data="caseStore.propertyLogs" border stripe>
        <el-table-column prop="time" label="操作时间" min-width="150" />
        <el-table-column prop="user" label="操作人" min-width="110" />
        <el-table-column prop="action" label="操作内容" min-width="240" />
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ElMessageBox, ElMessage } from 'element-plus'
import { useAuthStore } from '../stores/auth'
import { useCaseStore } from '../stores/case'

const auth = useAuthStore()
const caseStore = useCaseStore()

function tagType(status) {
  if (status === '已移送' || status === '已发还') return 'success'
  if (status === '超期未处置') return 'danger'
  return 'warning'
}

function rowClassName({ row }) {
  return row.status === '超期未处置' ? 'danger-row' : ''
}

function process(row) {
  ElMessageBox.confirm(`将 ${row.name} 处置为“已移送”？`, '财物处置', { type: 'warning' }).then(() => {
    caseStore.updateProperty(row.id, { status: '已移送', method: '移送' })
    caseStore.pushPropertyLog(auth.username, `处置财物 ${row.caseNo}-${row.name} 为已移送`)
    ElMessage.success('处置完成')
  })
}
</script>

<style scoped>
.table-panel,
.log-panel {
  padding: 12px;
  margin-bottom: 12px;
}

.log-panel h3 {
  margin: 0 0 12px;
}

:deep(.danger-row td) {
  background: rgba(255, 88, 88, 0.15) !important;
}
</style>
