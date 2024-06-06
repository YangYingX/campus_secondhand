<template>
  <div class="order">
    <div class="content">
      <div class="return">
          <div style="margin-bottom:1rem;"> <el-icon @click="$router.go(-1)"><ArrowLeftBold /></el-icon> </div>
         
        </div>
      <ul>
        <li
          v-if="collections.length != 0"
          v-for="item in collections"
          :key="item.id"
        >
          <div class="top" @click="jump(item.id)">
            <div class="top_left">
              <div class="photo"><img :src="item.src" /></div>
              <div class="word">
                <p>{{ item.name }}</p>
                <p>{{ item.desc }}</p>
              </div>
            </div>
            <div class="top_right">
              <p class="price">{{ "RMB " + item.price }}</p>
            </div>
          </div>
          <div class="btm">
            <button @click="dele(item.collectionId)">删除</button>
            <button @click="end(item.id)">立即购买</button>
          </div>
        </li>
        <li v-if="collections.length == 0">
          <p class="null">暂无收藏</p>
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
        <el-button type="primary" @click="play"> 确定 </el-button>
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
import { useRouter } from "vue-router";
import { Pointer,ArrowLeftBold } from "@element-plus/icons-vue";
const router = useRouter();

let collections = ref([]);

const dialogFormVisible = ref(false);

const form = ref({
  addressName: user.addressName,
  phone: user.phone,
  address: user.address,
  userId: user.id,
  commodityId : ''
});

const jump = (id) => {
  router.push({
    path: "/details",
    query: {
      id: id,
    },
  });
};

onMounted(() => {
  get();
});

const end = (id) => {
  dialogFormVisible.value = true;
  form.value.commodityId = id;
};

const get = () => {
  axios
    .get(`https://api3638.wagu.vip/commodity/getCollections?userId=${user.id}`)
    .then((res) => {
      collections.value = res.data;
      console.log(collections.value);
    })
    .catch((err) => {
      console.log(err);
    });
};

const play = (id) => {
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

const dele = (id) => {
  ElMessageBox.confirm("是否删除订单", "删除订单", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      axios
        .get(`https://api3638.wagu.vip/commodity/deleCollection?id=${id}`)
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
        message: "Delete canceled",
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