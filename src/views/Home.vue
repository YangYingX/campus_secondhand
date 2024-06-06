<template>
  <div class="home">
    <div class="header">
      <div class="header_top">
        <div class="header_left">
          <div class="logo">
            <img src="../assets/images/logo.svg" alt="" />
            <p class="title">二手交易平台</p>
          </div>
          <div class="search">
            <input type="text" placeholder="搜索" v-model="key" /> <button @click="search">搜索</button>
          </div>
        </div>
        <div class="header_right">
          <ul>
            <li>
              <router-link to="/individual"
                ><div class="icon"><i class="iconfont icon-personal"></i></div>
                <div class="word"><p>个人</p></div>
              </router-link>
            </li>
            <li>
              <router-link to="/collection"
                ><div class="icon"><i class="iconfont icon-shoucang4"></i></div>
                <div class="word"><p>我的收藏</p></div>
              </router-link>
            </li>
            <li>
              <router-link to="/order"
                ><div class="icon"><i class="iconfont icon-dingdan"></i></div>
                <div class="word"><p>订单</p></div>
              </router-link>
            </li>
            <li @click="open">
              <div class="icon"><i class="iconfont icon-kefu1"></i></div>
              <div class="word"><p>客服</p></div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="content">
        <div class="wper">
          <div class="wper_left">
            <div class="block text-center" m="t-4">
              <el-carousel trigger="click" height="30rem">
                <el-carousel-item v-for="item in list" :key="item.id">
                  <img :src="require('../assets/images/' + item.src)" alt="" />
                </el-carousel-item>
              </el-carousel>
            </div>
          </div>
          <ul class="wper_right">
            <li>
              <div class="shot"><img :src="user.shot" alt="" /></div>
              <div class="word">
                <p class="username">{{ "Hi, " + user.username }}</p>
                <p>让我们去购物吧</p>
                <button class="out" @click="out">退出登录</button>
              </div>
            </li>
            <li>
              <p>对于我们来说:</p>
              <p>每位顾客都是上帝的恩赐</p>
              <p>我们将竭尽全力为您服务</p>
            </li>
            <li>
              <div class="sale" @click="upload"><p>出售二手物品 ></p></div>
            </li>
          </ul>
        </div>
        <div class="box">
          <ul>
            <li style="margin-top: 2rem">
              <div class="type">
                <img src="../assets/images/furniture.png" alt="" />
                <div class="type_cover">
                  <p>电子</p>
                  <p>产品</p>
                </div>
              </div>
              <ol class="classification">
                <li
                  v-for="item in furniture"
                  :key="item.id"
                  @click="jump(item.id)"
                >
                  <div class="name_price">
                    <p class="name">{{ item.name }}</p>
                    <div class="price">
                      <p>From</p>
                      <p>{{ "RMB " + item.price }}</p>
                      <p>{{ "来自:"+item.user.username }}</p>
                    </div>
                  </div>
                  <div class="photo"><img :src="item.src" alt="" /></div>
                </li>
              </ol>
            </li>
            <li style="margin-top: 2rem">
              <div class="type">
                <img src="../assets/images/electronic.jpg" alt="" />
                <div class="type_cover">
                  <p>电子产品</p>
                </div>
              </div>
              <ol class="classification">
                <li
                  v-for="item in electronic"
                  :key="item.id"
                  @click="jump(item.id)"
                >
                  <div class="name_price">
                    <p class="name">{{ item.name }}</p>
                    <div class="price">
                      <p>From</p>
                      <p>{{ "RMB " + item.price }}</p>
                      <p>{{ "来自:"+item.user.username }}</p>
                    </div>
                  </div>
                  <div class="photo"><img :src="item.src" alt="" /></div>
                </li>
              </ol>
            </li>
          </ul>
        </div>
        <div class="lis">
          <p>服饰服装</p>
          <ul>
            <li v-for="item in fz" :key="item.id" @click="jump(item.id)">
              <div class="lis_top"><img :src="item.src" alt="" /></div>
              <div class="lis_btm">
                <p class="price_fz">{{ "RMB " + item.price }}</p>
                <p class="name_fz">{{ item.name }}</p>
                <p class="Seller_name">{{ "来自:"+item.user.username }}</p>
              </div>
            </li>
          </ul>
        </div>
        <div class="lis">
          <p>其它</p>
          <ul>
            <li v-for="item in qt" :key="item.id" @click="jump(item.id)">
              <div class="lis_top"><img :src="item.src" alt="" /></div>
              <div class="lis_btm">
                <p class="price_fz">{{ "RMB " + item.price }}</p>
                <p class="name_fz">{{ item.name }}</p>
                <p class="Seller_name">{{ "来自:"+item.user.username }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <el-dialog v-model="centerDialogVisible" width="500" align-center>
      <template #footer>
        <img
          src="../assets/images/wx.jpg"
          alt=""
          style="width: 30rem; height: 40rem"
        />
      </template>
    </el-dialog>
    <goods ref="goodsClick" @upload="uplist"></goods>
  </div>
</template>

<script setup>
import Cookies from "js-cookie";
import { ref, onMounted } from "vue";
const user = JSON.parse(Cookies.get("user"));
import { useRouter } from "vue-router";
const router = useRouter();
import axios from "axios";
import goods from '../components/goods.vue'
import { ElMessage,ElMessageBox } from 'element-plus'

let furniture = ref();
let electronic = ref();
let fz = ref();
let qt = ref();
const key = ref()

const search = () => {
  axios.get(`https://api3638.wagu.vip/commodity/search?key=${key.value}`).then((res) => {
    router.push({
    path: "/details",
    query: {
      id: res.data[0].id,
    },
  });
  key.value = ''
  }).catch((err) => {
    ElMessage.warning(err.response.data)
    key.value = ''
  })
}

onMounted(() => {
  getCommoditys();
});

const uplist = () => {
  setTimeout(()=>{
    getCommoditys()
  },1000)
}

const goodsClick = ref(null)

const upload = () => {
  goodsClick.value.changeCover()
}

const getCommoditys = () => {
  axios
    .get(`https://api3638.wagu.vip/commodity/getCommoditys?type=1`)
    .then((res) => {
      furniture.value = res.data;
    });
  axios
    .get(`https://api3638.wagu.vip/commodity/getCommoditys?type=2`)
    .then((res) => {
      electronic.value = res.data;
    });
  axios
    .get(`https://api3638.wagu.vip/commodity/getCommoditys?type=3`)
    .then((res) => {
      fz.value = res.data;
    });
  axios
    .get(`https://api3638.wagu.vip/commodity/getCommoditys?type=4`)
    .then((res) => {
      qt.value = res.data;
    });
};

const centerDialogVisible = ref(false);

const jump = (id) => {
  router.push({
    path: "/details",
    query: {
      id: id,
    },
  });
};

const list = [
  { id: 0, src: "wper_0.png" },
  { id: 1, src: "wper_1.jpg" },
  { id: 2, src: "wper_2.jpg" },
  { id: 3, src: "wper_3.png" },
];

const out = () => {
  Cookies.remove("token");
  router.push("/");
};

const open = () => {
  centerDialogVisible.value = true;
};
</script>

<style lang="scss" scoped>
@import url(../assets/icons/font_kdwckouqv7/iconfont.css);
.home {
  width: 100vw;
  height: auto;
  .header {
    width: 90%;
    height: 5rem;
    margin: auto;
    .header_top {
      width: 100%;
      height: 100%;
      display: flex;
      .header_left {
        flex: 7;
        height: 100%;
        display: flex;
        .logo {
          width: 30%;
          height: 100%;
          display: flex;
          align-items: center;
          img {
            width: 50%;
            height: 100%;
          }
          .title {
            color: #8cb7f5;
            font-size: 1.2rem;
            font-family: "Dancing Script", cursive;
          }
        }
        .search {
          width: 70%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          input {
            width: 80%;
            height: 50%;
            border-top-left-radius: 0.3125rem;
            border-bottom-left-radius: 0.3125rem;
            padding: 0 0.5rem;
            border: 2px solid #336fff;
            outline: none;
            &::placeholder {
              color: #999;
            }
          }
          button {
            width: 15%;
            height: 50%;
            background: #336fff;
            color: white;
            border: none;
            outline: none;
            border-top-right-radius: 0.3125rem;
            border-bottom-right-radius: 0.3125rem;
          }
        }
      }
      .header_right {
        flex: 3;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        ul {
          list-style: none;
          display: flex;
          li {
            flex: 1;
            height: 100%;
            margin: 0 1rem;
            padding: 0 0.5rem;
            cursor: pointer;
            a {
              text-decoration: none;
              color: black;
            }
            .icon {
              display: flex;
              justify-content: center;
              align-items: center;
              margin-bottom: 0.5rem;
              i {
                font-size: 1.5rem;
                color: #8b96a5;
              }
            }
            .word {
              display: flex;
              justify-content: center;
              align-items: center;
              white-space: nowrap;
              p {
                font-size: 0.8rem;
                color: #8b96a5;
              }
            }
          }
        }
      }
    }
  }
  .container {
    width: 100%;
    background: #f7fafc;
    margin-top: 1rem;
    .content {
      width: 90%;
      height: auto;
      margin: auto;
      .wper {
        width: 100%;
        height: 30rem;
        display: flex;
        gap: 2%;
        .wper_left {
          flex: 7;
          height: 100%;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .wper_right {
          flex: 3;
          height: 100%;
          list-style: none;
          li:nth-of-type(1) {
            width: 100%;
            height: 38%;
            background: #e3f0ff;
            border-radius: 2%;
            padding: 0.5rem;
            display: flex;
            .out {
              width: 50%;
              height: 20%;
              margin-top: 1rem;
              border: none;
              outline: none;
              background: #066eff;
              color: white;
              border-radius: 1rem;
              cursor: pointer;
            }
            .shot {
              width: 30%;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
              img {
                width: 80%;
                height: 55%;
                border-radius: 100%;
              }
            }
            .word {
              width: 70%;
              height: 100%;
              .username {
                width: 100%;
                height: 50%;
                display: flex;
                align-items: flex-end;
                font-size: 1.3rem;
                margin-bottom: 0.5rem;
              }
              p:nth-of-type(2) {
                font-family: "Dancing Script", cursive;
              }
            }
          }
          li:nth-of-type(2) {
            width: 100%;
            height: 29%;
            background: #f19350;
            border-radius: 2%;
            margin: 3% 0;
            padding: 1rem;
            p:nth-of-type(2) {
              margin: 1rem 0;
            }
            p {
              font-size: 1.1rem;
              font-family: "Dancing Script", cursive;
            }
          }
          li:nth-of-type(3) {
            width: 100%;
            height: 29%;
            background: #55bdc4;
            border-radius: 2%;
            margin: 3% 0;
            padding: 1rem;
            .sale {
              width: 100%;
              height: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
              cursor: pointer;
              p {
                color: white;
                font-size: 2.5rem;
              }
            }
          }
        }
      }
      .box {
        width: 100%;
        height: auto;
        ul {
          list-style: none;
          margin-top: 2rem;
          li {
            width: 100%;
            height: auto;
            display: flex;
            .type {
              flex: 2.5;
              height: auto;
              position: relative;
              img {
                width: 100%;
                height: 100%;
                border-top-left-radius: 1rem;
                border-bottom-left-radius: 1rem;
              }
              &:hover .type_cover {
                display: block;
              }
              .type_cover {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.3);
                border-top-left-radius: 1rem;
                border-bottom-left-radius: 1rem;
                color: white;
                padding: 2rem;
                font-size: 2rem;
                font-family: "Dancing Script", cursive;
                display: none;
              }
            }
            .classification {
              flex: 7.5;
              height: auto;
              display: flex;
              list-style: none;
              flex-wrap: wrap;
              li {
                width: 33.3%;
                height: 12rem;
                outline: 1px solid #e1e0e0;
                display: flex;
                background: #ffffff;
                .name_price {
                  flex: 1.4;
                  height: 100%;
                  padding: 2rem 1.5rem;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  .name {
                    font-size: 1.2rem;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                  }
                  .price {
                    margin-top: 1rem;
                    p {
                      color: #999;
                    }
                  }
                }
                .photo {
                  flex: 2;
                  height: 100%;
                  img {
                    width: 100%;
                    height: 100%;
                    cursor: pointer;
                    transition: all 0.5s ease;
                  }
                  &:hover img {
                    transform: scale(1.1);
                  }
                }
              }
            }
          }
        }
      }
      .lis {
        width: 100%;
        height: auto;
        margin-top: 2rem;
        p {
          font-size: 1.5rem;
        }
        ul {
          width: 100%;
          height: auto;
          display: flex;
          flex-wrap: wrap;
          gap: 1%;
          margin-top: 0.5rem;
          list-style: none;
          li {
            width: 24%;
            height: 23rem;
            box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
            margin: 1rem 0;
            .lis_top {
              width: 100%;
              height: 80%;
              img {
                width: 100%;
                height: 100%;
              }
            }
            .lis_btm {
              width: 100%;
              height: 20%;
              .name_fz,.price_fz,.Seller_name{
                margin: 0;
                padding: 0;
                font-size: 1rem;
                color:#8b96a5;
                padding: .1rem .5rem;
              }
              // .name_fz{
              //     font-size:1.2rem;
              //     margin-left:1rem;
              //     font-family: "Dancing Script", cursive;
              //     white-space: nowrap;
              //     overflow: hidden;
              //     text-overflow: ellipsis;
              //     color:#8b96a5;
              //     padding: 0;
              //   }

              //   .price_fz{
              //     font-size:1.2rem;
              //     // margin-top:.5rem;
              //     margin-left:1rem;
              //     padding: 0;
              //   }
              //   .Seller_name{
              //     font-size:1rem;
              //     // margin-top:.5rem;
              //     margin-left:1rem;
              //     color:#8b96a5;
              //   }
            }
          }
        }
      }
    }
  }
}
</style>