<template>
  <div class="title">登录</div>
  <div class="input">
    <el-input v-model="username" placeholder="用户名">
      <template #prepend><font-awesome-icon icon="fa-user" /></template>
    </el-input>
    <el-input v-model="password" type="password" placeholder="密码">
      <template #prepend><font-awesome-icon icon="fa-lock" /></template>
    </el-input>
  </div>
  <div class="button">
    <el-button @click="subLogin" type="primary">登录</el-button>
    <el-button @click="$router.push(`/register`)">注册</el-button>
  </div>
</template>
<script setup lang="ts">
import axios from 'axios';
import { ref } from 'vue';

let username = ref();
let password = ref();

function subLogin() {
  axios.post("/user/login", {
    username,
    password
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
  margin: 10px 0;
  height: 45px;
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