import HomePage from '@/views/home/HomePage.vue'
import NoteBook from '@/views/todo/NoteBook.vue'
import SaySomething from '@/views/todo/SaySomething.vue'
import UserPage from '@/views/user/UserPage.vue'
import FoodPage from '@/views/album/FoodPage.vue'
import DailyPage from '@/views/album/DailyPage.vue'
import SceneryPage from '@/views/album/SceneryPage.vue'
import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/views/login/LoginPage.vue'
import LayoutPage from '@/views/layout/LayoutPage.vue'

import { useUserStore } from '@/stores/modules/user'
import ChatPage from '@/views/chat/ChatPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', component: LoginPage },
    {
      path: '/',
      component: LayoutPage,
      redirect: '/working',
      children: [
        { path: '/working', component: HomePage },
        { path: '/user', component: UserPage },
        { path: '/noteBook', component: NoteBook },
        { path: '/say', component: SaySomething },
        { path: '/daily', component: DailyPage },
        { path: '/food', component: FoodPage },
        { path: '/scenery', component: SceneryPage },
        { path: '/chat', component: ChatPage }
      ]
    }
  ]
})

// 添加路由守卫
router.beforeEach((to) => {
  const userStore = useUserStore()

  // 检查是否存在 token
  if (userStore.token === 0 && to.path !== '/login') {
    // 如果没有 token 且目标路径不是登录页，则重定向到登录页
    return '/login'
  }
})

export default router
