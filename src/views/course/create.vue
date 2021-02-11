<template>
  <div class="course-create">
    <create-or-edit />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import CreateOrEdit from "./components/CreateOrEdit.vue";

export default Vue.extend({
  name: "CourseCreate",
  components: {
    CreateOrEdit,
  },
});
</script>

<style lang="less" scoped></style>
