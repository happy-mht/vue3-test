<template>
  <div>
    <template v-if="!isEdit">
      {{ tag.value.values && tag.value.values[0] }}
    </template>
    <template v-else>
      <el-radio-group v-model="value" size="small" class="boolean-radio" @change="change">
        <el-radio-button v-for="item in enumList" :key="item.key" :label="item.key">{{item.value}}</el-radio-button>
      </el-radio-group>
    </template>
  </div>
</template>

<script>
export default {
  name: 'compontent_4',
  props: {
    isEdit: {
      type: Boolean
    },
    tag: {
      type: Object,
      required: true,
      default: () => ({
        value: {
          values: [],
          keys: []
        }
      })
    }
  },
  data() {
    return {
      value: ''
    }
  },
  watch: {
    tag: {
      handler: function(val) {
        this.value = val.value.keys[0]
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    enumList() {
      return this.tag.enumList || this.tag.tagEnumInfo
    }
  },
  methods: {
    change(e) {
      this.$emit('change-enum', [e])
    }
  }
}
</script>

<style scoped lang="scss">
.boolean-radio {
  :deep(.el-radio-button__inner) {
    height: 24px;
    border-radius: 8px;
    text-align: center;
    padding: 0;
    border: none;
    padding: 0 10px;
    line-height: 24px;
    background: #F9F8FD;
    color: #353C47;
    margin-right: 8px;
  }
  :deep(.el-radio-button__orig-radio:checked+.el-radio-button__inner) {
    background: #FFEBF0;
    box-shadow: none;
    color: #353C47;
  }
}
</style>