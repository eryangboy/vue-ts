<template>
  <div class="course-edit">
    <create-or-edit :isEdit="true" :courseId="courseId" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import CreateOrEdit from "./components/CreateOrEdit.vue";

export default Vue.extend({
  name: "CourseEdit",
  components: {
    CreateOrEdit,
  },
  props: {
    courseId: {
      type: [String, Number],
    },
  },
});
</script>

<style lang="less" scoped></style>
