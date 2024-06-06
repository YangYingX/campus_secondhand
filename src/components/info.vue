<template>
     <el-dialog v-model="cover" title="编辑个人资料" width="500">
    <el-form :model="form">
      <el-form-item label="昵称" label-width="8.75rem">
        <el-input v-model="form.username" autocomplete="off" />
      </el-form-item>
      <el-form-item label="密码" label-width="8.75rem">
        <el-input v-model="form.password" autocomplete="off" placeholder="请郑重考虑修改密码" />
      </el-form-item>
      <el-form-item label="电话" label-width="8.75rem">
        <el-input v-model="form.phone" autocomplete="off" />
      </el-form-item>
      <el-form-item label="地址" label-width="8.75rem">
        <el-input v-model="form.address" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="clear">取消</el-button>
        <el-button type="primary" @click="end">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive, ref,defineComponent,defineEmits } from 'vue'
import Cookies from "js-cookie";
import axios from 'axios'
const user = JSON.parse(Cookies.get("user"));
import {ElDialog,ElMessage } from 'element-plus'

const cover = ref(false)

const changeCover = () => {
  cover.value = !cover.value
}

const emit = defineEmits(['upload'])

const form = ref({
  id : user.id,
  username: user.username,
  password: '',
  phone: '',
  address: '',
})

const clear = () => {
  changeCover()
  form.value.password = ''
  form.value.phone = ''
  form.value.address = ''
  console.log(user)
}

const end = () => {
  axios.post(`https://api3638.wagu.vip/user/changeUserInfo`,form.value).then(res=>{
    emit('upload')
    ElMessage.success(res.data)
    changeCover()
  form.value.password = ''
  form.value.phone = ''
  form.value.address = ''

  }).catch(err=>{
    ElMessage.error(err.response.data)
  })
}

defineExpose({
  changeCover,
});

</script>

<style lang="scss" scoped>

</style>