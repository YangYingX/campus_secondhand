<template>
  <div class="order">
    <div class="content">
      <div class="return">
          <div style="margin-bottom:1rem;"> <el-icon @click="$router.go(-1)"><ArrowLeftBold /></el-icon> </div>
         
        </div>
      <ul>
        <li v-if="order.length != 0" v-for="item in order" :key="item.id">
          <div class="top" @click="jump(item.id)">
            <div class="top_left">
              <div class="photo"><img :src="item.src" /></div>
              <div class="word">
                <p>{{ item.name }}</p>
                <p>{{ item.desc }}</p>
                <p>{{ item.createTime }}</p>
                <p>{{ "收货地址:" +item.address }}</p>
              </div>
            </div>
            <div class="top_right">
              <p class="price">{{ "RMB " + item.price }}</p>
              <p class="state">{{ item.OrderState ? "已支付" : "未支付" }}</p>
            </div>
          </div>
          <div class="btm">
            <button @click="deleOrder(item.orderId, item.id)">删除</button>
            <button @click="play(item.orderId)" v-if="item.OrderState == false">立即支付</button>
            <button @click="dialogFormVisible = true">收货地址</button>
            <button @click="comment(item.orderId)" v-if="item.OrderState == true">评论商品</button>
          </div>
        </li>
        <li v-if="order.length == 0">
          <p class="null">暂无订单</p>
        </li>
      </ul>
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
        <el-button type="primary" @click="upload">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog
    v-model="centerDialogVisible"
    title="评论商品"
    width="500"
    align-center
  >
  <div style="margin-bottom: 1rem">
    <span>
      评价:
      <el-radio-group v-model="radio">
    <el-radio :value="1">好评</el-radio>
    <el-radio :value="2">中评</el-radio>
    <el-radio :value="3">差评</el-radio>
  </el-radio-group>
    </span>
    </div>
    <div>
      <span>评论:  <el-input v-model="input" style="width: 240px" placeholder="评论" /></span>
    </div>
  
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="sppl">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import Cookies from "js-cookie";
let user = JSON.parse(Cookies.get("user"));
import { ref, reactive, onMounted, computed, watch, onUpdated } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import axios from "axios";
import { Pointer,ArrowLeftBold } from "@element-plus/icons-vue";  
import { useRouter } from "vue-router";
const router = useRouter();

const orderId = ref()

const comment = (id) => {
    orderId.value = id
    centerDialogVisible.value = true
}



const jump = (id) => {
  router.push({
    path: "/details",
    query: {
      id: id,
    },
  });
};

const input = ref('')

let order = ref([]);
const radio = ref(1)

const sppl = () => {
  if(input.value == ''){
    ElMessage({
      type: "error",
      message: "评论不能为空",
    });
    return
  }
  const info = {
     id : orderId.value,
      comments : input.value,
      commentsState : radio.value
  }
  axios.post('https://api3638.wagu.vip/commodity/productReviews',info).then(res=>{
    ElMessage({
      type: "success",
      message: res.data,
    });
    centerDialogVisible.value = false
  }).catch(err=>{
    console.log(err)
  })
}

const dialogFormVisible = ref(false)
const centerDialogVisible = ref(false)

const form = ref({
  addressName: user.addressName,
  phone: user.phone,
  address: user.address,
  userId : user.id
})

onMounted(() => {
  get();
});

const upload = () => {
    axios.post('https://api3638.wagu.vip/user/uploadAddress',form.value)
    .then((res) => {
      ElMessage({
        type: "success",
        message: res.data,
      });
      dialogFormVisible.value = false
    })
    .catch((err) => {
      console.log(err);
    })
    
}

const get = () => {
  axios
    .get(`https://api3638.wagu.vip/commodity/getOrders?id=${user.id}`)
    .then((res) => {
      order.value = res.data;
    })
    .catch((err) => {
      console.log(err);
    });
};

const play = (id) => {
  ElMessageBox.confirm("是否支付", "支付", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      axios
        .get(`https://api3638.wagu.vip/commodity/play?id=${id}`)
        .then((res) => {
          ElMessage({
            type: "success",
            message: res.data,
          });
          get();
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "支付取消",
      });
    });
};

const deleOrder = (orderId, commodityId) => {
  ElMessageBox.confirm("是否删除订单", "删除订单", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      axios
        .get(
          `https://api3638.wagu.vip/commodity/deleOrder?orderId=${orderId}&commodityId=${commodityId}`
        )
        .then((res) => {
          ElMessage({
            type: "success",
            message: res.data,
          });
          get();
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消删除",
      });
    });
};
</script>

<style lang="scss" scoped>
.null {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 2rem;
  color: #d1d0d0;
}
.order {
  width: 100vw;
  height: auto;
  .content {
    width: 70%;
    height: auto;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
    margin: 1rem auto;
    padding: 2rem;
    ul {
      list-style: none;
      li {
        width: 100%;
        height: 13rem;
        margin-bottom: 1rem;
        padding: 0.5rem;
        box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
        border-radius: 0.5rem;
        .top {
          width: 100%;
          height: 70%;
          display: flex;
          gap: 2%;
          .top_left {
            width: 80%;
            height: 100%;
            display: flex;

            .photo {
              width: 7rem;
              height: 100%;
              background: #d1d0d0;
              border-radius: 0.5rem;
              display: flex;
              justify-content: center;
              align-items: center;
              img {
                width: 80%;
                height: 80%;
              }
            }
            .word {
              width: 80%;
              p:nth-child(1) {
                margin-left: 1rem;
                font-size: 1.2rem;
                height: 1rem;
              }
              p:nth-child(2) {
                margin-left: 1rem;
                font-size: 1rem;
                color: #6c6c6c;
                height: 0.5rem;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                height: 2.5rem;
                line-height: 1.25rem;
                overflow: hidden;
              }
              p:nth-child(3) {
                margin-left: 1rem;
                font-size: 1rem;
                color: #6c6c6c;
                height: auto;
              }
              p:nth-child(4) {
                margin-left: 1rem;
                font-size: 1rem;
                color: #6c6c6c;
                height: auto;
                margin-bottom:1rem;
                position: relative;
                bottom:.5rem;
              }
            }
          }
          .top_right {
            width: 20%;
            height: 100%;
            .price {
              font-size: 1.5rem;
            }
            .state {
              font-size: 1rem;
              color: cornflowerblue;
              font-weight: bold;
            }
          }
        }
        .btm {
          width: 100%;
          height: 30%;
          display: flex;
          align-items: center;
          gap: 1%;
          padding-left: 7rem;
          button {
            outline: none;
            background: #ffffff;
            padding: 0.3rem 1rem;
            border: 1px solid #d1cfcf;
            border-radius: 0.3rem;
            cursor: pointer;
          }
          button:nth-child(1) {
            color: red;
          }
        }
      }
    }
  }
}
</style>