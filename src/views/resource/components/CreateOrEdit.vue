<template>
  <div class="resource-create-edit">
    <el-dialog
      :title="isEdit ? '编辑资源' : '添加资源'"
      :visible="true"
      width="40%"
      :show-close="false"
    >
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item
          label="资源名称"
          prop="name"
          :label-width="formLabelWidth"
        >
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="资源路径" prop="url" :label-width="formLabelWidth">
          <el-input v-model="form.url" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="资源分类"
          prop="categoryId"
          :label-width="formLabelWidth"
        >
          <el-select v-model="form.categoryId" placeholder="请选择">
            <el-option
              v-for="item in resourceCategories"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth">
          <el-input
            type="textarea"
            :rows="4"
            placeholder="请输入内容"
            v-model="form.description"
          >
          </el-input>
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
import { saveOrUpdateResource, getResource } from "@/services/resouce";

export default Vue.extend({
  name: "resourceCreateOrEdit",
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
    resourceCategories: {
      type: Array,
    },
    currentEditResource: {
      type: Object,
    },
  },
  data() {
    return {
      form: {
        name: "",
        url: "",
        categoryId: "",
        description: "",
      },
      rules: {
        name: [{ required: true, message: "请输入资源名称", trigger: "blur" }],
        url: [{ required: true, message: "请输入资源路径", trigger: "blur" }],
        categoryId: [
          { required: true, message: "请选择资源分类", trigger: "blur" },
        ],
      },
      formLabelWidth: "120px",
    };
  },
  async created() {
    if (this.isEdit && this.currentEditResource) {
      const { data } = await getResource(this.currentEditResource.id);
      if (data.code === "000000") {
        this.form = data.data;
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
        const { data } = await saveOrUpdateResource(this.form);
        if (data.code === "000000") {
          this.$message.success(this.isEdit ? "编辑成功" : "添加成功");
        } else {
          this.$message.error(data.mesg);
        }

        // 关闭弹框
        this.$emit("handleChangeVisible", false);

        // 重新获取列表数据
        this.$emit("getResources");
      } catch (error) {
        console.log("新建或修改表单error");
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
