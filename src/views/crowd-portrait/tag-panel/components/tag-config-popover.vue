<template>
  <el-popover
    placement="bottom"
    width="248"
    trigger="hover">
    <div style="font-size:12px;margin-bottom: 12px">展示样式</div>
    <div>
      <span
        v-if="!tagType || [1, 3, 4, 6, 7].includes(tagType)"
        :class="['style-radio', styleType == 'Column' && 'active']"
        title="柱形图-y"
        @click="$emit('change', 'Column')">
        <svg class="svg-icon">
          <use :xlink:href="`#iconzhuxingtu-y`"></use>
        </svg>
      </span>
      <span
        v-if="!tagType || [3, 4, 6, 7].includes(tagType)"
        :class="['style-radio', styleType == 'Bar' && 'active']"
        title="柱形图-x"
        @click="$emit('change', 'Bar')">
        <svg class="svg-icon">
          <use :xlink:href="`#iconzhuxingtu-x`"></use>
        </svg>
      </span>
      <span
        v-if="!tagType || tagType === 4 || tagType === 7"
        :class="['style-radio', styleType == 'Pie' && 'active']"
        title="环形图"
        @click="$emit('change', 'Pie')">
        <svg class="svg-icon">
          <use :xlink:href="`#iconhuanxingtu`"></use>
        </svg>
      </span>
      <span
        v-if="!tagType || tagType === 2"
        :class="['style-radio', styleType == 'Histogram' && 'active']"
        title="直方图"
        @click="$emit('change', 'Histogram')">
        <svg class="svg-icon">
          <use :xlink:href="`#iconzhifangtu`"></use>
        </svg>
      </span>
      <span
        v-if="!tagType || tagType === 1 || tagType === 2"
        :class="['style-radio', styleType == 'Area' && 'active']"
        title="面积图"
        @click="$emit('change', 'Area')">
        <svg class="svg-icon">
          <use :xlink:href="`#iconmianjitu`"></use>
        </svg>
      </span>
    </div>
    <template #reference>
      <el-button type="text" size="small">
        <i class="iconfont iconshezhi-xianxing" />
      </el-button>
    </template>
  </el-popover>
</template>

<script>
export default {
  name: 'tagConfigPopver',
  props: {
    styleType: String,
    tagType: [String, Number]
  }
}
</script>

<style lang="scss" scoped>
.el-button:hover {
  .iconfont {
    color: $secondRed;
  }
}
.iconfont {
  color: #9DA4B2;
  font-size: 14px;
  cursor: pointer;
}
.style-radio {
  margin-right: 8px;
  display: inline-block;
  text-align: center;
  width: 36px;
  height: 36px;
  padding: 5px;
  cursor: pointer;
  box-sizing: border-box;
  border: 1px solid #FFFFFF;
  border-radius: 4px;
  &.active {
    background: #FFEBF0;
    border-color: #FF74AC;
  }
  &:hover:not(.active) {
    background: #F1F3FE;
    border-color: #F1F3FE;
  }
}
.svg-icon {
  width: 24px;
  height: 24px;
  cursor: pointer;
  outline: none;
}
</style>
