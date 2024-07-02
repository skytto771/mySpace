import HomePage from '@/views/home/HomePage.vue'
import NoteBook from '@/views/todo/NoteBook.vue'
import SaySomething from '@/views/todo/SaySomething.vue'
import UserPage from '@/views/user/UserPage.vue'
import FoodPage from '@/views/album/FoodPage.vue'
import DailyPage from '@/views/album/DailyPage.vue'
import SceneryPage from '@/views/album/SceneryPage.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/working' },
    { path: '/working', component: HomePage },
    { path: '/user', component: UserPage },
    { path: '/noteBook', component: NoteBook },
    { path: '/say', component: SaySomething },
    { path: '/daily', component: DailyPage },
    { path: '/food', component: FoodPage },
    { path: '/scenery', component: SceneryPage }
  ]
})

export default router
