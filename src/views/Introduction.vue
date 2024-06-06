<template>
  <div class="individual">
    <div class="container">
      <div class="top">
        <div>
          <el-icon @click="$router.go(-2)"><ArrowLeftBold /></el-icon>
        </div>
        <img :src="userInfo.bg" alt="" />
        <div class="shot">
          <img :src="userInfo.shot" alt="" />
        </div>
        <div class="num">
        <p @click.stop="change()"> {{ "粉丝数: " + followersNum }}</p>
          
        </div>
        <div class="type">
          <p>{{ "好评数:" + product.goodCount }}</p>
          <p>{{ "中评数:" + product.mediumCount }}</p>
          <p>{{ "差评数:" + product.badCount }}</p>
        </div>
      </div>
      <ul class="btm">
        <li
          class="lis"
          v-for="item in list"
          :key="item.id"
          @click="jump(item.id)"
        >
          <div class="lis_top"><img :src="item.src" alt="" /></div>
          <div class="lis_btm">
            <p class="name">{{ "名称:" + item.name }}</p>
            <p class="price">{{ "价格: RMB " + item.price }}</p>
            <p class="state">
              {{ "状态: " + item.state ? "未出售" : "已出售" }}
            </p>
          </div>
        </li>
      </ul>
    </div>

  </div>
  <el-dialog v-model="dialogTableVisible" title="我的粉丝" width="500">
      <ul class="fs">
        <li v-for="item in followers" :key="item.id">
          <div class="userInfo-shot"> <img :src="item.shot" alt=""> </div>
          <div class="userInfo_name"> <p>{{ item.username }}</p> </div>
          <div class="btn"><button @click="jumpInfo(item.id)">查看用户</button></div>
        </li>
      </ul>
  </el-dialog>
</template>
  
  <script setup>
import Cookies from "js-cookie";
import { ref, reactive, onMounted, computed, watch, onUpdated } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Plus, Delete, ArrowLeftBold } from "@element-plus/icons-vue";
import axios from "axios";
let user = JSON.parse(Cookies.get("user"));
import { useRouter } from "vue-router";
const router = useRouter();
let id = router.currentRoute.value.query.id;

const dialogTableVisible = ref(false)

const change = () => {
  dialogTableVisible.value = !dialogTableVisible.value
}

const followers = ref([])

const getFollowersInfo = () => {
    axios.get(`https://api3638.wagu.vip/user/getFollowersInfo?userId=${id}`).then(res=>{
      followers.value = res.data
      console.log(followers.value)
    })
}

const jumpInfo = (Itid) => {
  id = Itid
  get();
  getCommoditys();
  getFollowersNum();
  getFollowersInfo()
  dialogTableVisible.value = false
}

const product = ref({});

const getproduct = () => {
   axios.get(`https://api3638.wagu.vip/commodity/getproduct?userId=${id}`).then(res=>{
      product.value = res.data
      console.log(product.value)
   })
}
 

let userInfo = ref({});

const imageUrl = ref("");
let list = ref();

const jump = (id) => {
  router.push({
    path: "/details",
    query: {
      id: id,
    },
  });
 
};

let followersNum = ref();

const getFollowersNum = () => {
  axios
    .get(`https://api3638.wagu.vip/user/getFollowersNum?userId=${id}`)
    .then((res) => {
      followersNum.value = res.data;
    });
};

onMounted(() => {
  get();
  getCommoditys();
  getFollowersNum();
  getFollowersInfo()
  getproduct()
});

const uplist = () => {
  setTimeout(() => {
    getCommoditys();
  }, 1000);
};

const getCommoditys = () => {
  axios
    .get(`https://api3638.wagu.vip/commodity/getUserCommoditys?id=${id}`)
    .then((res) => {
      list.value = res.data;
    });
};

const get = () => {
  axios
    .get(`https://api3638.wagu.vip/user/getUserInfo?id=${id}`)
    .then((res) => {
      userInfo.value = res.data;
    });
};
const beforeAvatarUpload = (rawFile) => {
  if (rawFile.type !== "image/jpeg") {
    ElMessage.error("Avatar picture must be JPG format!");
    return false;
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error("Avatar picture size can not exceed 2MB!");
    return false;
  }
  return true;
};



</script>
  
  
  
  <style lang="scss" scoped>
@import url(../assets/icons/font_he0z9rbm28b/iconfont.css);
.fs{
    max-height: 25rem;
    overflow-y: auto;
    li{
      width: 100%;
      height:3rem;
      list-style: none;
      border-bottom: 1px solid #ccc;
      margin-top: 0.5rem;
      display: flex;
      align-items: center;
      padding-bottom: .5rem;
      position: relative;
      .userInfo-shot{
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 100%;
        background: #ccc;
        margin-right: 1rem;
        img{
          width:100%;
          height:100%;
        }
        
      }
      .userInfo_name{
        height:100%;
        p{
          font-size: 1rem;
          height: 100%;
          display: flex;
          align-items: center;
        }
      }
      .btn{
        width:5rem;
        height: 100%;
        margin-left: 15rem;
        display: flex;
        position: absolute;
        right:0;
        align-items: center;
        button{
          width: 100%;
          height: 60%;
          background: #066eff;
          color: white;
          border: none;
          outline: none;
          cursor: pointer;
          border-radius: 1rem;
        }
      }
    }
  }
.individual {
  width: 100vw;
  height: auto;

  .num {
    position: absolute;
    left: 18%;
    bottom: 0%;
    color: white;
    font-size: 1.2rem;
    
  }
  .type{
    position: absolute;
    left: 25%;
    bottom:2%;
    color:white;
    display:flex;
    align-items:center;
    margin-left:1rem;
    p{
      padding-right: 1rem;
    }
  }
  .container {
    width: 80%;
    height: auto;
    margin: auto;
    .top {
      width: 100%;
      height: 15rem;
      img {
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
      li {
        width: 21%;
        height: 50%;
        .icon_upload {
          width: 100%;
          height: 100%;
          text-align: center;
          border: 1px dashed #cec9c9;
          border-radius: 0.5rem;
          cursor: pointer;
          font-size: 3rem;
          color: #cec9c9;
          i {
            font-size: 3rem;
            color: #066eff;
          }
          &:hover {
            border: 1px dashed #066eff;
            color: #066eff;
          }
          p:nth-of-type(1) {
            font-size: 1.2rem;
            padding-top: 3rem;
          }
        }
      }
      .lis {
        width: 21%;
        height: 50%;
        box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
        border-radius: 0.5rem;
        position: relative;
        .dele {
          position: absolute;
          right: 0.5rem;
          top: 1rem;
          width: 1rem;
          height: 1rem;
          border-radius: 0 0.5rem 0 0.5rem;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
        }
        .lis_top {
          width: 100%;
          height: 60%;
          display: flex;
          justify-content: center;
          align-items: center;
          img {
            width: 80%;
            height: 100%;
          }
        }
        .lis_btm {
          width: 100%;
          height: 40%;
          padding-left: 0.5rem;
          padding-top: 0.5rem;
          .name {
          }
          .price {
            margin: 0.2rem 0;
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
.el-icon.avatar-uploader-icon {
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