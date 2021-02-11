<template>
  <div class="role">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="输入搜索" prop="name">
            <el-input v-model="form.name" placeholder="角色名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSearch">查询</el-button>
            <el-button @click="onReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-row><el-button @click="handleAdd">添加角色</el-button> </el-row>
      <el-divider></el-divider>
      <el-table :data="roles" style="width: 100%">
        <el-table-column label="编号" prop="id" width="120px">
        </el-table-column>
        <el-table-column prop="name" label="角色名称"> </el-table-column>
        <el-table-column prop="description" label="描述"> </el-table-column>
        <el-table-column prop="createdTime" label="添加时间"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleMenu(scope.row)"
              >分配菜单</el-button
            >
            <el-button
              size="mini"
              type="primary"
              @click="handleResource(scope.row)"
              >分配资源</el-button
            >
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
    </el-card>
    <el-dialog
      :title="isEdit ? '编辑角色' : '添加角色'"
      :visible.sync="dialogVisible"
      width="40%"
    >
      <create-or-edit
        v-if="dialogVisible"
        :roleId="currentRoleId"
        :isEdit="isEdit"
        @success="onSuccess"
        @cancel="dialogVisible = false"
      />
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Form } from "element-ui";
import { getRolePages, deleteRole } from "@/services/role";
import CreateOrEdit from "./components/CreateOrEdit.vue";

export default Vue.extend({
  components: { CreateOrEdit },
  name: "Role",
  data() {
    return {
      form: {
        name,
      },

      roles: [],
      dialogVisible: false, // 控制添加/编辑角色的对话框显示和隐藏
      currentRoleId: null, // 当前需要修改的角色id
      isEdit: false, // 是否是编辑状态
    };
  },
  created() {
    this.getRolePages();
  },
  methods: {
    // 获取角色列表数据
    async getRolePages() {
      const { data } = await getRolePages({
        name: this.form.name,
      });
      if (data.code === "000000") {
        this.roles = data.data.records;
      }
    },

    // 查询角色
    onSearch() {
      this.getRolePages();
    },

    // 重置查询条件
    onReset() {
      (this.$refs.form as Form).resetFields();
      this.getRolePages();
    },

    // 添加角色
    handleAdd() {
      this.dialogVisible = true;
      this.isEdit = false;
    },

    // 编辑角色
    handleEdit(item: any) {
      this.dialogVisible = true;
      this.isEdit = true;
      this.currentRoleId = item.id;
    },

    // 创建角色成功
    onSuccess() {
      this.dialogVisible = false;
      this.getRolePages();
    },

    // 删除角色
    handleDelete(item: any) {
      this.$confirm("确认删除吗？", "删除提示", { type: "warning" })
        .then(async (res) => {
          const { data } = await deleteRole(item.id);
          if (data.code === "000000") {
            this.$message.success("删除成功");
            this.getRolePages();
          }
        })
        .catch((err) => {
          this.$message.success("已取消删除");
        });
    },

    // 分配菜单
    handleMenu(item: any) {
      this.$router.push({
        name: "alloc-menu",
        params: {
          roleId: item.id,
        },
      });
    },

    // 分配资源
    handleResource(item: any) {
      this.$router.push({
        name: "alloc-resource",
        params: {
          roleId: item.id,
        },
      });
    },
  },
});
</script>

<style lang="less" scoped>
.el-form {
  display: flex;
  justify-content: space-between;

  .el-input {
    width: 250px;
  }
}
</style>
