<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores'
import {
  Menu as IconMenu,
  ChatDotRound,
  HomeFilled,
  Promotion,
  Aim,
  Setting
} from '@element-plus/icons-vue'

const userStore = useUserStore()
const router = useRouter()
const headerRef = ref()
const currentTitle = ref('')
const currentItem = ref('')
const currentTime = ref('')

const user = userStore.getUser()

const updateTime = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  currentTime.value = `${year}-${month}-${day} ${hours}:${minutes}`
}
updateTime()
setInterval(updateTime, 1000)
</script>

<template>
  <el-row class="theLayout">
    <el-col :span="4"
      ><el-menu
        default-active="/working"
        default-openeds="[1,2,3,4]"
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
          <el-menu-item index="/working">工作台</el-menu-item>
          <el-menu-item index="/user">个人中心</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="2">
          <template #title>
            <el-icon><icon-menu /></el-icon>
            <span>待办事项</span>
          </template>
          <el-menu-item index="/noteBook">笔记本</el-menu-item>
          <el-menu-item index="/say">说说</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="3">
          <template #title>
            <el-icon><ChatDotRound /></el-icon>
            <span>聊天室（待完成）</span>
          </template>
          <el-menu-item index="/chat">聊天室1</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="4">
          <template #title>
            <el-icon><Promotion /></el-icon>
            <span>相册</span>
          </template>
          <el-menu-item index="/scenery">风景</el-menu-item>
          <el-menu-item index="/food">美食</el-menu-item>
          <el-menu-item index="/daily">日常</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="5">
          <template #title>
            <el-icon><Aim /></el-icon>
            <span>个人项目</span>
          </template>
          <el-menu-item index="2-1">个人空间</el-menu-item>
        </el-sub-menu>
      </el-menu></el-col
    >
    <el-col :span="20">
      <el-page-header class="pageHeader" @back="router.go(-1)">
        <template #breadcrumb>
          <el-breadcrumb separator=">" class="pageHeader-item">
            <el-breadcrumb-item :to="{ path: './working' }">
              首页
            </el-breadcrumb-item>
            <el-breadcrumb-item v-if="currentTitle">
              <span>{{ currentTitle }}</span>
            </el-breadcrumb-item>
            <el-breadcrumb-item v-if="currentItem">{{
              currentItem
            }}</el-breadcrumb-item>
          </el-breadcrumb>
        </template>
        <template #content>
          <span class="text-large font-600 mr-3">
            {{ currentItem }}
          </span>
        </template>
        <template #extra>
          <div class="dateAndWeather">
            <span style="margin-right: 20px">{{ currentTime }}</span>
            <span style="margin-right: 20px">天气：晴</span>
          </div>
          <div class="SimpleUserInfo">
            <div style="display: flex; flex-direction: row">
              <div><el-avatar :src="user.userAvator" /></div>
              <div style="margin-left: 20px; line-height: 45px">
                你好！{{ user.username }}
              </div>
            </div>
            <el-icon><Setting /></el-icon>
          </div>
        </template>
      </el-page-header>
      <el-space wrap>
        <RouterView />
      </el-space>
    </el-col>
  </el-row>
</template>

<style scoped>
.theLayout {
  width: 98vw;
  height: 98vh;
}
.el-menu-title {
  width: 100%;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
}
.pageHeader {
  height: 100px;
  border-bottom: 1px solid black;
}
.SimpleUserInfo {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>
