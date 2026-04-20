<template>
  <div>
    <h2 class="page-title">规则引擎配置</h2>
    <div class="page-panel rule-card">
      <el-form label-width="180px">
        <el-form-item label="审查逮捕期限">
          <el-select v-model="localRules.arrestLimit">
            <el-option label="7天" :value="7" />
            <el-option label="15天" :value="15" />
            <el-option label="20天" :value="20" />
          </el-select>
        </el-form-item>
        <el-form-item label="审查起诉期限">
          <el-select v-model="localRules.prosecutionLimit">
            <el-option label="1个月（30天）" :value="30" />
            <el-option label="1.5个月（45天）" :value="45" />
          </el-select>
        </el-form-item>
        <el-form-item label="预警天数">
          <div class="warn-inputs">
            <el-input-number v-model="localRules.warningDays" :min="1" :max="10" />
            <span>黄色提醒</span>
            <el-input-number v-model="localRules.orangeDays" :min="1" :max="10" />
            <span>橙色预警</span>
          </div>
        </el-form-item>
        <el-form-item label="文书校验开关">
          <el-switch v-model="localRules.docCheckEnabled" />
        </el-form-item>
      </el-form>

      <div class="btns">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button type="warning" @click="testRule">测试</el-button>
        <el-button @click="reset">重置</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '../stores/auth'
import { useCaseStore } from '../stores/case'
import { useRuleStore } from '../stores/rule'

const auth = useAuthStore()
const caseStore = useCaseStore()
const ruleStore = useRuleStore()

const localRules = reactive({ ...ruleStore.rules })

function save() {
  ruleStore.setRules({ ...localRules })
  caseStore.pushPermissionLog(auth.username, '保存规则引擎配置')
  ElMessage.success('保存成功（演示模式，刷新后重置）')
}

function testRule() {
  ElMessage.success('测试完成：已按当前规则模拟一次预警扫描')
}

function reset() {
  ruleStore.resetRules()
  Object.assign(localRules, ruleStore.rules)
}
</script>

<style scoped>
.rule-card {
  padding: 16px;
  max-width: 820px;
}

.warn-inputs {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btns {
  display: flex;
  gap: 10px;
  margin-top: 8px;
}
</style>
