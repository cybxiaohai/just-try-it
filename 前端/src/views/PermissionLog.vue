<template>
  <div>
    <h2 class="page-title">权限管理 + 操作日志</h2>

    <div class="page-panel permission-panel">
      <h3>角色菜单权限</h3>
      <el-table :data="permissionRows" border>
        <el-table-column prop="role" label="角色" min-width="110" />
        <el-table-column label="菜单权限">
          <template #default="{ row }">
            <el-checkbox-group v-model="row.menus">
              <el-checkbox
                v-for="menu in menuOptions"
                :key="menu"
                :label="menu"
                :disabled="row.locked"
              >
                {{ menu }}
              </el-checkbox>
            </el-checkbox-group>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="page-panel log-panel">
      <div class="log-top">
        <h3>操作日志</h3>
        <el-button type="primary" plain @click="mockLog">新增模拟日志</el-button>
      </div>
      <el-table :data="caseStore.permissionLogs" border stripe>
        <el-table-column prop="time" label="时间" min-width="150" />
        <el-table-column prop="user" label="操作者" min-width="120" />
        <el-table-column prop="action" label="操作事项" min-width="240" />
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useCaseStore } from '../stores/case'

const auth = useAuthStore()
const caseStore = useCaseStore()

const menuOptions = ['工作台', '案件管理', '期限预警', '文书校验', '财物监控', '规则引擎', '数据大盘', '权限管理']

const permissionRows = ref([
  { role: '检察官', menus: ['案件管理', '期限预警'], locked: true },
  
  { role: '案件管理办公室', menus: ['工作台', '案件管理', '期限预警', '文书校验', '财物监控', '自定义期限', '数据大盘'], locked: true },

  { role: '院长', menus: ['数据大盘', '权限管理'], locked: false }

])

function mockLog() {
  caseStore.pushPermissionLog(auth.username || '案件管理办公室管理员', '查看权限配置并生成日志记录')
}
</script>

<style scoped>
.permission-panel,
.log-panel {
  padding: 14px;
  margin-bottom: 12px;
}

.permission-panel h3,
.log-panel h3 {
  margin: 0 0 10px;
}

.log-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
</style>
