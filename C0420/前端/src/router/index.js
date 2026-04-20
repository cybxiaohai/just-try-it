import { createRouter, createWebHistory } from 'vue-router'
import { roleDefaultPath } from '../data/mock'
import { useAuthStore } from '../stores/auth'
import Login from '../views/Login.vue'
import Workbench from '../views/Workbench.vue'
import Dashboard from '../views/Dashboard.vue'
import CaseList from '../views/CaseList.vue'
import CaseDetail from '../views/CaseDetail.vue'
import TimeoutWarn from '../views/TimeoutWarn.vue'
import DocCheck from '../views/DocCheck.vue'
import PropertyMonitor from '../views/PropertyMonitor.vue'
import RuleConfig from '../views/RuleConfig.vue'
import PermissionLog from '../views/PermissionLog.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login, meta: { public: true } },
  { path: '/workbench', component: Workbench, meta: { roles: ['prosecutor', 'manager'] } },
  { path: '/dashboard', component: Dashboard, meta: { roles: ['manager', 'leader'] } },
  { path: '/case/list', component: CaseList, meta: { roles: ['prosecutor', 'manager'] } },
  { path: '/case/detail/:id', component: CaseDetail, meta: { roles: ['prosecutor', 'manager'] } },
  { path: '/warn/timeout', component: TimeoutWarn, meta: { roles: ['prosecutor', 'manager'] } },
  { path: '/check/document', component: DocCheck, meta: { roles: ['manager'] } },
  { path: '/property/monitor', component: PropertyMonitor, meta: { roles: ['manager'] } },
  { path: '/rule/config', component: RuleConfig, meta: { roles: ['manager'] } },
  { path: '/permission/log', component: PermissionLog, meta: { roles: ['manager'] } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  const targetHome = roleDefaultPath[auth.role] || '/workbench'

  if (!to.meta.public && !auth.loggedIn) {
    return '/login'
  }

  if (to.path === '/login' && auth.loggedIn) {
    return targetHome
  }

  if (to.meta.roles && !to.meta.roles.includes(auth.role)) {
    return targetHome
  }

  return true
})

export default router
