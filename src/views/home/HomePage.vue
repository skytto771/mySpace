<script setup>
import { ref, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { getCityCode, getWeather } from '@/api/weather'
import {
  useWorkStore,
  useUserStore,
  useWeatherStore,
  useTalkStore
} from '@/stores'
import { getCurrentTime } from '@/utils/getTime'

const newTodo = ref({ id: 1, title: '无标题待办事项', text: '' })
const newTodoVisible = ref(false)
const cities = ref([])
const userStore = useUserStore()
const workStore = useWorkStore()
const talkStore = useTalkStore()
const weatherStore = useWeatherStore()
const todos = ref([])
const popoverVisible = ref(false)
const weather = ref({})
weather.value = weatherStore.weather

//设置待办
todos.value = workStore.todo.filter((item) => item.userId === userStore.token)

const latestNews = ref([
  { id: 1, text: '最新动态1', timestamp: '2024/7/21' },
  { id: 2, text: '最新动态2', timestamp: '2024/7/20' },
  { id: 3, text: '最新动态3', timestamp: '2024/7/19' }
])

const statistics = ref([
  { name: '访问量', value: workStore.visitNum },
  { name: '注册用户', value: userStore.users.length },
  { name: '说说发布量', value: talkStore.talkLog.length }
])

const addtodos = () => {
  const newId = workStore.todo.length + 1
  const todo = {
    id: newId,
    userId: userStore.token,
    text: newTodo.value.text,
    clock: ''
  }
  workStore.addTodo({ ...todo })
  newTodo.value.text = ''
  newTodoVisible.value = false
  todos.value = workStore.todo.filter((item) => item.userId === userStore.token)
}

const handleClose = () => {
  ElMessageBox.confirm('是否保存?')
    .then(() => {
      addtodos()
    })
    .catch(() => {
      newTodoVisible.value = false
      return
    })
}

const delTodeSev = (id) => {
  workStore.delTodo(id)
  todos.value = workStore.todo.filter((item) => item.userId === userStore.token)
}

const setTopTodo = (id) => {
  workStore.setTop(id)
  todos.value = workStore.todo.filter((item) => item.userId === userStore.token)
}

const getCode = async () => {
  popoverVisible.value = true
  if (!cities.value[0]) {
    const res = await getCityCode('中国')
    const country = res.data.districts[0]
    cities.value = country.districts
  }
}
const setCurrentCity = (item) => {
  weatherStore.currentCity = item.adcode
  fetchWeather()
  popoverVisible.value = false
}
// 获取天气信息
const fetchWeather = async () => {
  if (weather.value.adcode) {
    const weatherTime = new Date(weatherStore.weather.reporttime)
      .toISOString()
      .split('T')[0]
    const theTime = new Date(getCurrentTime()).toISOString().split('T')[0]
    if (
      weatherTime !== theTime ||
      weatherStore.weather.adcode !== weatherStore.currentCity
    ) {
      const res = await getWeather(weatherStore.currentCity)
      weatherStore.renewWeather(res.data.lives[0])
      weather.value = weatherStore.weather
    } else {
      return
    }
  } else {
    const res = await getWeather(weatherStore.currentCity)
    weatherStore.renewWeather(res.data.lives[0])
    weather.value = weatherStore.weather
  }
}

onMounted(() => {
  fetchWeather()
})
</script>

<template>
  <div class="workbench">
    <el-scrollbar height="650px">
      <!-- 显示天气信息 -->
      <el-card class="weather-card" shadow="always">
        <div class="weather-content">
          <el-popover placement="right" :width="100" trigger="click">
            <template #reference>
              <h3 @click="getCode" style="cursor: pointer">
                {{ weather.city }}
              </h3>
            </template>
            <el-scrollbar height="300px">
              <el-form-item v-for="item in cities" :key="item.adcode">
                <el-popover placement="right" :width="100" trigger="hover">
                  <template #reference>
                    <div
                      style="width: 100%"
                      @click="setCurrentCity(item)"
                      class="cities-item"
                    >
                      {{ item.name }}
                    </div>
                  </template>
                  <el-scrollbar height="300px">
                    <el-form-item
                      @click="setCurrentCity(city)"
                      v-for="city in item.districts"
                      :key="city.adcode"
                      class="cities-item"
                    >
                      {{ city.name }}</el-form-item
                    >
                  </el-scrollbar>
                </el-popover></el-form-item
              >
            </el-scrollbar>
          </el-popover>
          <div class="weather-details">
            <p>{{ weather.weather }}</p>
            <p>{{ weather.temperature }}°C</p>
          </div>
        </div>
        <div class="weather-picture"></div>
      </el-card>

      <el-row :gutter="20">
        <!-- 统计和分析 -->
        <el-col :span="12">
          <el-card class="box-card" style="height: 270px">
            <template v-slot:header>
              <div class="clearfix">
                <span>统计和分析</span>
              </div>
            </template>
            <el-table :data="statistics" style="width: 100%">
              <el-table-column
                prop="name"
                label="项目"
                width="120"
              ></el-table-column>
              <el-table-column prop="value" label="值"></el-table-column>
            </el-table>
          </el-card>
        </el-col>

        <!-- 最新动态 -->
        <el-col :span="12">
          <el-card class="box-card">
            <el-scrollbar>
              <el-timeline style="max-width: 600px; max-height: 230px">
                <el-timeline-item
                  :timestamp="item.timestamp"
                  placement="top"
                  v-for="item in latestNews"
                  :key="item.id"
                >
                  <el-card>
                    <h4>{{ item.text }}</h4>
                  </el-card>
                </el-timeline-item>
              </el-timeline>
            </el-scrollbar>
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <!-- 待办事项 -->
        <el-col :span="12">
          <el-card class="box-card" style="height: 270px">
            <template v-slot:header>
              <div class="todo-header">
                <span>待办事项</span>
                <el-button size="small" @click="newTodoVisible = true">
                  <el-icon size="large"><Plus /></el-icon>
                </el-button>
              </div>
            </template>
            <el-scrollbar>
              <el-collapse
                v-if="todos[0]"
                class="todo-class"
                style="max-height: 180px; height: 180px"
              >
                <el-collapse-item
                  :title="todo.text"
                  :name="todo.id"
                  v-for="todo in todos"
                  :key="todo.id"
                >
                  <div>
                    <el-button @click="setTopTodo(todo.id)">置顶</el-button>
                    <el-button @click="delTodeSev(todo.id)" type="danger"
                      >删除</el-button
                    >
                  </div>
                </el-collapse-item>
              </el-collapse>
              <div style="width: 100%; text-align: center" v-else>
                暂无待办事项
              </div>
            </el-scrollbar>
          </el-card>
        </el-col>
      </el-row>
    </el-scrollbar>
    <el-dialog
      v-model="newTodoVisible"
      title="新待办事项"
      width="500"
      :before-close="handleClose"
    >
      <el-form-item
        ><el-input
          v-model="newTodo.text"
          type="textarea"
          resize="none"
          rows="3"
        ></el-input
      ></el-form-item>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="addtodos"> 确认 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.workbench {
  padding: 10px;
  background-color: #f5f5f5;
  max-width: 100%; /* 限制宽度不超过父组件 */
  max-height: 100%; /* 限制高度不超过父组件 */
  box-sizing: border-box; /* 包括填充和边框在内的总宽度和高度 */
}

.box-card {
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
}

.el-card__header {
  background-color: #f0f2f5;
  font-weight: bold;
}

.el-form-item {
  margin-bottom: 20px;
}

.el-select {
  width: 100%;
}

.todo-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 5px;
}

.weather-card {
  margin-bottom: 20px;
  border-radius: 8px;
  background: linear-gradient(to right, #56ccf2, #2f80ed);
  color: white;
  height: 140px;
}

.weather-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.weather-details {
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 0 10px;
}

.weather-details p {
  margin: 0 10px;
}
.cities-item {
  cursor: pointer;
}
.cities-item:hover {
  background-color: rgb(236, 245, 255);
}
</style>
