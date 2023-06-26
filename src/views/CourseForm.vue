<template>
  <div class="container">
    <el-form ref="courseFormRef" :model="courseStore.courseForm" :rules="courseRule">
      <el-form-item label="课程名：" prop="name">
        <el-input v-model="courseStore.courseForm.name" placeholder="请输入课程名" />
      </el-form-item>
      <el-form-item label="日期：" prop="dayOfWeek">
        <el-select class="dayOfWeek" v-model="courseStore.courseForm.dayOfWeek" placeholder="请选择日期">
          <el-option v-for="item in courseStore.weeks" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="地点：" prop="place">
        <el-input v-model="courseStore.courseForm.place" placeholder="请输入上课地点" />
      </el-form-item>
      <el-form-item label="讲师：" prop="teacher">
        <el-input v-model="courseStore.courseForm.teacher" placeholder="请输入授课教师" />
      </el-form-item>
      <el-form-item label="时间：" prop="startTime">
        <div class="time">
          <el-time-select v-model="courseStore.courseForm.startTime" :max-time="courseStore.courseForm.endTime"
            placeholder="Start time" start="06:00" step="00:05" end="23:00" />
          <span class="time-span">-</span>
          <el-time-select v-model="courseStore.courseForm.endTime" :min-time="courseStore.courseForm.startTime"
            placeholder="End time" start="06:00" step="00:05" end="23:00" />
        </div>
      </el-form-item>
      <el-form-item label="上课周：" prop="startWeek">
        <div class="week">
          <el-input class="weekInput" v-model="courseStore.courseForm.startWeek" label="startWeek"
            placeholder="请输入开始周数" />
          <span class="week-span">-</span>
          <el-input class="weekInput" v-model="courseStore.courseForm.endWeek" label="endWeek" placeholder="请输入结束周数" />
        </div>
      </el-form-item>
      <el-form-item label="学分：" prop="credit">
        <el-input v-model="courseStore.courseForm.credit" placeholder="请输入学分" />
      </el-form-item>
      <el-form-item label="单双周：" prop="oddWeek">
        <el-radio-group v-model="courseStore.courseForm.oddWeek">
          <el-radio :label="0">无</el-radio>
          <el-radio :label="1">单</el-radio>
          <el-radio :label="2">双</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <div class="btn">
          <el-button type="primary" @click="submitForm(courseFormRef)">{{ btnName }}</el-button>
          <el-button @click="close">取消</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { useCourseStore, useUtilStore } from '@/stores/counter';
import type { FormInstance, FormRules } from 'element-plus/lib/components/index.js';
import { ElMessage } from 'element-plus/lib/components/index.js';
import { ref, reactive } from 'vue';

const emit = defineEmits(["close", "submit"]);
defineProps(["btnName"]);
const courseStore = useCourseStore();
const utilStore = useUtilStore();

const courseFormRef = ref<FormInstance>();

const courseRule = reactive<FormRules>({
  name: [
    { required: true, message: '请输入课程名', trigger: 'blur' },
    { min: 1, max: 20, message: '长度应在1-20之间', trigger: 'blur' },
  ],
  dayOfWeek: [
    { required: true, message: '请选择日期', trigger: 'blur' },
  ],
  place: [
    { required: true, message: '请输入上课地点', trigger: 'blur' },
    { min: 1, max: 20, message: '长度应在1-20之间', trigger: 'blur' },
  ],
  teacher: [
    { required: true, message: '请输入授课教师', trigger: 'blur' },
    { min: 1, max: 20, message: '长度应在1-20之间', trigger: 'blur' },
  ],
  startTime: [
    { required: true, validator: checkTime, trigger: 'change' },
  ],
  startWeek: [
    { required: true, validator: checkWeek, trigger: 'blur' },
  ],
  credit: [
    { required: true, message: '请输入学分', trigger: 'blur' },
    { validator: checkOnlyNumber, trigger: 'blur' }
  ],
  oddWeek: [
    { required: true, message: '请选择单双周', trigger: 'blur' },
  ],
});

function checkOnlyNumber(rule: any, value: any, callback: any) {
  if (utilStore.onlyNumber(value)) {
    callback();
  }
  callback("请不要其他字符，仅输入数字");
}

function checkTime(rule: any, value: any, callback: any) {
  const startTime = courseStore.courseForm.startTime;
  const endTime = courseStore.courseForm.endTime;
  if (startTime !== "" && endTime !== "") {
    callback();
  }
  if (startTime === "" && endTime === "") {
    callback("请选择开始、结束时间");
  }
  if (startTime === "") {
    callback("请选择开始时间");
  }
  callback("请选择结束时间");
}

function checkWeek(rule: any, value: any, callback: any) {
  let startWeek: string | number = courseStore.courseForm.startWeek as unknown as string;
  let endWeek: string | number = courseStore.courseForm.endWeek as unknown as string;
  if (startWeek === "" && endWeek === "") {
    callback("请输入开始、结束周");
  }
  if (startWeek === "") {
    callback("请输入开始周");
  }
  if (endWeek === "") {
    callback("请输入结束周");
  }
  checkOnlyNumber(rule, value, callback);
  startWeek = startWeek as unknown as number;
  endWeek = endWeek as unknown as number;
  if (startWeek - endWeek > 0) {
    callback("开始周小于等于结束周");
  }
  callback();
}

function close() {
  emit("close");
}

async function submitForm(formEl: FormInstance | undefined) {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      submit();
    } else {
      ElMessage({
        message: '请检查输入信息',
        type: 'error',
      });
    }
  });
};

function submit() {
  emit("submit");
}
</script>

<style scoped>
.container {
  display: flex;
}

:deep(.el-form-item__label) {
  width: 80px;
}

.dayOfWeek {
  width: 100%;
}

.time {
  display: flex;
}

.time .time-span {
  margin: 0 20px;
}

.time :deep(.el-input__wrapper) {
  box-sizing: border-box;
  width: 100%;
}

.week {
  display: flex;
  /* justify-content: space-between; */
  width: 100%;
}

.week .weekInput {
  display: inline-block;
  width: 100%;
}

.week .weekInput :deep(.el-input__wrapper) {
  box-sizing: border-box;
  width: 100%;
}

.week .week-span {
  margin: 0 20px;
}

.btn {
  margin: 15px auto;
  margin-bottom: 0;
}

.btn .el-button {
  margin: 0 15px;
}
</style>