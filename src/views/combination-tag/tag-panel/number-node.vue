<template>
  <div>
    <template v-if="!isEdit">
      N {{ tag.value.operator }}
      <template v-if="tag.inputType === 0">{{ tag.value.number }}</template>
      <template v-else>{{ tag.value.referenceTagName }}</template>
    </template>
    <el-form v-else ref="form" :model="tagForm" size="small" :rules="rules" :show-message="false">
      <el-radio v-model="inputType" :label="0" class="svg-radio" @click="$emit('change', { key:'inputType', val: 0 })">输入数值</el-radio>
      <el-radio v-model="inputType" :label="1" class="svg-radio" @click="$emit('change', { key:'inputType', val: 1 })">引用标签</el-radio>
      <span style="margin-right: 8px">N</span>
      <el-form-item prop="value" class="tag-form-item">
        <el-input
          v-if="inputType === 0"
          v-model="tagForm.number"
          size="small"
          style="width: 200px"
          placeholder="请输入"
          @input="handleInput"
          clearable>
          <template #prepend>
            <el-select v-model="tag.value.operator" size="small" style="width: 50px">
              <el-option label=">" value=">" />
              <el-option label="<" value="<" />
              <el-option label="=" value="=" />
              <el-option label=">=" value=">=" />
              <el-option label="<=" value="<=" />
            </el-select>
          </template>
        </el-input>
        <select-tag
          v-else
          v-on="$attrs"
          :base-tag-type="1"
          :tag-id="tag.tagId"
          v-model="tagForm.referenceTagName"
          :operator="tag.value.operator" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import selectTag from './select-tag.vue'
export default {
  name: 'compontent_1',
  components: { selectTag },
  props: {
    isEdit: {
      type: Boolean
    },
    tag: {
      type: Object
    }
  },
  data() {
    const validateValue = (rule, value, cb) => {
      if (this.inputType === 0) {
        if (!this.tagForm.number) cb('请输入')
        else if (this.tagForm.number == 0 && this.tag.value.operator === '<') {
          cb('不能小于0')
        } else cb()
      }
      else if (this.inputType === 1 && !this.tagForm.referenceTagName) {
        cb('请选择')
      } else cb()
    }
    return {
      tagForm: {
        number: '',
        referenceTagName: ''
      },
      inputType: '',
      number: '',
      referenceTag: '',
      rules: {
        value: [
          { validator: validateValue }
        ]
      }
    }
  },
  watch: {
    tag: {
      handler: function(val) {
        this.inputType = val.inputType
        this.tagForm = val.value
      },
      deep: true,
      immediate: true
    },
    inputType() {
      this.tagForm.number = ''
      this.tagForm.referenceTagName = ''
    }
  },
  methods: {
    handleInput(e) {
      let val = e.replace(/[^\d]/g, '')
      this.$emit('change', { key: 'number', val })
    },
    async validate() {
      try {
        await this.$refs.form.validate()
        return Promise.resolve()
      } catch (e) {
        return Promise.reject(e)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.tag-form-item {
  display: inline-block;
  margin-bottom: 0;
  :deep(.el-form-item__error) {
    left: 50px;
  }
}
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