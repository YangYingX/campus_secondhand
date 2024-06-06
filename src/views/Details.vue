<template>
  <div class="details">
    <div class="content">
      <div class="user_info">
        <div class="return">
          <div style="margin-bottom:1rem;"> <el-icon @click="$router.go(-1)"><ArrowLeftBold /></el-icon> </div>
         
        </div>
        <div class="user">
          <div class="user_shot" > <img :src="Publisher.shot" alt="" @click="jump(Publisher.id)"> <p class="user_name">{{ Publisher.username }}</p> </div>
          <div class="concern" @click="concern(Publisher.id)">{{ is? "取消关注": "关注"}}</div>
        </div>
      </div>
      <div class="top">
        <div class="top_right">
          <p class="name">{{ commodity.name }}</p>
          <p class="desc">{{ commodity.desc }}</p>
          <p class="price">{{ "RMB: ￥" + commodity.price }}</p>
          <div class="play" @click="dialogFormVisible = true" v-if="commodity.state == 1">
            <button>立即购买</button>
          </div>
          <div class="like" @click="link"><button>立即收藏</button></div>
        </div>
        <div class="top_left">
          <div class="photo">
            <index :src="commodity.src"></index>
          </div>
        </div>
      </div>
    </div>
    <el-dialog v-model="dialogFormVisible" title="编辑收货地址" width="500">
      <el-form :model="form">
        <el-form-item label="名字" label-width="8.75rem">
          <el-input v-model="form.addressName" autocomplete="off" />
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
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="play"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>

    <div class="comment">
      <div class="comment-header">
        <div class="top-header">
          <span>评论</span>
        </div>
        <div class="up-header">
          <!-- <span>全部</span>
          <span>追评</span> -->
        </div>
      </div>
      <div class="comment-main"  v-for="item in commentsData" :key="item.id">
        <div class="comment-main-headr">
          <ul>
            <li class="comment-main-headr-img">
              <img :src="item.user.shot" alt="" />
            </li>
            <li class="comment-main-headr-msg">
              <p class="user-name">{{ item.user.username }}</p>

              <p class="message time" style="display: flex">
                {{ item.createTime }} <div class="like" style="margin-left: 1rem;"><el-icon @click="love(item)"><Pointer /></el-icon> <span>{{item.nike}}</span></div>
              </p>
            </li>
          </ul>
        </div>
        <div class="comment-main-text">
          <p @click="reply(item)">
           {{ item.content }}
          </p>
        </div>
        <div class="comment-main-addtext" v-if="item.replies">
          <!-- <span>{{ "相关回复共" + item.replies.length+"条" }}</span> -->
          <ul class="lis" v-for="items in item.replies" :key="items.id">
            <li>
              <div class="head">
                <div class="shot"> <img :src="items.user.shot" alt=""> </div>
                <div class="userInfo">
                  <p>{{ items.user.username }} <span class="huifuTime">{{ items.createTime }}</span> </p>
                </div>
              </div>
                <p>{{ items.content }}</p>
            </li>
          </ul>
        </div>
      </div>
      
      
      <div class="input-box">
        <el-input
          v-model="textarea"
          style="width: 62.5rem"
          :rows="2"
          type="textarea"
          :placeholder="placeholder"
          v-if="addshow"
        />
        <el-input
          v-model="textarea"
          style="width: 62.5rem"
          :rows="2"
          type="textarea"
          placeholder="请追加评论"
          v-else
        />
        <el-button
          type="primary"
          size="large"
          style="margin-left: 0.625rem; margin-top: 0.625rem" @click="comments"
          >发送</el-button
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import index from "../components/index.vue";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { Pointer,ArrowLeftBold } from "@element-plus/icons-vue";
const router = useRouter();
const id = router.currentRoute.value.query.id;
import axios from "axios";
import Cookies from "js-cookie";
const user = JSON.parse(Cookies.get("user"));

let commodity = ref({});

const dialogFormVisible = ref(false);

const textarea = ref("");
const addshow = ref(true);

const form = ref({
  addressName: user.addressName,
  phone: user.phone,
  address: user.address,
  userId: user.id,
  commodityId: id,
});







const jump = (id) => {
  router.push({
    path: "/introduction",
    query: {
      id: id,
    },
  });
}

const commentsInfo = ref({
  userId: user.id,
  commodityId: id,
  content: "",
});

let commentsData = ref([]);
let replyInfo = {
  userId: user.id,
  commodityId: id,
  collectionId: "",
  content: textarea.value,
};

const love = (item) => {
  axios.post(`https://api3638.wagu.vip/commodity/love`, {
    userId: user.id,
    id: item.id,
  }).then((res) => {
    ElMessage({
      message: res.data,
      type: "success",
    });
    getComments();
  }).catch((err) => {
    ElMessage({
      message: err.response.data,
      type: "warning",
    });
  });
};

const addCart = () => {
  dialogFormVisible.value = true;
}

const ipt = ref(true);
const placeholder = ref("请输入评论");

const reply = (item) => {
  replyInfo.collectionId = item.id;
  if (ipt.value) {
    ipt.value = false;
    placeholder.value = "请输入回复";
  }
};

const getComments = () => {
  axios
    .get(`https://api3638.wagu.vip/commodity/getComments?commodityId=${id}`)
    .then((res) => {
      commentsData.value = res.data;
    });
};

const comments = () => {
  if (textarea.value == "") {
    ElMessage({
      message: "请输入评论",
      type: "warning",
    });
    return;
  }
 
  if (ipt.value) {
    commentsInfo.value.content = textarea.value;
    axios
      .post(`https://api3638.wagu.vip/commodity/comments`, commentsInfo.value)
      .then((res) => {
        ElMessage({
          message: res.data,
          type: "success",
        });
        getComments();
        textarea.value = "";
      })
      .catch((err) => {
        ElMessage({
          message: err.response.data,
          type: "warning",
        });
      });
  } else {
    replyInfo.content = textarea.value;
    axios.post(`https://api3638.wagu.vip/commodity/reply`, replyInfo).then((res) => {
      ElMessage({
        message: res.data,
        type: "success",
      });
      getComments();
      textarea.value = "";
      ipt.value = true;
      placeholder.value = "请输入评论";
    });
  }
};

const Publisher = ref({})

onMounted(() => {
  axios
    .get(`https://api3638.wagu.vip/commodity/getCommodity?id=${id}`)
    .then((res) => {
      commodity.value = res.data[0];
      Publisher.value = res.data[0].user;
      isConcern(Publisher.value.id)
    })
    .catch((err) => {
    });
  getComments();
});

const is = ref(false);
const isConcern = (concernId) => {
  console.log(is)
   axios.get(`https://api3638.wagu.vip/user/getIsConcern?userId=${user.id}&concernId=${concernId}`).then((res) => {
    is.value = res.data;
    console.log(res.data)
   }).catch((err) => {
      is.value = err.response.data
   });
}

const concern = (id) => {
   if(id == user.id){
    ElMessage({
      message: "不能关注自己",
      type: "warning",
    });
    return;
  }
  if(is.value){
    axios.get(`https://api3638.wagu.vip/user/cancelConcern?userId=${user.id}&concernId=${id}`).then((res) => {
        is.value = false
        ElMessage({
          message: res.data,
          type: "success",
        });

    })
  }else{
axios.get(`https://api3638.wagu.vip/user/concern?userId=${user.id}&concernId=${id}`).then((res) => {
    is.value = res.data;
    ElMessage({
      message: res.data,
      type: "success",
    });
  }).catch((err) => {
    ElMessage({
      message: err.response.data,
      type: "warning",
    });
  });
  }
 
  
}

const play = () => {
  const phoneRegex = /^1[3-9]\d{9}$/;
  if (
    form.value.addressName == "" ||
    form.value.photo == "" ||
    form.value.address == ""
  ) {
    ElMessage({
      message: "请填写完整",
      type: "warning",
    });
    return;
  }
  if (!phoneRegex.test(form.value.phone)) {
    ElMessage({
      message: "请输入正确的手机号",
      type: "warning",
    });
    return;
  }
  axios
    .post("https://api3638.wagu.vip/commodity/addOrder", form.value)
    .then((res) => {
      ElMessage({
        message: res.data,
        type: "success",
      });
      router.push("/order");
      dialogFormVisible.value = false;
    });
};

const link = () => {
  axios
    .get(
      `https://api3638.wagu.vip/commodity/collection?id=${id}&userId=${user.id}`
    )
    .then((res) => {
      ElMessage({
        message: res.data,
        type: "success",
      });
    })
    .catch((err) => {
      ElMessage({
        message: err.response.data,
        type: "warning",
      });
    });
};
</script>

<style scoped lang="scss">
.lis {
  width: 100%;

  list-style: none;
  padding-left: 3rem;
  .head {
    width: 100%;
    height: 4rem;
    display: flex;
    .shot {
      width: 5%;
      height: 100%;
      border-radius: 100%;
      img {
        width: 100%;
        height: 100%;
        border-radius: 100%;
      }
    }
    .userInfo {
      width: 90%;
      height: 100%;
      .huifuTime {
        font-family: none;
        font-size: 1rem;
      }
    }
  }
}
.details {
  width: 100vw;
  height: auto;
  .content {
    width: 75%;
    height: 30rem;
    margin: auto;
    .user_info{
      width:100%;
      height:6rem;
      box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
      display: flex;
      padding:1rem;
      text-align: center;
      display:flex;
      justify-content: space-between;
      .user{
        display: flex;
      }
      .concern{
        width:5rem;
        height:2rem;
        line-height:2rem;
        background-color:#2273ff;
        color:white;
        border-radius:0.5rem;
        cursor:pointer;
        margin-left: 1rem;
      }
      .return{
        display:flex;
        align-items:center;
      }
      .user_shot{
        width:3rem;
        height:3rem;
        border-radius:100%;
        margin-left:1rem;
        img{
          width:100%;
          height:100%;
          border-radius:100%;
        }
      }
    }
    .top {
      width: 100%;
      height: 100%;
      display: flex;
      border-radius: 0.5rem;
      margin-top: 0.5rem;
      box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
      gap: 5rem;
      .top_left {
        flex: 6;
        height: 100%;
        padding: 1rem;
        display: flex;
        align-items: center;
      }
      .top_right {
        flex: 4;
        height: 100%;
        padding: 1rem;
        box-shadow: rgba(0, 0, 0, 0.2) 0px 18px 50px -10px;
        padding: 1rem;
        .name {
          font-family: "Courier New", Courier, monospace;
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1rem;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .desc {
          color: #999;
          font-size: 1.1rem;
          font-weight: 400;
          margin-bottom: 1rem;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          width:25rem;
        }
        .price {
          font-size: 1.5rem;
          font-weight: 600;
        }
        .play {
          margin-top: 4rem;
          display: flex;
          justify-content: center;
          align-items: center;

          button {
            width: 70%;
            height: 3rem;
            border: none;
            border-radius: 0.5rem;
            background-color: #2273ff;
            color: white;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
          }
        }
        .like {
          margin-top: 1rem;
          display: flex;
          justify-content: center;
          align-items: center;

          button {
            width: 70%;
            height: 3rem;
            border: none;
            border-radius: 0.5rem;
            background-color: #ffffff;
            color: #4a92fe;
            border: 0.0625rem solid #4a92fe;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
          }
        }
      }
    }
  }
}
.comment {
  width: 90rem;
  margin: auto;
  margin-top: 3.125rem;
  padding-bottom: 12.5rem;
  margin-top: 10rem;
  .comment-header {
    width: 100%;
    height: 6.25rem;
    line-height: 3.125rem;
    .top-header {
      width: 100%;
      height: 50%;
      border-bottom: 0.0625rem solid rgba(0, 0, 0, 0.08);
      span {
        margin-left: 1.25rem;
        font-family: PingFang SC;
        font-size: 1.125rem;
        color: #000;
        cursor: pointer;
      }
    }
    .up-header {
      width: 100%;
      height: 50%;
      display: flex;
      align-items: center;
      span {
        text-align: center;
        display: block;
        width: 5rem;
        height: 2.1875rem;
        line-height: 2.1875rem;
        background-color: rgba(0, 0, 0, 0.08);
        margin-left: 1.25rem;
        border-radius: 0.9375rem;
        cursor: pointer;
        border-radius: 1.125rem;
        padding: 0 1rem;
        border: none;
        background-color: #f6f6f6;
        color: #333;
        font-size: 0.875rem;
        font-family: PingFang SC;
      }
      span:hover {
        background-color: rgba(0, 0, 0, 0.2);
      }
    }
  }
  .comment-main {
    margin-top: 1.25rem;
    width: 100%;
    border-bottom: 0.0625rem solid rgba(0, 0, 0, 0.08);
    .comment-main-headr {
      width: inherit;
      height: inherit;
      ul {
        height: 4.375rem;
        list-style: none;
        display: flex;
        align-items: center;
        .comment-main-headr-img {
          margin-left: 1.25rem;
          width: 3.75rem;
          height: 3.75rem;
          img {
            border-radius: 50%;
            width: 100%;
          }
        }
        .comment-main-headr-msg {
          margin-left: 1.25rem;
          height: 3.75rem;
          padding: 0.3125rem 0;
          .user-name {
            font-size: 1.125rem;
            font-weight: bold;
            span {
              font-size: 1rem;
              font-weight: 200;
              background-color: rgba(219, 219, 219, 0.8);
              padding: 0.0625rem 0.5rem;
              border-radius: 0.25rem;
              color: rgb(0, 162, 255);
            }
          }
        }
      }
    }
    .comment-main-text {
      width: inherit;
      height: inherit;
      cursor: pointer;
      p {
        padding: 0.625rem 1.25rem;
        line-height: 1.5rem;
      }
    }
    .comment-main-addtext {
      margin-top: 0.3125rem;
      span {
        display: block;
        padding: 0.125rem 0;
        font-size: 1.25rem;
        font-family: "华文行楷";
        color: #999;
      }
      p {
        padding: 0.625rem 1.25rem;
        line-height: 1.5rem;
      }
    }
  }
  .input-box {
    width: 90rem;
    height: 5rem;
    background-color: #fff;
    position: fixed;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.active {
  background-color: #ff5000;
  color: #fff;
}
</style>
