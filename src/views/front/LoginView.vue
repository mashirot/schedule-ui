<template>
    <div class="outsider">
        <div id="login">
            <el-container>
                <el-header>
                    <div class="headerTitle">Login</div>
                </el-header>
                <el-main>
                    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" label-width="80px">
                        <el-form-item label="用户名" prop="username">
                            <el-input placeholder="请输入用户名" v-model="loginForm.username"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="password">
                            <el-input placeholder="请输入密码" v-model="loginForm.password" show-password></el-input>
                        </el-form-item>
                    </el-form>
                    <el-button @click="submitVerify('loginForm')" type="primary" plain>登录</el-button>
                    <el-button @click="jumpToRegPage" type="primary" plain>注册</el-button>
                </el-main>
            </el-container>
        </div>
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
            },
            loginRules: {
                username: [
                    { required: true, message: '用户名不能为空', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur' },
                    { min: 8, message: '密码长度不能小于8位', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        async sendLoginReq() {
            const loginSubmitForm = {
                username: this.loginForm.username,
                password: md5(this.loginForm.username + this.loginForm.password)
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
                    this.$store.dispatch('updateAuthToken', resp.data.data.authToken);
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
        },
        submitVerify(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.sendLoginReq();
                } else {
                    return false;
                }
            });
        }
    }
};
export default options;
</script>
<style scoped>
#login {
    width: 50%;
}
</style>