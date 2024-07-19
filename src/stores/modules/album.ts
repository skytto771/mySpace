import { ref } from 'vue'
import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'

export const useAlbumStore = defineStore(
  'albumStore',
  () => {
    type albumType = {
      id: number
      classification: string
      discription: string
      createTime: string
      url: string
    }

    const album = ref<albumType[]>([])

    const addPic = (albumData: albumType) => {
      album.value.push(albumData)
      ElMessage.success('添加成功！')
    }
    return { album, addPic }
  },
  {
    persist: true
  }
)
