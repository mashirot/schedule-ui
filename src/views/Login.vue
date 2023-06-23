<template>
  <div class="title">登录</div>
  <div class="input">
    <el-form :model="loginForm" :rules="loginRules" label-width="0">
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" placeholder="用户名">
          <template #prepend><font-awesome-icon icon="fa-user" /></template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="loginForm.password" type="password" placeholder="密码">
          <template #prepend><font-awesome-icon icon="fa-lock" /></template>
        </el-input>
      </el-form-item>
    </el-form>
  </div>
  <div class="button">
    <el-button @click="subLogin" type="primary">登录</el-button>
    <el-button @click="$router.push(`/register`)">注册</el-button>
  </div>
</template>
<script setup lang="ts">
import axios from 'axios';
import { reactive, toRefs } from 'vue';
import { useUtilStore } from '@/stores/counter';
import { ElMessage } from 'element-plus/lib/components/index.js';
import type {  FormRules } from 'element-plus/lib/components/index.js';
import { useRouter } from 'vue-router';

const utils = useUtilStore();
const router = useRouter();

interface UserLoginVo {
  username: string | null,
  password: string | null,
  authToken: string | null;
}

const loginForm = reactive({
  username: "",
  password: ""
});

const { username, password } = toRefs(loginForm);

const loginRules = reactive<FormRules>({
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
});

function checkChinese(rule: any, value: any, callback: any) {
  if (!utils.hasNoChinese(value)) {
    callback(new Error("请输入英文及数字"));
  }
  callback();
}

function isAllInfoValid(): boolean {
  let flag = true;
  flag &&= username.value!.length >= 6;
  flag &&= utils.hasNoChinese(username.value as string);
  flag &&= password.value!.length >= 6 && password.value!.length <= 30;
  flag &&= utils.hasNoChinese(password.value as string);
  return flag;
}

function subLogin() {
  if (!isAllInfoValid()) {
    ElMessage({
      message: '请检查输入信息',
      type: 'error',
    });
    return;
  }
  axios.post("/user/login", {
    username: loginForm.username,
    password: loginForm.password
  }).then(result => {
    if (result.data.code === 10011) {
      const user: UserLoginVo = result.data.data;
      sessionStorage.setItem("authToken", user.authToken as string);
      ElMessage({
        message: '登陆成功，即将跳转',
        type: 'success',
      });
      setTimeout(() => {
        router.push({ name: "backend" });
      }, 1500);
    } else if (result.data.code === 10010) {
      ElMessage({
        message: '登陆失败，请检查用户名密码',
        type: 'warning',
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
.input {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  padding: 0 70px;
}

.input .el-input {
  margin: 10px 0;
  height: 45px;
}

.input :deep(.el-form-item__error) {
  color: #dddddd;
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