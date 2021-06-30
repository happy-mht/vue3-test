<!--
 * @Description: 后端模糊搜索商品
 -->
<template>
  <el-select
    v-model="fooName"
    class="good-select"
    :style="{'width':`${width}`}"
    :placeholder="placeholder"
    :remote-method="doSearch"
    :disabled="disabled"
    filterable
    remote
    clearable
    transfer
    multiple
    :loading="loading"
    :collapse-tags="collapseTags"
    @clear="clear"
    @change="getResult">
    <el-option
      v-if="list.length"
      value="all"
      @click="selectAll"
      :disabled="!selectALlAble"
      :label="selectAllText" />
    <el-option
      v-for="item in list"
      :key="item.goodsCode"
      :disabled="selectedList.includes(item.goodsCode)"
      :label="item.goodsName"
      :value="item.goodsCode">
    </el-option>
  </el-select>
</template>

<script>
import { searchGoods } from '@/api/common'
import { mapGetters } from 'vuex'

export default {
  name: 'SelectProduct',
  props: {
    selectedList: { // 已经添加的商品选项
      type: Array,
      default: () => ([])
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      default: '商品名称/id模糊搜索'
    },
    width: {
      type: String,
      default: '200px'
    },
    collapseTags: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      fooName: [],
      loading: false,
      defaultList: [],
      list: [],
      isSelectAll: false,
      selectAllText: '全选'
    }
  },
  computed: {
    ...mapGetters(['shop']),
    selectALlAble() {
      return this.list.some(i => !this.selectedList.includes(i.goodsCode))
    }
  },
  watch: {
    shop: {
      handler: function () {
        this.initList()
      },
      deep: true,
      immediate: true
    },
    isSelectAll(newVal) {
      this.fooName = []
      if (newVal) {
        this.selectAllText = '全不选'
        let arr = []
        this.list.forEach(item => {
          if (!this.selectedList.includes(item.goodsCode)) {
            this.fooName.push(item.goodsCode)
            arr.push(item)
          }
        })
        if (arr.length) this.$emit('select', this.fooName, arr)
      } else {
        this.selectAllText = '全选'
        this.$emit('select', this.fooName, [])
      }
    }
  },
  mounted() {
    this.initList()
  },
  methods: {
    selectAll() {
      if (this.selectALlAble) this.isSelectAll = !this.isSelectAll
    },
    async initList() {
      try {
        this.loading = true
        const res = await searchGoods({ key: '' })
        this.list = res
        this.defaultList = res
        this.loading = false
      } catch (e) {
        console.log(e)
        this.loading = false
      }
    },
    doSearch(q = '') {
      if (this.loading || q == '') {
        return
      }
      this.loading = true

      if (typeof this.timer == 'number') {
        clearTimeout(this.timer)
      }

      this.timer = setTimeout(async () => {
        const res = await searchGoods({ key: q })
        this.list = JSON.parse(JSON.stringify(res))
        this.loading = false
      }, 300)
    },
    clearValue() {
      this.isSelectAll = false
      this.fooName = []
      this.$emit('select', this.fooName)
    },
    clear() {
      this.isSelectAll = false
      this.fooName = []
      this.list = this.defaultList
      this.$emit('select', this.fooName)
    },
    getResult(e) {
      let obj
      if (typeof e === 'object') {
        if (e[0] === 'all') return
        obj = this.list.filter(i => e.includes(i.goodsCode))
      } else {
        obj = this.list.find(i => i.goodsCode === e)
      }
      this.$emit('select', e, obj)
    },
  }
}
</script>

<style lang="scss" scoped>
.good-select ::v-deep {
  .el-tag.el-tag--info {
    position: relative;
  }
  .el-tag__close.el-icon-close {
    right: 0px;
    top: 3px;
    position: absolute;
  }
  .el-select__tags-text {
    white-space: normal !important;
    word-wrap: break-word;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    max-width: 160px;
  }
}
</style>