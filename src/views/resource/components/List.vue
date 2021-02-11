<template>
  <div class="resouce-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form
          :inline="true"
          ref="form"
          :model="form"
          class="demo-form-inline"
        >
          <div>
            <el-form-item prop="name" label="资源名称">
              <el-input
                v-model="form.name"
                placeholder="请输入资源名称"
              ></el-input>
            </el-form-item>
            <el-form-item prop="url" label="资源路径">
              <el-input
                v-model="form.url"
                placeholder="请输入资源路径"
              ></el-input>
            </el-form-item>
            <el-form-item prop="categoryId" label="资源分类">
              <el-select
                v-model="form.categoryId"
                clearable
                placeholder="请选择活动区域"
              >
                <el-option
                  v-for="item in resourceCategories"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <el-form-item>
            <el-button type="primary" :disabled="isLoading" @click="onSubmit"
              >查询</el-button
            >
            <el-button :disabled="isLoading" @click="onReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-row
        ><el-button @click="handleAdd">添加</el-button>
        <el-button @click="toResourceCategory">资源分类</el-button></el-row
      >
      <el-divider></el-divider>
      <el-table
        :data="resouces"
        v-loading="isLoading"
        style="width: 100%;margin-bottom:20px"
      >
        <el-table-column type="index" label="编号" width="120px">
        </el-table-column>
        <el-table-column prop="name" label="资源名称"> </el-table-column>
        <el-table-column prop="url" label="资源路径"> </el-table-column>
        <el-table-column prop="description" label="描述"> </el-table-column>
        <el-table-column prop="createdTime" label="添加时间"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)"
              >删除</el-button
            >
          </template></el-table-column
        >
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="form.current"
        :page-sizes="[5, 10, 20, 100]"
        :page-size="form.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
        :disabled="isLoading"
      >
      </el-pagination>
    </el-card>
    <create-or-edit
      v-if="visible"
      :isEdit="isEdit"
      :resourceCategories="resourceCategories"
      :currentEditResource="currentEditResource"
      @handleChangeVisible="handleChangeVisible"
      @getResources="onSubmit"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import CreateOrEdit from "./CreateOrEdit.vue";
import {
  getResourceCategories,
  getResourcePages,
  deleteResource,
} from "@/services/resouce";
import { Form } from "element-ui";

export default Vue.extend({
  components: { CreateOrEdit },
  name: "ResourceList",
  data() {
    return {
      form: {
        name: "", // 资源名称
        url: "", // 资源路径
        categoryId: null, // 资源分类
        current: 1, // 当前第几页
        size: 10, // 每页展示几条数据
      },
      resouces: [],
      totalCount: 0,
      resourceCategories: [],
      isLoading: true,
      visible: false,
      isEdit: false,
      currentEditResource: null,
    };
  },
  created() {
    this.getResourceCategories();
    this.getResourcePages();
  },
  methods: {
    // 获取资源分类列表数据
    async getResourceCategories() {
      const { data } = await getResourceCategories();
      if (data.code === "000000") {
        this.resourceCategories = data.data;
      }
    },

    // 获取资源列表数据
    async getResourcePages() {
      this.isLoading = true;
      const { data } = await getResourcePages(this.form);
      if (data.code === "000000") {
        this.resouces = data.data.records;
        this.totalCount = data.data.total;
      }
      this.isLoading = false;
    },

    // 提交表单
    onSubmit() {
      this.form.current = 1;
      this.getResourcePages();
    },

    // 重置表单
    onReset() {
      (this.$refs.form as Form).resetFields();
      this.form.current = 1;
      this.getResourcePages();
    },

    // 改变每页条数
    handleSizeChange(val: number) {
      this.form.size = val;
      this.form.current = 1;
      this.getResourcePages();
    },

    // 改变当前页数
    handleCurrentChange(val: number) {
      this.form.current = val;
      this.getResourcePages();
    },

    // 改变资源弹框状态
    handleChangeVisible(state: boolean) {
      this.visible = state;
    },

    // 添加资源
    handleAdd() {
      this.handleChangeVisible(true);
      this.isEdit = false;
    },

    // 编辑资源
    handleEdit(data: any) {
      this.handleChangeVisible(true);
      this.isEdit = true;
      this.currentEditResource = data;
    },

    // 删除资源
    handleDelete(item: any) {
      this.$confirm("确认删除吗？", "删除提示", { type: "warning" })
        .then(async (res) => {
          const { data } = await deleteResource(item.id);
          if (data.code === "000000") {
            this.$message.success("删除成功");
            this.getResourcePages();
          }
        })
        .catch((err) => {
          this.$message.success("已取消删除");
        });
    },

    // 跳转至资源分类页面
    toResourceCategory() {
      this.$router.push({ name: "resourceCategory" });
    },
  },
});
</script>

<style lang="less" scoped>
.el-form {
  display: flex;
  justify-content: space-between;

  .el-input {
    margin-right: 30px;
    width: 250px;
  }
}
</style>
