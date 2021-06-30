<template>
  <div v-show="visible" class="loading-box">
    <span class="ant-spin-dot ant-spin-dot-spin" :style="{animationDuration: `${time}ms`}">
      <i></i><i></i><i></i><i></i>
    </span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: true,
      time: 800
    }
  }
}
</script>
<style lang="scss" scoped>
.loading-box {
  position: absolute;
  z-index: 2000;
  background-color: rgba(255, 255, 255, 0.9);
  margin: 0;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  .ant-spin-dot {
    position: relative;
    left: 50%;
    top: 50%;
    transform: translate(-50% -50%);
    display: inline-block;
    font-size: 20px;
    width: 30px;
    height: 30px;
  }
  .ant-spin-dot-spin {
    transform: rotate(45deg);
    animation: antRotate  infinite linear;
  }

  .ant-spin-dot i {
    width: 12px;
    height: 12px;
    border-radius: 100%;
    background-color: #1890ff;
    transform: scale(0.75);
    display: block;
    position: absolute;
    opacity: 0.3;
    animation: antSpinMove 1s infinite linear alternate;
    transform-origin: 50% 50%;
    &:nth-child(1) {
      left: 0;
      top: 0;
    }
    &:nth-child(2) {
      right: 0;
      top: 0;
      animation-delay: 0.4s;
    }
    &:nth-child(3) {
      right: 0;
      bottom: 0;
      animation-delay: 0.8s;
    }
    &:nth-child(4) {
      left: 0;
      bottom: 0;
      animation-delay: 1.2s;
    }
  }
  @keyframes antSpinMove {
    to {
      opacity: 1;
    }
  }
  @keyframes antRotate {
    to {
      transform: rotate(405deg);
    }
  }
}
</style>
