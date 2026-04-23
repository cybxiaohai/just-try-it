<template>
  <div>
    <h2 class="page-title">案件详情 · {{ caseInfo?.name || '未找到案件' }}</h2>
    <div v-if="!caseInfo" class="page-panel missing-panel">未找到案件，请返回列表重新选择。</div>
    <template v-else>
      <div class="page-panel top-card">
        <div class="meta">
          <div>案号：{{ caseInfo.caseNo }}</div>
          <div>承办人：{{ caseInfo.prosecutor }}</div>
          <div>当前节点：{{ caseInfo.node }}</div>
        </div>
        <el-tag :class="['status-tag', currentWarning.cls]">{{ currentWarning.label }}</el-tag>
      </div>

      <div class="page-panel step-card">
        <el-steps :active="activeStep" finish-status="success">
          <el-step v-for="(item, idx) in steps" :key="item" :title="item" />
        </el-steps>
        <div class="step-actions">
          <el-button
            v-for="(item, idx) in steps"
            :key="item"
            :type="idx === activeStep ? 'primary' : 'default'"
            :disabled="idx > maxUnlocked"
            @click="goStep(idx)"
          >
            {{ idx + 1 }}.{{ item }}
          </el-button>
        </div>
      </div>

      <div class="page-panel form-card">
        <h3>{{ steps[activeStep] }}</h3>

        <div v-if="activeStep === 0" class="kv-grid">
          <el-input v-model="form.accept.caseName" placeholder="案件名称" />
          <el-input v-model="form.accept.transferUnit" placeholder="移送单位" />
          <el-date-picker v-model="form.accept.acceptDate" type="date" value-format="YYYY-MM-DD" placeholder="受理日期" />
          <el-input v-model="form.accept.caseNo" placeholder="案号（自动生成）" />
          <el-input v-model="form.accept.suspectName" placeholder="嫌疑人姓名" />
          <el-input v-model="form.accept.idCard" placeholder="身份证" />
          <el-input v-model="form.accept.measure" placeholder="强制措施" />
          <el-switch v-model="form.accept.suspectArrived" active-text="嫌疑人已到案" inactive-text="嫌疑人未到案" />
          <div class="upload-row">
            <span>上传文书：</span>
            <el-upload :auto-upload="false" :before-upload="preventUpload" :on-change="onAcceptUpload" multiple>
              <el-button type="primary" plain>上传起诉意见书/通知书/电子卷宗</el-button>
            </el-upload>
          </div>
          <div class="file-list">{{ form.accept.files.join('、') || '暂无上传文件' }}</div>
        </div>

        <div v-else-if="activeStep === 1" class="kv-grid">
          <el-select v-model="form.assign.mode" placeholder="分案方式">
            <el-option label="自动轮案" value="自动轮案" />
            <el-option label="指定分案" value="指定分案" />
            <el-option label="领导交办" value="领导交办" />
          </el-select>
          <el-select v-model="form.assign.department" placeholder="部门">
            <el-option label="批捕" value="批捕" />
            <el-option label="公诉" value="公诉" />
            <el-option label="未检" value="未检" />
          </el-select>
          <el-input v-model="form.assign.prosecutor" placeholder="承办检察官" />
          <el-input v-model="form.assign.assistant" placeholder="助理" />
          <el-input v-model="form.assign.clerk" placeholder="书记员" />
        </div>

        <div v-else-if="activeStep === 2" class="kv-grid">
          <el-select v-model="form.arrest.term" placeholder="审查期限">
            <el-option label="7天" :value="7" />
            <el-option label="15天" :value="15" />
            <el-option label="20天" :value="20" />
          </el-select>
          <el-select v-model="form.arrest.decision" placeholder="决定">
            <el-option label="批准逮捕" value="批准逮捕" />
            <el-option label="不批准逮捕" value="不批准逮捕" />
          </el-select>
          <div class="upload-row">
            <span>上传文书：</span>
            <el-upload :auto-upload="false" :before-upload="preventUpload" :on-change="onArrestUpload" multiple>
              <el-button type="primary" plain>上传逮捕意见书/讯问笔录</el-button>
            </el-upload>
          </div>
          <div class="file-list">{{ form.arrest.files.join('、') || '暂无上传文件' }}</div>
        </div>

        <div v-else-if="activeStep === 3" class="kv-grid">
          <el-select v-model="form.prosecution.returnMark" placeholder="退回标记">
            <el-option label="无退回" value="无退回" />
            <el-option label="一退" value="一退" />
            <el-option label="二退" value="二退" />
          </el-select>
          <el-input-number v-model="form.prosecution.extendCount" :min="0" :max="4" placeholder="延长次数" />
          <el-date-picker
            v-model="form.prosecution.startDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="审查起诉起算日"
          />
          <el-select v-model="form.prosecution.limit" placeholder="审查起诉期限">
            <el-option label="1个月（30天）" :value="30" />
            <el-option label="1.5个月（45天）" :value="45" />
          </el-select>
          <div>
            剩余期限：
            <span :class="['remain', getWarningLevel(form.prosecution.remainDay).cls]">
              {{ form.prosecution.remainDay }} 天（超期变红）
            </span>
          </div>
        </div>

        <div v-else-if="activeStep === 4" class="kv-grid">
          <el-date-picker v-model="form.pledge.date" type="date" value-format="YYYY-MM-DD" placeholder="具结日期" />
          <el-input v-model="form.pledge.lawyer" placeholder="律师姓名" />
          <el-input v-model="form.pledge.sentenceSuggest" placeholder="量刑建议" />
          <el-input v-model="form.pledge.fine" placeholder="罚金" />
        </div>

        <div v-else-if="activeStep === 5" class="kv-grid">
          <el-select v-model="form.close.result" placeholder="审结结果">
            <el-option label="起诉" value="起诉" />
            <el-option label="不起诉" value="不起诉" />
          </el-select>
          <el-select v-model="form.close.procedure" placeholder="程序">
            <el-option label="普通" value="普通" />
            <el-option label="速裁" value="速裁" />
          </el-select>
          <el-input-number
            v-if="form.close.procedure === '速裁'"
            v-model="form.close.quickDays"
            :min="0"
            :max="60"
            placeholder="速裁耗时"
          />
          <el-alert v-if="form.close.procedure === '速裁' && form.close.quickDays > 15" title="速裁超过15天，黄色预警" type="warning" :closable="false" />
        </div>

        <div v-else-if="activeStep === 6" class="kv-grid">
          <el-date-picker v-model="form.trial.courtDate" type="date" value-format="YYYY-MM-DD" placeholder="开庭日期" />
          <el-select v-model="form.trial.verdict" placeholder="判决结果">
            <el-option label="有罪" value="有罪" />
            <el-option label="无罪" value="无罪" />
          </el-select>
          <el-select v-if="form.trial.verdict === '无罪'" v-model="form.trial.protest" placeholder="是否抗诉">
            <el-option label="是" value="是" />
            <el-option label="否" value="否" />
          </el-select>
          <div class="upload-row">
            <span>判决书：</span>
            <el-upload :auto-upload="false" :before-upload="preventUpload" :on-change="onTrialUpload" multiple>
              <el-button type="primary" plain>上传判决书</el-button>
            </el-upload>
          </div>
          <div class="file-list">{{ form.trial.files.join('、') || '暂无上传文件' }}</div>
        </div>

        <div v-else-if="activeStep === 7">
          <div v-for="(item, idx) in form.property.items" :key="idx" class="property-row">
            <el-input v-model="item.name" placeholder="财物名称" />
            <el-input-number v-model="item.count" :min="1" :max="9999" />
            <el-input v-model="item.destination" placeholder="去向" />
            <el-select v-model="item.method" placeholder="处置方式">
              <el-option label="发还" value="发还" />
              <el-option label="移送" value="移送" />
              <el-option label="上缴" value="上缴" />
              <el-option label="销毁" value="销毁" />
            </el-select>
            <el-button type="danger" plain @click="removeProperty(idx)">删除</el-button>
          </div>
          <el-button type="primary" plain @click="addProperty">新增财物</el-button>
        </div>

        <div v-else class="kv-grid">
          <el-date-picker v-model="form.archive.date" type="date" value-format="YYYY-MM-DD" placeholder="归档日期" />
          <el-input v-model="form.archive.reviewer" placeholder="审核人" />
          <el-input-number v-model="form.archive.volumes" :min="1" :max="99" />
          <el-alert
            title="归档强校验：财物未处置、案卡缺项会直接拦截"
            type="error"
            :closable="false"
          />
        </div>

        <div class="bottom-actions">
          <el-button :disabled="activeStep === 0" @click="goStep(activeStep - 1)">上一步</el-button>
          <el-button type="primary" @click="nextStep">{{ activeStep === 8 ? '提交归档' : '保存并下一步' }}</el-button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '../stores/auth'
import { useCaseStore } from '../stores/case'
import { calcDaysFrom, getWarningLevel } from '../utils/case'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const caseStore = useCaseStore()

const caseId = Number(route.params.id)
const caseInfo = computed(() => caseStore.cases.find((item) => item.id === caseId))
const currentWarning = computed(() => getWarningLevel(caseInfo.value?.remainDay ?? 99))

const steps = [
  '案件受理',
  '案件分配',
  '审查逮捕',
  '审查起诉',
  '认罪认罚具结',
  '案件审结',
  '出庭判决',
  '财物处置',
  '结案归档'
]

const nodeStepMap = {
  案件受理: 0,
  案件分配: 1,
  审查逮捕: 2,
  审查起诉: 3,
  认罪认罚: 4,
  案件审结: 5,
  出庭及判决: 6,
  涉案财物处置: 7,
  结案归档: 8
}

const maxUnlocked = ref(caseInfo.value ? nodeStepMap[caseInfo.value.node] ?? 0 : 0)
const activeStep = ref(maxUnlocked.value)

const form = reactive({
  accept: {
    caseName: caseInfo.value?.name || '',
    transferUnit: '公安机关',
    acceptDate: caseInfo.value?.createdAt || '',
    caseNo: caseInfo.value?.caseNo || `AUTO${Date.now()}`,
    suspectName: caseInfo.value?.suspect || '',
    idCard: '',
    measure: '取保候审',
    suspectArrived: true,
    files: []
  },
  assign: {
    mode: '自动轮案',
    department: '公诉',
    prosecutor: caseInfo.value?.prosecutor || '',
    assistant: '',
    clerk: ''
  },
  arrest: {
    term: 7,
    decision: '批准逮捕',
    files: []
  },
  prosecution: {
    returnMark: '无退回',
    extendCount: 0,
    startDate: caseInfo.value?.createdAt || '',
    limit: 30,
    remainDay: caseInfo.value?.remainDay ?? 30
  },
  pledge: {
    date: '',
    lawyer: '',
    sentenceSuggest: '',
    fine: ''
  },
  close: {
    result: '起诉',
    procedure: '普通',
    quickDays: 0
  },
  trial: {
    courtDate: '',
    verdict: '有罪',
    protest: '',
    files: []
  },
  property: {
    items: [{ name: '', count: 1, destination: '', method: '' }]
  },
  archive: {
    date: '',
    reviewer: '',
    volumes: 1
  }
})

watch(
  () => [form.prosecution.startDate, form.prosecution.limit, form.prosecution.extendCount],
  () => {
    const elapsed = calcDaysFrom(form.prosecution.startDate)
    const total = Number(form.prosecution.limit || 30) + Number(form.prosecution.extendCount || 0) * 5
    form.prosecution.remainDay = total - elapsed
    if (caseInfo.value) {
      caseStore.updateCase(caseId, { remainDay: form.prosecution.remainDay })
    }
  },
  { immediate: true }
)

function preventUpload() {
  return false
}

function onAcceptUpload(file) {
  form.accept.files.push(file.name)
}

function onArrestUpload(file) {
  form.arrest.files.push(file.name)
}

function onTrialUpload(file) {
  form.trial.files.push(file.name)
}

function goStep(index) {
  if (index > maxUnlocked.value) {
    ElMessage.warning('未完成上一步，不能跳转到下一步')
    return
  }
  activeStep.value = index
}

function addProperty() {
  form.property.items.push({ name: '', count: 1, destination: '', method: '' })
}

function removeProperty(index) {
  if (form.property.items.length === 1) return
  form.property.items.splice(index, 1)
}

function validateCurrentStep() {
  if (activeStep.value === 0) {
    if (!form.accept.caseName || !form.accept.acceptDate || !form.accept.suspectName) {
      ElMessage.error('案件受理信息未填写完整')
      return false
    }
    if (!form.accept.suspectArrived) {
      ElMessage.error('嫌疑人未到案，无法分案')
      return false
    }
  }
  if (activeStep.value === 1) {
    if (!form.assign.mode || !form.assign.department || !form.assign.prosecutor) {
      ElMessage.error('案件分配信息未填写完整')
      return false
    }
    if (caseInfo.value) {
      caseStore.updateCase(caseId, {
        prosecutor: form.assign.prosecutor,
        department: `${form.assign.department}科`
      })
    }
  }
  if (activeStep.value === 2) {
    if (!form.arrest.term || !form.arrest.decision) {
      ElMessage.error('请填写审查逮捕信息')
      return false
    }
  }
  if (activeStep.value === 3) {
    if (!form.prosecution.startDate || !form.prosecution.limit) {
      ElMessage.error('请填写审查起诉时间信息')
      return false
    }
    if (caseInfo.value) {
      caseStore.updateCase(caseId, { node: '审查起诉', remainDay: form.prosecution.remainDay })
    }
  }
  if (activeStep.value === 4) {
    if (!form.pledge.date) {
      ElMessage.error('无具结日期，不能进入起诉')
      return false
    }
  }
  if (activeStep.value === 5) {
    if (!form.close.result || !form.close.procedure) {
      ElMessage.error('请填写案件审结信息')
      return false
    }
    if (form.close.procedure === '速裁' && form.close.quickDays > 15) {
      ElMessage.warning('速裁超过15天，已触发黄色预警')
    }
  }
  if (activeStep.value === 6) {
    if (!form.trial.courtDate || !form.trial.verdict) {
      ElMessage.error('请填写出庭及判决信息')
      return false
    }
    if (form.trial.verdict === '无罪' && !form.trial.protest) {
      ElMessage.error('无罪判决必须填写是否抗诉')
      return false
    }
  }
  if (activeStep.value === 7) {
    const invalid = form.property.items.some((item) => !item.name || !item.destination || !item.method)
    if (invalid) {
      ElMessage.error('存在未处置财物，无法进入归档')
      return false
    }
  }
  if (activeStep.value === 8) {
    if (!form.archive.date || !form.archive.reviewer) {
      ElMessage.error('请填写归档日期和审核人')
      return false
    }
    const missing = []
    if (!form.accept.caseName || !form.accept.suspectName) missing.push('案件受理')
    if (!form.assign.prosecutor) missing.push('案件分配')
    if (!form.arrest.decision) missing.push('审查逮捕')
    if (!form.prosecution.startDate) missing.push('审查起诉')
    if (!form.pledge.date) missing.push('认罪认罚')
    if (!form.close.result) missing.push('案件审结')
    if (!form.trial.courtDate) missing.push('出庭判决')
    const propertyPending = form.property.items.some((item) => !item.method)
    if (propertyPending) missing.push('财物处置未完成')
    if (missing.length) {
      ElMessage.error(`归档拦截：${missing.join('、')}存在缺项`)
      return false
    }
  }
  return true
}

function nextStep() {
  if (!validateCurrentStep()) return
  if (activeStep.value < 8) {
    maxUnlocked.value = Math.max(maxUnlocked.value, activeStep.value + 1)
    activeStep.value += 1
    ElMessage.success('当前节点已保存')
    return
  }
  caseStore.archiveCase(caseId, {
    node: '结案归档',
    remainDay: 0,
    propertyStatus: '已处置'
  })
  caseStore.pushPermissionLog(auth.username, `归档案件 ${caseInfo.value?.caseNo}`)
  ElMessage.success('归档成功')
  router.push('/case/list')
}
</script>

<style scoped>
.missing-panel {
  padding: 20px;
}

.top-card {
  padding: 12px 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.meta {
  display: flex;
  gap: 18px;
  flex-wrap: wrap;
}

.step-card {
  padding: 14px;
  margin-bottom: 12px;
  position: sticky;
  top: 0;
  z-index: 2;
}

.step-actions {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.form-card {
  padding: 14px;
}

.form-card h3 {
  margin: 0 0 12px;
}

.upload-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.file-list {
  color: #9bc6f2;
  font-size: 13px;
}

.remain {
  margin-left: 4px;
  padding: 3px 8px;
  border-radius: 6px;
}

.property-row {
  display: grid;
  grid-template-columns: 1.2fr 0.7fr 1.2fr 1.2fr auto;
  gap: 8px;
  margin-bottom: 8px;
}

.bottom-actions {
  margin-top: 18px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

@media (max-width: 980px) {
  .property-row {
    grid-template-columns: 1fr;
  }
}
</style>
