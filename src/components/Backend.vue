<template>
  <div class="box">
    <div class="header">
      <div class="dateInfo">
        <div>{{ today }}</div>
        <div class="week">第 {{ userInfo.currWeek }} 周</div>
      </div>
      <div class="userInfo">
        <el-dropdown>
          <div class="btn">
            <el-icon>
              <User />
            </el-icon>
            <span style="margin: 0 10px;">{{ userInfo.username }}</span>
            <el-icon><arrow-down /></el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="dialogUserInfoVisible = true">个人资料</el-dropdown-item>
              <el-dropdown-item @click="dialogModifyUserInfoVisible = true">修改资料</el-dropdown-item>
              <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <div class="container">
      <div class="aside">
        <el-menu default-active="1-1">
          <el-sub-menu index="1">
            <template #title>
              <el-icon class="aside-icon">
                <Calendar />
              </el-icon>
              <span>课程表</span>
            </template>
            <el-menu-item index="1-1" @click="getEffCourses">
              <div class="aside-small-icon">
                <font-awesome-icon icon="fa-solid fa-calendar-check" />
              </div>
              <span class="aside-small-title">有效日程</span>
            </el-menu-item>
            <el-menu-item index="1-2" @click="getAllCourses">
              <div class="aside-small-icon">
                <font-awesome-icon icon="fa-solid fa-calendar" />
              </div>
              <span class="aside-small-title">全部日程</span>
            </el-menu-item>
          </el-sub-menu>
          <el-menu-item @click="dialogSearchVisible = true">
            <el-icon class="aside-icon">
              <Operation />
            </el-icon>
            <span>筛选</span>
          </el-menu-item>
          <el-sub-menu>
            <template #title>
              <el-icon class="aside-icon">
                <Setting />
              </el-icon>
              <span>操作</span>
            </template>
            <el-menu-item @click="dialogInsertVisible = true">
              <div class="aside-small-icon">
                <font-awesome-icon icon="fa-solid fa-file-circle-plus" />
              </div>
              <span class="aside-small-title">添加课程</span>
            </el-menu-item>
            <el-menu-item @click="dialogFileVisible = true">
              <div class="aside-small-icon">
                <font-awesome-icon icon="fa-solid fa-file-lines" />
              </div>
              <span class="aside-small-title">导入课程</span>
            </el-menu-item>
            <el-menu-item @click="ensureClear">
              <div class="aside-small-icon">
                <font-awesome-icon icon="fa-solid fa-trash" />
              </div>
              <span class="aside-small-title">清空课程</span>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </div>
      <div class="main">
        <RouterView />
      </div>
    </div>
  </div>
  <el-dialog v-model="dialogSearchVisible" title="筛选" width="600px">
    <Search @close="dialogSearchVisible = false"></Search>
  </el-dialog>
  <el-dialog v-model="dialogInsertVisible" :closed="resetCourseForm()" title="添加课程" width="600px">
    <CourseForm class="insert" btnName="添加" @close="dialogInsertVisible = false" @submit="subIns"></CourseForm>
  </el-dialog>
  <el-dialog v-model="dialogUserInfoVisible" title="个人信息" width="600px">
    <div class="userInfoShow">
      <div class="row">
        <div class="des">用户名：</div>
        <div class="value">{{ userInfo.username }}</div>
      </div>
      <div class="row">
        <div class="des">学期开始日期：</div>
        <div class="value">{{ moment(userInfo.termStartDate).format("YYYY-MM-DD") }}</div>
      </div>
      <div class="row">
        <div class="des">学期结束日期：</div>
        <div class="value">{{ moment(userInfo.termEndDate).format("YYYY-MM-DD") }}</div>
      </div>
      <div class="row">
        <div class="des">ApiToken：</div>
        <div class="value">{{ userInfo.apiToken }}</div>
      </div>
    </div>
  </el-dialog>
  <el-dialog v-model="dialogModifyUserInfoVisible" :closed="resetUserInfoForm()" title="修改信息" width="600px">
    <div class="infoInput">
      <el-form :model="userInfoForm" :rules="infoRules" label-width="75px">
        <el-form-item label="新密码：" prop="password">
          <el-input v-model="userInfoForm.password" type="password" placeholder="新密码" />
        </el-form-item>
        <el-form-item label="新日期：">
          <el-date-picker v-model="userInfoForm.date" type="daterange" range-separator="-" start-placeholder="学期开始日期"
            end-placeholder="学期结束日期" />
        </el-form-item>
        <div class="btn">
          <el-button type="primary" @click="subUserInfoModify">修改</el-button>
          <el-button @click="dialogModifyUserInfoVisible = false">取消</el-button>
        </div>
      </el-form>
    </div>
  </el-dialog>
  <el-dialog v-model="dialogFileVisible" title="文件上传" width="600px">
    <div class="upload" style="margin: 25px 50px;">
      <el-upload drag :action="uploadUrl" name="courseFile" accept=".txt" limit="1"
        :headers="{ 'Authorization': `Bearer ${jwtToken}` }" :on-success="uploadSuccess" :on-error="uploadFailed">
        <font-awesome-icon icon="fa-solid fa-cloud-arrow-up" style="height: 75px;" />
        <div class="el-upload__text">
          拖动文件至此 或 <em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            仅能上传.txt文件且小于16KB
          </div>
          <div class="el-upload__tip">
            内容示例：
          </div>
          <div class="el-upload__tip">
            课程名|地点|讲师|日期|开始时间-结束时间|开始周-结束周|单双周[否|单|双]|学分
          </div>
          <div class="el-upload__tip">
            高等数学|A教111|罗永浩|Monday|07:00-20:00|1-16|否|100
          </div>
        </template>
      </el-upload>
    </div>
  </el-dialog>
</template>
<script setup lang="ts">
import axios from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus/lib/components/index.js';
import type { FormRules } from 'element-plus/lib/components/index.js';
import { useCourseStore, useUtilStore } from '@/stores/counter';
import { useRouter } from 'vue-router';
import { reactive, ref } from 'vue';
import Search from '@/views/Search.vue';
import CourseForm from '@/views/CourseForm.vue';
import moment from 'moment';
import { url } from '@/urlConfig';
import { sortByDayOfWeek } from '@/utils/Sort';

const router = useRouter();
const utilStore = useUtilStore();
const courseStore = useCourseStore();
const dialogSearchVisible = ref(false);
const dialogInsertVisible = ref(false);
const dialogUserInfoVisible = ref(false);
const dialogModifyUserInfoVisible = ref(false);
const dialogFileVisible = ref(false);
const today = ref(moment().format("YYYY 年 MM 月 DD 日"));
// 文件上传接口地址
const uploadUrl = `${url}/sched/file`;
const jwtToken = localStorage.getItem("authToken");

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

interface UserInfoModify {
  password: string,
  date: Array<Date> | null;
}

const userInfo = reactive({
  username: "default",
  termStartDate: new Date(),
  termEndDate: new Date(),
  currWeek: "?",
  apiToken: "-"
});

function uploadFailed() {
  ElMessage({
    message: '系统错误',
    type: 'error',
  });
  dialogFileVisible.value = false;
}

function uploadSuccess(response: any) {
  if (response.code === 10000) {
    ElMessage({
      message: '登录过期，请重新登陆',
      type: 'warning',
    });
    router.push({ name: "login" });
  } else if (response.code === 30051) {
    ElMessage({
      message: '上传成功，解析成功',
      type: 'success',
    });
    getEffCourses();
  } else if (response.code === 30050) {
    ElMessage({
      message: '上传成功，解析失败，请检查内容格式',
      type: 'warning',
    });
  }
  dialogFileVisible.value = false;
}

let userInfoForm = reactive<UserInfoModify>({
  password: "",
  date: null,
});

const infoRules = reactive<FormRules>({
  password: [
    { min: 6, max: 30, message: '密码长度在6-30之间', trigger: 'blur' },
    { validator: checkChinese, trigger: 'blur' }
  ]
});

function checkChinese(rule: any, value: any, callback: any) {
  if (!utilStore.hasNoChinese(value)) {
    callback(new Error("请输入英文及数字"));
  }
  callback();
}

function subUserInfoModify() {
  if (userInfoForm.password === "" && userInfoForm.date === null) {
    dialogModifyUserInfoVisible.value = false;
    ElMessage({
      message: '无任何修改',
      type: 'warning',
    });
    return;
  }
  if (userInfoForm.password !== "") {
    if (userInfoForm.password.length < 6 || userInfoForm.password.length > 30) {
      ElMessage({
        message: '请检查输入信息',
        type: 'error',
      });
      return;
    }
  }
  let termStartDate = null;
  let termEndDate = null;
  if (userInfoForm.date !== null) {
    const dateArr = userInfoForm.date as Array<Date>;
    termStartDate = dateArr[0];
    termEndDate = dateArr[1];
  }
  axios.post("/user/modify", {
    password: userInfoForm.password === "" ? null : userInfoForm.password,
    termStartDate,
    termEndDate
  }, {
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("authToken")}`
    }
  }).then(response => {
    if (response.data.code === 10000) {
      ElMessage({
        message: '登录过期，请重新登陆',
        type: 'warning',
      });
      router.push({ name: "login" });
    } else if (response.data.code === 10041) {
      if (userInfoForm.password === "") {
        ElMessage({
          message: '修改成功',
          type: 'success',
        });
        dialogModifyUserInfoVisible.value = false;
        getUserInfo();
      } else {
        ElMessage({
          message: '修改成功，请重新登陆',
          type: 'success',
        });
        router.push({ name: "login" });
      }
    } else if (response.data.code === 10040) {
      ElMessage({
        message: '修改失败',
        type: 'error',
      });
      dialogModifyUserInfoVisible.value = false;
    }
  }).catch(error => {
    ElMessage({
      message: '系统错误',
      type: 'error',
    });
  });
}

function resetUserInfoForm() {
  userInfoForm = reactive({
    password: "",
    date: null,
  });
}

function logout() {
  axios.get("/user/logout", {
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("authToken")}`
    }
  }).then(response => {
    const resp = response.data;
    if (resp.code === 10000) {
      ElMessage({
        message: '登录过期，请重新登陆',
        type: 'warning',
      });
    } else if (resp.code === 10021) {
      localStorage.removeItem("authToken");
      router.push({ name: "login" });
      ElMessage({
        message: '退出成功',
        type: 'success',
      });
    } else {
      ElMessage({
        message: '退出失败',
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

function getUserInfo() {
  axios.get("/user/info", {
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("authToken")}`
    }
  }).then(response => {
    const resp = response.data;
    if (resp.code === 10000) {
      ElMessage({
        message: '登录过期，请重新登陆',
        type: 'warning',
      });
    } else if (resp.code === 10051) {
      const user = resp.data;
      userInfo.username = user.username;
      userInfo.termStartDate = user.termStartDate;
      userInfo.termEndDate = user.termEndDate;
      userInfo.currWeek = user.currWeek;
      userInfo.apiToken = user.apiToken;
    } else {
      ElMessage({
        message: '获取个人信息失败',
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
// 进入后调用一次
getUserInfo();

function subIns() {
  const course: Course = {
    courseId: courseStore.courseForm.courseId,
    dayOfWeek: courseStore.courseForm.dayOfWeek,
    startTime: courseStore.courseForm.startTime,
    endTime: courseStore.courseForm.endTime,
    name: courseStore.courseForm.name,
    place: courseStore.courseForm.place,
    teacher: courseStore.courseForm.teacher,
    startWeek: parseInt(courseStore.courseForm.startWeek as unknown as string, 10),
    endWeek: parseInt(courseStore.courseForm.endWeek as unknown as string, 10),
    oddWeek: parseInt(courseStore.courseForm.oddWeek as unknown as string, 10),
    credit: parseFloat(courseStore.courseForm.credit as unknown as string)
  };
  axios.post(`/sched/ins`, course, {
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("authToken")}`
    }
  }).then(response => {
    if (response.data.code === 10000) {
      ElMessage({
        message: '登录过期，请重新登陆',
        type: 'warning',
      });
      router.push({ name: "login" });
    } else if (response.data.code === 20051) {
      ElMessage({
        message: '修改成功',
        type: 'success',
      });
      dialogInsertVisible.value = false;
      getEffCourses();
    } else if (response.data.code === 20050) {
      ElMessage({
        message: '修改失败',
        type: 'error',
      });
      dialogInsertVisible.value = false;
    }
  }).catch(error => {
    ElMessage({
      message: '系统错误',
      type: 'error',
    });
  });
}

function resetCourseForm() {
  courseStore.courseForm = reactive({
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
}

function ensureClear() {
  ElMessageBox.confirm(
    '本操作将清除所有课程，不可恢复，你确定吗？',
    'Warning',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    subClear();
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: '取消清除',
    });
  });
}

function subClear() {
  axios.post(`/sched/del`, {}, {
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("authToken")}`
    }
  }).then(response => {
    if (response.data.code === 10000) {
      ElMessage({
        message: '登录过期，请重新登陆',
        type: 'warning',
      });
      router.push({ name: "login" });
    } else if (response.data.code === 20061) {
      ElMessage({
        message: '清空成功',
        type: 'success',
      });
      getEffCourses();
    } else if (response.data.code === 20060) {
      ElMessage({
        message: '清空失败',
        type: 'error',
      });
    }
  }).catch(error => {
    ElMessage({
      message: '系统错误',
      type: 'error',
    });
  });
}

function getEffCourses() {
  getCourses(true);
}

function getAllCourses() {
  getCourses(false);
}

function getCourses(isEff: boolean) {
  axios.post(`/sched/sel`, {
    isEffective: isEff
  }, {
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("authToken")}`
    }
  }).then(response => {
    if (response.data.code === 10000) {
      ElMessage({
        message: '登录过期，请重新登陆',
        type: 'warning',
      });
      router.push({ name: "login" });
    } else if (response.data.code === 20011) {

      const courses: Array<CourseVo> = response.data.data;
      courses.sort(sortByDayOfWeek);
      courseStore.courseData = courses;
    } else if (response.data.code === 20020) {
      ElMessage({
        message: '获取课程信息失败',
        type: 'error',
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
.box {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}

.header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 65px;
  border-bottom: 1px solid #dcdcdc;
}

.header .dateInfo {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.header .week {
  margin-top: 3px;
  font-size: 14px;
}

.header .userInfo {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  margin-right: 15px;
}

.header .userInfo .btn {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  background-color: #fefefe;
  border: 1.5px solid #e1e1e1;
  border-radius: 5px;
}

.header .userInfo .btn:hover {
  cursor: default;
}

.container {
  display: flex;
  height: 100%;
}

.aside {
  width: 275px;
  border-right: 1px solid #dcdfe6;
  background-color: #fcfcfc;
}

.aside .el-menu {
  border: 0;
  background-color: #ffffff00;
}

.aside .el-menu :deep(.el-menu--inline) {
  background-color: #ffffff00;
}

.aside .aside-small-icon {
  display: flex;
  padding-left: 25px;
  width: 25px;
}

.aside .aside-icon {
  padding-left: 20px;
}

.main {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: #f0f0f0;
}

.insert {
  display: flex;
  justify-content: center;
  padding: 0 50px;
}

.userInfoShow {
  margin: 0 50px;
  margin-bottom: 25px;
}

.userInfoShow .row {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  height: 50px;
  line-height: 50px;
}

.userInfoShow .row .des {
  padding-right: 15px;
  box-sizing: border-box;
  width: 250px;
  text-align: right;
  background-color: #ececec;
  border: 1px solid #363637;
}

.userInfoShow .row .value {
  box-sizing: border-box;
  text-align: center;
  width: 100%;
  background-color: #fff;
  border: 1px solid #363637;
  border-left: 0;
}

.infoInput {
  display: flex;
  justify-content: center;
  width: 100%;
}

.infoInput .btn {
  margin-top: 25px;
  text-align: center;
}

.infoInput .el-button {
  margin: 0 15px;
}
</style>