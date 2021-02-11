<template>
  <div class="course-section">
    <el-card>
      <div slot="header" class="header">
        <span>课程名称：{{ courseName }}</span>
        <el-button type="primary" icon="el-icon-plus" @click="addSection"
          >添加阶段</el-button
        >
      </div>
      <el-tree
        :data="sections"
        :props="defaultProps"
        draggable
        :allow-drop="handleAllowDrop"
        @node-drop="handleSort"
      >
        <div slot-scope="{ node, data }" class="inner">
          <span>{{ node.label }}</span>
          <span class="actions" v-if="data.sectionName">
            <el-button @click="editSection(data)">编辑</el-button>
            <el-button @click="addLesson(data)">添加课时</el-button>
            <el-button @click="changeStatus(data)">{{
              getStatus(data.status)
            }}</el-button>
          </span>
          <span class="actions" v-else>
            <el-button @click="editLesson(data)">编辑</el-button>
            <el-button @click="toCourseViedo">上传视频</el-button>
            <el-button @click="changeStatus(data)">{{
              getStatus(data.status)
            }}</el-button>
          </span>
        </div>
      </el-tree>
    </el-card>
    <el-dialog title="章节信息" :visible.sync="sectionVisible" width="40%">
      <el-form>
        <el-form-item label="课程名称" label-width="80px">
          <el-input :disabled="true" v-model="courseName"></el-input>
        </el-form-item>
        <el-form-item label="章节名称" label-width="80px">
          <el-input v-model="sectionForm.sectionName"></el-input>
        </el-form-item>
        <el-form-item label="章节描述" label-width="80px">
          <el-input
            type="textarea"
            v-model="sectionForm.description"
          ></el-input>
        </el-form-item>
        <el-form-item label="章节排序" label-width="80px">
          <el-input type="number" v-model="sectionForm.orderNum"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="sectionVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveSection">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="课时基本信息" :visible.sync="lessonVisible" width="40%">
      <el-form>
        <el-form-item label="课程名称" label-width="100px">
          <el-input :disabled="true" v-model="courseName"></el-input>
        </el-form-item>
        <el-form-item label="章节名称" label-width="100px">
          <el-input :disabled="true" v-model="sectionName"></el-input>
        </el-form-item>
        <el-form-item label="课时名称" label-width="100px">
          <el-input type="textarea" v-model="lessonForm.theme"></el-input>
        </el-form-item>
        <el-form-item label="时长" label-width="100px">
          <el-input type="number" v-model="lessonForm.duration">
            <template slot="append">分钟</template></el-input
          >
        </el-form-item>
        <el-form-item label="是否开放试听" label-width="100px">
          <el-switch
            v-model="lessonForm.isFree"
            active-color="#13ce66"
            inactive-color="#ff4949"
          >
          </el-switch>
        </el-form-item>
        <el-form-item label="课时排序" label-width="100px">
          <el-input type="number" v-model="lessonForm.orderNum"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="lessonVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveLesson">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="statusVisible" width="40%">
      <p style="padding-left:37px">
        当前状态：{{ getStatus(currentStatusItem.status) }}
      </p>
      <el-form>
        <el-form-item label="状态变更为" label-width="120px">
          <el-select v-model="currentStatusItem.status" placeholder="请选择">
            <el-option
              v-for="item in lessonStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="statusVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveStatus">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {
  getSectionAndLesson,
  saveOrUpdateSection,
  saveOrUpdateLesson,
  getBySectionId,
} from "@/services/course-section";
import { getCourseById } from "@/services/course";

export default Vue.extend({
  name: "Section",
  props: {
    courseId: {
      type: [Number, String],
      required: true,
    },
  },
  data() {
    return {
      sections: [],
      defaultProps: {
        children: "lessonDTOS",
        label(data: any) {
          return data.sectionName || data.theme;
        },
      },
      sectionVisible: false, // 课程章节显示状态
      courseName: "",
      sectionForm: {
        sectionName: "",
        description: "",
        orderNum: 0,
        status: 0,
      },
      lessonVisible: false, // 课时显示状态
      sectionName: "",
      lessonForm: {
        theme: "",
        duration: 0,
        isFree: true,
        orderNum: 0,
        status: 0,
      },
      lessonStatus: [
        {
          label: "已隐藏",
          value: 0,
        },
        {
          label: "待更新",
          value: 1,
        },
        {
          label: "已更新",
          value: 2,
        },
      ],
      statusVisible: false,
      currentStatusItem: {},
    };
  },
  created() {
    this.getCourseById();
    this.getSectionAndLesson();
  },
  computed: {
    getStatus() {
      return (type: number | string) => {
        const item = this.lessonStatus.find((v) => v.value == type);
        return item && item.label;
      };
    },
  },
  methods: {
    // 获取课程内容
    async getCourseById() {
      const { data } = await getCourseById(this.courseId);
      if (data.code === "000000") {
        this.courseName = data.data.courseName;
      }
    },

    // 获取章节列表
    async getSectionAndLesson() {
      const { data } = await getSectionAndLesson(this.courseId);
      if (data.code === "000000") {
        this.sections = data.data;
      }
    },

    // 保存课程章节
    async saveSection() {
      const { data } = await saveOrUpdateSection(this.sectionForm);
      if (data.code === "000000") {
        this.sectionVisible = false;
        this.$message.success("保存成功");
        this.getSectionAndLesson();
      } else {
        this.$message.error("保存失败");
      }
    },

    // 添加课程章节
    addSection() {
      this.sectionVisible = true;
      this.sectionForm = {
        sectionName: "",
        description: "",
        orderNum: 0,
        status: 0,
      };
    },

    // 编辑课程章节
    editSection(item: any) {
      this.sectionForm = item;
      this.sectionVisible = true;
    },

    // 保存课时信息
    async saveLesson() {
      const { data } = await saveOrUpdateLesson(this.lessonForm);
      if (data.code === "000000") {
        this.lessonVisible = false;
        this.$message.success("保存成功");
        this.getSectionAndLesson();
      } else {
        this.$message.error("保存失败");
      }
    },

    // 添加课时信息
    addLesson(item: any) {
      this.lessonVisible = true;
      this.sectionName = item.sectionName;
      this.lessonForm = {
        theme: "",
        duration: 0,
        isFree: true,
        orderNum: 0,
        status: 0,
      };
    },

    // 编辑课时信息
    editLesson(item: any) {
      console.log(item);
      this.getBySectionId(item.sectionId);
      this.lessonForm = item;
      this.lessonVisible = true;
    },

    // 获取课程单个章节内容
    async getBySectionId(sectionId: number | string) {
      const { data } = await getBySectionId(sectionId);
      if (data.code === "000000") {
        this.sectionName = data.data.sectionName;
      }
    },

    // 改变课时状态
    changeStatus(item: any) {
      this.currentStatusItem = item;
      this.statusVisible = true;
    },

    // 更新课时状态
    async saveStatus() {
      if ((this.currentStatusItem as any).sectionName) {
        // 章节
        await saveOrUpdateSection(this.currentStatusItem);
      } else {
        // 课时
        await saveOrUpdateLesson(this.currentStatusItem);
      }
      this.$message.success("更新成功");
      this.statusVisible = false;
    },

    // 拖拽节点处理
    handleAllowDrop(draggingNode: any, dropNode: any, type: any) {
      return (
        draggingNode.data.sectionId === dropNode.data.sectionId &&
        type !== "inner"
      );
    },

    // 节点排序
    async handleSort(drag: any, drop: any, type: any, event: any) {
      try {
        await Promise.all(
          drop.parent.childNodes.map((item: any, index: number) => {
            if (drag.data.lessonDTOS || drag.data.sectionName) {
              // 阶段
              return saveOrUpdateSection({
                id: item.data.id,
                orderNum: index + 1,
              });
            } else {
              // 课时
              return saveOrUpdateLesson({
                id: item.data.id,
                orderNum: index + 1,
              });
            }
          })
        );
        this.$message.success("排序成功");
      } catch (error) {
        this.$message.error("排序失败");
      }
    },

    // 上传视频
    toCourseViedo(item: any) {
      this.$router.push({
        name: "course-video",
        params: {
          courseId: this.courseId.toString(),
        },
      });
    },
  },
});
</script>

<style lang="less" scoped>
.header {
  display: flex;
  justify-content: space-between;
}

.inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
}

::v-deep .el-tree-node__content {
  margin: 8px 0;
  height: auto;
}
</style>
