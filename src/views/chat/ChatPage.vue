<template>
  <div class="chat-room-container">
    <div class="chat-room-header">星空聊天室</div>
    <div class="messages-container">
      <div class="message" v-for="(message, index) in messages" :key="index">
        <strong>{{ message.user }}:</strong> {{ message.content }}
      </div>
    </div>
    <div class="message-input-container">
      <el-input
        v-model="newMessage"
        placeholder="Type your message"
        class="message-input"
        @keyup.enter="sendMessage"
      />
      <el-button type="primary" @click="sendMessage">Send</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const messages = ref([])
const newMessage = ref('')
const userName = ref('User' + Math.floor(Math.random() * 1000))

const sendMessage = () => {
  if (newMessage.value.trim()) {
    messages.value.push({
      user: userName.value,
      content: newMessage.value
    })
    newMessage.value = ''
  }
}
</script>

<style scoped>
.chat-room-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-room-header {
  background-color: #f5f5f5;
  padding: 10px;
  font-size: 16px;
  text-align: center;
  border-bottom: 1px solid #ebebeb;
}

.messages-container {
  flex-grow: 1;
  overflow-y: auto;
  padding: 10px;
  background-color: #fff;
}

.message {
  margin-bottom: 8px;
}

.message-input-container {
  display: flex;
  padding: 10px;
  background-color: #f5f5f5;
  border-top: 1px solid #ebebeb;
}

.message-input {
  flex-grow: 1;
  margin-right: 10px;
}
</style>
