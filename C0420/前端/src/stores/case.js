import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import {
  initialCases,
  initialOperationLogs,
  initialPermissionLogs,
  initialPropertyRecords
} from '../data/mock'
import { getTodayStamp } from '../utils/case'

function clone(data) {
  return JSON.parse(JSON.stringify(data))
}

export const useCaseStore = defineStore('case-store', () => {
  const cases = ref(clone(initialCases))
  const propertyRecords = ref(clone(initialPropertyRecords))
  const propertyLogs = ref(clone(initialOperationLogs))
  const permissionLogs = ref(clone(initialPermissionLogs))

  const warningSummary = computed(() => {
    const result = { total: 0, warning: 0, alert: 0, danger: 0 }
    cases.value.forEach((item) => {
      if (item.remainDay <= 3) result.total += 1
      if (item.remainDay <= 3 && item.remainDay > 1) result.warning += 1
      if (item.remainDay <= 1 && item.remainDay >= 0) result.alert += 1
      if (item.remainDay < 0) result.danger += 1
    })
    return result
  })

  function getCasesByRole(role, username) {
    if (role === 'prosecutor') {
      return cases.value.filter((item) => item.prosecutor === username)
    }
    return cases.value
  }

  function updateCase(id, payload) {
    const target = cases.value.find((item) => item.id === id)
    if (!target) return
    Object.assign(target, payload)
  }

  function archiveCase(id, extra = {}) {
    updateCase(id, { node: '结案归档', ...extra })
  }

  function updateProperty(id, payload) {
    const target = propertyRecords.value.find((item) => item.id === id)
    if (!target) return
    Object.assign(target, payload)
  }

  function pushPermissionLog(user, action) {
    permissionLogs.value.unshift({
      time: getTodayStamp(),
      user,
      action
    })
  }

  function pushPropertyLog(user, action) {
    propertyLogs.value.unshift({
      time: getTodayStamp(),
      user,
      action
    })
  }

  return {
    cases,
    propertyRecords,
    propertyLogs,
    permissionLogs,
    warningSummary,
    getCasesByRole,
    updateCase,
    archiveCase,
    updateProperty,
    pushPermissionLog,
    pushPropertyLog
  }
})
