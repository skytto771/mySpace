<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'

const router = useRouter()
const userStore = useUserStore()
const formRef = ref()
const formModel = ref({
  id: 0,
  username: '',
  email: '',
  password: '',
  rePassword: ''
})
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, message: '用户名需大于3个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/,
      message: '请输入有效的邮箱地址',
      trigger: 'blur'
    }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z\\W]{6,18}$/,
      message: '密码至少6个字符，包含大小写字母、数字和特殊字符',
      trigger: 'blur'
    }
  ],
  rePassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z\\W]{6,18}$/,
      message: '密码至少6个字符，包含大小写字母、数字和特殊字符',
      trigger: 'blur'
    },
    {
      validator: (rule, value, callback) => {
        if (value !== formModel.value.password) {
          callback(new Error('两次密码不一致！'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}
const isRegister = ref(false)
const isShow = ref(true)
const toggleCard = () => {
  formRef.value.resetFields()
  isShow.value = false
  setTimeout(() => {
    isRegister.value = !isRegister.value
    isShow.value = true
  }, 300) // 延迟300毫秒后显示卡片
}
//注册操作
const submitRegister = async () => {
  try {
    await formRef.value.validate()
  } catch (err) {
    console.log(err)
    return
  }
  console.log(userStore.users)
  //检测是否重合用户名或邮箱
  if (
    userStore.users.some((user) => user.username === formModel.value.username)
  ) {
    ElMessage.error('该用户名已被注册!')
    return
  }
  if (userStore.users.some((user) => user.email === formModel.value.email)) {
    ElMessage.error('该邮箱已被注册!')
    return
  }
  if (!userStore.users[0]) {
    formModel.value.id = 41200 + 1
  } else {
    formModel.value.id = userStore.users[userStore.users.length - 1].id + 1
  }

  userStore.addUser(
    formModel.value.id,
    formModel.value.username,
    formModel.value.email,
    formModel.value.password
  )
  ElMessage.success('注册成功！')
  formRef.value.resetFields()
  toggleCard()
}
//登录操作
const submitLogin = async () => {
  try {
    await formRef.value.validate()
  } catch (err) {
    console.log(err)
    return
  }
  userStore.setUser(formModel.value.username, formModel.value.password)
  router.push('/')
}
</script>

<template>
  <el-row class="login-page">
    <el-col :span="10" :offset="7" class="form">
      <transition name="flip">
        <el-card shadow="hover" v-if="isRegister" v-show="isShow">
          <template #header>
            <div class="title">注册</div>
          </template>
          <el-form
            :model="formModel"
            :rules="rules"
            ref="formRef"
            label-width="auto"
            size="large"
            autocomplete="off"
          >
            <el-form-item label="用户名" prop="username">
              <el-input v-model="formModel.username" />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="formModel.email" />
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input
                type="password"
                show-password
                v-model="formModel.password"
              />
            </el-form-item>
            <el-form-item label="确认密码" prop="rePassword">
              <el-input
                type="password"
                show-password
                v-model="formModel.rePassword"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                @click="submitRegister"
                class="button"
                type="primary"
                auto-insert-space
              >
                注册
              </el-button>
            </el-form-item>
          </el-form>
          <template #footer>
            <el-link type="info" :underline="false" @click="toggleCard">
              ← 前往登录
            </el-link>
          </template>
        </el-card>
        <el-card shadow="hover" v-else v-show="isShow">
          <template #header>
            <div class="title">登录</div>
          </template>
          <el-form
            :model="formModel"
            :rules="rules"
            label-width="auto"
            size="large"
            autocomplete="off"
            ref="formRef"
          >
            <el-form-item label="用户名" prop="username">
              <el-input v-model="formModel.username" />
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input
                type="password"
                show-password
                v-model="formModel.password"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                @click="submitLogin"
                class="button"
                type="primary"
                auto-insert-space
              >
                登录
              </el-button>
            </el-form-item>
            <el-form-item class="flex">
              <el-checkbox label="记住我" size="large" />
              <el-link style="margin-left: auto">忘记密码？</el-link>
            </el-form-item>
          </el-form>
          <template #footer>
            <el-link type="info" :underline="false" @click="toggleCard">
              ← 前往注册
            </el-link>
          </template>
        </el-card>
      </transition>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.login-page {
  height: 100vh;
  background-color: #fff;
  background: url('@/assets/bg.jpg') no-repeat center / cover;
  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;
    .title {
      width: 100%;
      margin: 0 auto;
      font-size: 25px;
      font-weight: 600;
      text-align: center;
    }
    .button {
      width: 100%;
    }
    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
    .flip-enter-active,
    .flip-leave-active {
      transition: transform 0.6s;
      transform-style: preserve-3d;
    }
    .flip-enter,
    .flip-leave-to {
      transform: rotateY(180deg);
    }
  }
}
</style>
