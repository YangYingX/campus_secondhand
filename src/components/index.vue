<template>
  <div>
    <div class="left">
      <img class="leftImg" :src="src" alt="" />
      <div v-show="topShow" class="top" :style="topStyle"></div>
      <div
        class="maskTop"
        @mouseenter="enterHandler"
        @mousemove="moveHandler"
        @mouseout="outHandler"
      ></div>
    </div>
    <div v-show="rShow" class="right">
      <img
        :style="r_img"
        class="rightImg"
        :src="src"
        alt=""
      />
    </div>
  </div>
</template>
<style scoped>
.rightImg {
  display: inline-block;
  width: 800px;
  height: 800px;
  position: absolute;
  top: 0;
  left: 0;
} 
.right {
  width: 200px;
  height: 200px;
  border: 1px solid red;
  position: relative;
  overflow: hidden;
  
}
.maskTop {
  width: 400px;
  height: 400px;
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
}
.top {
  width: 200px;
  height: 200px;
  background-color: lightcoral;
  opacity: 0.4;
  position: absolute;
  top: 0;
  left: 0;
} 
.leftImg {
  width: 400px;
  height: 400px;
  display: inline-block;
} 
.left {
  width: 400px;
  height: 400px;
  border: 1px solid teal;
  float: left;
  position: relative;
}
</style>
<script>
export default {
  props:["src"],
  data() {
    return {
      topStyle: { transform: "" },
      r_img: {},
      topShow: false,
      rShow: false,
    };
  },
  methods: {
    enterHandler() {
      this.topShow = true;
      this.rShow = true;
    },
    moveHandler(event) {
      let x = event.offsetX;
      let y = event.offsetY;
      let topX = x - 100 < 0 ? 0 : x - 100;
      let topY = y - 100 < 0 ? 0 : y - 100;
      if (topX > 200) {
        topX = 200;
      }
      if (topY > 200) {
        topY = 200;
      }
      this.topStyle.transform = `translate(${topX}px,${topY}px)`;
      this.r_img.transform = `translate(-${2 * topX}px,-${2 * topY}px)`;
    },
    outHandler() {
      this.topShow = false;
      this.rShow = false;
    },
  },
};
</script>

