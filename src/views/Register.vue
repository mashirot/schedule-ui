<template>
  <div class="title">注册</div>
  <div class="input">
    <el-form :model="regForm" :rules="regRules" label-width="0">
      <el-form-item prop="username">
        <el-input v-model="regForm.username" type="text" placeholder="用户名">
          <template #prepend><font-awesome-icon icon="fa-user" /></template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="regForm.password" type="password" placeholder="密码">
          <template #prepend><font-awesome-icon icon="fa-lock" /></template>
        </el-input>
      </el-form-item>
      <el-form-item prop="confirmPassword">
        <el-input v-model="regForm.confirmPassword" type="password" placeholder="确认密码">
          <template #prepend><font-awesome-icon icon="fa-lock" /></template>
        </el-input>
      </el-form-item>
      <el-form-item prop="date">
        <el-date-picker class="date-picker" v-model="regForm.date" type="daterange" range-separator="-"
          start-placeholder="学期开始日期" end-placeholder="学期结束日期" />
      </el-form-item>
      <div class="verify">
        <el-form-item prop="verifyCode">
          <el-input v-model="regForm.verifyCode" placeholder="验证码">
            <template #prepend><font-awesome-icon icon="fa-shield-halved" /></template>
          </el-input>
        </el-form-item>
        <div class="verifyCode">Code</div>
      </div>
    </el-form>
  </div>
  <div class="button">
    <el-button @click="subRegister" type="primary">注册</el-button>
    <el-button @click="$router.push(`/login`)">登录</el-button>
  </div>
</template>
<script setup lang="ts">
import axios from 'axios';
import { ElMessage } from 'element-plus/lib/components/index.js';
import type { FormRules } from 'element-plus/lib/components/index.js';
import { reactive, ref, toRefs, watch } from 'vue';

interface RegForm {
  username: string | null,
  password: string | null,
  confirmPassword: string | null,
  date: Array<Date> | null,
  verifyCode: string | null;
}

const regForm = reactive<RegForm>({
  username: "",
  password: "",
  confirmPassword: "",
  date: null,
  verifyCode: ""
});

const { username, password, confirmPassword, date } = toRefs(regForm);

let verifyCode = ref();

// 表单校验
const regRules = reactive<FormRules>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 6, max: 20, message: '用户名长度在6-20之间', trigger: 'blur' },
    { validator: checkChinese, trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 30, message: '密码长度在6-30之间', trigger: 'blur' },
    { validator: checkChinese, trigger: 'blur' }
  ],
  confirmPassword: [
    { validator: checkPassword, trigger: 'blur' },
    { validator: checkChinese, trigger: 'blur' }
  ],
  date: [
    { required: true, message: '请选择日期', trigger: 'blur' },
  ],
  verifyCode: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { min: 4, max: 4, message: '验证码长度为4', trigger: 'blur' },
    { validator: checkChinese, trigger: 'blur' }
  ]
});

function checkChinese(rule: any, value: any, callback: any) {
  if (hasNoChinese(value)) {
    callback(new Error("请输入英文及数字"));
  }
  callback();
}

function checkPassword(rule: any, value: any, callback: any) {
  if (value === password.value) {
    if (value.length >= 6 && value.length <= 30) {
      callback();
    }
    callback(new Error("密码长度在6-30之间"));
  }
  callback(new Error("请确认密码一致"));
}

function hasNoChinese(value: string): boolean {
  const reg = /[\u4E00-\u9FA5]/g;
  return value.search(reg) !== -1;
}

function isAllInfoValid(): boolean {
  let flag = true;
  flag &&= username.value!.length >= 6;
  flag &&= hasNoChinese(username.value as string);
  flag &&= password.value!.length >= 6 && password.value!.length <= 30;
  flag &&= hasNoChinese(password.value as string);
  flag &&= confirmPassword.value === password.value;
  flag &&= hasNoChinese(confirmPassword.value as string);
  flag &&= date.value != null;
  flag &&= verifyCode.value!.length === 4;
  flag &&= hasNoChinese(verifyCode.value as string);
  return flag;
}

// 提交
function subRegister() {
  if (!isAllInfoValid()) {
    ElMessage({
      message: '请检查输入信息',
      type: 'error',
    });
    return;
  }
  const dateArr = date!.value as Array<Date>;
  const termStartDate = dateArr[0];
  const termEndDate = dateArr[1];

  axios.post("/user/register", {
    username,
    password,
    termStartDate,
    termEndDate,
    verifyCode
  }).then(result => {

  }).catch(error => {

  });
}

</script>
<style scoped>
.input {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  padding: 0 70px;
}

.input .el-input {
  height: 45px;
}

/* vue深度选择器 */
.input :deep(.date-picker) {
  width: 360px;
  height: 45px;
  box-sizing: border-box;
}

.input :deep(.el-form-item__error) {
  color: #dddddd;
}

.verify {
  display: flex;
  justify-content: space-between;
}

.verify .el-input {
  width: 200px;
  height: 45px;
}

.verify .verifyCode {
  width: 100px;
  /* height: 45px; */
  border: 1px solid #000;
}

.button {
  margin-top: 25px;
}

.button .el-button {
  margin: 0 20px;
  width: 70px;
  height: 40px;
}
</style>