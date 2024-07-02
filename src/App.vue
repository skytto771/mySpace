<script setup lang="ts">
import { ref } from 'vue'
import {
  Menu as IconMenu,
  ChatDotRound,
  HomeFilled,
  Promotion,
  Aim
} from '@element-plus/icons-vue'

const headerRef = ref()
const currentTitle = ref('')
const currentItem = ref('')
const getHeader = (target: any) => {
  console.log(target)
  if (target.srcElement.className === 'el-sub-menu__title') {
    currentTitle.value = target.srcElement.innerText
    currentItem.value = ''
  } else {
    currentItem.value = target.srcElement.innerText
  }
}
</script>

<template>
  <el-row>
    <el-col :span="4"
      ><el-menu
        default-active="2"
        class="el-menu-vertical"
        ref="headerRef"
        router
        @click="getHeader($event)"
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
          <el-menu-item index="2-1">聊天室1</el-menu-item>
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
      <el-page-header class="pageHeader">
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
        <hr />
      </el-page-header>
      <RouterView />
    </el-col>
  </el-row>
</template>

<style scoped>
.el-menu-title {
  width: 100%;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
}
.pageHeader {
  padding: 20px;
}
hr {
  border: 1px solid rgb(255, 255, 255);
}
</style>
