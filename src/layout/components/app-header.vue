<template>
  <div class="header">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
    <el-dropdown>
      <span class="el-dropdown-link">
        <el-avatar
          shape="square"
          :size="40"
          :src="userInfo.portrait || require('@/assets/default-avatar.png')"
        ></el-avatar>
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>{{ userInfo.userName }}</el-dropdown-item>
        <el-dropdown-item divided @click.native="handleLogout"
          >退出</el-dropdown-item
        >
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { getUserInfo } from "@/services/user";

export default Vue.extend({
  name: "AppHeader",
  data() {
    return {
      userInfo: {},
    };
  },
  created() {
    this.getUserInfo();
  },
  methods: {
    async getUserInfo() {
      const { data } = await getUserInfo();
      if (data.state === 1) {
        this.userInfo = data.content;
      } else {
        console.log("获取用户信息失败");
      }
    },
    async handleLogout() {
      this.$confirm("确定退出吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 清除用户信息
          this.$store.commit("setUser", null);

          // 跳转至登录页面
          this.$router.push({
            name: "login",
          });

          this.$message({
            type: "success",
            message: "退出成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消退出",
          });
        });
    },
  },
});
</script>

<style lang="less" scoped>
.header {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .el-dropdown-link {
    display: flex;
    align-items: center;
  }
}
</style>
