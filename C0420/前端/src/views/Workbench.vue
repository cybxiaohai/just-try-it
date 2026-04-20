<template>
  <div class="workbench">
    <h2 class="page-title">工作台</h2>
    <div class="cards">
      <div class="card page-panel">
        <div class="card-title">我的在办案件</div>
        <div class="card-num">{{ caseCount }}</div>
      </div>
      <div class="card page-panel">
        <div class="card-title">待处理预警</div>
        <div class="card-num">{{ urgentCount }}</div>
      </div>
      <div class="card page-panel">
        <div class="card-title">超期案件</div>
        <div class="card-num">{{ dangerCount }}</div>
      </div>
    </div>

    <div class="panel-wrap">
      <div class="page-panel table-panel">
        <div class="panel-title">重点预警清单</div>
        <el-table :data="warningCases" border stripe>
          <el-table-column prop="caseNo" label="案号" min-width="120" />
          <el-table-column prop="name" label="案件名称" min-width="160" />
          <el-table-column prop="node" label="当前节点" min-width="120" />
          <el-table-column prop="remainDay" label="剩余期限" min-width="90">
            <template #default="{ row }">{{ row.remainDay }} 天</template>
          </el-table-column>
          <el-table-column label="状态" min-width="100">
            <template #default="{ row }">
              <el-tag :class="['status-tag', getWarningLevel(row.remainDay).cls]">
                {{ getWarningLevel(row.remainDay).label }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="110" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" link @click="goDetail(row.id)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="page-panel quick-panel">
        <div class="panel-title">快捷操作</div>
        <el-button type="primary" plain @click="router.push('/case/list')">进入案件管理</el-button>
        <el-button type="warning" plain @click="router.push('/warn/timeout')">查看期限预警</el-button>
        <el-button type="success" plain v-if="auth.role === 'manager'" @click="router.push('/check/document')">
          文书智能校验
        </el-button>
        <p class="quick-tip">切换角色后，菜单和数据会实时刷新。</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useCaseStore } from '../stores/case'
import { getWarningLevel } from '../utils/case'

const router = useRouter()
const auth = useAuthStore()
const caseStore = useCaseStore()

const currentCases = computed(() => caseStore.getCasesByRole(auth.role, auth.username))
const caseCount = computed(() => currentCases.value.length)
const urgentCount = computed(() => currentCases.value.filter((item) => item.remainDay <= 3).length)
const dangerCount = computed(() => currentCases.value.filter((item) => item.remainDay < 0).length)
const warningCases = computed(() => currentCases.value.filter((item) => item.remainDay <= 3))

function goDetail(id) {
  router.push(`/case/detail/${id}`)
}
</script>

<style scoped>
.cards {
  display: grid;
  grid-template-columns: repeat(3, minmax(180px, 1fr));
  gap: 12px;
  margin-bottom: 14px;
}

.card {
  padding: 18px;
}

.card-title {
  color: #9bc6f2;
}

.card-num {
  margin-top: 10px;
  font-size: 30px;
  font-weight: 700;
  color: #e5f2ff;
}

.panel-wrap {
  display: grid;
  gap: 14px;
  grid-template-columns: 2fr 1fr;
}

.table-panel,
.quick-panel {
  padding: 14px;
}

.panel-title {
  margin-bottom: 12px;
  font-size: 16px;
  font-weight: 600;
}

.quick-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.quick-tip {
  color: #9bc6f2;
  font-size: 13px;
}

@media (max-width: 980px) {
  .cards {
    grid-template-columns: 1fr;
  }

  .panel-wrap {
    grid-template-columns: 1fr;
  }
}
</style>
