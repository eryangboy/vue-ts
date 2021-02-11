<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "App",
});
</script>

<style lang="less" scoped>
.text {
  color: @success-color;
}
</style>
