<script setup>
import { ref } from 'vue'
import { useUserStore, useChatStore } from '@/stores'
import data from 'emoji-mart-vue-fast/data/all.json'
import 'emoji-mart-vue-fast/css/emoji-mart.css'
import { Picker, EmojiIndex } from 'emoji-mart-vue-fast/src'
import { setUrl } from '@/utils/fileToImg'

let emojiIndex = new EmojiIndex(data)
const userStore = useUserStore()
const chatStore = useChatStore()
const newMessage = ref('')
const visibleEmoji = ref(false)
const scrollRef = ref()
const user = ref({})

setTimeout(() => {
  scrollRef.value.setScrollTop(10000)
}, 100)
user.value = userStore.getUser()

const sendMessage = () => {
  if (newMessage.value.trim()) {
    const messageData = {
      id: userStore.token,
      username: user.value.nickName || user.value.username,
      userAvator: user.value.userAvator,
      chatLog: newMessage.value,
      createTime: new Date().toLocaleString()
    }
    chatStore.addLog({ ...messageData })
    newMessage.value = ''
    console.log(scrollRef.value)
    setTimeout(() => {
      scrollRef.value.setScrollTop(10000)
    }, 200)
  }
}
const showEmoji = (emoji) => {
  newMessage.value += emoji.native
  visibleEmoji.value = false
}
</script>

<template>
  <div class="chat-room-container">
    <div class="chat-room-header">星空聊天室</div>
    <el-scrollbar ref="scrollRef" height="100%">
      <div class="messages-container">
        <div v-for="(message, index) in chatStore.chatLog" :key="index">
          <div class="message-date">
            {{ message.createTime }}
          </div>
          <div class="message-left" v-if="message.id !== user.id">
            <img :src="setUrl(message.userAvator)" class="avatar" />
            <div class="message-content">
              <div class="user-name" style="display: flex; margin-right: auto">
                {{ message.username }}
              </div>
              <div class="message-text">{{ message.chatLog }}</div>
            </div>
          </div>
          <div class="message-right" v-else>
            <img :src="setUrl(message.userAvator)" class="avatar" />
            <div class="message-content">
              <div class="user-name" style="display: flex; margin-left: auto">
                {{ message.username }}
              </div>
              <div class="message-text">{{ message.chatLog }}</div>
            </div>
          </div>
        </div>
      </div>
    </el-scrollbar>
    <div class="message-input-bar">
      <div class="emojiDiv" v-show="visibleEmoji">
        <Picker :data="emojiIndex" set="twitter" @select="showEmoji" />
      </div>
      <div>
        <el-button @click="visibleEmoji = !visibleEmoji">表情</el-button>
      </div>
      <div class="message-input-container">
        <el-input
          v-model="newMessage"
          type="textarea"
          resize="none"
          placeholder="输入您的消息"
          class="message-input"
          @keyup.enter="sendMessage"
        />
        <el-button type="primary" @click="sendMessage">Send</el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-room-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.chat-room-header {
  background-color: #f5f5f5;
  padding: 10px;
  font-size: 16px;
  text-align: center;
  border-bottom: 1px solid #ebebeb;
}
.messages-container {
  padding: 10px;
  max-height: 85%;
  display: flex;
  flex-direction: column;
}
.message-left,
.message-right {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.message-left {
  flex-direction: row;
}
.message-right {
  flex-direction: row-reverse;
}
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin: 0 10px;
}
.message-content {
  display: flex;
  flex-direction: column;
  max-width: 60%;
}
.user-name {
  font-size: 14px;
  margin-bottom: 2px;
}
.message-text {
  max-width: 35vw;
  border-radius: 10px;
  padding: 10px;
  background-color: #ffffff;
  word-wrap: break-word;
}
.message-date {
  text-align: center;
  font-size: 12px;
  color: #888;
  margin-bottom: 10px;
}
.message-input-bar {
  display: flex;
  padding-top: 10px;
  padding-left: 10px;
  flex-direction: column;
  height: 15%;
  background-color: #f5f5f5;
  border-top: 1px solid #70707030;
}
.message-input-container {
  display: flex;
  padding-top: 10px;
}

.message-input {
  flex-grow: 1;
  margin-right: 10px;
}
.emojiDiv {
  position: absolute;
  bottom: 15%;
}
</style>
