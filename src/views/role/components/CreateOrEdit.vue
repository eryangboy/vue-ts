<template>
  <div class="role-create-edit">
    <el-form
      :model="form"
      ref="form"
      label-position="right"
      label-width="120px"
    >
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="form.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="角色编码" prop="sort">
        <el-input v-model="form.code" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input
          type="textarea"
          :rows="4"
          placeholder="请输入内容"
          v-model="form.description"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="$emit('cancel')">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { saveOrUpdateRole, getCurrentRole } from "@/services/role";

export default Vue.extend({
  name: "CreateOrEditRole",
  props: {
    roleId: {
      type: [Number, String],
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      form: {
        name: "",
        code: "",
        description: "",
      },
    };
  },
  created() {
    if (this.isEdit) {
      this.getCurrentRole();
    }
  },
  methods: {
    // 获取角色信息
    async getCurrentRole() {
      const { data } = await getCurrentRole(this.roleId);
      if (data.code === "000000") {
        this.form = data.data;
      }
    },

    // 确认提交
    async handleSubmit() {
      const { data } = await saveOrUpdateRole(this.form);
      if (data.code === "000000") {
        this.$message.success(this.isEdit ? "编辑成功" : "添加成功");
        this.$emit("success");
      } else {
        this.$message.error(data.mesg);
      }
    },
  },
});
</script>

<style lang="less" scope>
.el-form {
  margin-right: 50px;
}
</style>
