<template>
  <div class="title">注册</div>
  <div class="input">
    <el-input v-model="username" placeholder="用户名">
      <template #prepend><font-awesome-icon icon="fa-user" /></template>
    </el-input>
    <el-input v-model="password" type="password" placeholder="密码">
      <template #prepend><font-awesome-icon icon="fa-lock" /></template>
    </el-input>
    <el-input v-model="confirmPassword" type="password" placeholder="确认密码">
      <template #prepend><font-awesome-icon icon="fa-lock" /></template>
    </el-input>
  </div>
  <div class="button">
    <el-button type="primary">注册</el-button>
    <el-button @click="$router.push(`/login`)">返回登录</el-button>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';

let username = ref();
let password = ref();
let confirmPassword = ref();

</script>
<style scoped>
.input {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  padding: 0 70px;
  height: 175px;
}

.input .el-input {
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