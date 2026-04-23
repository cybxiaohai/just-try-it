import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useRuleStore = defineStore('rule-store', () => {
  const rules = ref({
    arrestLimit: 7,
    prosecutionLimit: 30,
    warningDays: 3,
    orangeDays: 1,
    docCheckEnabled: true
  })

  function setRules(payload) {
    rules.value = { ...rules.value, ...payload }
  }

  function resetRules() {
    rules.value = {
      arrestLimit: 7,
      prosecutionLimit: 30,
      warningDays: 3,
      orangeDays: 1,
      docCheckEnabled: true
    }
  }

  return { rules, setRules, resetRules }
})
