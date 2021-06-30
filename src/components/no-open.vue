<template>
  <div class="shop-noPriv-panel">
    <img src="@/assets/images/scene.png" />
    <span>{{msg}}</span>
    <span>您可前往OC-新建流程-CDL需求提出场景需求</span>
  </div>
</template>
<script>
export default {
  name: 'no-open',
  props: {
    msg: String
  }
}
</script>

<style scoped lang="scss">
.shop-noPriv-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100% - 68px);
  padding-bottom: 100px;
  img {
    width: 80px;
    margin-bottom: 20px;
  }
  span {
    color: rgba(0,0,0,0.65);
    line-height: 2em;
  }
}
</style>