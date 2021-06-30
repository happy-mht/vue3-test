
<!--
  @desc: 详情页面的页眉
 -->
<template>
  <div class="fixed-top">
    <div class="system">
      <div class="logo-wrapper">
        <i class="iconlogo1 iconfont"/>
      </div>
      <span class="title">
        <el-divider direction="vertical" style="background-color: #EAEEFA;margin-left: -16px"></el-divider>
        {{ pageName }}
      </span>
    </div>
    <div class="user">
      <img src="@/assets/images/touxiang.png"  style="width: 18px"/>
      <span class="username" style="font-size: 14px;margin-left: 10px">{{ name }}</span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'pageHeader',
  props: {
    pageName: {
      required: true,
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapGetters(['name'])
  }
}
</script>
<style lang="scss" scoped>
  .fixed-top {
    top: 0;
    display: flex;
    justify-content: space-between;
    padding: 14px 24px 14px 0;
    background-color: white;
    position: relative;
    box-shadow: 0px -1px 0px 0px #E1E6EB;
    .logo-wrapper {
      position: absolute;
      height: 100%;
      display: flex;
      align-items: center;
      padding-left: 24px;
      width: 94px;
      background: #FFFFFF linear-gradient(270deg, rgba(255, 255, 255, 0.5) 0%, #F4E0E6 100%);
    }
    .system, .user {
      display: flex;
      align-items: center;
    }
    .iconlogo1 {
      color: $primaryRed;
    }
    .title {
      z-index: 1;
      font-size: 14px;
      color: #353C47;
      font-weight: bold;
      margin-left: 64px;
    }
  }
</style>