<template>
  <el-container class="shell">
    <el-header class="header">
      <div class="header-left">
        <div class="logo-dot"></div>
        <div class="logo-title">青朗法治 · 智慧检务综合管理平台</div>
      </div>
      <div class="header-right">
        <span class="user-text">{{ auth.username || '未登录' }}</span>
        <el-select v-model="auth.role" size="small" class="role-select" @change="handleRoleChange">
          <el-option v-for="item in roles" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-button type="danger" size="small" plain @click="logout">退出</el-button>
      </div>
    </el-header>
    <el-container>
      <el-aside class="aside" width="220px">
        <el-menu
          :default-active="activePath"
          background-color="#091a31"
          text-color="#bdddff"
          active-text-color="#2ec7ff"
          router
        >
          <el-menu-item v-for="item in visibleMenus" :index="item.path" :key="item.path">
            <el-icon><component :is="item.icon" /></el-icon>
            <span>{{ item.label }}</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main class="main">
        <slot />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  DataAnalysis,
  DocumentChecked,
  Files,
  HomeFilled,
  Lock,
  Money,
  SetUp,
  WarningFilled
} from '@element-plus/icons-vue'
import { roleDefaultPath, roleMenus, roles } from '../data/mock'
import { useAuthStore } from '../stores/auth'
import { useCaseStore } from '../stores/case'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const caseStore = useCaseStore()

const menus = [
  { path: '/workbench', label: '工作台', icon: HomeFilled },
  { path: '/case/list', label: '案件管理', icon: Files },
  { path: '/warn/timeout', label: '期限预警', icon: WarningFilled },
  { path: '/check/document', label: '文书校验', icon: DocumentChecked },
  { path: '/property/monitor', label: '财物监控', icon: Money },
  { path: '/rule/config', label: '规则引擎', icon: SetUp },
  { path: '/dashboard', label: '数据大盘', icon: DataAnalysis },
  { path: '/permission/log', label: '权限管理', icon: Lock }
]

const visibleMenus = computed(() => {
  const allowList = roleMenus[auth.role] || []
  return menus.filter((item) => allowList.includes(item.path))
})

const activePath = computed(() => {
  if (route.path.startsWith('/case/detail')) return '/case/list'
  return route.path
})

function handleRoleChange(value) {
  auth.switchRole(value)
  caseStore.pushPermissionLog(auth.username || '系统用户', `切换角色为 ${auth.roleLabel}`)
  router.push(roleDefaultPath[value] || '/workbench')
}

function logout() {
  caseStore.pushPermissionLog(auth.username || '系统用户', '退出系统')
  auth.logout()
  router.push('/login')
}
</script>

<style scoped>
.shell {
  height: 100%;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(90deg, #081a31, #0e3257 55%, #081a31);
  border-bottom: 1px solid rgba(65, 159, 240, 0.3);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-dot {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: #39deff;
  box-shadow: 0 0 14px #39deff;
}

.logo-title {
  font-size: 17px;
  font-weight: 700;
  letter-spacing: 1px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-text {
  color: #d7ebff;
}

.role-select {
  width: 120px;
}

.aside {
  background: #091a31;
  border-right: 1px solid rgba(69, 161, 240, 0.3);
}

.aside :deep(.el-menu) {
  border-right: none;
}

.main {
  padding: 16px;
  overflow-y: auto;
}

@media (max-width: 900px) {
  .logo-title {
    font-size: 14px;
  }

  .header-right {
    gap: 6px;
  }

  .aside {
    width: 72px !important;
  }

  .aside :deep(.el-menu-item span) {
    display: none;
  }
}
</style>
