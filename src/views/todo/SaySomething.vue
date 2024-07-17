<script setup>
import { ref } from 'vue'
import {
  ChatDotRound,
  ChatDotSquare,
  StarFilled,
  Plus,
  Star
} from '@element-plus/icons-vue'
import { useTalkStore, useUserStore } from '@/stores'
import { fileToBase64 } from '@/utils/fileToImg'
import data from 'emoji-mart-vue-fast/data/all.json'
import 'emoji-mart-vue-fast/css/emoji-mart.css'
import { Picker, EmojiIndex } from 'emoji-mart-vue-fast/src'

let emojiIndex = new EmojiIndex(data)
const visibleEmoji1 = ref(false)
const visibleEmoji2 = ref(false)
const currentTalkId = ref(0)
const inputVisible = ref(false)
const newSayContent = ref({})
const talkStore = useTalkStore()
const userStore = useUserStore()
const talksList = ref([])
const fileList = ref([])
const user = userStore.getUser()

const talkDefault = {
  id: +(user.id + '001'),
  userid: user.id,
  username: user.username,
  nickname: user.nickName,
  content: '',
  avatar: user.userAvator,
  comments: [],
  pictureUrl: [],
  stars: [],
  createTime: '',
  newComment: '',
  visibleComment: false
}
newSayContent.value = JSON.parse(JSON.stringify(talkDefault))
talkStore.talkLog.forEach((item) => (item.visibleComment = false))
talksList.value = talkStore.getTalks()

function toggleInput() {
  inputVisible.value = !inputVisible.value
}

function handleClose(done) {
  if (!newSayContent.value) {
    done()
  } else {
    // 可以添加确认对话框或其他处理
    done()
  }
}

function postNewSay() {
  newSayContent.value.createTime = new Date().toLocaleString()
  talkStore.addTalk(JSON.parse(JSON.stringify(newSayContent.value)))
  fileList.value = []
  newSayContent.value = JSON.parse(JSON.stringify(talkDefault))
  inputVisible.value = false
  talksList.value = talkStore.getTalks()
}
const handleUrl = async (uploadFile) => {
  console.log(uploadFile)
  const base64 = await fileToBase64(uploadFile.raw)
  newSayContent.value.pictureUrl.push(base64)
}
const handleComment = (newComment, id) => {
  const newCommentData = {
    userid: user.id,
    name: user.nickName || user.username,
    comment: newComment,
    avatar: user.userAvator
  }
  talkStore.addComment({ ...newCommentData }, id)
  talksList.value = talkStore.getTalks()
}
const toggleCommentVisible = (id) => {
  talkStore.toggleVisibleComment(id)
  const theTalk = talksList.value.find((item) => item.id === id)
  theTalk.visibleComment = !theTalk.visibleComment
}
const isLike = (id) => {
  talkStore.toggleLike(id, user.id)
  talksList.value = talkStore.getTalks()
}
const showEmoji1 = (emoji) => {
  newSayContent.value.content += emoji.native
  visibleEmoji1.value = false
}
const toggleEmoji = (id) => {
  visibleEmoji2.value = !visibleEmoji2.value
  currentTalkId.value = id
}
const showEmoji2 = (emoji) => {
  const theTalk = talksList.value.find(
    (item) => item.id === currentTalkId.value
  )
  theTalk.newComment += emoji.native
  visibleEmoji2.value = false
}
</script>

<template>
  <div class="talk-container">
    <el-button class="post-button" circle @click="toggleInput">
      <el-icon size="60"><ChatDotRound /></el-icon
    ></el-button>

    <el-dialog
      title="发表说说"
      v-model="inputVisible"
      :before-close="handleClose"
    >
      <el-input
        type="textarea"
        v-model="newSayContent.content"
        resize="none"
        rows="4"
        placeholder="分享新鲜事..."
      ></el-input>
      <el-form-item>
        <svg
          class="emojiSvg"
          @click="visibleEmoji1 = !visibleEmoji1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 64 64"
          width="25"
          height="25"
        >
          <!-- 圆形脸部 -->
          <circle cx="32" cy="32" r="30" fill="#ffcc4d" />
          <!-- 左眼 -->
          <circle cx="20.5" cy="24" r="5" fill="#664500" />
          <!-- 右眼 -->
          <circle cx="43.5" cy="24" r="5" fill="#664500" />
          <!-- 嘴巴 -->
          <path
            d="M20.8 39.5c2.6 2.9 6.1 4.5 9.9 4.5s7.3-1.6 9.9-4.5c0.8-0.9 2.1-1 3-0.2 0.9 0.8 1 2.1 0.2 3-3.4 3.7-8 5.7-13.1 5.7s-9.7-2-13.1-5.7c-0.8-0.9-0.7-2.2 0.2-3s2.2-0.7 3 0.2z"
            fill="#664500"
          />
        </svg>
        <div class="emojiDiv" v-show="visibleEmoji1">
          <Picker :data="emojiIndex" set="twitter" @select="showEmoji1" />
        </div>
      </el-form-item>
      <el-upload
        class="avatar-uploader"
        v-model:file-list="fileList"
        list-type="picture-card"
        :auto-upload="false"
        :on-change="handleUrl"
      >
        <el-icon><Plus /></el-icon>
      </el-upload>
      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button @click="inputVisible = false">取消</el-button>
          <el-button type="primary" @click="postNewSay">发表</el-button>
        </span>
      </template>
    </el-dialog>
    <el-scrollbar class="scrollbar">
      <div class="talks-list">
        <el-card
          v-for="(talk, index) in talksList"
          :key="index"
          class="talk-card"
          shadow="hover"
        >
          <div class="talk-contain-box">
            <div class="talk-content-avatar">
              <el-avatar
                shape="square"
                size="large"
                :src="talk.avatar"
              ></el-avatar>
            </div>
            <div class="talk-content">
              <div class="talk-content-username">
                {{ talk.nickname || talk.username }}
              </div>
              <div class="talk-content-content">{{ talk.content }}</div>
              <div class="talk-content-picture">
                <el-image
                  v-for="(item, index) in talk.pictureUrl"
                  :key="index"
                  style="width: 200px; height: 200px; margin-right: 5px"
                  :src="item"
                  :zoom-rate="1.2"
                  :max-scale="7"
                  :min-scale="0.2"
                  :preview-src-list="talk.pictureUrl"
                  :initial-index="4"
                  fit="cover"
                />
              </div>
              <div class="comment-bar">
                <div class="comment-bar-pubDate">{{ talk.createTime }}</div>
                <div class="comment-bar-star">
                  <el-icon
                    class="star-icon"
                    @click="toggleCommentVisible(talk.id)"
                    ><ChatDotSquare
                  /></el-icon>
                  <el-icon
                    class="star-icon"
                    style="margin-left: 10px"
                    @click="isLike(talk.id)"
                  >
                    <StarFilled
                      color="orange"
                      v-if="talk.stars.some((item) => item === user.id)"
                    />
                    <Star v-else />
                  </el-icon>
                  <span class="stars-num">{{ talk.stars.length }}</span>
                </div>
              </div>
              <div v-if="talk.visibleComment">
                <div class="publish-comment">
                  <div class="publish-comment-input">
                    <textarea
                      v-model="talk.newComment"
                      placeholder="期待留下你的脚印..."
                      row="2"
                      class="comment-input"
                    ></textarea>
                  </div>
                  <div class="publish-comment-toolBar">
                    <svg
                      class="emojiSvg"
                      @click="toggleEmoji(talk.id)"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 64 64"
                      width="25"
                      height="25"
                    >
                      <!-- 圆形脸部 -->
                      <circle cx="32" cy="32" r="30" fill="#ffcc4d" />
                      <!-- 左眼 -->
                      <circle cx="20.5" cy="24" r="5" fill="#664500" />
                      <!-- 右眼 -->
                      <circle cx="43.5" cy="24" r="5" fill="#664500" />
                      <!-- 嘴巴 -->
                      <path
                        d="M20.8 39.5c2.6 2.9 6.1 4.5 9.9 4.5s7.3-1.6 9.9-4.5c0.8-0.9 2.1-1 3-0.2 0.9 0.8 1 2.1 0.2 3-3.4 3.7-8 5.7-13.1 5.7s-9.7-2-13.1-5.7c-0.8-0.9-0.7-2.2 0.2-3s2.2-0.7 3 0.2z"
                        fill="#664500"
                      />
                    </svg>
                    <div class="emojiDiv2" v-show="visibleEmoji2">
                      <Picker
                        :data="emojiIndex"
                        set="twitter"
                        @select="showEmoji2"
                      />
                    </div>
                    <el-button
                      @click="handleComment(talk.newComment, talk.id)"
                      style="height: 25px"
                      >发布</el-button
                    >
                  </div>
                </div>
                <div
                  class="comment"
                  v-for="(item, index) in talk.comments"
                  :key="index"
                >
                  <div class="comment-avatar">
                    <el-avatar :src="item.avatar"></el-avatar>
                  </div>
                  <div class="comment-main">
                    <div class="comment-main-username">{{ item.name }}</div>
                    <div class="comment-main-content">{{ item.comment }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </el-scrollbar>
  </div>
</template>

<style scoped>
.talk-container {
  display: flex;
  justify-items: center;
  width: 100%;
  height: 100%;
  background: url('https://th.bing.com/th?id=OIP.2rQ25qnSMQHXGcHz3Rp2pAAAAA&w=316&h=197&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2')
    no-repeat center / cover;
}

.post-button {
  position: fixed;
  width: auto;
  height: auto;
  bottom: 20px;
  right: 20px;
  z-index: 100;
}
.scrollbar {
  width: 100%;
}

.talks-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  margin: 20px auto;
  background-color: rgba(110, 110, 110, 0.166);
}

.talk-card {
  display: flex;
  flex-direction: row;
  width: 80%;
  margin: 15px 0;
}

.talk-header {
  display: flex;
  align-items: center;
}

.talk-contain-box {
  display: flex;
  flex-direction: row;
  margin-top: 10px;
}
.talk-content {
  display: flex;
  flex-direction: column;
  margin-left: 10px;
}

.talk-content-username,
.comment-main-username {
  margin-bottom: 5px;
  font-size: 14px;
  color: rgb(107, 107, 108);
}
.talk-content-content,
.comment-main-content {
  margin-bottom: 5px;
  font-size: 16px;
}
.talk-content-picture {
  margin-top: 10px;
}
.comment-bar {
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
}
.comment-bar-pubDate {
  font-size: 12px;
  color: rgb(103, 103, 103);
}
.comment-bar-star {
  margin-left: 10vw;
}
.star-icon {
  cursor: pointer;
}
.star-icon:hover {
  color: rgb(63, 217, 244);
}
.comment {
  display: flex;
  flex-direction: row;
}
.comment-main {
  margin-left: 10px;
}
.publish-comment {
  width: 20vw;
}
.comment-input {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: none;
  font-size: 16px;
  line-height: 18px;
  color: rgb(103, 103, 103);
}
.comment-input:hover {
  box-shadow: 0 0 5px rgba(102, 175, 233, 0.6);
}
.comment-input:focus {
  border-color: #66afe9;
  outline: none;
  box-shadow: 0 0 5px rgba(102, 175, 233, 0.6);
}
.publish-comment-toolBar {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 5px;
}
.emojiSvg {
  cursor: pointer;
  width: 25px;
  height: 25px;
}
.emojiDiv {
  position: absolute;
  z-index: 20;
}
.emojiDiv2 {
  position: fix;
  z-index: 20;
}
.comment {
  margin-top: 10px;
}
.stars-num {
  font-size: 10px;
}
</style>
