import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useUtilStore = defineStore('utils', () => {
  // 中文校验
  function hasNoChinese(value: string): boolean {
    const reg = /[\u4E00-\u9FA5]/g;
    return value.search(reg) === -1;
  }
  return { hasNoChinese };
});
