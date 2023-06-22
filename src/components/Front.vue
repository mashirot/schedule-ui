<template>
  <div class="container">
    <div class="inner-container">
      <slot></slot>
      <RouterView />
    </div>
    <div class="copyright">
      <div class="pixiv" @click="jump2Pixiv">Pixiv: 108906379</div>
      <font-awesome-icon icon="fa-brands fa-github" @click="jump2Github" />
    </div>
  </div>
</template>
<script setup lang="ts">

function jump2Pixiv() {
  window.open("https://www.pixiv.net/artworks/108906379", "_blank");
}

function jump2Github() {
  window.open("https://github.com/mashirot/schedule-ui", "_blank");
}
</script>
<style>
.container {
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  background-image: url("../assets/loginBg.jpg");
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
}

.inner-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 50px;
  box-sizing: border-box;
  width: 600px;
  /* height: 500px; */
  text-align: center;
  border-radius: 20px;
  background-color: rgba(0, 0, 0, 0.27);
}

.title {
  margin: 25px auto;
  color: #b9b3b0;
  font-size: 32px;
  font-weight: 700;
  line-height: 32px;
}

.button {
  margin-top: 25px;
}

.button .el-button {
  margin: 0 20px;
  width: 70px;
  height: 40px;
}

.copyright {
  position: absolute;
  right: 0;
  bottom: 0;
  margin: 15px 20px;
  color: #555555;
}

.copyright .pixiv {
  display: inline-block;
  margin-right: 15px;
  cursor: pointer
}

.copyright .fa-github {
  cursor: pointer
}
</style>