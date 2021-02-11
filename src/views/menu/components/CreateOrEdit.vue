<template>
  <div class="menu-create">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ isEdit ? "编辑菜单" : "添加菜单" }}</span>
      </div>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="菜单路径" prop="href">
          <el-input v-model="form.href"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单" prop="parentId">
          <el-select v-model="form.parentId" placeholder="请选择上级菜单">
            <el-option :value="-1" label="无上级菜单"></el-option>
            <el-option
              v-for="item in parentMenuList"
              :label="item.name"
              :value="item.id"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description"></el-input>
        </el-form-item>
        <el-form-item label="前端图标" prop="icon">
          <el-input v-model="form.icon"></el-input>
        </el-form-item>
        <el-form-item label="是否显示" prop="shown">
          <el-radio-group v-model="form.shown">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序" prop="orderNum">
          <el-input-number v-model="form.orderNum"></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">提交</el-button>
          <el-button v-if="!isEdit" @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Form } from "element-ui";
import { createOrUpdateMenu, getEditMenuInfo } from "@/services/menu";

export default Vue.extend({
  name: "MenuEdit",
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      form: {
        parentId: -1,
        name: "",
        href: "",
        icon: "",
        orderNum: 0,
        description: "",
        shown: false,
      },
      parentMenuList: [], // 父级菜单列表
    };
  },
  created() {
    this.getEditMenuInfo();
  },
  methods: {
    async getEditMenuInfo() {
      const { data } = await getEditMenuInfo(this.$route.params.id || -1);
      if (data.code === "000000") {
        if (data.data.menuInfo) {
          this.form = data.data.menuInfo;
        }
        this.parentMenuList = data.data.parentMenuList;
      }
    },
    async onSubmit() {
      // 1. 表单验证
      // 2. 验证通过，提交表单数据
      const { data } = await createOrUpdateMenu(this.form);
      if (data.code === "000000") {
        this.$message.success("提交成功");
        this.$router.back();
      } else {
        this.$message.error(data.mesg);
      }
    },
    onReset() {
      (this.$refs.form as Form).resetFields();
    },
  },
});
</script>

<style lang="less"></style>
