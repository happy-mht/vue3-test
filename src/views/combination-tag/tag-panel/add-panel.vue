<template>
  <div class="container">
    <template v-if="isAdd">
      <span style="color: #353C47;">点击右侧标签添加条件</span>
    </template>
    <template v-else>
      <el-button v-if="!isLeaf" :disabled="disabled" type="text" size="small" @click="$emit('add-container')">添加容器</el-button>
      <span v-if="!isLeaf" class="grey">或</span>
      <el-button class="btn-sub" size="small" :disabled="disabled" @click="$emit('add-tag')">添加标签</el-button>
    </template>
  </div>
</template>

<script>
export default {
  name: 'AddPanel',
  props: {
    item: {
      type: Object,
      default: () => ({})
    },
    isLeaf: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean
    }
  },
  computed: {
    isAdd() {
      return this.item.isAdd
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
  width: 100%;
  min-width: 694px;
  position: relative;
  height: 52px;
  display: flex;
  align-items: center;
  border: 1px dashed #B8CDFD;
  border-radius: 8px;
  box-sizing: border-box;
  justify-content: center;
}
.tag-item-container + .container {
  margin-top: 16px;
}
.grey {
  margin: 0 10px;
  color: rgb(197, 201, 206);
}
</style>