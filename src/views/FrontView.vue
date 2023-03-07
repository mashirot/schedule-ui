
<template>
    <div>
        <el-container style="height: 100vh;">
            <el-header>
                <div class="headerTitle">Schedule</div>
            </el-header>
            <el-main>
                <router-view />
            </el-main>
        </el-container>
    </div>
</template>
<style>
.headerTitle {
    flex: 1;
    text-align: center;
}

.outsider {
    display: flex;
    justify-content: center;
    align-items: center;
    /* height: 100%; */
}
</style>
