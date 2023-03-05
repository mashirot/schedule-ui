<template>
    <div>
        <el-container>
            <el-header>Register</el-header>
            <el-main>
                <el-form ref="regForm" :model="regForm" label-width="80px">
                    <el-form-item label="用户名">
                        <el-input placeholder="请输入用户名" v-model="regForm.username"></el-input>
                    </el-form-item>
                    <el-form-item label="密码">
                        <el-input placeholder="请输入密码" v-model="regForm.password" show-password></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码">
                        <el-input placeholder="请输入密码" v-model="regForm.ensurePassword" show-password></el-input>
                    </el-form-item>
                    <el-form-item label="日期">
                        <div class="block">
                            <span class="demonstration"></span>
                            <el-date-picker v-model="regForm.termDate" unlink-panels type="daterange" range-separator="至"
                                start-placeholder="开学日期" end-placeholder="修业日期">
                            </el-date-picker>
                        </div>
                    </el-form-item>
                </el-form>
                <el-button @click="sendRegReq" type="primary" plain>注册</el-button>
                <el-button @click="jumpToLoginPage" type="primary" plain>返回登录</el-button>
            </el-main>
        </el-container>
    </div>
</template>
<script>
import axios from 'axios';
import md5 from 'js-md5'
const options = {
    data: function () {
        return {
            regForm: {
                username: '',
                password: '',
                ensurePassword: '',
                termDate: []
            },
        }
    },
    methods: {
        async sendRegReq() {
            const regSubmitForm = {
                username: this.regForm.username,
                password: md5(this.regForm.username, this.regForm.password),
                termStartDate: this.regForm.termDate[0],
                termEndDate: this.regForm.termDate[1]
            };
            try {
                const resp = await axios.post('http://127.0.0.1:8080/user/register', regSubmitForm);
                if (resp.data.code === 10051) {
                    this.$message({
                        message: '注册成功, 2s后跳转登录',
                        type: 'success'
                    });
                    setTimeout(this.jumpToLoginPage, 2000);
                } else if (resp.data.code === 10050) {
                    this.$message({
                        message: '注册失败, 用户名重复',
                        type: 'warning'
                    });
                }
            } catch (error) {
                this.$message.error('Server Err');
            }
        },
        jumpToLoginPage() {
            this.$router.push('/login');
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