<!--
  @doc: 店铺下拉选择组件
-->
<template>
  <el-select
    v-bind="$attrs"
    size="small"
    filterable>
    <el-option
      v-for="item of list"
      :disabled="item.shopId === shop.shopId"
      :key="item.shopId"
      :value="item.shopId"
      :label="item.shopName"
      @click="$emit('item-click', item)"
    />
  </el-select>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'AllShopSelect',
  inheritAttrs: false,
  props: {
    request: {
      type: Function,
      required: true
    }
  },
  data: () => ({
    list: [],
  }),
  computed: {
    ...mapGetters(['shopList', 'shop'])
  },
  mounted() {
    if (this.request) this.getList()
    else this.list = this.shopList
  },
  methods: {
    async getList() {
      const response = await this.request()
      this.list = Object.freeze(response)
    }
  }
}
</script>
