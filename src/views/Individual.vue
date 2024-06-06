<template>
  <div class="individual">
    <div class="container">
      <div class="top">
        <div > <el-icon @click="$router.go(-1)"><ArrowLeftBold /></el-icon> </div>
        <img :src="user.bg" alt="">
        <div class="uploadBg" @click="uploadBj">
          <i class="iconfont icon-zhaoxiangji"></i> 上传
        </div>
        <div class="shot">
          <img :src="userInfo.shot" alt="" />
          <div class="cover" @click="uploadShot">
            <i class="iconfont icon-zhaoxiangji"></i>
          </div>
        </div>
        <div class="change"><button @click="uploadInfo">编辑个人信息</button></div>
      </div>
      <ul class="btm">
        <li class="upload" @click="uploadGoods">
            <div class="icon_upload"> <p>立即发布您的闲用二手</p> <p>+</p> </div>
        </li>
        <li class="lis" v-for="item in list" :key="item.id" @click="jump(item.id)">
            <div class="lis_top"><img :src="item.src" alt=""></div>
            <div class="lis_btm">
                <p class="name">{{ "名称:" + item.name}}</p>
                <p class="price">{{ "价格: RMB " + item.price}} </p>
                <p class="state">{{ "状态: " + item.state?"未出售":"已出售"}}</p>
            </div>
            <div class="dele"><Delete @click="dele(item.id)"/></div>            
        </li>
      
     
      </ul>
    </div>
    <shot ref="shotClick" @upload="get"/>
    <info ref="infoClick" @upload="get"></info>
    <bj ref="bjClick" @upload="bgClick"></bj>
    <goods ref="goodsClick" @upload="uplist"></goods>
</div>
</template>

<script setup>
import Cookies from "js-cookie";
import { ref, reactive, onMounted, computed, watch, onUpdated} from "vue";
import { ElMessage,ElMessageBox } from 'element-plus'
import { Plus,Delete,ArrowLeftBold } from '@element-plus/icons-vue'
import axios from 'axios'
let user = JSON.parse(Cookies.get("user"));
import { useRouter } from "vue-router";
const router = useRouter();

import shot from "../components/shot.vue";
import info from '../components/info.vue'
import bj from '../components/bj.vue'
import goods from '../components/goods.vue'

let userInfo = ref({})

const imageUrl = ref('')
let list = ref()

const jump = (id) => {
  router.push({
    path: "/details",
    query: {
      id: id,
    },
  });
};

onMounted(() => {
    get()
    getCommoditys()
})

const uplist = () => {
  setTimeout(()=>{
    getCommoditys()
  },1000)
}

const dele = (id) =>{
  ElMessageBox.confirm(
    '确定要删除吗?',
    '删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      axios.get(`https://api3638.wagu.vip/commodity/deleteCommodity?id=${id}`).then(res => {
        getCommoditys()
      })
      ElMessage({
        type: 'success',
        message: '删除成功',
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除',
      })
    })
}


const bgClick = (url) => {
  get()
  user.bg = url
}

const getCommoditys = ()=>{
   axios.get(`https://api3638.wagu.vip/commodity/getUserCommoditys?id=${user.id}`).then(res => {
        list.value = res.data
    })
}


const get = () => {
    axios.get(`https://api3638.wagu.vip/user/getUserInfo?id=${user.id}`).then(res => {
        userInfo.value = res.data
        Cookies.set("user", JSON.stringify(res.data))
    })
}
const beforeAvatarUpload = (rawFile) => {
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('Avatar picture must be JPG format!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('Avatar picture size can not exceed 2MB!')
    return false
  }
  return true
}


const shotClick = ref(null)
const infoClick = ref(null)
const bjClick = ref(null)
const goodsClick = ref(null)



const uploadShot = () => {
  shotClick.value.changeCover()
}
const uploadInfo = () => {
  infoClick.value.changeCover()
}
const uploadBj = () => {
  bjClick.value.changeCover()
}

const uploadGoods = () => {
  goodsClick.value.changeCover()
}

</script>



<style lang="scss" scoped>
@import url(../assets/icons/font_he0z9rbm28b/iconfont.css);
.individual {
  width: 100vw;
  height: auto;
  .container {
    width: 80%;
    height: auto;
    margin: auto;
    .top {
      width: 100%;
      height: 15rem;
      img{
        width: 100%;
        height: 100%;
      }
      position: relative;
      &:hover .uploadBg {
        opacity: 1;
      }
      &:hover .change {
        opacity: 1;
      }
      .change {
        position: absolute;
        right: 5%;
        bottom: 5%;
        opacity: 0;
        button {
          padding: 0.5rem 1.2rem;
          border: none;
          outline: none;
          border-radius: 0.5rem;
          background: #066eff;
          color: white;
          cursor: pointer;
          font-size: 0.8rem;
        }
      }
      .uploadBg {
        width: 4.5rem;
        height: 2rem;
        background: #f2f2f2;
        position: absolute;
        border-radius: 0.3rem;
        right: 15%;
        bottom: 5%;
        display: flex;
        justify-content: center;
        align-items: center;
        opacity: 0;
        cursor: pointer;
      }
      .shot {
        width: 8rem;
        height: 8rem;
        background: #066eff;
        position: absolute;
        bottom: -20%;
        left: 5%;
        border-radius: 100%;
        box-shadow: 0 0 0.1rem 0.1rem white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 3rem;
        color: white;
        img {
          width: 90%;
          height: 90%;
          border-radius: 100%;
        }
        &:hover .cover {
          opacity: 1;
        }
        .cover {
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          border-radius: 100%;
          position: absolute;
          top: 0;
          left: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: all 0.5s;
          i {
            font-size: 2.5rem;
            color: white;
          }
        }
      }
    }
    .btm {
      width: 100%;
      height: 30rem;
      display: flex;
      margin-top: 4rem;
      overflow: hidden;
      display: flex;
      gap: 2%;
      list-style: none;
      flex-wrap: wrap;
      overflow-y: auto;
      li{
        width: 21%;
        height: 50%;
        .icon_upload{
          width:100%;
          height:100%;
          text-align: center;
          border: 1px dashed #cec9c9;
          border-radius: .5rem;
          cursor: pointer;
          font-size:3rem;
          color: #cec9c9;
          i{
            font-size: 3rem;
            color: #066eff;
          }
          &:hover{
            border: 1px dashed #066eff;
            color: #066eff;
          }
          p:nth-of-type(1){
            font-size: 1.2rem;
            padding-top: 3rem;
          }

        }
       
      }
      .lis{ 
        width: 21%;
        height: 50%;
        box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
        border-radius: .5rem;
        position: relative;
        .dele{
          position: absolute;
          right: .5rem;
          top: 1rem;
          width: 1rem;
          height: 1rem;
          border-radius: 0 0.5rem 0 0.5rem;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
        }
        .lis_top{
            width: 100%;
            height: 60%;
            display: flex;
            justify-content: center;
            align-items: center;
            img{
                width:80%;
                height:100%;
            }
        }
        .lis_btm{
            width: 100%;
            height: 40%;
            padding-left: .5rem;
            padding-top: .5rem;
            .name{

            }
            .price{
                margin: .2rem 0;
            }
        }
      }
    }
  }
}
</style>

<style scoped>
.avatar-uploader .avatar {
  width: 16rem;
  height: 15rem;
  display: block;
}
.el-icon.avatar-uploader-icon{
    width: 16rem;
    height: 15rem;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>