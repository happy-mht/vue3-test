<template>
  <el-select
    v-bind="$attrs"
    v-model="selectIds"
    :disabled="disabled"
    :collapse-tags="false"
    :placeholder="placeholder"
    multiple
    filterable
    clearable
    transfer
    size="small"
    @change="selectChange"
    @visible-change="openChange">
    <el-option v-if="optList.length" value="all" @click="selectAll" :label="selectAllText" />
    <el-option v-for="(item, index) in optList" :key="index" :value="item.key" :label="item.value" />
  </el-select>
</template>
<script>
export default {
  name: 'SelectAll',
  props: {
    optList: {
      type: Array,
      default: () => ([])
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    selectedList: {
      type: Array,
      default: () => ([])
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selectIds: [],
      isSelectAll: false,
      selectAllText: '全选'
    }
  },
  watch: {
    selectIds(newVal) {
      this.$emit('selectall', newVal)
    },
    selectedList: {
      handler: function(newVal) {
        this.selectIds = newVal
        if (newVal.length === 0) this.isSelectAll = false
      },
      deep: true,
      immediate: true
    },
    isSelectAll(newVal) {
      this.selectIds = []
      if (newVal) {
        this.selectAllText = '全不选'
        for (const item of this.optList) {
          this.selectIds.push(item.key)
          this.$emit('select-change', this.selectIds)
        }
      } else {
        this.selectAllText = '全选'
        this.$emit('select-change', this.selectIds)
      }
    }
  },
  methods: {
    selectAll() {
      this.isSelectAll = !this.isSelectAll
      this.$emit('setAll', this.isSelectAll)
    },
    selectChange(val) {
      let isChange = true
      for (const item of val) {
        if (item === 'all') {
          isChange = false
        }
      }
      if (isChange) {
        this.$emit('select-change', this.selectIds)
      }
    },
    openChange(val) {
      this.$emit('openChange', val)
    }
  }
}
</script>
<style scoped>

</style>
