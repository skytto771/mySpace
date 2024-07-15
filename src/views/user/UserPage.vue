<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores'
import cloneDeep from 'lodash/cloneDeep'
import { Plus, Minus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { fileToBase64 } from '@/utils/fileToImg'

const userStore = useUserStore()
const showEditDialog = ref(false)
const showUploadDialog = ref(false)
const formRef = ref()
const user = ref({
  id: 1,
  username: 'johndoe',
  password: 'password123',
  email: 'johndoe@example.com',
  userAvator: 'https://example.com/avatar.jpg',
  nickName: 'John Doe',
  skill: ['JavaScript', 'Vue.js', 'Element Plus'],
  chara: ['Friendly', 'Hardworking'],
  description: 'A passionate developer',
  address: '123 Main Street',
  phone: '123-456-7890'
})
const editUser = ref({})

const readyEdit = () => {
  editUser.value = cloneDeep(user.value)
  showEditDialog.value = true
}
//获取用户
user.value = userStore.getUser()
//技能和特征的添加和删除方法
const addSkill = () => {
  editUser.value.skill.push('')
}
const removeSkill = (index) => {
  editUser.value.skill.splice(index, 1)
}
const addChara = () => {
  editUser.value.chara.push('')
}
const removeChara = (index) => {
  editUser.value.chara.splice(index, 1)
}
//保存编辑
const saveEdit = () => {
  userStore.updataUserInfo(cloneDeep(editUser.value))
  user.value = userStore.getUser()
  showEditDialog.value = false
  formRef.value.resetFields()
}

// 上传头像
const handleAvatar = async (uploadFile) => {
  const base64img = await fileToBase64(uploadFile.raw)
  userStore.setAvator(base64img)
  showUploadDialog.value = false
  user.value = userStore.getUser()
}

const beforeAvatarUpload = (file) => {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG) {
    ElMessage.error('上传头像图片只能是 JPG 或 PNG 格式!')
  }
  if (!isLt2M) {
    ElMessage.error('上传头像图片大小不能超过 2MB!')
  }
  return isJPG && isLt2M
}

const avatarHover = ref(false)
</script>

<template>
  <div class="profile-container">
    <el-card class="profile-card">
      <div class="profile-header">
        <el-avatar
          :src="user.userAvator"
          size="large"
          @click="showUploadDialog = true"
          :style="{ border: avatarHover ? '2px solid blue' : 'none' }"
          @mouseenter="avatarHover = true"
          @mouseleave="avatarHover = false"
        ></el-avatar>
        <div class="profile-info">
          <h3>{{ user.nickName || user.username }}</h3>
          <p>{{ user.description || '用户未留下签名' }}</p>
        </div>
      </div>
      <el-divider></el-divider>
      <div class="profile-details">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户名">
              {{ user.username }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱">
              {{ user.email }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="地址">
              {{ user.address }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电话">
              {{ user.phone }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="技能">
              <el-tag
                v-for="(skill, index) in user.skill"
                :key="index"
                class="skill-tag"
                >{{ skill }}
              </el-tag>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="特征">
              <el-tag
                v-for="(chara, index) in user.chara"
                :key="index"
                class="chara-tag"
                >{{ chara }}
              </el-tag>
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="8">
            <el-button style="width: 100%" type="primary" @click="readyEdit"
              >编辑信息</el-button
            >
          </el-col>
        </el-row>
      </div>
    </el-card>

    <!-- 编辑信息的对话框 -->
    <el-dialog style="width: 500px" title="编辑信息" v-model="showEditDialog">
      <el-form ref="formRef" label-width="auto" :model="editUser">
        <el-form-item label="昵称">
          <el-input v-model="editUser.nickName"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="editUser.email"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="editUser.address"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="editUser.phone"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            resize="none"
            type="textarea"
            v-model="editUser.description"
          ></el-input>
        </el-form-item>
        <el-form-item label="技能">
          <div style="display: flex; flex-direction: column">
            <el-row
              class="editSk-Ca-row"
              v-for="(item, index) in editUser.skill"
              :key="index"
            >
              <el-col :span="18">
                <el-input
                  v-model="editUser.skill[index]"
                  placeholader="index"
                ></el-input>
              </el-col>
              <el-col :span="2"></el-col>
              <el-col :span="4">
                <el-button type="danger" @click="removeSkill(index)">
                  <el-icon><Minus /></el-icon>
                </el-button>
              </el-col>
            </el-row>
            <el-button type="primary" @click="addSkill">
              <el-icon><Plus /></el-icon>
            </el-button>
          </div>
        </el-form-item>
        <el-form-item label="特征">
          <div class="editSk-Ca">
            <el-row
              class="editSk-Ca-row"
              v-for="(item, index) in editUser.chara"
              :key="index"
            >
              <el-col :span="18">
                <el-input v-model="editUser.chara[index]"></el-input>
              </el-col>
              <el-col :span="2"></el-col>
              <el-col :span="4">
                <el-button type="danger" @click="removeChara(index)">
                  <el-icon><Minus /></el-icon>
                </el-button>
              </el-col>
            </el-row>
            <el-button type="primary" @click="addChara">
              <el-icon><Plus /></el-icon>
            </el-button>
          </div>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button @click="showEditDialog = false">取消</el-button>
          <el-button type="primary" @click="saveEdit">保存</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 上传图像的对话框 -->
    <el-dialog
      title="修改头像"
      style="display: flex; flex-direction: column; width: 350px"
      v-model="showUploadDialog"
      center
    >
      <el-upload
        class="avatar-uploader"
        :auto-upload="false"
        :show-file-list="false"
        :on-change="handleAvatar"
        :before-upload="beforeAvatarUpload"
      >
        <div class="avatar-wrapper">
          <img :src="user.userAvator" class="avatar-img" />
          <i class="overlay-icon">
            <el-icon size="150"><Plus /></el-icon>
          </i>
        </div>
      </el-upload>
    </el-dialog>
  </div>
</template>

<style scoped>
.profile-container {
  display: flex;
  justify-content: center;
  margin-top: 50px;
}

.profile-card {
  width: 600px;
  padding: 20px;
}

.profile-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.profile-info {
  margin-left: 20px;
}

.skill-tag,
.chara-tag {
  margin: 5px;
}

.editSk-Ca {
  display: flex;
  flex-direction: column;
}

.editSk-Ca-row {
  margin-bottom: 5px;
}

.avatar-uploader {
  display: flex;
  width: 100%;
  height: 100%;
  border: 1px dashed #d9d9d9;
  border-radius: 50%;
  cursor: pointer;
  overflow: hidden;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
}

.avatar-uploader img {
  width: 100%;
  height: 100%;
}
.avatar-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.overlay-icon {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* 半透明背景 */
  display: flex;
  align-items: center;
  justify-content: center;
  color: white; /* 图标颜色 */
  opacity: 0;
  transition: opacity 0.3s;
}

.avatar-wrapper:hover .overlay-icon {
  opacity: 1;
}
</style>
