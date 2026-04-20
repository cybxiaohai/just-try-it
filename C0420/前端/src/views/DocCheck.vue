<template>
  <div>
    <h2 class="page-title">法律文书智能校验</h2>

    <div class="page-panel upload-panel">
      <el-upload
        class="upload"
        drag
        :auto-upload="false"
        :before-upload="() => false"
        :show-file-list="false"
        :on-change="handleFile"
      >
        <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
        <div class="el-upload__text">拖放 PDF/Word 到这里，或点击上传</div>
      </el-upload>
      <p class="tip">演示规则：上传后 1 秒自动生成校验结果。</p>
    </div>

    <div class="page-panel result-panel">
      <h3>校验结果面板</h3>
      <el-skeleton :loading="loading" animated :rows="6">
        <template #default>
          <div class="result-row">
            <span>格式规范</span>
            <el-tag type="success">√ 通过</el-tag>
          </div>
          <div class="result-row">
            <span>关键项缺失</span>
            <el-tag type="danger">× {{ result.missing.join('、') || '无' }}</el-tag>
          </div>
          <div class="result-row">
            <span>法条引用</span>
            <el-tag type="success">√ 正常</el-tag>
          </div>
          <div class="result-row">
            <span>案卡不一致</span>
            <el-tag :type="result.conflict ? 'danger' : 'success'">
              {{ result.conflict ? `× ${result.conflictText}` : '√ 无冲突' }}
            </el-tag>
          </div>
        </template>
      </el-skeleton>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'
import { useAuthStore } from '../stores/auth'
import { useCaseStore } from '../stores/case'

const auth = useAuthStore()
const caseStore = useCaseStore()
const loading = ref(false)

const result = reactive({
  missing: [],
  conflict: false,
  conflictText: ''
})

function handleFile(file) {
  loading.value = true
  setTimeout(() => {
    result.missing = ['量刑建议', '嫌疑人身份证号']
    result.conflict = true
    result.conflictText = '案卡嫌疑人姓名“张三”与文书“张某”不一致'
    loading.value = false
    caseStore.pushPermissionLog(auth.username, `上传并校验文书：${file.name}`)
  }, 1000)
}
</script>

<style scoped>
.upload-panel {
  padding: 14px;
  margin-bottom: 12px;
}

.tip {
  margin-top: 10px;
  color: #9bc6f2;
  font-size: 13px;
}

.result-panel {
  padding: 14px;
}

.result-panel h3 {
  margin: 0 0 12px;
}

.result-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(155, 198, 242, 0.2);
  padding: 10px 0;
}
</style>
