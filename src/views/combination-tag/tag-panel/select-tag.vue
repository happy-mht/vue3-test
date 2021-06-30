<template>
  <el-autocomplete
    ref="autocomplete"
    :value="tagName"
    size="small"
    value-key="tagName"
    label="tagId"
    placeholder="请选择标签"
    clearable
    @clear="handleClear"
    @blur="handleBlur"
    style="width: 200px"
    :fetch-suggestions="querySearch">
    <template #prepend>
      <el-select :value="operator" size="small" style="width: 50px" @change="$emit('change', { key:'operator', val: $event })">
        <el-option label=">" value=">" />
        <el-option label="<" value="<" />
        <el-option label="=" value="=" />
        <el-option label=">=" value=">=" />
        <el-option label="<=" value="<=" />
      </el-select>
    </template>
    
    <template v-slot="{ item }">
      <span @click="handleClick(item)">{{ item.tagName }}</span>
    </template>
  </el-autocomplete>
</template>

<script>
import { getShopTags } from '@/api/tag'

export default {
  name: 'SelectTag',
  inheritAttrs: false,
  props: {
    operator: {
      type: String
    },
    value: {
      type: String
    },
    baseTagType: {
      type: Number
    },
    tagId: {
      type: [Number, String]
    }
  },
  watch: {
    value: {
      handler: function(val) {
        this.tagName = val
      },
      immediate: true
    }
  },
  data() {
    return {
      tagList: [],
      tagName: ''
    }
  },
  created() {
    this.fetchList()
  },
  methods: {
    async fetchList(tagName = '') {
      let _self = this
      try {
        const res = await getShopTags({
          firstTagType: 0,
          baseTagType: this.baseTagType, // 数值型1：时间型：2
          tagName
        })
        res.forEach(item => {
          _self.tagList.push(...item.threeTagList)
        })
        _self.tagList = _self.tagList.filter(i => i.tagId !== this.tagId)
      } catch (e) {
        console.log(e)
      }
    },
    handleClick(item) {
      this.$emit('change-tag', item)
    },
    handleClear() {
      this.$emit('change-tag', { tagId: '', tagName: '', tagEnName: '' })
    },
    handleBlur() {
      if (this.$refs.autocomplete.suggestions.length === 0) {
        this.tagName = ''
        this.$emit('change-tag', { tagId: '', tagName: '', tagEnName: '' })
      }
    },
    querySearch(q, cb) {
      const results = q ? this.tagList.filter(this.createFilter(q)) : this.tagList
      cb(results)
    },
    createFilter(q) {
      return tag => {
        return (tag.tagName.toLowerCase().indexOf(q.toLowerCase()) === 0)
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.svg-radio {
  margin-right: 16px;
  :deep(.el-radio__label) {
    padding-left: 4px;
  }
  :deep(.el-radio__inner) {
    width: 10px;
    height: 10px;
  }
}
</style>