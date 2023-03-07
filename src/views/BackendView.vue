<template>
    <el-container>
        <el-header>
            <div id="headerTitle">Schedule Backend</div>
            <el-dropdown @command="infoMenuHandleCommand">
                <el-button id="infoButton">
                    {{ user.username }}
                    <i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="info">个人信息</el-dropdown-item>
                    <el-dropdown-item command="infoModify">修改信息</el-dropdown-item>
                    <el-dropdown-item command="api">获取Api</el-dropdown-item>
                    <el-dropdown-item command="exit" divided>退出</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <el-dialog title="个人信息" :visible.sync="userInfoDialogVisible" width="40%">
                <div>
                    <el-descriptions direction="vertical" :column="4" border>
                        <el-descriptions-item label="用户名">{{ user.username }}</el-descriptions-item>
                        <el-descriptions-item label="开学日期">{{ user.termStartDate }}</el-descriptions-item>
                        <el-descriptions-item label="修业日期">{{ user.termEndDate }}</el-descriptions-item>
                    </el-descriptions>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="userInfoDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="userInfoDialogVisible = false">确 定</el-button>
                </span>
            </el-dialog>
            <el-dialog title="修改信息" :visible.sync="userInfoModifyDialogVisible" width="40%">

                <el-form ref="form" :model="tempUserData" label-width="80px">
                    <el-form-item label="新密码：">
                        <div class="block">
                            <el-input id="modifyInputBox" placeholder="请输入密码" v-model="tempUserData.password"
                                show-password></el-input>
                        </div>
                    </el-form-item>
                    <el-form-item label="开学日期：">
                        <div class="block">
                            <el-date-picker v-model="tempUserData.termStartDate" type="date" placeholder="选择日期">
                            </el-date-picker>
                        </div>
                    </el-form-item>
                    <el-form-item label="修业日期：">
                        <div class="block">
                            <el-date-picker v-model="tempUserData.termEndDate" type="date" placeholder="选择日期">
                            </el-date-picker>
                        </div>
                    </el-form-item>
                </el-form>

                <span slot="footer" class="dialog-footer">
                    <el-button @click="userInfoModifyDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="sendInfoModifyReq">确 定</el-button>
                </span>
            </el-dialog>
            <el-dialog title="Api获取" :visible.sync="apiDialogVisible" width="40%">
                <div>Api: {{ this.user.apiToken }}</div>
                <div><el-button @click="sendApiReq" type='text'>点击获取</el-button></div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="apiDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="apiDialogVisible = false">确 定</el-button>
                </span>
            </el-dialog>
        </el-header>
        <el-container>
            <el-aside width="200px">
                <el-row class="tac">
                    <el-col>
                        <el-menu default-active="2" class="el-menu-vertical-demo">
                            <el-submenu index="1">
                                <template slot="title">
                                    <i class="el-icon-date"></i>
                                    <span>日程</span>
                                </template>
                                <el-menu-item-group>
                                    <el-menu-item @click="sendCourseEffReq" index="1-1">有效日程</el-menu-item>
                                    <el-menu-item @click="sendCourseAllReq" index="1-2">所有日程</el-menu-item>
                                </el-menu-item-group>
                            </el-submenu>
                            <el-menu-item @click="this.jumpToUploadPage" index="2">
                                <i class="el-icon-document"></i>
                                <span>文件上传</span>
                            </el-menu-item>
                            <el-submenu index="3">
                                <template slot="title">
                                    <i class="el-icon-setting"></i>
                                    <span>操作</span>
                                </template>
                                <el-menu-item-group>
                                    <el-menu-item @click="newCourseDialogVisible = true" index="3-1">
                                        <i class="el-icon-notebook-2"></i>
                                        <span>添加课程</span>
                                    </el-menu-item>
                                    <el-menu-item @click="ensureClearCourse" index="3-2">
                                        <i class="el-icon-delete"></i>
                                        <span>清除课程</span>
                                    </el-menu-item>
                                </el-menu-item-group>
                            </el-submenu>
                            <el-menu-item @click="conditionSelectDialogVisible = true" index="4">
                                <i class="el-icon-search"></i>
                                <span>筛选</span>
                            </el-menu-item>
                        </el-menu>
                    </el-col>
                </el-row>
            </el-aside>
            <el-main>
                <router-view />
            </el-main>
            <el-dialog title="添加课程" :visible.sync="newCourseDialogVisible" width="30%"
                :before-close="newCourseDialogHandleClose">
                <el-form ref="newCourseForm" :model="newCourseForm" :rules="newCourseFormRules" label-width="80px">
                    <el-form-item label="课程名：" prop="name">
                        <el-input v-model="newCourseForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="日期：" prop="dayOfWeek">
                        <el-select v-model="newCourseForm.dayOfWeek" placeholder="请选择">
                            <el-option v-for="item in daysOfWeek" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="时间：" prop="startTime">
                        <el-time-select placeholder="起始时间" v-model="newCourseForm.startTime" :picker-options="{
                            start: '06:30',
                            step: '00:05',
                            end: '20:30'
                        }">
                        </el-time-select>
                        <el-time-select placeholder="结束时间" v-model="newCourseForm.endTime" :picker-options="{
                            start: '06:30',
                            step: '00:05',
                            end: '20:30',
                            minTime: newCourseForm.startTime
                        }">
                        </el-time-select>
                    </el-form-item>
                    <el-form-item label="地点：" prop="place">
                        <el-input v-model="newCourseForm.place"></el-input>
                    </el-form-item>
                    <el-form-item label="讲师：" prop="teacher">
                        <el-input v-model="newCourseForm.teacher"></el-input>
                    </el-form-item>
                    <el-form-item label="开始周：" prop="startWeek">
                        <el-input-number v-model="newCourseForm.startWeek" :controls="false" :min="1"
                            :max="30"></el-input-number>
                    </el-form-item>
                    <el-form-item label="结束周：" prop="endWeek">
                        <el-input-number v-model="newCourseForm.endWeek" :controls="false" :min="1"
                            :max="30"></el-input-number>
                    </el-form-item>
                    <el-form-item label="单双周：" prop="oddWeek">
                        <el-radio v-model="newCourseForm.oddWeek" label="0">否</el-radio>
                        <el-radio v-model="newCourseForm.oddWeek" label="1">单周</el-radio>
                        <el-radio v-model="newCourseForm.oddWeek" label="2">双周</el-radio>
                    </el-form-item>
                    <el-form-item label="学分：" prop="credit">
                        <el-input-number v-model="newCourseForm.credit" :precision="1" :step="0.25"
                            :max="20"></el-input-number>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="newCourseDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addCourseSubmit('newCourseForm')">确 定</el-button>
                </span>
            </el-dialog>
            <el-dialog title="条件筛选" :visible.sync="conditionSelectDialogVisible" width="30%"
                :before-close="conditionSelectDialogHandleClose">
                <el-form ref="conditionSelForm" :model="conditionSelForm" :rules="conditionSelRules" label-width="80px">
                    <el-form-item label="类型：" prop="isEff">
                        <el-radio v-model="conditionSelForm.isEff" label="true">有效</el-radio>
                        <el-radio v-model="conditionSelForm.isEff" label="false">所有</el-radio>
                    </el-form-item>
                    <el-form-item label="日期：" prop="dayOfWeek">
                        <el-select v-model="conditionSelForm.dayOfWeek" placeholder="请选择">
                            <el-option v-for="item in daysOfWeek" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="conditionSelectDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="conditionSelectDialogSubmit('conditionSelForm')">确 定</el-button>
                </span>
            </el-dialog>
        </el-container>
    </el-container>
</template>
<script>
import authAxios from '@/util/authAxios';

const options = {
    mounted: function () {
        this.initData();
    },
    data: function () {
        return {
            user: {
                uid: '',
                username: '',
                termStartDate: '',
                termEndDate: '',
                apiToken: ''
            },
            userInfoDialogVisible: false,
            userInfoModifyDialogVisible: false,
            apiDialogVisible: false,
            tempUserData: {
                password: '',
                termStartDate: '',
                termEndDate: ''
            },
            newCourseDialogVisible: false,
            daysOfWeek: [{
                value: 'Monday',
                label: '周一'
            }, {
                value: 'Tuesday',
                label: '周二'
            }, {
                value: 'Wednesday',
                label: '周三'
            }, {
                value: 'Thursday',
                label: '周四'
            }, {
                value: 'Friday',
                label: '周五'
            }, {
                value: 'Saturday',
                label: '周六'
            }, {
                value: 'Sunday',
                label: '周日'
            }],
            newCourseForm: {
                uid: '',
                name: '',
                place: '',
                startTime: '',
                endTime: '',
                dayOfWeek: '',
                teacher: '',
                startWeek: '',
                endWeek: '',
                oddWeek: '',
                credit: ''
            },
            newCourseFormRules: {
                name: [{ required: true, message: '课程名不能为空', trigger: 'blur' }],
                dayOfWeek: [{ required: true, message: '日期不能为空', trigger: 'change' }],
                startTime: [{ required: true, message: '开始时间不能为空', trigger: 'change' }],
                endTime: [{ required: true, message: '结束时间不能为空', trigger: 'change' }],
                place: [{ required: true, message: '地点不能为空', trigger: 'blur' }],
                teacher: [{ required: true, message: '讲师不能为空', trigger: 'blur' }],
                startWeek: [
                    { required: true, message: '开始周不能为空', trigger: 'change' },
                    { validator: this.validateWeeks, trigger: 'blur' }
                ],
                endWeek: [
                    { required: true, message: '结束周不能为空', trigger: 'change' },
                    { validator: this.validateWeeks, trigger: 'blur' }
                ],
                oddWeek: [{ required: true, message: '单双周不能为空', trigger: 'change' }],
                credit: [{ required: true, message: '学分不能为空', trigger: 'blur' }]
            },
            conditionSelectDialogVisible: false,
            conditionSelForm: {},
            conditionSelRules: {
                isEff: [
                    { required: true, message: '请选择类型', trigger: 'change' }
                ],
                dayOfWeek: [
                    { required: true, message: '请选择日期', trigger: 'change' }
                ]
            },
        }
    },
    methods: {
        initData() {
            this.user.uid = localStorage.getItem('uid');
            this.user.username = localStorage.getItem('username');
            this.user.termStartDate = localStorage.getItem('termStartDate');
            this.user.termEndDate = localStorage.getItem('termEndDate');
        },
        infoMenuHandleCommand(command) {
            switch (command) {
                case 'info':
                    this.userInfoDialogVisible = true;
                    break;
                case 'infoModify':
                    this.tempUserData.termStartDate = this.user.termStartDate;
                    this.tempUserData.termEndDate = this.user.termEndDate;
                    this.userInfoModifyDialogVisible = true;
                    break;
                case 'api':
                    this.apiDialogVisible = true;
                    break;
                case 'exit':
                    this.sendLogoutReq();
            }
        },
        async sendLogoutReq() {
            try {
                const resp = await authAxios.post('http://127.0.0.1:8080/user/logout', {
                    uid: this.user.uid
                });
                if (resp.data.code === 10021) {
                    this.$message({
                        message: '退出成功',
                        type: 'success'
                    });
                    localStorage.clear();
                    setTimeout(this.jumpToLogin, 1000);
                } else if (resp.data.code === 10020) {
                    this.$message({
                        message: '退出失败, Session已过期, 请重新登陆',
                        type: 'warning'
                    });
                    localStorage.clear();
                    setTimeout(this.jumpToLogin, 1000);
                } else if (resp.data.code === 10000) {
                    this.$message.warning('登录过期，请重新登陆');
                    this.$router.push('/');
                    return;
                }
            } catch (error) {
                this.$message.error('Server Err');
            }
        },
        jumpToLogin() {
            this.$router.push('/');
        },
        async sendApiReq() {
            try {
                const resp = await authAxios.post('http://127.0.0.1:8080/user/api', {
                    username: this.user.username
                });
                if (resp.data.code === 10031) {
                    this.user.apiToken = resp.data.data.apiToken;
                } else if (resp.data.code === 10030) {
                    this.$message({
                        message: '获取失败, 请联系管理员处理',
                        type: 'warning'
                    });
                } else if (resp.data.code === 10000) {
                    this.$message.warning('登录过期，请重新登陆');
                    this.$router.push('/');
                    return;
                }
            } catch (error) {
                this.$message.error('Server Err');
            }
        },
        async sendInfoModifyReq() {
            const modifyData = {
                uid: this.user.uid
            };
            let flag = false;
            if (this.tempUserData.password !== '') {
                modifyData.password = this.tempUserData.password;
                flag = true;
            }
            if (this.tempUserData.termStartDate !== this.user.termStartDate) {
                modifyData.termStartDate = this.tempUserData.termStartDate;
                flag = true;
            }
            if (this.tempUserData.termEndDate !== this.user.termEndDate) {
                modifyData.termEndDate = this.tempUserData.termEndDate;
                flag = true;
            }
            if (!flag) {
                this.$message('未作出修改');
                this.userInfoModifyDialogVisible = false;
                return;
            }
            try {
                const resp = await authAxios.post('http://127.0.0.1:8080/user/modify', modifyData);
                if (resp.data.code === 10041) {
                    if (modifyData.password === undefined || modifyData.password === null) {
                        this.$message({
                            message: '修改成功',
                            type: 'success'
                        });
                        if (this.tempUserData.termStartDate != this.user.termStartDate) {
                            this.user.termStartDate = this.tempUserData.termStartDate;
                        }
                        if (this.tempUserData.termEndDate != this.user.termEndDate) {
                            this.user.termEndDate = this.tempUserData.termEndDate;
                        }
                    } else {
                        this.$message({
                            message: '修改成功，请重新登陆',
                            type: 'success'
                        });
                        this.sendLogoutReq();
                    }
                } else if (resp.data.code === 10040) {
                    this.$message({
                        message: '修改失败, 请联系管理员',
                        type: 'warning'
                    });
                } else if (resp.data.code === 10000) {
                    this.$message.warning('登录过期，请重新登陆');
                    this.$router.push('/');
                    return;
                }
                this.userInfoModifyDialogVisible = false;
            } catch (error) {
                this.$message.error('Server Err');
            }
        },
        newCourseDialogHandleClose() {
            this.newCourseDialogVisible = false;
            this.newCourseForm = {
                uid: '',
                name: '',
                place: '',
                startTime: '',
                endTime: '',
                dayOfWeek: '',
                teacher: '',
                startWeek: '',
                endWeek: '',
                oddWeek: '',
                credit: ''
            }
        },
        validateWeeks(rule, value, callback) {
            const startWeek = Number(this.newCourseForm.startWeek);
            const endWeek = Number(this.newCourseForm.endWeek);
            if (startWeek && endWeek && startWeek > endWeek) {
                callback(new Error('开始周必须小于或等于结束周'));
            } else {
                callback();
            }
        },
        addCourseSubmit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.sendAddCourseReq();
                } else {
                    return false;
                }
            });
        },
        async sendAddCourseReq() {
            try {
                this.newCourseForm.uid = this.user.uid;
                const resp = await authAxios.post('http://127.0.0.1:8080/sched/ins', this.newCourseForm);
                if (resp.data.code === 20051) {
                    this.$message({
                        message: '添加成功',
                        type: 'success'
                    });
                    this.newCourseDialogHandleClose();
                    this.sendCourseEffReq();
                } else if (resp.data.code === 20050) {
                    this.$message({
                        message: '添加失败, 请联系管理员处理',
                        type: 'warning'
                    });
                }
            } catch (error) {
                this.$message.error('Server Err');
            }
        },
        sendCourseEffReq() {
            this.jumpToSchedulePage();
            this.$store.dispatch('sendCourseEffReq', this.user);
        },
        sendCourseAllReq() {
            this.jumpToSchedulePage();
            this.$store.dispatch('sendCourseAllReq', this.user);
        },
        sendCourseSelReq() {
            this.jumpToSchedulePage();
            this.$store.dispatch('sendCourseSelReq', {
                user: this.user,
                conditionSelForm: this.conditionSelForm
            });
        },
        ensureClearCourse() {
            this.$confirm('此操作将清除所有课程, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.sendClearReq();
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消清除'
                });
            });
        },
        async sendClearReq() {
            try {
                const resp = await authAxios.post('http://127.0.0.1:8080/sched/del', {
                    uid: this.user.uid
                });
                if (resp.data.code === 20061) {
                    this.$message({
                        type: 'success',
                        message: '清除成功!'
                    });
                } else if (resp.data.code === 10000) {
                    this.$message.warning('登录过期，请重新登陆');
                    this.$router.push('/');
                    return;
                } else {
                    this.$message({
                        type: 'warning',
                        message: '清除失败, 请联系管理员处理'
                    });
                }
                this.sendCourseEffReq();
            } catch (error) {
                this.$message.error('Server Err');
            }
        },
        conditionSelectDialogHandleClose() {
            this.conditionSelectDialogVisible = false;
            this.conditionSelForm = {};
        },
        conditionSelectDialogSubmit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.sendCourseSelReq();
                    this.conditionSelectDialogHandleClose();
                } else {
                    return false;
                }
            });
        },
        jumpToSchedulePage() {
            this.$router.push('/backend/schedule');
        },
        jumpToUploadPage() {
            this.$router.push('/backend/fileUpload');
        }
    }
}
export default options;
</script>
<style>
.upload {
    padding: 15%;
    text-align: center;
}

#headerTitle {
    flex: 1;
    text-align: center;
}

#infoButton {
    align-self: flex-end;
}

#modifyInputBox {
    width: 75%;
}
</style>