<template>
    <el-dialog v-model="dialogFormVisible" title="发布商品" width="500">
    <el-form :model="form">
      <el-form-item label="商品名称" label-width="8.75rem">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="商品价格" label-width="8.75rem">
        <el-input v-model="form.price" type="number" autocomplete="off" />
      </el-form-item>
      <el-form-item label="商品类别" label-width="8.75rem">
        <el-select v-model="form.type" placeholder="请选择商品类别">
          <el-option label="家具与户外" value="1" />
          <el-option label="数码产品" value="2" />
          <el-option label="服装服饰" value="3" />
          <el-option label="其它" value="4" />
        </el-select>
      </el-form-item>
      <el-form-item label="商品描述" label-width="8.75rem">
            <el-input v-model="form.desc" autocomplete="off" />
      </el-form-item>
      <el-form-item label="商品图片" label-width="8.75rem">
        <el-upload
          class="upload-demo"
          action="https://api3638.wagu.vip/commodity/addCommodity"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          multiple
          accept = 'image/*'
          :limit="1"
          :on-exceed="handleExceed"
          :file-list="form.file"
          :auto-upload="false"
          ref="uploadImg"
          :data="form"
          :on-success="success"
          :before-upload="beforeUpload"
        >
          <el-button type="primary">点击上传</el-button>
          <template #tip>
            <div class="el-upload__tip">
              jpg/png files with a size less than 500kb.
            </div>
          </template>
        </el-upload>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="clear">取消</el-button>
        <el-button type="primary" @click="upload"> 确定</el-button>
      </div>
    </template>
  </el-dialog>    
</template>

<script setup>
import { reactive, ref, defineComponent, defineEmits } from "vue";
const dialogFormVisible = ref(false)
import { ElMessage } from 'element-plus'
const uploadImg = ref()
import axios from 'axios'
import Cookies from "js-cookie";
const user = JSON.parse(Cookies.get("user"));
const form = ref({
  userId : user.id,
  name: '',
  price : '',
  type : '',
  desc: '',
})

const emit = defineEmits(["upload"]);
const upload = () => {
    console.log(form.value)
    if (form.value.name == '' || form.value.price == '' || form.value.type == '' || form.value.desc == '') {
      ElMessage({
        message: '请填写完整信息',
        type: 'warning',
      })
      return
    }

    uploadImg.value.submit()
    axios.post('https://api3638.wagu.vip/commodity/addCommodity', form.value).then(res => {
         ElMessage({
                message: "上传成功",
                type: 'success',
            })
            form.value.name=''
            form.value.price=''
            form.value.type=''
            form.value.desc=''
            uploadImg.value.clearFiles();
            emit('upload')
    })
    dialogFormVisible.value = false
}

const clear = () => {
    form.value.name = ''
    form.value.price = ''
    form.value.type = ''
    form.value.desc = ''
    dialogFormVisible.value = false
}

const changeCover = () => {
    dialogFormVisible.value = !dialogFormVisible.value
}


defineExpose({
  changeCover,
});


</script>

<style lang="scss" scoped>

</style>