<template>
  <div class="tag-item-container-2">
    <slot></slot>
    <el-button v-if="isEdit" class="red" type="text" @click="$emit('delete-tag')"><i class="iconshanchu iconfont" /></el-button>
  </div>
</template>

<script>
export default {
  name: 'SecondContainer',
  props: {
    isEdit: Boolean
  }
}
</script>

<style lang="scss" scoped>
.tag-item-container-2 {
  width: 100%;
  min-width: 694px;
  background: #F8F8FF;
  padding: 12px 48px;
  position: relative;
  &:hover {
    .red {
      display: block;
    }
  }
}
.red {
  color: $secondRed;
  position: absolute;
  right: 16px;
  top: 16px;
  display: none;
  &:hover {
    opacity: 0.8;
  }
  .iconfont {
    font-size: 14px;
  }
}
</style>