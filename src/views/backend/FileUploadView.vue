<template>
    <div>
        <el-upload class="upload" ref="upload" accept="txt" drag :on-success="handleFileUploadSuccess"
            :on-error="handleFileUploadFailed" :headers="{ Authorization: this.$store.state.authToken }" :action="uploadUrl"
            :limit="1" :multiple="false" name="courseFile" :data="subData">
            <i class="el-icon-upload" slot="trigger"></i>
            <div class="el-upload__text" slot="trigger"><em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传txt文件, 且不超过500kb</div>
        </el-upload>
    </div>
</template>
<script>
import API_URL from '@/api';

const options = {
    computed: {
        uploadUrl() {
            return `${API_URL}/sched/file`
        }
    },
    mounted: function () {
        this.initUid();
    },
    data() {
        return {
            subData: {
                uid: ''
            },
        }
    },
    methods: {
        initUid() {
            this.subData.uid = localStorage.getItem('uid');
        },
        handleFileUploadSuccess(resp) {
            if (resp.code === 30051) {
                this.$message.success("文件解析成功");
            } else if (resp.code === 30050) {
                this.$message.warning("文件解析失败, 请检查格式");
            } else if (resp.data.code === 10000) {
                this.$message.warning('登录过期，请重新登陆');
                this.$router.push('/');
                return;
            }
        },
        handleFileUploadFailed() {
            this.$message.error('Server Err');
        }
    }
}
export default options;
</script>