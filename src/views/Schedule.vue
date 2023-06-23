<template>
  <el-table :data="courseStore.courseData" border align="center">
    <el-table-column prop="dayOfWeek" label="日期" align="center" min-width="100" />
    <el-table-column prop="time" label="时间" align="center" min-width="100" />
    <el-table-column prop="name" label="课程名" align="center" min-width="250" />
    <el-table-column prop="place" label="上课地点" align="center" min-width="100" />
    <el-table-column prop="teacher" label="讲师" align="center" />
    <el-table-column prop="week" label="上课周" align="center" />
    <el-table-column prop="oddWeek" label="单双周" align="center" />
    <el-table-column prop="credit" label="学分" align="center" />
    <el-table-column label="操作" align="center" min-width="125">
      <template #default="scope">
        <el-button size="small" @click="modifyCourse(scope.$index, scope.row)">修改</el-button>
        <el-button size="small" type="danger" @click="delCourse(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ElMessage } from 'element-plus/lib/components/index.js';
import { useCourseStore } from '@/stores/counter';
import { useRouter } from 'vue-router';

const router = useRouter();
const courseStore = useCourseStore();

interface CourseVo {
  courseId: number,
  dayOfWeek: string,
  time: string,
  name: string,
  place: string,
  teacher: string,
  week: string,
  oddWeek: string,
  credit: string,
}

function modifyCourse(index: number, row: CourseVo) {

}

function delCourse(index: number, row: CourseVo) {

}

function getCourses(uri: string) {
  axios.get(`/sched/${uri}`, {
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

function getEffCourses() {
  getCourses("eff");
}
getEffCourses();
</script>
<style scoped>
.el-table {
  height: 100%;
}
</style>