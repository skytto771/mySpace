import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useChatStore = defineStore(
  'chatStore',
  () => {
    type ChatLogType = {
      id: number
      username: string
      userAvator: string
      nickName: string
      chatLog: string
      createTime: string
    }

    const chatLog = ref<ChatLogType[]>([])

    const addLog = (chatData: ChatLogType) => {
      chatLog.value.push(chatData)
    }
    return { chatLog, addLog }
  },
  {
    persist: true
  }
)
