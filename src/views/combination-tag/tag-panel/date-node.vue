<template>
  <div>
    <template v-if="!isEdit">
      N {{ tag.value.operator }}
      <template v-if="tag.inputType === 0">{{ tag.value.time }}</template>
      <template v-else>{{ tag.value.referenceTagName }}</template>
    </template>
    <el-form v-else ref="form" size="small" :model="tagForm" :rules="rules" :show-message="false">
      <el-radio v-model="inputType" :label="0" class="svg-radio" @click="$emit('change', { key:'inputType', val: 0 })">选择时间</el-radio>
      <el-radio v-model="inputType" :label="1" class="svg-radio" @click="$emit('change', { key:'inputType', val: 1 })">引用标签</el-radio>
      <span style="margin-right: 8px">N</span>
      <el-form-item prop="value" class="tag-form-item">
        <template v-if="inputType === 0">
          <el-input
            size="small"
            class="date-input">
            <template #prepend>
              <el-select v-model="tagForm.operator" size="small" style="width: 50px">
                <el-option label=">" value=">" />
                <el-option label="<" value="<" />
                <el-option label="=" value="=" />
                <el-option label=">=" value=">=" />
                <el-option label="<=" value="<=" />
              </el-select>
            </template>
          </el-input>
          <el-date-picker
            v-model="tagForm.time"
            type="date"
            class="date-picker"
            size="small"
            style="width: 150px"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            @change="handleChange"
            :picker-options="pickerOptions" />
        </template>
        <select-tag
          v-else
          v-model="tagForm.referenceTagName"
          :base-tag-type="2"
          :tag-id="tag.tagId"
          :operator="tag.value.operator" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import selectTag from './select-tag.vue'
import dayjs from 'dayjs'

export default {
  name: 'compontent_2',
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
      console.log(value)
      if (this.inputType === 0 && !this.tagForm.time) {
        cb('请输入')
      } else if (this.inputType === 1 && !this.tagForm.referenceTagName) {
        cb('请选择')
      } else cb()
    }
    return {
      tagForm: {
        operator: '',
        time: null,
        referenceTagName: ''
      },
      inputType: '',
      pickerOptions: {
        disabledDate(time) {
          return dayjs(time) <= dayjs().subtract(721, 'day')
        }
      },
      rules: {
        value: [
          { validator: validateValue }
        ],
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
      this.tagForm.time = null
      this.tagForm.referenceTagName = ''
    }
  },
  methods: {
    async validate() {
      try {
        await this.$refs.form.validate()
        return Promise.resolve()
      } catch (e) {
        return Promise.reject(e)
      }
    },
    handleChange(e) {
      this.$emit('change', { key: 'time', val: e })
    }
  }
}
</script>

<style scoped lang="scss">
.tag-form-item {
  display: inline-block;
  margin-bottom: 0;
  :deep(.el-form-item__error) {
    left: 50px;
  }
}
.date-input {
  width: 50px!important;
  :deep(.el-input__inner) {
    padding: 0;
    border-right-width: 0;
  }
  :deep(.el-input-group__prepend .el-input__inner) {
    padding: 0 8px;
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
.date-picker :deep(.el-input__inner) {
  border-radius: 0 8px 8px 0;
  border-left: none;
}
</style>