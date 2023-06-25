<template>
  <div class="container">
    <el-form :model="searchForm">
      <el-form-item label="课程名：">
        <el-input v-model="searchForm.name" placeholder="请输入课程名" />
      </el-form-item>
      <el-form-item label="上课周：">
        <el-input v-model="searchForm.currWeek" placeholder="请输入周数" />
      </el-form-item>
      <el-form-item label="地点：">
        <el-input v-model="searchForm.place" placeholder="请输入上课地点" />
      </el-form-item>
      <el-form-item label="日期：">
        <el-select v-model="searchForm.dayOfWeek" placeholder="请选择日期">
          <el-option v-for="item in courseStore.weeks" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="学分：">
        <el-input v-model="searchForm.credit" placeholder="请输入学分" />
      </el-form-item>
      <el-form-item label="类型：">
        <el-radio-group v-model="searchForm.isEffective">
          <el-radio :label="true">有效</el-radio>
          <el-radio :label="false">全部</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="单双周：">
        <el-radio-group v-model="searchForm.oddWeek">
          <el-radio :label="0">无</el-radio>
          <el-radio :label="1">单</el-radio>
          <el-radio :label="2">双</el-radio>
          <el-radio :label="null">全部</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="subSearch">查询</el-button>
        <el-button @click="close">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { reactive } from 'vue';
import { useCourseStore } from "@/stores/counter";
import { ElMessage } from 'element-plus/lib/components/index.js';
import { useRouter } from 'vue-router';

const emit = defineEmits(["close"]);
const router = useRouter();
const courseStore = useCourseStore();

interface CourseSearchVo {
  name: string | null,
  place: string | null,
  currWeek: number | null,
  dayOfWeek: string | null,
  isEffective: boolean,
  credit: number | null,
  oddWeek: number | null,
}

const searchForm = reactive<CourseSearchVo>({
  name: null,
  place: null,
  currWeek: null,
  dayOfWeek: null,
  isEffective: true,
  credit: null,
  oddWeek: 0
});

function close() {
  emit("close");
}

function subSearch() {
  axios.post("/sched/sel", {
    name: searchForm.name,
    place: searchForm.place,
    currWeek: searchForm.currWeek,
    dayOfWeek: searchForm.dayOfWeek,
    isEffective: searchForm.isEffective,
    credit: searchForm.credit,
    oddWeek: searchForm.oddWeek,
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
    } else if (result.data.code === 20010) {
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
  }).finally(() => {
    close();
  });
}
</script>