<template>
    <div>
        <div v-if="courses.length == 0">
            <el-empty description="暂无课程"></el-empty>
        </div>
        <div v-else>
            <el-table :data="courses" height="875" border style="width: 100%">
                <el-table-column prop="dayOfWeek" label="日期" width="180" align="center">
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
                <el-table-column prop="credit" label="学分" align="center">
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="editCourse(scope.$index, scope.row)">修改</el-button>
                        <el-button size="mini" type="danger" @click="delCourse(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
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
            }
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
        editCourse(index, row) {
            console.log(index, row);
        },
        delCourse(index, row) {
            console.log(index, row);
        }
    }
};
export default options;
</script>