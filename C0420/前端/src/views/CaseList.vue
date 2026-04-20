<template>
  <div>
    <h2 class="page-title">案件列表</h2>
    <div class="page-panel filter-panel">
      <div class="toolbar">
        <el-input v-model="filters.keyword" placeholder="按案号/名称搜索" clearable style="width: 220px" />
        <el-select v-model="filters.department" clearable placeholder="部门" style="width: 140px">
          <el-option v-for="item in departments" :key="item" :label="item" :value="item" />
        </el-select>
        <el-select v-model="filters.node" clearable placeholder="节点" style="width: 150px">
          <el-option v-for="item in nodes" :key="item" :label="item" :value="item" />
        </el-select>
        <el-select v-model="filters.status" clearable placeholder="预警状态" style="width: 150px">
          <el-option label="绿色正常" value="normal" />
          <el-option label="黄色提醒" value="warning" />
          <el-option label="橙色预警" value="alert" />
          <el-option label="红色超期" value="danger" />
        </el-select>
        <el-date-picker
          v-model="filters.dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD"
        />
      </div>
    </div>

    <div class="page-panel table-wrap">
      <el-table :data="tableData" border stripe>
        <el-table-column prop="caseNo" label="案号" min-width="120" />
        <el-table-column prop="name" label="案件名称" min-width="160" />
        <el-table-column prop="suspect" label="嫌疑人" min-width="100" />
        <el-table-column prop="prosecutor" label="承办人" min-width="110" />
        <el-table-column prop="node" label="当前节点" min-width="120" />
        <el-table-column prop="remainDay" label="剩余期限" min-width="100">
          <template #default="{ row }">{{ row.remainDay }} 天</template>
        </el-table-column>
        <el-table-column label="预警状态" min-width="110">
          <template #default="{ row }">
            <el-tag :class="['status-tag', getWarningLevel(row.remainDay).cls]">
              {{ getWarningLevel(row.remainDay).label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="210" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="toDetail(row.id)">查看详情</el-button>
            <el-button type="warning" link @click="openEdit(row)">编辑</el-button>
            <el-button type="danger" link @click="archive(row)">归档</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="editVisible" title="编辑案件" width="520px">
      <el-form :model="editForm" label-width="100px">
        <el-form-item label="案件名称">
          <el-input v-model="editForm.name" />
        </el-form-item>
        <el-form-item label="部门">
          <el-select v-model="editForm.department" style="width: 100%">
            <el-option v-for="item in departments" :key="item" :value="item" :label="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="当前节点">
          <el-select v-model="editForm.node" style="width: 100%">
            <el-option v-for="item in nodes" :key="item" :value="item" :label="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="承办人">
          <el-input v-model="editForm.prosecutor" />
        </el-form-item>
        <el-form-item label="剩余期限">
          <el-input-number v-model="editForm.remainDay" :min="-99" :max="99" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editVisible = false">取消</el-button>
        <el-button type="primary" @click="saveEdit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAuthStore } from '../stores/auth'
import { useCaseStore } from '../stores/case'
import { getWarningLevel } from '../utils/case'

const router = useRouter()
const auth = useAuthStore()
const caseStore = useCaseStore()

const filters = reactive({
  keyword: '',
  department: '',
  node: '',
  status: '',
  dateRange: []
})

const editVisible = ref(false)
const editForm = reactive({
  id: null,
  name: '',
  department: '',
  node: '',
  prosecutor: '',
  remainDay: 0
})

const allCasesByRole = computed(() => caseStore.getCasesByRole(auth.role, auth.username))

const departments = computed(() => [...new Set(caseStore.cases.map((item) => item.department))])
const nodes = computed(() => [...new Set(caseStore.cases.map((item) => item.node))])

const tableData = computed(() =>
  allCasesByRole.value.filter((item) => {
    const keywordHit =
      !filters.keyword || item.caseNo.includes(filters.keyword) || item.name.includes(filters.keyword)
    const deptHit = !filters.department || item.department === filters.department
    const nodeHit = !filters.node || item.node === filters.node
    const statusHit = !filters.status || getWarningLevel(item.remainDay).key === filters.status
    const dateHit =
      !filters.dateRange.length ||
      (item.createdAt >= filters.dateRange[0] && item.createdAt <= filters.dateRange[1])
    return keywordHit && deptHit && nodeHit && statusHit && dateHit
  })
)

function toDetail(id) {
  router.push(`/case/detail/${id}`)
}

function openEdit(row) {
  Object.assign(editForm, row)
  editVisible.value = true
}

function saveEdit() {
  caseStore.updateCase(editForm.id, { ...editForm })
  caseStore.pushPermissionLog(auth.username, `编辑案件 ${editForm.caseNo || ''}`)
  editVisible.value = false
  ElMessage.success('案件已更新')
}

function archive(row) {
  ElMessageBox.confirm('确认归档该案件？系统将仅做前端演示状态更新。', '归档提示', {
    type: 'warning'
  }).then(() => {
    caseStore.archiveCase(row.id, { node: '结案归档', remainDay: 0 })
    caseStore.pushPermissionLog(auth.username, `归档案件 ${row.caseNo}`)
    ElMessage.success('已归档')
  })
}
</script>

<style scoped>
.filter-panel {
  padding: 14px;
  margin-bottom: 12px;
}

.table-wrap {
  padding: 12px;
}
</style>
