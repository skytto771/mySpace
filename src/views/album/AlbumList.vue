<script setup>
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { useAlbumStore } from '@/stores'
import { fileToBase64 } from '@/utils/fileToImg'

const albumStore = useAlbumStore()
const router = useRouter()
const fileList = ref([])
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const VisiblePreview = ref(false)
const dialogWidth = ref('auto')
const dialogHeight = ref('auto')
const formRef = ref

const optionsPic = ref(['风景', '美食', '日常'])

const albums = ref([
  {
    id: 1,
    name: '风景',
    index: '/album/scenery',
    url: 'https://ts4.cn.mm.bing.net/th?id=OIP-C.BJ1enN7k7IDu_co8BKPhdwHaEo&w=316&h=197&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2'
  },
  {
    id: 2,
    name: '美食',
    index: '/album/food',
    url: 'https://tse1-mm.cn.bing.net/th/id/OIP-C.U_DnbmuTj2wfPeMNHsHzqQHaE8?w=298&h=198&c=7&r=0&o=5&dpr=1.3&pid=1.7'
  },
  {
    id: 3,
    name: '日常',
    index: '/album/daily',
    url: 'https://tse4-mm.cn.bing.net/th/id/OIP-C.r2oiWJ6VrfTGktQ2iXYWygHaFG?w=267&h=184&c=7&r=0&o=5&dpr=1.3&pid=1.7'
  }
  // 添加更多相册信息
])

const newAlbum = ref({
  id: null,
  classification: '',
  discription: '',
  createTime: new Date().toLocaleString(),
  url: []
})

const handleAddAlbum = () => {
  newAlbum.value.createTime = new Date().toLocaleString()
  newAlbum.value.id = albumStore.album.length + 1
  albumStore.addPic({ ...newAlbum.value })
  dialogVisible.value = false
  newAlbum.value = {
    id: null,
    classification: '',
    discription: '',
    createTime: new Date().toLocaleString(),
    url: []
  }
  fileList.value = []
}

const handlePictureCardPreview = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url
  VisiblePreview.value = true
}
const addPicture = async (uploadFile) => {
  console.log(uploadFile)
  const picBase64 = await fileToBase64(uploadFile.raw)
  newAlbum.value.url.push(picBase64)
}
const adjustDialogSize = (event) => {
  const img = event.target
  dialogWidth.value = img.naturalWidth + 'px'
  dialogHeight.value = img.naturalHeight + 'px'
}
</script>

<template>
  <div class="container">
    <div class="album-list">
      <div class="album-item" v-for="album in albums" :key="album.id">
        <img
          :src="album.url"
          @click="router.push(album.index)"
          :alt="album.name"
          class="album-cover"
        />
        <div class="album-name">{{ album.name }}</div>
      </div>
    </div>

    <el-button type="primary" @click="dialogVisible = !dialogVisible">
      <el-icon><Plus /></el-icon> 添加图片
    </el-button>

    <el-dialog class="addPicDialog" v-model="dialogVisible" title="添加新图片">
      <el-form ref="formRef" label-width="auto" :model="newAlbum">
        <el-form-item label="图片分类">
          <el-select
            v-model="newAlbum.classification"
            placeholder="请选择图片的分类"
            style="width: 100%"
          >
            <el-option
              v-for="item in optionsPic"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="newAlbum.discription"
            placeholder="分享今天的趣事吧！"
          ></el-input>
        </el-form-item>
        <el-form-item label="上传图片">
          <el-upload
            class="upload-pic"
            v-model:file-list="fileList"
            :auto-upload="false"
            list-type="picture-card"
            :on-change="addPicture"
            :on-preview="handlePictureCardPreview"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAddAlbum">确定</el-button>
      </span>
      <el-dialog
        :width="dialogWidth"
        :height="dialogHeight"
        v-model="VisiblePreview"
        class="preview"
      >
        <img
          :src="dialogImageUrl"
          alt="Preview Image"
          @load="adjustDialogSize"
        />
      </el-dialog>
    </el-dialog>
  </div>
</template>

<style scoped>
.container {
  transform: translate(0, 50%);
  padding: 20px;
  max-width: 1050px;
  margin: auto;
}

.album-list {
  display: flex;
  justify-content: center;
  gap: 32px;
  padding: 16px;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.album-item {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  transition:
    transform 0.5s ease-in-out,
    box-shadow 0.5s ease-in-out;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.album-cover {
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: transform 0.3s ease-in-out;
  cursor: pointer;
  border-radius: 8px;
}

.album-name {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.6);
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
  color: white;
  text-align: center;
  padding: 8px;
  border-radius: 0 0 8px 8px;
  font-weight: bold;
  font-size: 1.2em;
}

.album-item:hover .album-cover {
  transform: scale(1.05);
}

.album-item:hover {
  transform: translateY(-10px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}
.album-item:hover .album-name {
  opacity: 1;
}
.el-button {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px auto;
  padding: 10px 20px;
  font-size: 1em;
  border-radius: 8px;
}

.upload-pic .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: border-color 0.3s ease-in-out;
}

.upload-pic .el-upload:hover {
  border-color: #409eff;
}

.dialog-footer {
  display: flex;
  flex-direction: row;
  width: 200px;
  max-width: 20vw;
  margin-left: 60px;
}

.preview img {
  max-width: 100%;
  max-height: 100%;
  display: block;
  margin: auto;
}
</style>
