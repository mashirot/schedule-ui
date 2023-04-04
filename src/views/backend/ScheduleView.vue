<template>
    <div>
        <div v-if="courses.length == 0">
            <el-empty height="875" description="暂无课程"></el-empty>
        </div>
        <div v-else>
            <el-table :data="courses" :default-sort="{ prop: 'dayOfWeek', order: 'ascending' }" border style="width: 100%">
                <el-table-column prop="dayOfWeek" label="日期" width="180" sortable :sort-method="normalSort" align="center">
                </el-table-column>
                <el-table-column prop="time" label="时间" width="180" align="center">
                </el-table-column>
                <el-table-column prop="name" label="课程名" align="center">
                </el-table-column>
                <el-table-column prop="place" label="地点" align="center">
                </el-table-column>
                <el-table-column prop="teacher" label="讲师" align="center">
                </el-table-column>
                <el-table-column prop="week" label="周数" align="center">
                </el-table-column>
                <el-table-column prop="credit" label="学分" sortable align="center">
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="editCourse(scope.$index)">修改</el-button>
                        <el-button size="mini" type="danger" @click="delCourse(scope.$index)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-container>
                <el-dialog title="修改课程" :visible.sync="modifyCourseDialogVisible" width="30%"
                    :before-close="modifyCourseDialogCloseHandle">
                    <el-form ref="modifyCourseForm" :model="modifyCourseForm" label-width="80px">
                        <el-form-item label="课程名：">
                            <el-input v-model="modifyCourseForm.name" id="modifyInputBox"></el-input>
                        </el-form-item>
                        <el-form-item label="日期：">
                            <el-select v-model="modifyCourseForm.dayOfWeek" placeholder="请选择">
                                <el-option v-for="item in daysOfWeek" :key="item.value" :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="时间：">
                            <el-time-select placeholder="起始时间" v-model="modifyCourseForm.startTime" :picker-options="{
                                start: '06:30',
                                step: '00:05',
                                end: '20:30'
                            }">
                            </el-time-select>
                            <el-time-select placeholder="结束时间" v-model="modifyCourseForm.endTime" :picker-options="{
                                start: '06:30',
                                step: '00:05',
                                end: '20:30',
                                minTime: modifyCourseForm.startTime
                            }">
                            </el-time-select>
                        </el-form-item>
                        <el-form-item label="地点：">
                            <el-input v-model="modifyCourseForm.place" id="modifyInputBox"></el-input>
                        </el-form-item>
                        <el-form-item label="讲师：">
                            <el-input v-model="modifyCourseForm.teacher" id="modifyInputBox"></el-input>
                        </el-form-item>
                        <el-form-item label="开始周：">
                            <el-input-number v-model="modifyCourseForm.startWeek" :controls="false" :min="1"
                                :max="30"></el-input-number>
                        </el-form-item>
                        <el-form-item label="结束周：">
                            <el-input-number v-model="modifyCourseForm.endWeek" :controls="false" :min="1"
                                :max="30"></el-input-number>
                        </el-form-item>
                        <el-form-item label="单双周：">
                            <el-radio v-model="modifyCourseForm.oddWeek" label="0">否</el-radio>
                            <el-radio v-model="modifyCourseForm.oddWeek" label="1">单周</el-radio>
                            <el-radio v-model="modifyCourseForm.oddWeek" label="2">双周</el-radio>
                        </el-form-item>
                        <el-form-item label="学分：">
                            <el-input-number v-model="modifyCourseForm.credit" :precision="1" :step="0.25"
                                :max="20"></el-input-number>
                        </el-form-item>
                    </el-form>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="modifyCourseDialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="sendCourseUpdateReq">确 定</el-button>
                    </span>
                </el-dialog>
            </el-container>
        </div>
    </div>
</template>
<script>
import API_URL from '@/api';
import authAxios from '@/util/authAxios.js'
const options = {
    mounted: function () {
        this.init();
        this.sendCourseEffReq(this.user);
    },
    computed: {
        courses() {
            return this.$store.state.courses;
        }
    },
    data: function () {
        return {
            user: {
                uid: '',
                termStartDate: '',
                dayOfWeak: ''
            },
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
            modifyCourseDialogVisible: false,
            modifyCourseForm: {}
        }
    },
    methods: {
        init() {
            this.user.uid = localStorage.getItem('uid');
            this.user.termStartDate = localStorage.getItem('termStartDate');
            this.user.dayOfWeak = localStorage.getItem('dayOfWeak');
        },
        sendCourseEffReq() {
            this.$store.dispatch('sendCourseEffReq', this.user);
        },
        modifyCourseDialogCloseHandle() {
            this.modifyCourseDialogVisible = false;
            this.modifyCourseForm = {};
        },
        editCourse(index) {
            this.modifyCourseDialogVisible = true;
            this.modifyCourseForm.courseId = this.courses[index].courseId;
        },
        async sendCourseUpdateReq() {
            try {
                this.modifyCourseForm.uid = this.user.uid;
                const resp = await authAxios.post(API_URL + '/sched/update', this.modifyCourseForm);
                if (resp.data.code === 20071) {
                    this.$message({
                        message: '修改成功',
                        type: 'success'
                    });
                    this.modifyCourseDialogVisible = false;
                    this.sendCourseEffReq();
                    this.modifyCourseForm = {};
                } else if (resp.data.code === 20070) {
                    this.$message({
                        message: '修改课程失败',
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
        async delCourse(index) {
            try {
                const resp = await authAxios.post(API_URL + '/sched/del', {
                    uid: this.user.uid,
                    courseId: this.courses[index].courseId
                });
                if (resp.data.code === 20061) {
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    this.sendCourseEffReq();
                } else if (resp.data.code === 20060) {
                    this.$message({
                        message: '删除课程失败',
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
        normalSort(o1, o2) {
            const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            const o1Index = daysOfWeek.indexOf(o1.dayOfWeek);
            const o2Index = daysOfWeek.indexOf(o2.dayOfWeek);
            if (o1Index !== o2Index) {
                return o1Index - o2Index;
            }
            const o1Time = o1.time.split(' - ')[0].replace(':', '');
            const o2Time = o2.time.split(' - ')[0].replace(':', '');
            return o1Time - o2Time;
        }
    }
};
export default options;
</script>