<template>
  <div class="wrapper">
    <template v-if="shopList.length === 0">
      <p class="title">没有店铺数据权限，请到OC中申请相应店铺的权限</p>
      <div class="content">
        <div style="width: 100%;max-width: 700px;">
          步骤<br>
          1. 登录OC(oc.leqee.com)，在OC工作台中选取“流程管理-新建流程”，右侧选择“人事模块-系统权限申请” <br>
          2. 在流程发起中找到申请类型，选择店铺角色<br>
          3. 按照自身店铺需求，选取服务店铺<br>
          4. 按照自身角色，选取服务店铺的角色
        </div>
        <img src="@/assets/images/tip.png" style="margin-top: 20px;max-width: 700px;width: 100%;"/>
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'no-shop',
  computed: {
    ...mapGetters([
      'shopList'
    ])
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  margin: 0 12px;
  padding: 0 16px;
  min-height: calc(100vh - 136px);
  background-color: white;
  .title {
    padding-top: 20px;
    color: rgba(0,0,0,0.85);
    font-size: 18px;
    font-weight: bold;
    text-align: center;
  }
}
.content {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}
</style>