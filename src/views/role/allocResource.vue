<template>
  <div class="alloc-resource">
    <el-card class="box-card">
      <div slot="header">分配资源</div>
      <el-tree
        ref="resource-tree"
        node-key="id"
        :data="resources"
        :props="defaultProps"
        :default-checked-keys="checkedKeys"
        :default-expanded-keys="defaultCheckedKeys"
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
import { getRoleResources, allocateRoleResources } from "@/services/resouce";

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
      resources: [],
      defaultProps: {
        children: "resourceList",
        label: "name",
      },
      checkedKeys: [],
      systemNodeFlag: false, // 解决回显时父节点和子节点都会被选中
    };
  },
  created() {
    this.getRoleResources();
  },
  methods: {
    // 获取角色拥有的菜单列表
    async getRoleResources() {
      this.systemNodeFlag = true;
      const { data } = await getRoleResources(this.roleId);
      if (data.code === "000000") {
        this.resources = data.data;
        this.getCheckedKeys(data.data);
        this.systemNodeFlag = false;
      }
    },

    // 获取选中的key
    getCheckedKeys(resources: any) {
      resources.forEach((resource: any) => {
        if (resource.selected) {
          this.checkedKeys = [...this.checkedKeys, resource.id] as any;
        }

        if (resource.resourceList) {
          this.getCheckedKeys(resource.resourceList);
        }
      });
    },

    // 保存
    async onSave() {
      const resourceIdList = (this.$refs[
        "resource-tree"
      ] as Tree).getCheckedKeys();
      const { data } = await allocateRoleResources({
        roleId: this.roleId,
        resourceIdList,
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
      (this.$refs["resource-tree"] as Tree).setCheckedKeys([]);
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
