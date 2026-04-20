import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { roleDefaultPath, roles } from '../data/mock'

export const useAuthStore = defineStore('auth', () => {
  const username = ref('')
  const role = ref('prosecutor')
  const loggedIn = ref(false)

  const roleLabel = computed(() => {
    const target = roles.find((item) => item.value === role.value)
    return target ? target.label : '未知角色'
  })

  function login(payload) {
    username.value = payload.username
    role.value = payload.role
    loggedIn.value = true
  }

  function switchRole(nextRole) {
    role.value = nextRole
  }

  function logout() {
    username.value = ''
    role.value = 'prosecutor'
    loggedIn.value = false
  }

  const homePath = computed(() => roleDefaultPath[role.value] || '/workbench')

  return {
    username,
    role,
    loggedIn,
    roleLabel,
    homePath,
    login,
    switchRole,
    logout
  }
})
