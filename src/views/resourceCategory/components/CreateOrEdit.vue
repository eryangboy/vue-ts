<template>
  <div class="resource-create-edit">
    <el-dialog
      :title="isEdit ? '编辑分类' : '添加分类'"
      :visible="true"
      width="40%"
      :show-close="false"
    >
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item label="名称" prop="name" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort" :label-width="formLabelWidth">
          <el-input v-model="form.sort" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Form } from "element-ui";
import {
  saveOrUpdateResourceCategory,
  getResourceCategories,
} from "@/services/resouce";

export default Vue.extend({
  name: "resourceCategoryCreateOrEdit",
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
    currentEditResource: {
      type: Object,
    },
  },
  data() {
    return {
      form: {
        name: "",
        sort: "0",
      },
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        sort: [{ required: true, message: "请输入排序", trigger: "blur" }],
      },
      formLabelWidth: "120px",
    };
  },
  async created() {
    if (this.isEdit && this.currentEditResource) {
      const { data } = await getResourceCategories();
      if (data.code === "000000") {
        const current = data.data.find(
          (v: any) => v.id === this.currentEditResource.id
        );
        console.log(current);
        this.form = current;
      }
    }
  },
  methods: {
    // 提交表单
    async handleSubmit() {
      try {
        // 校验表单
        await (this.$refs.form as Form).validate();

        // 提交表单
        const { data } = await saveOrUpdateResourceCategory(this.form);
        if (data.code === "000000") {
          this.$message.success(this.isEdit ? "编辑成功" : "添加成功");
        } else {
          this.$message.error(data.mesg);
        }

        // 关闭弹框
        this.$emit("handleChangeVisible", false);

        // 重新获取列表数据
        this.$emit("getResourceCategories");
      } catch (error) {
        console.log("新建或修改资源分类error");
      }
    },

    // 取消提交
    handleCancel() {
      this.$emit("handleChangeVisible", false);
    },
  },
});
</script>

<style lang="less" scoped>
.el-form {
  margin-right: 50px;
}
</style>
