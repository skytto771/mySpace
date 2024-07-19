import { ref } from 'vue'
import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'

export const useTalkStore = defineStore(
  'talkStore',
  () => {
    type TalkLogType = {
      id: number
      userid: number
      username: string
      avatar: string
      nickName: string
      content: string
      pictureUrl: string[]
      comments: commentType[]
      stars: number[]
      createTime: string
      newComment: string
      visibleComment: boolean
    }

    type commentType = {
      userid: number
      name: string
      comment: string
      avatar: string
    }

    const talkLog = ref<TalkLogType[]>([])

    const addTalk = async (talkData: TalkLogType) => {
      if (talkLog.value[talkLog.value.length - 1]) {
        talkData.id = 44200 + 1
      } else {
        talkData.id = +(talkData.userid + '001')
      }
      talkLog.value.unshift(talkData)
      ElMessage.success('发表成功！')
    }
    const getTalks = () => {
      return JSON.parse(JSON.stringify(talkLog.value))
    }
    const addComment = (commentData: commentType, id: number) => {
      console.log(id)
      const comments = talkLog.value.find((item) => item.id === id)?.comments
      if (comments) {
        comments.push(commentData)
      }
      console.log(comments)
      ElMessage.success('评论成功')
    }
    const toggleVisibleComment = (id: number) => {
      const theTalk = talkLog.value.find((item) => item.id === id)
      if (theTalk) {
        theTalk.visibleComment = !theTalk.visibleComment
      }
    }
    const toggleLike = (id: number, userid: number) => {
      const theTalk = talkLog.value.find((item) => item.id === id)
      console.log(id)
      if (theTalk) {
        const index = theTalk.stars.findIndex((item) => item === userid)
        if (index !== -1) {
          theTalk.stars.splice(index, 1)
        } else {
          theTalk.stars.push(userid)
        }
      }
    }
    return {
      talkLog,
      addTalk,
      getTalks,
      addComment,
      toggleVisibleComment,
      toggleLike
    }
  },
  {
    persist: true
  }
)
