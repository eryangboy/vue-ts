<template>
  <div class="alloc-menu">
    <el-card class="box-card">
      <div slot="header">分配菜单</div>
      <el-tree
        ref="menu-tree"
        node-key="id"
        :data="menus"
        :props="defaultProps"
        :default-checked-keys="checkedKeys"
        :check-strictly="systemNodeFlag"
        show-checkbox
        default-expand-all
      ></el-tree>
      <div class="btn-group">
        <el-button @click="onReset">清空</el-button>
        <el-button type="primary" @click="onSave">保存</el-button>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Tree } from "element-ui";
import {
  getMenuNodeList,
  allocateRoleMenus,
  getRoleMenus,
} from "@/services/menu";

export default Vue.extend({
  name: "AllocMenu",
  props: {
    roleId: {
      type: [Number, String],
      required: true,
    },
  },
  data() {
    return {
      menus: [],
      defaultProps: {
        children: "subMenuList",
        label: "name",
      },
      checkedKeys: [],
      systemNodeFlag: false, // 解决回显时父节点和子节点都会被选中
    };
  },
  created() {
    this.getMenuNodeList();
    this.getRoleMenus();
  },
  methods: {
    // 获取所有菜单并按层级展示
    async getMenuNodeList() {
      const { data } = await getMenuNodeList();
      if (data.code === "000000") {
        this.menus = data.data;
      }
    },

    // 获取角色拥有的菜单列表
    async getRoleMenus() {
      this.systemNodeFlag = true;
      const { data } = await getRoleMenus(this.roleId);
      if (data.code === "000000") {
        this.getCheckedKeys(data.data);
        this.systemNodeFlag = false;
      }
    },

    // 获取选中的key
    getCheckedKeys(menus: any) {
      menus.forEach((menu: any) => {
        if (menu.selected) {
          this.checkedKeys = [...this.checkedKeys, menu.id] as any;
        }

        if (menu.subMenuList) {
          this.getCheckedKeys(menu.subMenuList);
        }
      });
    },

    // 保存
    async onSave() {
      const menuIdList = (this.$refs["menu-tree"] as Tree).getCheckedKeys();
      const { data } = await allocateRoleMenus({
        roleId: this.roleId,
        menuIdList,
      });
      if (data.code === "000000") {
        this.$message.success("保存成功");
        this.$router.back();
      } else {
        this.$message.error("保存失败");
      }
    },

    // 清空
    onReset() {
      (this.$refs["menu-tree"] as Tree).setCheckedKeys([]);
    },
  },
});
</script>

<style lang="less" scoped>
.btn-group {
  margin-top: 20px;
  text-align: center;
}
</style>
