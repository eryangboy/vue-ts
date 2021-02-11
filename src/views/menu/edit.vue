<template>
  <div class="menu-create">
    <create-or-edit :is-edit="true" />
  </div>
</template>

<script>
import Vue from "vue";
import CreateOrEdit from "./components/CreateOrEdit";

export default Vue.extend({
  name: "MenuCreate",
  components: {
    CreateOrEdit,
  },
  data() {
    return {};
  },
});
</script>

<style></style>
