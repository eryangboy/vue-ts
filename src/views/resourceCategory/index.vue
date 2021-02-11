<template
  ><div class="=resource-category">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-button @click="handleAdd">添加</el-button>
      </div>
      <el-table
        :data="resourceCategories"
        style="width: 100%;margin-bottom:20px"
      >
        <el-table-column type="index" label="编号" width="120px">
        </el-table-column>
        <el-table-column prop="name" label="名称"> </el-table-column>
        <el-table-column prop="createdTime" label="创建时间"> </el-table-column>
        <el-table-column prop="sort" label="排序"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="deleteResourceCategorie(scope.row)"
              >删除</el-button
            >
          </template></el-table-column
        >
      </el-table>
    </el-card>
    <create-or-edit
      v-if="visible"
      :isEdit="isEdit"
      :currentEditResource="currentEditResource"
      @handleChangeVisible="handleChangeVisible"
      @getResourceCategories="getResourceCategories"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import CreateOrEdit from "./components/CreateOrEdit.vue";
import {
  getResourceCategories,
  deleteResourceCategorie,
} from "@/services/resouce";

export default Vue.extend({
  components: { CreateOrEdit },
  name: "ResourceCategory",
  data() {
    return {
      resourceCategories: [],
      visible: false,
      isEdit: false,
      currentEditResource: null,
    };
  },
  created() {
    this.getResourceCategories();
  },
  methods: {
    // 获取资源分类列表数据
    async getResourceCategories() {
      const { data } = await getResourceCategories();
      if (data.code === "000000") {
        this.resourceCategories = data.data;
      }
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

    // 删除资源分类
    async deleteResourceCategorie(item: any) {
      this.$confirm("确认删除吗？", "删除提示", { type: "warning" })
        .then(async (res) => {
          const { data } = await deleteResourceCategorie(item.id);
          if (data.code === "000000") {
            this.$message.success("删除成功");
            this.getResourceCategories();
          } else {
            this.$message.error(data.mesg);
          }
        })
        .catch((err) => {
          this.$message.success("已取消删除");
        });
    },
  },
});
</script>

<style lang="less"></style>
