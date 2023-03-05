
import router from '@/router';

<template>
    <div>
        <el-container>
            <el-header>Schedule</el-header>
            <el-main>
                <router-view/>
            </el-main>
        </el-container>
    </div>
</template>
<style scoped>
.el-header,
.el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
}
</style>
