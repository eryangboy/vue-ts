<template>
  <div class="user-list">
    <el-card>
      <div slot="header">
        <el-form
          :inline="true"
          :model="form"
          ref="form"
          class="demo-form-inline"
        >
          <div>
            <el-form-item label="手机号" prop="phone">
              <el-input
                v-model="form.phone"
                placeholder="请输入手机号"
              ></el-input>
            </el-form-item>
            <el-form-item label="注册时间" prop="time">
              <el-date-picker
                v-model="form.time"
                type="daterange"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
              >
              </el-date-picker>
            </el-form-item>
          </div>
          <el-form-item>
            <el-button type="primary" @click="onSearch">查询</el-button>
            <el-button @click="onReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="users" style="width: 100%">
        <el-table-column prop="id" label="用户ID"> </el-table-column>
        <!-- <el-table-column prop="portrait" label="头像"> </el-table-column> -->
        <el-table-column prop="name" label="用户名"> </el-table-column>
        <el-table-column prop="phone" label="手机号"> </el-table-column>
        <el-table-column prop="createTime" label="注册时间"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleRole(scope.row)"
              >分配角色</el-button
            >
          </template></el-table-column
        >
      </el-table>
    </el-card>
    <el-dialog title="分配角色" :visible.sync="dialogVisible" width="40%">
      <el-select
        v-model="roleIdList"
        multiple
        placeholder="请选择"
        class="user-list-select"
      >
        <el-option
          v-for="item in roles"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAllocRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Form } from "element-ui";
import { getUserPages } from "@/services/user";
import {
  getAllRoles,
  allocateUserRoles,
  getCurrentUserRole,
} from "@/services/role";

export default Vue.extend({
  name: "UserList",
  data() {
    return {
      form: {
        phone: "",
        time: "",
      },
      users: [], // 用户列表
      roles: [], // 角色列表
      currentUser: null,
      dialogVisible: false,
      roleIdList: [],
    };
  },
  created() {
    this.getUserPages();
  },
  methods: {
    // 获取用户列表数据
    async getUserPages() {
      const { data } = await getUserPages({
        phone: this.form.phone,
        startCreateTime: this.form.time[0],
        endCreateTime: this.form.time[1],
      });
      if (data.code === "000000") {
        this.users = data.data.records;
      }
    },

    // 获取角色列表
    async getAllRoles() {
      const { data } = await getAllRoles();
      if (data.code === "000000") {
        this.roles = data.data;
      }
    },

    onSearch() {
      this.getUserPages();
    },
    onReset() {
      (this.$refs.form as Form).resetFields();
      this.getUserPages();
    },

    // 分配角色
    handleRole(item: any) {
      this.dialogVisible = true;
      this.currentUser = item;
      this.getAllRoles();
      this.getCurrentUserRole(item.id);
    },

    // 确定分配角色
    async handleAllocRole() {
      const { data } = await allocateUserRoles({
        userId: (this.currentUser as any).id,
        roleIdList: this.roleIdList,
      });

      if (data.code === "000000") {
        this.$message.success("分配成功");
        this.dialogVisible = false;
      } else {
        this.$message.error("分配失败");
      }
    },

    // 查询用户角色
    async getCurrentUserRole(userId: number) {
      const { data } = await getCurrentUserRole(userId);
      if (data.code === "000000") {
        this.roleIdList = data.data.map((v: any) => v.id);
      }
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

.user-list-select {
  min-width: 60%;
}
</style>
