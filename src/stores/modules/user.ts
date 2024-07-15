import { ref } from 'vue'
import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'

export const useUserStore = defineStore(
  'userStore',
  () => {
    type UserType = {
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
    const users = ref<UserType[]>([])
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
    const setAvator = (avatarBase64: string) => {
      const user = users.value.find((item) => item.id === token.value)
      if (user) {
        user.userAvator = avatarBase64
        ElMessage.success('上传成功!')
      }
    }

    const updataUserInfo = (editUser: UserType) => {
      const user = users.value.find((item) => item.id === token.value)
      console.log(editUser)
      const {
        id,
        username,
        password,
        email,
        userAvator,
        nickName,
        skill,
        chara,
        description,
        address,
        phone
      } = editUser
      if (user) {
        user.id = id
        user.username = username
        user.password = password
        user.email = email
        user.userAvator = userAvator
        user.nickName = nickName
        user.skill = skill
        user.chara = chara
        user.description = description
        user.address = address
        user.phone = phone
      }
      ElMessage.success('编辑成功！')
    }
    return {
      token,
      users,
      lastid,
      addUser,
      setUser,
      getUser,
      setAvator,
      updataUserInfo
    }
  },
  {
    persist: true
  }
)
