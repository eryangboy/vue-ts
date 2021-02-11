<template>
  <div class="course-section">
    <el-card>
      <div slot="header">课程名称</div>
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
            <el-button>编辑</el-button>
            <el-button>添加课时</el-button>
            <el-button>状态</el-button>
          </span>
          <span class="actions" v-else>
            <el-button>编辑</el-button>
            <el-button>上传视频</el-button>
            <el-button>状态</el-button>
          </span>
        </div>
      </el-tree>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {
  getSectionAndLesson,
  saveOrUpdateSection,
  saveOrUpdateLesson,
} from "@/services/course-section";

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
    };
  },
  created() {
    this.getSectionAndLesson();
  },
  methods: {
    async getSectionAndLesson() {
      const { data } = await getSectionAndLesson(this.courseId);
      if (data.code === "000000") {
        this.sections = data.data;
      }
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
        cons;
        this.$message.error("排序失败");
      }
    },
  },
});
</script>

<style lang="less" scoped>
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
