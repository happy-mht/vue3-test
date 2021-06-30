<template>
  <div v-bind="$attrs" class="tag-item-container">
    <div class="tag-name-wrapper">
      <el-tooltip placement="bottom-start" :disabled="!tag.tagDesc">
        <template #content>
          <div style="max-width: 300px">{{ tag.tagDesc }}</div>
        </template>
        <span class="tag-name-txt" :class="['dot color-' + tag.tagType]">{{ tag.tagName }}</span>
      </el-tooltip>
    </div>
    <div style="padding:0 16px;display: table-cell;vertical-align: middle;" :class="{ 'empty-height': isEmpty }">
      <slot>不符合布尔值 TRUE 条件的所有顾客</slot>
    </div>
    <el-button v-if="!isEmpty && isEdit" class="red" type="text" @click="$emit('delete-tag')"><i class="iconshanchu iconfont" /></el-button>
  </div>
</template>

<script>
export default {
  name: 'TagPanel',
  props: {
    tag: {
      type: Object,
      default: () => ({})
    },
    isEdit: Boolean,
    isLeaf: Boolean,
    isEmpty: Boolean
  },
  methods: {
    validate(cb) {
      const tasks = this.$children
        .map(item => item.validate())

      Promise.all(tasks)
        .then(() => cb(true))
        .catch(() => cb(false))
    }
  }
}
</script>

<style lang="scss" scoped>
.empty-height {
  height: 120px;
  line-height: 120px;
}
.red {
  color: $secondRed;
  position: absolute;
  right: 16px;
  display: none;
  top: 16px;
  &:hover {
    opacity: 0.8;
  }
  .iconfont {
    font-size: 14px;
  }
}
.tag-item-container {
  position: relative;
  min-height: 52px;
  width: 100%;
  min-width: 694px;
  display: table;
  align-items: center;
  box-shadow: 0px 0px 4px 0px #F1F3F6;
  border-radius: 8px;
  background-color: white;
  &:hover .red{
    display: inline-block;
  }
}
.tag-name-wrapper {
  display: table-cell;
  vertical-align: middle;
  position: relative;
  width: 20%;
  min-width: 144px;
  max-width: 178px;
  padding: 0 16px;
  background: linear-gradient(90deg, #EBF4FF 0%, #FFEBF0 100%),
              linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, #FFFFFF 100%);
  min-height: 52px;
  border-radius: 8px 0px 0px 8px;
  border: 1px solid #FFFFFF;
  filter: blur(0px);
  align-items: center;
}
.tag-name-txt {
  overflow: hidden;
  position: relative;
  padding-left: 16px;
  display: inline-block;
  width: 100%;
}
.dot {
  &::before {
    position: absolute;
    left: 0;
    top: calc(50% - 4px);
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 90px;
  }
  &.color-1::before {
    background: #298CFF;
  }
  &.color-2::before {
    background: #FD4378;
  }
  &.color-3::before, &.color-6::before {
    background: #71E11C;
  }
  &.color-4::before, &.color-7::before  {
    background: #FFB044;
  }
  &.color-5::before {
    background: #61646D;
  }
}
</style>