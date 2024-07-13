import { ref } from 'vue'
import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'

export const useUserStore = defineStore(
  'userStore',
  () => {
    interface User {
      id: number
      username: string
      password: string
      email: string
      userAvator: string
      nickName: string
      skill: string[]
      chara: string[]
      description: string
      address: string
      phone: string
    }

    const lastid = ref(41200)
    const token = ref(0)
    const users = ref<User[]>([])
    //登录
    const setUser = (username: string, password: string) => {
      //检查是否存在用户
      const userToUpdate = users.value.find(
        (user) => user.username === username
      )

      if (!userToUpdate) {
        ElMessage.error('未找到用户信息')
        return false
      }
      if (!users.value.some((user) => user.password === password)) {
        ElMessage.error('密码错误!')
        return false
      }

      token.value = userToUpdate.id
      ElMessage.success('登录成功！')
    }
    //添加用户
    const addUser = (
      id: number,
      username: string,
      email: string,
      password: string
    ) => {
      users.value.push({
        id,
        username,
        password,
        email,
        userAvator: 'src/assets/defaultAvatar.jpg',
        nickName: '',
        skill: [],
        chara: [],
        description: '',
        address: '',
        phone: ''
      })
      console.log(users.value)
      lastid.value += 1
    }
    //获取当前用户信息
    const getUser = () => {
      const user = users.value.find((item) => item.id === token.value)
      return { ...user }
    }
    //设置头像
    const setAvator = () => {}

    return { token, users, lastid, addUser, setUser, getUser, setAvator }
  },
  {
    persist: true
  }
)
