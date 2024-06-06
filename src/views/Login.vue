<template>
    <div class="login_container">
      <div class="main" :class="{ 'right-panel-active': isRightPanelActive }">
        <div class="form-container sign-up-container">
          <form action="#">
            <h1>注册</h1>
            <span class="register_text">立即注册获得更多资源</span>
            <input type="text" placeholder="用户名" v-model="sigUsername" />
            <input type="password" placeholder="字母与数字组合,且长度为5-12个字符" v-model="sigPassword"/>
            <input type="password" placeholder="确认密码" v-model="password2" />
            <el-button :plain="true" @click="sign" class="btn">注册</el-button>
          </form>
        </div>
  
        <div class="form-container sign-in-container">
          <form action="#">
            <h1>登录</h1>
            <span class="login_text">立即登录查看更多内容</span>
            <input type="text" placeholder="用户名" v-model="username"/>
            <input type="password" placeholder="密码"  v-model="password"/>
            <el-button :plain="true" @click="login" class="btn">登录</el-button>
          </form>
        </div>
  
        <div class="overlay-container">
          <div class="overlay">
            <div class="overlay-panel overlay-left">
              <h1>已有帐号？</h1>
              <p>请使用您的帐号进行登录</p>
              <button class="switcher" @click="activateSignIn">登录</button>
            </div>
            <div class="overlay-panel overlay-right">
              <h1>没有帐号？</h1>
              <p>立即注册加入我们，和我们享受好时光吧</p>
              <button class="switcher" @click="activateSignUp">注册</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import axios from 'axios'
  import { useRouter } from 'vue-router';
  import { ElMessage } from 'element-plus'
  import Cookies from 'js-cookie'

    const router = useRouter();


  

    const username = ref('');
    const password = ref('');
    const sigUsername = ref('');
    const sigPassword = ref('');
    const password2 = ref('');
  
  const isRightPanelActive = ref(false);
  
  const activateSignIn = () => {
    isRightPanelActive.value = false;
  };
  
  const activateSignUp = () => {
    isRightPanelActive.value = true;
  };
  
  const login = () => {
    if(username.value === '' || password.value === ''){
        ElMessage.warning('用户名或密码不能为空')
        return
    }
    axios.post('https://api3638.wagu.vip/user/login',{
        username: username.value,
        password: password.value
    }).then(res=>{
        Cookies.set('user',JSON.stringify(res.data.user))
        Cookies.set('token', res.data.token)
        router.push('/home')
        ElMessage.success("登录成功")
    }).catch(err=>{
        ElMessage.error(err.response.data)
    })
  }
  const sign = () => {
    if(sigUsername.value === '' || sigPassword.value === '' || password2.value === ''){
        ElMessage.warning('用户名或密码不能为空')
        return
    }
    if(sigPassword.value !== password2.value){
        ElMessage.warning('两次密码不一致')
        return
    }
    axios.post('https://api3638.wagu.vip/user/register',{
        username: sigUsername.value,
        password: sigPassword.value
    }).then(res=>{
        ElMessage.success('注册成功')
        isRightPanelActive.value = false
    }).catch(err=>{
        ElMessage.error(err.response.data)
    })
  }
  

  
  </script>

<style scoped>
.register_text,
.login_text {
  margin: 2%;
  color: #999;
}
.login_container {
  width: 100vw;
  font-family: "Montserrat", sans-serif;
  background: #f6f5f7;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

h1 {
  font-weight: bold;
  margin: 0;
}

p {
  font-size: 0.9rem;
  line-height: 1.2rem;
  letter-spacing: 0.5px;
  margin: 1.5rem 0 2rem;
  padding-left: 5%;
}

span {
  font-size: 0.8rem;
}

a {
  color: #333;
  font-size: 0.8rem;
  text-decoration: none;
  margin: 0.9rem 0;
}

.main {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 0.8rem 1.8rem rgba(0, 0, 0, 0.25),
    0 0.6rem 0.6rem rgba(0, 0, 0, 0.22);
  position: relative;
  overflow: hidden;
  width: 48rem;
  height: 30rem;
}

.form-container form {
  background: #fff;
  display: flex;
  flex-direction: column;
  padding: 0 3rem;
  height: 100%;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.social-container {
  margin: 1.2rem 0;
}

.social-container a {
  border: 1px solid #ddd;
  border-radius: 50%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin: 0 0.45rem;
  height: 2.5rem;
  width: 2.5rem;
}

.social-container a:hover {
  background-color: #eee;
}

.form-container input {
  background: #eee;
  border: none;
  padding: 0.8rem 0.9rem;
  margin: 0.5rem 0;
  width: 100%;
  outline: none;
  border-radius: 0.5rem;
}

button {
  border-radius: 1.3rem;
  border: 1px solid #b6b6b5;
  background: #b6b6b5;
  color: #fff;
  font-size: 0.8rem;
  font-weight: bold;
  padding: 0.7rem 2.5rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: transform 80ms ease-in;
  cursor: pointer;
}

.btn {
  border-radius: 1.3rem;
  border: 1px solid #b6b6b5;
  background: #b6b6b5;
  color: #fff;
  font-size: 0.8rem;
  font-weight: bold;
  padding: 0.7rem 2.5rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: transform 80ms ease-in;
  cursor: pointer;
  margin-top: 5%;
}

button:active {
  transform: scale(0.95);
}

button:focus {
  outline: none;
}

button.switcher {
  background: transparent;
  border-color: #fff;
}

.form-container {
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.6s ease-in-out;
}

.sign-in-container {
  left: 0;
  width: 50%;
  z-index: 2;
}

.sign-up-container {
  left: 0;
  width: 50%;
  z-index: 1;
  opacity: 0;
}

.overlay-container {
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transition: transform 0.6s ease-in-out;
  z-index: 100;
}

.overlay {
  background: linear-gradient(to right, #66b2ff, #94b4d5) no-repeat 0 0 / cover;
  color: #fff;
  position: relative;
  left: -100%;
  height: 100%;
  width: 200%;
  transform: translateY(0);
  transition: transform 0.6s ease-in-out;
}

.overlay-panel {
  position: absolute;
  top: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 40px;
  height: 100%;
  width: 50%;
  text-align: center;
  transform: translateY(0);
  transition: transform 0.6s ease-in-out;
}

.overlay-right {
  right: 0;
  transform: translateY(0);
}

.overlay-left {
  transform: translateY(-20%);
}

.main.right-panel-active .sign-in-container {
  transform: translateY(100%);
}

.main.right-panel-active .overlay-container {
  transform: translateX(-100%);
}

.main.right-panel-active .sign-up-container {
  transform: translateX(100%);
  opacity: 1;
  z-index: 5;
}

.main.right-panel-active .overlay {
  transform: translateX(50%);
}

.main.right-panel-active .overlay-left {
  transform: translateY(0);
}

.main.right-panel-active .overlay-right {
  transform: translateY(20%);
}
</style>