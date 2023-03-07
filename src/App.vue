<template>
  <div id="app">
    <router-view />
  </div>
</template>
<style>
html,
body,
#app,
.el-container {
  padding: 0px;
  margin: 0px;
  height: 100%;
}

.el-header,
.el-footer {
  background-color: #B3C0D1;
  color: #333;
  text-align: center;
  /* line-height: 60px; */
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-aside {
  background-color: #D3DCE6;
  color: #333;
  text-align: center;
  /* line-height: 200px; */
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
  text-align: center;
  line-height: auto;
}
</style>