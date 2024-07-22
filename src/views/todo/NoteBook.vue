<script setup>
import { ref } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { Plus, MoreFilled } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores'
import { useNoteStore } from '@/stores/modules/note'

const notes = ref([])
const userStore = useUserStore()
const noteStore = useNoteStore()
const currentNoteId = ref(0)
const currentNote = ref({})
const quillRef = ref()
const searchInp = ref('')
const titleInp = ref()

//富文本输入框工具栏
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], // toggled buttons
  ['blockquote', 'code-block'],
  ['link', 'image', 'video', 'formula'],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
  [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
  [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
  [{ direction: 'rtl' }], // text direction

  [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],

  ['clean'] // remove formatting button
]

//从noteStore中获取note列表
notes.value = noteStore
  .getNote()
  .filter((item) => item.userid === userStore.token)
//设置默认笔记
const defaultNote = {
  id: +(userStore.token + '0001'),
  userid: userStore.token,
  title: '无标题笔记',
  content: '',
  contentHTML: '',
  createTime: new Date().toLocaleString()
}
//添加笔记的方法
const addnote = () => {
  defaultNote.createTime = new Date().toLocaleString()
  if (notes.value[0]) {
    defaultNote.id = notes.value[notes.value.length - 1].id + 1
    notes.value.push({ ...defaultNote })
    noteStore.addNote({ ...defaultNote })
  } else {
    notes.value.push({ ...defaultNote })
    noteStore.addNote({ ...defaultNote })
  }
}
//保存笔记的方法
const savenote = () => {
  currentNote.value.createTime = new Date().toLocaleString()
  noteStore.saveNote({ ...currentNote.value })
}
//选择笔记
const selectNote = (selectNoteID) => {
  if (!isSaveDev()) {
    savenote()
  }
  currentNoteId.value = selectNoteID
  currentNote.value = notes.value.find((item) => item.id === selectNoteID)
  quillRef.value.setHTML(currentNote.value.contentHTML)
}
const isTitleEmpty = () => {
  if (currentNote.value.title === '') {
    currentNote.value.title = '无标题笔记'
  }
}
const isSaveDev = () => {
  return noteStore.isSaveNote({ ...currentNote.value })
}
const setContent = () => {
  currentNote.value.content = quillRef.value.getText()
  currentNote.value.contentHTML = quillRef.value.getHTML()
  if (currentNote.value.id) {
    console.log(isSaveDev())
  }
}
//搜索功能
const searchNote = () => {
  if (searchInp.value !== '') {
    notes.value = noteStore
      .getNote()
      .filter(
        (item) =>
          item.title.includes(searchInp.value) &&
          item.userid === userStore.token
      )
  } else {
    notes.value = noteStore
      .getNote()
      .filter((item) => item.userid === userStore.token)
  }
}
const setTop = (noteId) => {
  noteStore.topNote(noteId)
  notes.value = noteStore
    .getNote()
    .filter((item) => item.userid === userStore.token)
}
const delNote = (noteId) => {
  noteStore.delNote(noteId)
  notes.value = noteStore
    .getNote()
    .filter((item) => item.userid === userStore.token)
}
</script>

<template>
  <div style="width: 100%; height: 100%">
    <div class="common-layout">
      <el-container>
        <el-aside width="250px" class="notePageAside">
          <div class="searchBox">
            <div>
              <el-input
                @input="searchNote"
                v-model="searchInp"
                placeholder="请输入搜索笔记的标题"
              ></el-input>
            </div>
            <el-button>搜索</el-button>
          </div>
          <div class="noteList">
            <div
              class="note-item"
              :class="{ 'note-item-active': item.id === currentNoteId }"
              @click="selectNote(item.id)"
              v-for="item in notes"
              :key="item.id"
            >
              <div class="note-item-title">
                {{ item.title }}

                <el-dropdown trigger="click">
                  <span
                    ><el-icon><MoreFilled /></el-icon
                  ></span>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item @click="setTop(item.id)"
                        >置顶</el-dropdown-item
                      >
                      <el-dropdown-item @click="titleInp.select()"
                        >重命名</el-dropdown-item
                      >
                      <el-dropdown-item @click="delNote(item.id)"
                        >删除</el-dropdown-item
                      >
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
              <div class="note-item-content">
                {{ item.content }}
              </div>
              <div class="note-item-date">{{ item.createTime }}</div>
            </div>
            <div
              style="width: 100%; text-align: center"
              v-show="searchInp === ''"
            >
              <el-button @click="addnote" circle>
                <el-icon size="large"><Plus /></el-icon>
              </el-button>
            </div>
            <div
              style="width: 100%; text-align: center"
              v-if="!notes[0] && searchInp !== ''"
            >
              搜索结果为空
            </div>
          </div>
        </el-aside>
        <el-container>
          <el-header class="notePageHeader">
            <div>
              <el-input
                ref="titleInp"
                @blur="isTitleEmpty"
                v-model="currentNote.title"
                :placeholder="currentNote.title"
              ></el-input>
            </div>
            <div v-if="currentNote.id">
              <span
                v-if="!isSaveDev()"
                style="margin-right: 10px; font-size: 14px; color: red"
                >未保存</span
              ><el-button @click="savenote" type="primary">{{
                isSaveDev() ? '已保存' : '保存'
              }}</el-button>
            </div>
          </el-header>
          <el-main class="notePageMain">
            <QuillEditor
              v-if="currentNote.id"
              :toolbar="toolbarOptions"
              ref="quillRef"
              theme="snow"
              @textChange="setContent"
            />
            <el-empty v-else description=" " />
          </el-main>
        </el-container>
      </el-container>
    </div>
  </div>
</template>

<style scoped>
.common-layout {
  display: flex;
  box-shadow: 1px 5px 15px rgba(103, 103, 103, 0.31);
  width: 100%;
  height: 100%;
  background-color: #fff;
}
.notePageAside,
.notePageHeader {
  padding: 10px;
}
.notePageAside {
  border-right: 1px solid rgb(209, 213, 219);
}

.searchBox {
  display: flex;
  height: 40px;
  margin-bottom: 10px;
}
.notePageMain {
  display: flex;
  flex-direction: column;
  padding: 0;
}
.note-item {
  display: flex;
  flex-direction: column;
  max-height: 150px;
  padding: 5px;
  margin-bottom: 5px;
  border-bottom: 1px solid rgb(209, 213, 219);
  border-radius: 10px;
}
.note-item:hover {
  background-color: rgb(244, 246, 247);
}
.note-item-active {
  background-color: rgb(244, 246, 247);
}

.note-item-title {
  display: flex;
  justify-content: space-between;
  font-size: 15px;
}
.note-item-title span {
  width: 20px;
  height: 20px;
  border-radius: 5px;
  line-height: 20px;
  text-align: center;
}
.note-item-title span:hover {
  background-color: rgb(225, 230, 237);
}
.note-item-content {
  max-height: 90px;
  white-space: nowrap; /* 不换行 */
  overflow: hidden; /* 超出隐藏 */
  text-overflow: ellipsis; /* 超出部分用省略号表示 */
  word-wrap: break-word;
  line-height: 30px;
  font-size: 12px;
  color: rgb(122, 133, 153);
}
.note-item-date {
  font-size: 12px;
  font-style: italic;
  color: rgb(175, 183, 198);
}
.notePageHeader {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid rgb(240, 243, 245);
  padding: 10px 24px;
}
</style>
