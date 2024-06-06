import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'vue-cropper/dist/index.css'
import vueCropper from 'vue-cropper'
import VueZoomPanPinch from 'vue3-zoom-pan-pinch'
import UndrawUi from 'undraw-ui'
import 'undraw-ui/dist/style.css'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';




function setRemUnit() {
  const baseSize = 8;
  const scale = document.documentElement.clientWidth / 750;
  const fontSize = baseSize * Math.min(scale, 2) + "px";
  document.documentElement.style.fontSize = fontSize;
}

setRemUnit();

window.addEventListener("resize", setRemUnit);

createApp(App).use(store).use(router).use(ElementPlus).use(vueCropper).use(VueZoomPanPinch).use(UndrawUi).use(Antd).mount('#app')


