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
        <el-button size="small" @click="modifyCourse(scope.row)">修改</el-button>
        <el-button size="small" type="danger" @click="delCourse(scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-dialog v-model="dialogModifyVisible" title="修改" width="600px">
    <CourseForm class="modify" btnName="修改" @close="dialogModifyVisible = false" @submit="subModify"></CourseForm>
  </el-dialog>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ElMessage } from 'element-plus/lib/components/index.js';
import { useCourseStore } from '@/stores/counter';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import CourseForm from './CourseForm.vue';

const router = useRouter();
const courseStore = useCourseStore();
let dialogModifyVisible = ref(false);

interface Course {
  courseId: number,
  dayOfWeek: string,
  startTime: string,
  endTime: string,
  name: string,
  place: string,
  teacher: string,
  startWeek: number,
  endWeek: number,
  oddWeek: number,
  credit: number,
}

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

function modifyCourse(row: CourseVo) {
  courseStore.courseForm = {
    courseId: row.courseId,
    dayOfWeek: row.dayOfWeek,
    startTime: row.time.split(" - ")[0],
    endTime: row.time.split(" - ")[1],
    name: row.name,
    place: row.place,
    teacher: row.teacher,
    startWeek: row.week.split(" - ")[0] as unknown as number,
    endWeek: row.week.split(" - ")[1] as unknown as number,
    oddWeek: row.oddWeek === "-" ? 0 : row.oddWeek === "单" ? 1 : 2,
    credit: row.credit as unknown as number,
  };
  dialogModifyVisible.value = true;
}

function subModify() {
  const course: Course = {
    courseId: courseStore.courseForm.courseId,
    dayOfWeek: courseStore.courseForm.dayOfWeek,
    startTime: courseStore.courseForm.startTime,
    endTime: courseStore.courseForm.endTime,
    name: courseStore.courseForm.name,
    place: courseStore.courseForm.place,
    teacher: courseStore.courseForm.teacher,
    startWeek: parseInt(courseStore.courseForm.startWeek as unknown as string, 10),
    endWeek: parseInt(courseStore.courseForm.endWeek as unknown as string, 10),
    oddWeek: parseInt(courseStore.courseForm.oddWeek as unknown as string, 10),
    credit: parseFloat(courseStore.courseForm.credit as unknown as string)
  };
  axios.post(`/sched/update`, course, {
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
    } else if (result.data.code === 20071) {
      ElMessage({
        message: '修改成功',
        type: 'success',
      });
      dialogModifyVisible.value = false;
      courseStore.resetForm();
      getEffCourses();
    } else if (result.data.code === 20070) {
      ElMessage({
        message: '修改失败',
        type: 'error',
      });
      dialogModifyVisible.value = false;
      courseStore.resetForm();
    }
  }).catch(error => {
    ElMessage({
      message: '系统错误',
      type: 'error',
    });
  });
}

function delCourse(row: CourseVo) {
  axios.post(`/sched/del`, {
    courseId: row.courseId
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
    } else if (result.data.code === 20061) {
      ElMessage({
        message: '删除成功',
        type: 'success',
      });
      getEffCourses();
    } else if (result.data.code === 20060) {
      ElMessage({
        message: '删除失败',
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

function getCourses(isEff: boolean) {
  axios.post(`/sched/sel`, {
    isEffective: isEff,
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

function getEffCourses() {
  getCourses(true);
}
getEffCourses();
</script>

<style scoped>
.el-table {
  height: 100%;
}

.modify {
  display: flex;
  justify-content: center;
  padding: 0 50px;
}
</style>