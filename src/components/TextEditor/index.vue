<template>
  <div ref="editor" class="text-editor"></div>
</template>

<script lang="ts">
import Vue from "vue";
import E from "wangeditor";
import { uploadCourseImage } from "@/services/course";

export default Vue.extend({
  name: "TextEditor",
  props: {
    value: {
      type: String,
      default: "",
    },
  },
  mounted() {
    this.initEditor();
  },
  methods: {
    initEditor() {
      const editor = new E(this.$refs.editor as any);

      editor.config.onchange = (value: string) => {
        this.$emit("input", value);
      };

      editor.config.customUploadImg = async function(
        resultFiles: any,
        insertImgFn: any
      ) {
        // resultFiles 是 input 中选中的文件列表
        // insertImgFn 是获取图片 url 后，插入到编辑器的方法
        // 上传图片，返回结果，将图片插入到编辑器中
        const fd = new FormData();
        fd.append("file", resultFiles[0]);
        const { data } = await uploadCourseImage(fd);
        if (data.code === "000000") {
          insertImgFn(data.data.name);
        }
      };

      // 事件监听必须在create之前
      editor.create();

      // 设置初始化必须在create之后
      editor.txt.html(this.value);
    },
  },
});
</script>

<style lang="less" scoped></style>
