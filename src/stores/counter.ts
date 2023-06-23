import { ref, computed, reactive } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';
import { ElMessage } from 'element-plus/lib/components/index.js';

export const useUtilStore = defineStore('utils', () => {
  // 中文校验
  function hasNoChinese(value: string): boolean {
    const reg = /[\u4E00-\u9FA5]/g;
    return value.search(reg) === -1;
  }
  return { hasNoChinese };
});


export const useCourseStore = defineStore('course', () => {
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

  let courseData = reactive<Array<CourseVo>>([]);

  return { courseData };
});