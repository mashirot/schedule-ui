<template>
    <div>
        <el-container>
            <el-header>Login</el-header>
            <el-main>
                <el-form ref="form" :model="loginForm" label-width="80px">
                    <el-form-item label="用户名">
                        <el-input placeholder="请输入用户名" v-model="loginForm.username"></el-input>
                    </el-form-item>
                    <el-form-item label="密码">
                        <el-input placeholder="请输入密码" v-model="loginForm.password" show-password></el-input>
                    </el-form-item>
                </el-form>
                <el-button @click="sendLoginReq" type="primary" plain>登录</el-button>
                <el-button @click="jumpToRegPage" type="primary" plain>注册</el-button>
            </el-main>
        </el-container>
    </div>
</template>
<script>
import axios from 'axios';
import md5 from 'js-md5';

const options = {
    data: function () {
        return {
            loginForm: {
                username: '',
                password: ''
            }
        }
    },
    methods: {
        async sendLoginReq() {
            const loginSubmitForm = {
                username: this.loginForm.username,
                password: md5(this.loginForm.username, this.loginForm.password)
            }
            try {
                const resp = await axios.post('http://127.0.0.1:8080/user/login', loginSubmitForm);
                if (resp.data.code === 10011) {
                    this.$message({
                        message: '登录成功, 将自动跳转',
                        type: 'success'
                    });
                    localStorage.setItem('uid', resp.data.data.uid);
                    localStorage.setItem('username', resp.data.data.username);
                    localStorage.setItem('termStartDate', resp.data.data.termStartDate);
                    localStorage.setItem('termEndDate', resp.data.data.termEndDate);
                    setTimeout(this.jumpToBackend, 1500);
                } else if (resp.data.code === 10010) {
                    this.$message({
                        message: '用户名或密码错误',
                        type: 'warning'
                    });
                }
            } catch (error) {
                this.$message.error('Server Err');
            }
        },
        jumpToRegPage() {
            this.$router.push('/register');
        },
        jumpToBackend() {
            this.$router.push('/backend');
        }
    }
};
export default options;
</script>
<style scoped>
.el-header,
.el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
}

.el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
}

.el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
}

body>.el-container {
    margin-bottom: 40px;
}
</style>
  