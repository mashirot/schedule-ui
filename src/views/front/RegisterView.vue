<template>
    <div class="outsider">
        <div id="reg">
            <el-container>
                <el-header>
                    <div class="headerTitle">Register</div>
                </el-header>
                <el-main>
                    <el-form ref="regForm" :model="regForm" :rules="regRules" label-width="80px">
                        <el-form-item label="用户名" prop="username">
                            <el-input placeholder="请输入用户名" v-model="regForm.username"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="password">
                            <el-input placeholder="请输入密码" v-model="regForm.password" show-password></el-input>
                        </el-form-item>
                        <el-form-item label="确认密码" prop="ensurePassword">
                            <el-input placeholder="请输入密码" v-model="regForm.ensurePassword" show-password></el-input>
                        </el-form-item>
                        <el-form-item label="日期" prop="termDate">
                            <div class="block">
                                <span class="demonstration"></span>
                                <el-date-picker v-model="regForm.termDate" unlink-panels type="daterange"
                                    range-separator="至" start-placeholder="开学日期" end-placeholder="修业日期">
                                </el-date-picker>
                            </div>
                        </el-form-item>
                    </el-form>
                    <el-button @click="submitVerify('regForm')" type="primary" plain>注册</el-button>
                    <el-button @click="jumpToLoginPage" type="primary" plain>返回登录</el-button>
                </el-main>
            </el-container>
        </div>
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
            regRules: {
                username: [
                    { required: true, message: '用户名不能为空', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur' },
                    { min: 8, message: '密码长度不能小于8位', trigger: 'blur' }
                ],
                ensurePassword: [
                    { required: true, message: '请再次输入密码', trigger: 'blur' },
                    { validator: this.checkEnsurePassword, trigger: 'blur' }
                ],
                termDate: [
                    { required: true, message: '日期不能为空', trigger: 'change' }
                ]
            }
        }
    },
    methods: {
        async sendRegReq() {
            const regSubmitForm = {
                username: this.regForm.username,
                password: md5(this.regForm.username + this.regForm.password),
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
        },
        checkEnsurePassword(rule, value, callback) {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.regForm.password) {
                callback(new Error('两次输入的密码不一致'));
            } else {
                callback();
            }
        },
        submitVerify(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.sendRegReq();
                } else {
                    return false;
                }
            });
        }
    }
};
export default options;
</script>
<style>
#reg {
    width: 50%;
}
</style>