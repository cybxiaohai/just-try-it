<template>
  <div class="login-wrap">
    <div class="bg-glow"></div>
    <el-card class="login-card">
      <h2>青法逐光 · 系统登录</h2>
      <el-form :model="form" :rules="rules" ref="formRef" label-position="top">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" show-password />
        </el-form-item>
        <el-form-item label="角色选择" prop="role">
          <el-select v-model="form.role" style="width: 100%">
            <el-option v-for="item in roles" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-button type="primary" style="width: 100%" @click="submitLogin">登录并进入工作台</el-button>
      </el-form>
      <p class="tip">角色说明：为了落实保密规则,检察官仅可查看本人办理案件,案件管理办公室可查看全院受理案件,院长可查看本院案件办理数据大盘。</p>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { roleDefaultPath, roles } from '../data/mock'
import { useAuthStore } from '../stores/auth'
import { useCaseStore } from '../stores/case'

const router = useRouter()
const auth = useAuthStore()
const caseStore = useCaseStore()
const formRef = ref()

const form = reactive({
  username: '李检察官',
  password: '123456',
  role: 'prosecutor'
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }]
}

function submitLogin() {
  formRef.value.validate((valid) => {
    if (!valid) return
    auth.login({ username: form.username, role: form.role })
    caseStore.pushPermissionLog(form.username, `登录系统，角色：${roles.find((i) => i.value === form.role)?.label || ''}`)
    ElMessage.success('登录成功')
    router.push(roleDefaultPath[form.role] || '/workbench')
  })
}
</script>

<style scoped>
.login-wrap {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.bg-glow {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 15% 20%, rgba(0, 196, 255, 0.2), transparent 30%),
    radial-gradient(circle at 85% 75%, rgba(0, 140, 255, 0.18), transparent 28%);
}

.login-card {
  width: min(420px, calc(100% - 32px));
  position: relative;
  z-index: 1;
  background: rgba(9, 28, 52, 0.92);
  border: 1px solid rgba(53, 156, 234, 0.45);
}

h2 {
  margin: 0 0 18px;
  color: #d9eeff;
  text-align: center;
}

.tip {
  margin-top: 14px;
  color: #9dc9f2;
  font-size: 12px;
}
</style>
