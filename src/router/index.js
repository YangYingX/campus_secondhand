import { createRouter, createWebHistory } from 'vue-router'
import Cookies from 'js-cookie'
import axios from 'axios'

const routes = [
  { path: '/', name: 'login', component: () => import('../views/Login.vue') },
  { path: '/home', name: 'home', component: () => import('../views/Home.vue') },
  { path: '/individual', name: 'individual', component: () => import('../views/Individual.vue') },
  { path: '/details', name: 'details', component: () => import('../views/Details.vue') },
  { path: '/order', name: 'order', component: () => import('../views/Order.vue') },
  { path: '/collection', name: 'collection', component: () => import('../views/Collection.vue') },
  { path: '/introduction', name: 'introduction', component: () => import('../views/Introduction.vue') },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

/**
 * @description: 路由守卫
 * @param {to} 跳转的路由
 * @param {from} 跳转前的路由
 * @param {next} 跳转函数
 * 在跳转之前判断是否有token以及是否有效，如果有token并且有效则跳转到home页面，否则跳转到login页面
 */
router.beforeEach((to, from, next) => {
  const token = Cookies.get('token');
  if (to.name == 'login' && token) {
    axios.post('https://api3638.wagu.vip/user/checkToken', { token }, { headers: { 'Authorization': `Bearer ${token}` } }).then(res => {
      Cookies.set('token', res.data.token)
      Cookies.set('user',JSON.stringify(res.data.user))
      next('/home')
    }).catch(err => {
      console.log(err)
      next()
    })
  } else {
    next()
  }
})




export default router
