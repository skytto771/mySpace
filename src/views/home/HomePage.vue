<script setup>
import { ref } from 'vue'
</script>
<template>
  <div class="workPage">
    <el-scrollbar>
      <el-row :gutter="20">
        <el-col :span="10" :offset="1">
          <el-card>
            <h3>时钟</h3>
            <div class="clock-img">
              <div class="clock"></div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card>
            <h3>日历</h3>
            <el-calendar></el-calendar>
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="20" style="margin-top: 20px">
        <el-col :span="8" :offset="2">
          <el-card>
            <h3>计划</h3>
            <el-timeline>
              <el-timeline-item timestamp="2023-10-01">计划1</el-timeline-item>
              <el-timeline-item timestamp="2023-10-05">计划2</el-timeline-item>
              <el-timeline-item timestamp="2023-10-10">计划3</el-timeline-item>
            </el-timeline>
          </el-card>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-card>
            <h3>标签</h3>
            <el-tag type="primary">工作</el-tag>
            <el-tag type="success">学习</el-tag>
            <el-tag type="info">生活</el-tag>
          </el-card>
        </el-col>
      </el-row>
    </el-scrollbar>
  </div>
</template>
<style>
.workPage {
  width: 100%;
  height: 100%;

  background: rgb(255, 255, 255);
}
</style>
