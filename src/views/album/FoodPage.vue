<script setup>
import { useAlbumStore } from '@/stores'
import { ref } from 'vue'

const albumStore = useAlbumStore()
const images = ref([])

const myAlbum = albumStore.album
  .filter((item) => item.classification === '美食')
  .map((item) => JSON.parse(JSON.stringify(item)))

myAlbum.forEach((item) => {
  images.value.push(...item.url)
})

// 遮罩层相关状态
const showMask = ref(false)
const currentImage = ref('')
const scale = ref(1)

const openMask = (image) => {
  currentImage.value = image
  showMask.value = true
}

const closeMask = () => {
  showMask.value = false
  scale.value = 1
}

const zoomImage = (event) => {
  event.preventDefault()
  if (event.deltaY < 0) {
    scale.value += 0.1
    if (scale.value > 7) scale.value = 7
  } else {
    scale.value -= 0.1
    if (scale.value < 0.2) scale.value = 0.2
  }
}
console.log(myAlbum)
</script>

<template>
  <el-scrollbar v-if="myAlbum[0]">
    <div class="album-item" v-for="item in myAlbum" :key="item.id">
      <div class="everyDate">{{ item.createTime }}</div>
      <div class="gallery">
        <div
          class="gallery-item"
          v-for="(image, index) in item.url"
          :key="index"
        >
          <el-image
            :src="image"
            :alt="item.description"
            class="gallery-image"
            @click="openMask(image)"
          />
        </div>
      </div>
    </div>

    <!-- 遮罩层 -->
    <div v-if="showMask" class="mask" @click="closeMask">
      <img
        :src="currentImage"
        class="mask-img"
        :style="{ transform: `scale(${scale})` }"
        @wheel="zoomImage"
      />
    </div>
  </el-scrollbar>
  <el-empty v-else description="暂无图片" />
</template>

<style scoped>
.album-item {
  display: flex;
  flex-direction: column;
  margin-top: 50px;
}
.everyDate {
  width: 80%;
  margin: 0 auto;
  margin-bottom: 10px;
}
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  width: 80%;
  margin: 0 auto;
  gap: 16px;
  padding: 16px;
  background: linear-gradient(135deg, #f5f5f5 25%, #e9e9e9 100%);
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
.gallery-item {
  overflow: hidden;
  position: relative;
  transition:
    transform 0.3s ease-in-out,
    box-shadow 0.3s ease-in-out;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.gallery-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
  transition: transform 0.5s ease-in-out;
}
.gallery-item:hover .gallery-image {
  transform: scale(1.1);
}
.gallery-item:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  border: 3px solid #0ce148;
}

/* 遮罩层样式 */
.mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.mask-img {
  max-width: 90%;
  max-height: 90%;
  transition: transform 0.3s;
}
</style>
