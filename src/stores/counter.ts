import { reactive } from 'vue';
import { defineStore } from 'pinia';

export const useUtilStore = defineStore('utils', () => {
  // 中文校验
  function hasNoChinese(value: string): boolean {
    const reg = /[\u4E00-\u9FA5]/g;
    return value.search(reg) === -1;
  }

  function onlyNumber(value: string): boolean {
    const reg = /^\d+$/;
    return reg.test(value);
  }

  return { hasNoChinese, onlyNumber };
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

  const weeks = [
    {
      value: "Monday",
      label: "周一"
    },
    {
      value: "Tuesday",
      label: "周二"
    },
    {
      value: "Wednesday",
      label: "周三"
    },
    {
      value: "Thursday",
      label: "周四"
    },
    {
      value: "Friday",
      label: "周五"
    },
    {
      value: "Saturday",
      label: "周六"
    },
    {
      value: "Sunday",
      label: "周日"
    }
  ];

  let courseData = reactive<Array<CourseVo>>([]);

  let courseForm = reactive<Course>({
    courseId: 0,
    dayOfWeek: '',
    startTime: '',
    endTime: '',
    name: '',
    place: '',
    teacher: '',
    startWeek: 0,
    endWeek: 0,
    oddWeek: 0,
    credit: 0
  });

  return { courseData, weeks, courseForm };
});