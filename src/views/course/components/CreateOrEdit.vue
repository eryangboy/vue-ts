<template>
  <div class="course-create-edit">
    <el-card>
      <div slot="header">
        <el-steps :active="activeStep" simple>
          <el-step
            v-for="(item, index) in steps"
            :key="index"
            :title="item.title"
            :icon="item.icon"
            @click.native="activeStep = index"
          ></el-step>
        </el-steps>
      </div>
      <el-form>
        <div v-show="activeStep === 0">
          <el-form-item label="课程名称" label-width="80px">
            <el-input v-model="course.courseName"></el-input>
          </el-form-item>
          <el-form-item label="课程简介" label-width="80px">
            <el-input v-model="course.brief"></el-input>
          </el-form-item>
          <el-form-item label="课程概述" label-width="80px">
            <el-input
              type="textarea"
              v-model="course.previewFirstField"
              style="margin-bottom:10px"
              placeholder="概述1"
            ></el-input>
            <el-input
              type="textarea"
              v-model="course.previewSecondField"
              placeholder="概述2"
            ></el-input>
          </el-form-item>
          <el-form-item label="讲师姓名" label-width="80px">
            <el-input v-model="course.teacherDTO.teacherName"></el-input>
          </el-form-item>
          <el-form-item label="讲师简介" label-width="80px">
            <el-input v-model="course.teacherDTO.description"></el-input>
          </el-form-item>
          <el-form-item label="课程排序" label-width="80px">
            <el-input-number v-model="course.sortNum"></el-input-number>
          </el-form-item>
        </div>
        <div v-show="activeStep === 1">
          <el-form-item label="课程封面">
            <course-image v-model="course.courseListImg" />
          </el-form-item>
          <el-form-item label="介绍封面">
            <course-image v-model="course.courseImgUrl" />
          </el-form-item>
        </div>
        <div v-show="activeStep === 2">
          <el-form-item label="售卖价格" label-width="80px">
            <el-input type="number" v-model="course.discounts">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="商品原价" label-width="80px">
            <el-input type="number" v-model="course.price">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="销量" label-width="80px">
            <el-input type="number" v-model="course.sales">
              <template slot="append">单</template>
            </el-input>
          </el-form-item>
          <el-form-item label="活动标签" label-width="80px">
            <el-input :maxlength="4" v-model="course.discountsTag"> </el-input>
          </el-form-item>
        </div>
        <div v-show="activeStep === 3">
          <el-form-item label="限时秒杀开关" label-width="120px">
            <el-switch
              v-model="course.activityCourse"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
          </el-form-item>
          <template v-if="course.activityCourse">
            <el-form-item label="开始时间" label-width="120px">
              <el-date-picker
                v-model="course.activityCourseDTO.beginTime"
                type="date"
                placeholder="选择日期"
                value-format="YYYY-MM-DD"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间" label-width="120px">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="course.activityCourseDTO.endTime"
                value-format="YYYY-MM-DD"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="秒杀价" label-width="120px">
              <el-input v-model="course.activityCourseDTO.amount" type="number">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item label="秒杀库存" label-width="120px">
              <el-input v-model="course.activityCourseDTO.stock" type="number">
                <template slot="append">个</template>
              </el-input>
            </el-form-item>
          </template>
        </div>
        <div v-show="activeStep === 4">
          <el-form-item label="课程详情" label-width="80px">
            <text-editor v-model="course.courseDescriptionMarkDown" />
          </el-form-item>

          <el-form-item label="是否发布" label-width="80px">
            <el-switch
              v-model="course.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
            >
            </el-switch>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handelSave">保存</el-button>
          </el-form-item>
        </div>
        <el-form-item
          v-if="activeStep >= 0 && activeStep < 4"
          label-width="80px"
        >
          <el-button type="primary" @click="activeStep++">下一步</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import moment from "moment";
import CourseImage from "./CourseImage.vue";
import TextEditor from "@/components/TextEditor/index.vue";
import { saveOrUpdateCourse, getCourseById } from "@/services/course";

export default Vue.extend({
  name: "CourseCreateOrEdit",
  components: {
    CourseImage,
    TextEditor,
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
    courseId: {
      type: [String, Number],
    },
  },
  data() {
    return {
      activeStep: 0,
      steps: [
        { title: "基本信息", icon: "el-icon-edit" },
        { title: "课程封面", icon: "el-icon-edit" },
        { title: "销售信息", icon: "el-icon-edit" },
        { title: "秒杀活动", icon: "el-icon-edit" },
        { title: "课程详情", icon: "el-icon-edit" },
      ],
      imageUrl: "", // 预览图片地址
      isSeckill: false, // 是否开启秒杀,
      course: {
        courseName: "",
        brief: "",
        teacherDTO: {
          courseId: 0,
          teacherName: "",
          teacherHeadPicUrl: "",
          position: "",
          description: "",
        },
        courseDescriptionMarkDown: "",
        price: 0,
        discounts: 0,
        priceTag: "",
        discountsTag: "",
        isNew: true,
        isNewDes: "",
        courseListImg: "",
        courseImgUrl: "",
        sortNum: 0,
        previewFirstField: "",
        previewSecondField: "",
        status: 1,
        sales: 0,
        activityCourse: true,
        activityCourseDTO: {
          courseId: 0,
          beginTime: "",
          endTime: "",
          amount: 0,
          stock: 0,
        },
        autoOnlineTime: "",
      },
    };
  },
  created() {
    if (this.isEdit) {
      this.getCourse();
    }
  },
  methods: {
    //  获取课程信息
    async getCourse() {
      const { data } = await getCourseById(this.courseId);
      if (data.code === "000000") {
        const { activityCourseDTO } = data.data;
        if (activityCourseDTO) {
          activityCourseDTO.beginTime = moment(
            activityCourseDTO.beginTime
          ).format("YYYY-MM-DD");
          activityCourseDTO.endTime = moment(activityCourseDTO.endTime).format(
            "YYYY-MM-DD"
          );
        }

        this.course = data.data;
      }
    },

    // 保存信息
    async handelSave() {
      const { data } = await saveOrUpdateCourse(this.course);
      if (data.code === "000000") {
        this.$message.success("保存成功");
        this.$router.back();
      } else {
        this.$message.error("保存失败");
      }
    },
  },
});
</script>

<style lang="less" scoped>
.el-step {
  cursor: pointer;
}
</style>
