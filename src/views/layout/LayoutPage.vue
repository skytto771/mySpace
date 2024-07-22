<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore, useWeatherStore, useWorkStore } from '@/stores'
import { getCurrentTime } from '@/utils/getTime'
import {
  Menu,
  ChatDotRound,
  HomeFilled,
  Promotion,
  Aim,
  Setting
} from '@element-plus/icons-vue'

const userStore = useUserStore()
const weatherStore = useWeatherStore()
const workStore = useWorkStore()
const router = useRouter()
const route = useRoute()
const headerRef = ref()
const currentTime = ref('')
const isRotating = ref(false)
const currentRoutePath = ref('')
const nowPath = ref({})
const lastPath = ref({})

workStore.VisitPlus()

currentRoutePath.value = route.path

const user = userStore.getUser()
//设置时间定时器
currentTime.value = getCurrentTime()
setInterval(() => {
  currentTime.value = getCurrentTime()
}, 1000)
// 下拉菜单
const handleCommand = async (command) => {
  if (command === 'logout') {
    await ElMessageBox.confirm('确认退出吗？', '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    })
    userStore.token = 0
    router.push('/login')
  } else {
    router.push(`${command}`)
  }
}
const changePageHeader = (index) => {
  lastPath.value = nowPath.value
  nowPath.value = index
}
</script>

<template>
  <el-row class="theLayout">
    <el-col :span="4">
      <div style="height: 98vh">
        <el-scrollbar>
          <el-menu
            :default-active="currentRoutePath"
            :default-openeds="['1', '2', '3', '4']"
            class="el-menu-vertical"
            ref="headerRef"
            router
          >
            <h3 class="el-menu-title"><span>个人空间</span></h3>
            <el-sub-menu index="1">
              <template #title>
                <el-icon><HomeFilled /></el-icon>
                <span>首页</span>
              </template>
              <el-menu-item
                @click="changePageHeader({ 工作台: '/working' })"
                index="/working"
                >工作台</el-menu-item
              >
              <el-menu-item
                @click="changePageHeader({ 个人中心: '/user' })"
                index="/user"
                >个人中心</el-menu-item
              >
            </el-sub-menu>
            <el-sub-menu index="2">
              <template #title>
                <el-icon><Menu /></el-icon>
                <span>待办事项</span>
              </template>
              <el-menu-item
                @click="changePageHeader({ 笔记本: '/noteBook' })"
                index="/noteBook"
                >笔记本</el-menu-item
              >
              <el-menu-item
                @click="changePageHeader({ 说说: '/say' })"
                index="/say"
                >说说</el-menu-item
              >
            </el-sub-menu>
            <el-sub-menu index="3">
              <template #title>
                <el-icon><ChatDotRound /></el-icon>
                <span>聊天室</span>
              </template>
              <el-menu-item
                @click="changePageHeader({ 聊天室: '/chat' })"
                index="/chat"
                >聊天室</el-menu-item
              >
            </el-sub-menu>
            <el-sub-menu index="4">
              <template #title>
                <el-icon><Promotion /></el-icon>
                <span>相册</span>
              </template>
              <el-menu-item
                @click="changePageHeader({ 日常: '/album' })"
                index="/album"
                >相册</el-menu-item
              >
            </el-sub-menu>
            <el-sub-menu index="5">
              <template #title>
                <el-icon><Aim /></el-icon>
                <span>个人项目</span>
              </template>
              <el-menu-item index="/">个人空间</el-menu-item>
            </el-sub-menu>
          </el-menu>
        </el-scrollbar>
      </div>
    </el-col>
    <el-col :span="20">
      <el-page-header class="pageHeader" @back="router.go(-1)">
        <template #breadcrumb>
          <el-breadcrumb separator=">" class="pageHeader-item">
            <el-breadcrumb-item :to="{ path: './working' }">
              首页
            </el-breadcrumb-item>
            <el-breadcrumb-item
              v-if="Object.keys(lastPath).length !== 0"
              :to="{ path: `${lastPath[Object.keys(lastPath)[0]]}` }"
            >
              <span>{{ Object.keys(lastPath)[0] }}</span>
            </el-breadcrumb-item>
            <el-breadcrumb-item v-if="Object.keys(nowPath).length !== 0">{{
              Object.keys(nowPath)[0]
            }}</el-breadcrumb-item>
          </el-breadcrumb>
        </template>
        <template #content>
          <span class="text-large font-600 mr-3">
            {{ Object.keys(nowPath)[0] }}
          </span>
        </template>
        <template #extra>
          <div class="dateAndWeather">
            <span style="margin-right: 20px">{{ currentTime }}</span>
            <span style="margin-right: 20px" v-if="weatherStore.weather"
              >天气：{{ weatherStore.weather.weather }}</span
            >
          </div>
          <div class="SimpleUserInfo">
            <div style="display: flex; flex-direction: row">
              <div><el-avatar :src="user.userAvator" /></div>
              <div style="margin-left: 20px; line-height: 45px">
                你好！{{ user.username }}
              </div>
            </div>
            <el-dropdown @command="handleCommand">
              <el-icon
                @mouseenter="isRotating = true"
                @mouseleave="isRotating = false"
                class="setting"
                :class="{ 'rotate-180': isRotating }"
                size="30"
                ><Setting
              /></el-icon>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="user">个人中心</el-dropdown-item>
                  <el-dropdown-item command="repassword"
                    >修改密码</el-dropdown-item
                  >
                  <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </template>
      </el-page-header>
      <div wrap class="mainPage">
        <RouterView />
      </div>
    </el-col>
  </el-row>
</template>

<style scoped>
.theLayout {
  width: 100%;
  height: 100%;
  background-color: #efbcda;
  background-image: -webkit-linear-gradient(
    45deg,
    rgb(171, 245, 218) 25%,
    transparent 25%,
    transparent 50%,
    rgb(150, 212, 236) 50%,
    rgb(239, 147, 228) 75%,
    transparent 75%,
    transparent
  );
}
.el-menu-title {
  margin: 0;
  padding-top: 10px;
  width: 100%;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
}
.pageHeader {
  height: 100px;
  border-bottom: 1px solid rgb(220, 223, 230);
  box-shadow: 1px 5px 15px rgba(103, 103, 103, 0.31);
  overflow: hidden;
  background-color: rgb(255, 255, 255);
}
.SimpleUserInfo {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.setting {
  margin-right: 25px;
  margin-top: 5px;
}
.rotate-180 {
  transition: transform 0.5s;
}
.rotate-180:hover {
  transform: rotate(180deg);
}
.mainPage {
  width: 100%;
  height: 87%;
  max-height: 668px;
}
</style>
