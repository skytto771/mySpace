import { ref } from 'vue'
import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'

export const useWorkStore = defineStore(
  'workStore',
  () => {
    type todoType = {
      id: number
      userId: string
      text: string
      clock: string
    }

    const todo = ref<todoType[]>([])
    const visitNum = ref(112)

    const addTodo = (todoData: todoType) => {
      console.log(todoData)
      todo.value.unshift(todoData)
      ElMessage.success('已添加待办事项')
    }

    const delTodo = (id: number) => {
      const theTodoIndex = todo.value.findIndex((item) => item.id === id)
      if (theTodoIndex !== -1) {
        todo.value.splice(theTodoIndex, 1)
        ElMessage.success('成功删除该待办事项!')
      }
    }

    const setTop = (id: number) => {
      const theTodoIndex = todo.value.findIndex((item) => item.id === id)
      if (theTodoIndex !== -1) {
        const [TheTodo] = todo.value.splice(theTodoIndex, 1)
        todo.value.unshift(TheTodo)
      }
    }

    const setClock = (id: number, clockTime: string) => {
      const theTodo = todo.value.find((item) => item.id === id)
      if (theTodo) {
        theTodo.clock = clockTime
      }
    }

    const VisitPlus = () => {
      visitNum.value += 1
    }

    return { todo, visitNum, addTodo, delTodo, setTop, setClock, VisitPlus }
  },
  {
    persist: true
  }
)
