<template>
  <div class="course-list">
    <el-card>
      <div slot="header">
        <el-form :inline="true" :model="form" ref="form">
          <div>
            <el-form-item label="课程名称" prop="courseName">
              <el-input
                v-model="form.courseName"
                placeholder="课程名称"
                style="width:300px"
              ></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-select v-model="form.status" placeholder="请选择">
                <el-option label="全部" value=""> </el-option>
                <el-option label="上架" value="1"> </el-option>
                <el-option label="下架" value="0"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSearch">查询</el-button>
              <el-button @click="onReset">重置</el-button>
            </el-form-item>
          </div>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-plus"
              @click="toCourseCreate"
              >新建课程</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="courses" style="width: 100%">
        <el-table-column prop="id" label="ID" width="180"> </el-table-column>
        <el-table-column prop="courseName" label="课程名称" width="180">
        </el-table-column>
        <el-table-column prop="price" label="价格">
          <template slot-scope="scope">
            <span>{{ "¥" + scope.row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="sortNum" label="排序"> </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
              :disabled="scope.row.isStatusLoading"
              @change="changeState(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="toCourseEdit(scope.row)"
              >编辑</el-button
            >
            <el-button size="mini" @click="tocourseSection(scope.row)"
              >内容管理</el-button
            >
          </template></el-table-column
        >
      </el-table>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Form } from "element-ui";
import { getQueryCourses, changeState } from "@/services/course";

export default Vue.extend({
  name: "CourseList",
  data() {
    return {
      form: { courseName: "", status: null },
      courses: [],
    };
  },
  created() {
    this.getQueryCourses();
  },
  methods: {
    async getQueryCourses() {
      const { data } = await getQueryCourses({
        courseName: this.form.courseName,
        status: this.form.status,
        currentPage: 0,
        pageSize: 1000,
      });

      if (data.code === "000000") {
        data.data.records.forEach((v: any) => (v.isStatusLoading = false));
        this.courses = data.data.records;
      }
    },

    // 查询
    onSearch() {
      this.getQueryCourses();
    },

    // 重置
    onReset() {
      (this.$refs.form as Form).resetFields();
      this.getQueryCourses();
    },

    // 课程上下架
    async changeState(course: any) {
      course.isStatusLoading = true;
      const { data } = await changeState({
        courseId: course.id,
        status: course.status,
      });
      if (data.code === "000000") {
        this.$message.success(`${course.status === 0 ? "下架" : "上架"}成功`);
      }
      course.isStatusLoading = false;
    },

    // 新建课程
    toCourseCreate() {
      this.$router.push({
        name: "course-create",
      });
    },

    // 编辑课程
    toCourseEdit(item: any) {
      this.$router.push({
        name: "course-edit",
        params: {
          courseId: item.id,
        },
      });
    },

    // 内容管理
    tocourseSection(item: any) {
      this.$router.push({
        name: "course-section",
        params: {
          courseId: item.id,
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
}
</style>
