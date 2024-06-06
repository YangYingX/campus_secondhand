<template>
  <el-dialog v-model="dialogVisible" title="上传头像" width="550" center style="position: relative;">
    <div class="cropper">
      <vue-cropper
        ref="cropper"
        :img="option.img"
        :outputSize="option.outputSize"
        :outputType="option.outputType"
        :info="option.info"
        :canScale="option.canScale"
        :autoCrop="option.autoCrop"
        :autoCropWidth="option.autoCropWidth"
        :autoCropHeight="option.autoCropHeight"
        :fixedBox="option.fixedBox"
        :fixed="option.fixed"
        :fixedNumber="option.fixedNumber"
        :canMove="option.canMove"
        :canMoveBox="option.canMoveBox"
        :original="option.original"
        :centerBox="option.centerBox"
        :infoTrue="option.infoTrue"
        :full="option.full"
        :enlarge="option.enlarge"
        :mode="option.mode"
      >
      </vue-cropper>
    </div>
    <template #footer>
      <div class="dialog-footer" style="position: relative; top: 10px;">
        <el-button style="margin-right: 10px;"> <label class="btn" for="uploads">选择</label></el-button>
            <input type="file" id="uploads" style="position:absolute; clip:rect(0 0 0 0);" accept="image/png, image/jpeg, image/gif, image/jpg" @change="selectImg($event)">
            <el-button @click="get">确定</el-button>
            <el-button @click="upload">上传</el-button>
            <el-button @click="handleClose">取消</el-button>
      </div>
    </template>
    <div class="browse"><div class="shot_img"> <img v-show=url :src="url">  </div></div>

  </el-dialog>
</template>
  
  
  <script setup>
import { ref, defineComponent,defineEmits } from "vue";
import axios from 'axios'
import Cookies from "js-cookie";
const user = JSON.parse(Cookies.get("user"));
import {ElDialog,ElMessage } from 'element-plus'

const cropper = ref();
let url = ref('')

const emit = defineEmits(['upload'])

const get = () => {
    cropper.value.getCropData((data) => {
        url.value = data
  });
}

const handleClose = () => {
    changeCover()
    url.value = ''
    option.value.img = ''
}

const upload = () => {
   if(url.value == ''){
        ElMessage.warning('请先确定选择的范围！')
        return
    }
    let info = {
        id : user.id,
        base64 : url.value
    }
    axios.post('https://api3638.wagu.vip/user/uploadShot',info).then(res => {
        emit('upload')
        changeCover()
    url.value = ''
    ElMessage.success(res.data.msg)
    option.value.img = ''
    }).catch(err => {
        console.log(err)
    })
   }


const option = ref({
  img: "", 
  outputSize: 1,
  outputType: "png", 
  info: true,
  canScale: false,
  autoCrop: true, 
  autoCropWidth: 150, 
  autoCropHeight: 150,
  fixedBox: false,
  fixed: false, 
  fixedNumber: [1, 1], 
  canMove: true, 
  canMoveBox: true,
  original: false, 
  centerBox: true,
  infoTrue: true, 
  full: true,
  enlarge: "1", 
  mode: "contain",
});

const dialogVisible = ref(false);
const previews = ref({})




const selectImg = (e) => {
    let file = e.target.files[0]
        if (!/\.(jpg|jpeg|png|JPG|PNG)$/.test(e.target.value)) {
          this.$message({
            message: '图片类型要求：jpeg、jpg、png',
            type: "error"
          });
          return false
        }
        let reader = new FileReader()
        reader.onload = (e) => {
          let data
          if (typeof e.target.result === 'object') {
            data = window.URL.createObjectURL(new Blob([e.target.result]))
          } else {
            data = e.target.result
          }
          option.value.img = data
        }
        reader.readAsDataURL(file)
}


const changeCover = () => {
  dialogVisible.value = !dialogVisible.value;
};




defineExpose({
  changeCover,
});
</script>
  
  <style lang="scss" scoped>
.cropper {
  width: 75%;
  height: 24.375rem;
  background-color: #f0f0f0;
  float:left;
}

.browse{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 24.375rem;
    background-color: #f0f0f0;
    .shot_img{
        width: 7rem;
        height: 7rem;
        background-color: #fff;
        border-radius: 100%;
        img{
            width: 100%;
            height:100%;
            border-radius: 100%;
        }
    }
}


</style>
  