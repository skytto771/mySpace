import { ref } from 'vue'
import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'

export const useNoteStore = defineStore(
  'noteStore',
  () => {
    type noteType = {
      id: number
      userid: number
      title: string
      content: string
      contentHTML: string
      createTime: string
    }

    const notes = ref<noteType[]>([])

    const addNote = (noteData: noteType) => {
      notes.value.push(noteData)
    }
    const getNote = () => {
      return JSON.parse(JSON.stringify(notes.value))
    }
    const saveNote = (noteData: noteType) => {
      const note = notes.value.find((item) => item.id === noteData.id)
      if (note) {
        note.title = noteData.title
        note.content = noteData.content
        note.contentHTML = noteData.contentHTML
        note.createTime = noteData.createTime
        ElMessage.success('保存成功!')
      }
    }
    const isSaveNote = (noteData: noteType) => {
      const note = notes.value.find((item) => item.id === noteData.id)
      if (note) {
        if (
          note.content === noteData.content &&
          note.contentHTML === noteData.contentHTML &&
          note.title === noteData.title
        ) {
          // 代码在这三个条件都满足时执行

          return true
        } else {
          // 代码在任意一个条件不满足时执行
          return false
        }
      }
    }
    const topNote = (noteId: number) => {
      const index = notes.value.findIndex((note) => note.id === noteId)
      if (index !== -1) {
        const [note] = notes.value.splice(index, 1)
        notes.value.unshift(note)
        ElMessage.success('置顶成功!')
      } else {
        ElMessage.error('未找到指定的笔记')
      }
    }

    const delNote = (noteId: number) => {
      notes.value = notes.value.filter((note) => note.id !== noteId)
    }
    return { notes, addNote, getNote, saveNote, isSaveNote, topNote, delNote }
  },
  {
    persist: true
  }
)
