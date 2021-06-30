<!--
  @desc: 页面器
-->
<template>
  <el-pagination
    style="padding-top: 8px;text-align: left;"
    background
    layout="prev, pager, next, jumper, slot, total"
    v-bind="$attrs"
    :page-sizes="pageSizes">
    </el-pagination>
</template>
<script>
export default {
  name: 'CdlPagination',
  inheritAttrs: false,
  props: {
    pageSizes: {
      type: Array,
      default: () => ([10, 20, 50, 100])
    }
  },
}
</script>