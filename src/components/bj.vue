<template>
  <el-dialog v-model="cover" title="更换背景" width="300" center>
    <el-upload
      ref="uploadInstance"
      class="avatar-uploader"
      action="https://api3638.wagu.vip/user/changeUseBj"
      :show-file-list="false"
      style="display: flex; justify-content: center; align-items: center"
      :limit="1"
      :data="{ id: user.id }"
      :on-success="success"
    >
      <el-icon class="avatar-uploader-icon"><Plus /></el-icon>
    </el-upload>
  </el-dialog>
</template>

<script setup>
import { reactive, ref, defineComponent, defineEmits } from "vue";
import Cookies from "js-cookie";
import axios from "axios";
const user = JSON.parse(Cookies.get("user"));
import { ElDialog, ElMessage } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
const cover = ref(false);
const changeCover = () => {
  cover.value = !cover.value;
};
const uploadInstance = ref();
const emit = defineEmits(["upload"]);
const success = (res, instance) => {
  uploadInstance.value.clearFiles();
  ElMessage.success("上传成功");
  changeCover();
  emit("upload", res);
};

defineExpose({
  changeCover,
});
</script>

<style scoped>
</style>