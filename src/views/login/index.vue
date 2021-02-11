<template>
  <div class="login">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="80px"
      label-position="top"
      class="login-form"
    >
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :loading="isLoginLoading"
          class="login-btn"
          @click="onSubmit"
          >登录</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Form } from "element-ui";
import { login } from "@/services/user";

export default Vue.extend({
  data() {
    return {
      form: {
        phone: "18201288771",
        password: "111111",
      },
      rules: {
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            pattern: /^1\d{10}$/,
            message: "请输入正确的手机号",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            pattern: /^(\w){6,20}$/,
            message: "请输入正确的密码(包含6-20个字母、数字、下划线 )",
            trigger: "blur",
          },
        ],
      },
      isLoginLoading: false,
    };
  },
  methods: {
    async onSubmit() {
      try {
        // 1. 表单验证
        await (this.$refs.form as Form).validate();

        // 登录按钮 loading
        this.isLoginLoading = true;

        // 2. 验证通过，提交表单
        const { data } = await login(this.form);

        // 3. 处理请求结果
        if (data.state !== 1) {
          this.$message.error(data.message);
        } else {
          // 登录成功，记录登录状态
          this.$store.commit("setUser", data.content);

          this.$router.push((this.$route.query.redirect as string) || "/");

          this.$message.success("登录成功");
        }
      } catch (error) {
        console.log("登录失败", error);
      }

      this.isLoginLoading = false;
    },
  },
});
</script>

<style lang="less" scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;

  .login-form {
    padding: 20px;
    width: 300px;
    background: #fff;
    border-radius: 5px;
  }

  .login-btn {
    width: 100%;
  }
}
</style>
