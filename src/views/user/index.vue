<template>
  <div class="user">
    <list />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { component } from "vue/types/umd";
import List from "./components/List.vue";

export default Vue.extend({
  name: "UserIndex",
  components: {
    List,
  },
});
</script>

<style lang="scss" scoped></style>
