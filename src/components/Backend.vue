<template>
  <div class="box">
    <div class="header">

    </div>
    <div class="container">
      <div class="aside">
        <el-menu default-active="1-1">
          <el-sub-menu index="1">
            <template #title>
              <el-icon class="aside-icon">
                <Calendar />
              </el-icon>
              <span>课程表</span>
            </template>
            <el-menu-item index="1-1" @click="getEffCourses">
              <div class="aside-small-icon">
                <font-awesome-icon icon="fa-solid fa-calendar-check" />
              </div>
              <span class="aside-small-title">有效日程</span>
            </el-menu-item>
            <el-menu-item index="1-2" @click="getAllCourses">
              <div class="aside-small-icon">
                <font-awesome-icon icon="fa-solid fa-calendar" />
              </div>
              <span class="aside-small-title">全部日程</span>
            </el-menu-item>
          </el-sub-menu>
          <el-menu-item @click="dialogSearchVisible = true">
            <el-icon class="aside-icon">
              <Operation />
            </el-icon>
            <span>筛选</span>
          </el-menu-item>
          <el-sub-menu>
            <template #title>
              <el-icon class="aside-icon">
                <Setting />
              </el-icon>
              <span>操作</span>
            </template>
            <el-menu-item>
              <div class="aside-small-icon">
                <font-awesome-icon icon="fa-solid fa-file-circle-plus" />
              </div>
              <span class="aside-small-title">添加课程</span>
            </el-menu-item>
            <el-menu-item>
              <div class="aside-small-icon">
                <font-awesome-icon icon="fa-solid fa-trash" />
              </div>
              <span class="aside-small-title">清空课程</span>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </div>
      <div class="main">
        <RouterView />
      </div>
    </div>
  </div>
  <el-dialog v-model="dialogSearchVisible" title="筛选" width="600px">
    <Search @close="dialogSearchVisible = false"></Search>
  </el-dialog>
</template>
<script setup lang="ts">
import axios from 'axios';
import { ElMessage } from 'element-plus/lib/components/index.js';
import { useCourseStore } from '@/stores/counter';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import Search from '@/views/Search.vue';

const router = useRouter();
const courseStore = useCourseStore();
const dialogSearchVisible = ref(false);

function getEffCourses() {
  getCourses(true);
}

function getAllCourses() {
  getCourses(false);
}

function getCourses(isEff: boolean) {
  axios.post(`/sched/sel`, {
    isEffective: isEff
  }, {
    headers: {
      "Authorization": `Bearer ${sessionStorage.getItem("authToken")}`
    }
  }).then(result => {
    if (result.data.code === 10000) {
      ElMessage({
        message: '登录过期，请重新登陆',
        type: 'warning',
      });
      router.push({ name: "login" });
    } else if (result.data.code === 20011) {
      courseStore.courseData = result.data.data;
    } else if (result.data.code === 20020) {
      ElMessage({
        message: '获取课程信息失败',
        type: 'error',
      });
    }
  }).catch(error => {
    ElMessage({
      message: '系统错误',
      type: 'error',
    });
  });
}
</script>
<style scoped>
.box {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}

.header {
  box-sizing: border-box;
  width: 100%;
  height: 65px;
  border: 1px solid #000;
}

.container {
  display: flex;
  height: 100%;
}

.aside {
  width: 275px;
  border-right: 1px solid #dcdfe6;
}

.aside .el-menu {
  border: 0;
}

.aside .aside-small-icon {
  display: flex;
  padding-left: 25px;
  width: 25px;
}

.aside .aside-icon {
  padding-left: 20px;
}

.main {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  overflow: auto;
}
</style>