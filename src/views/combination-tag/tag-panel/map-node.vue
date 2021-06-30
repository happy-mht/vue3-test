<template>
  <div>
    <template v-if="!isEdit">
      {{ tag.value.values.join() }}
    </template>
    <el-form v-else ref="form" :model="formData" size="small" :rules="rules" :show-message="false">
      <el-form-item prop="value" class="tag-form-item">
        <selectall
          size="small"
          style="width: calc(100% - 32px)"
          :opt-list="tag.tagEnumInfo || tag.enumList"
          @select-change="handeSelect"
          :selected-list="tag.value.keys"
          multiple
          :collapse-tags="false" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import selectall from '@/components/select-all.vue'

export default {
  name: 'compontent_3',
  components: { selectall },
  props: {
    isEdit: {
      type: Boolean
    },
    tag: {
      type: Object
    }
  },
  data() {
    const validateMap = (rule, value, cb) => {
      console.log(value)
      if (value.length === 0) cb('请选择')
      else cb()
    }
    return {
      formData: {
        value: []
      },
      rules: {
        value: [
          { type: 'object', validator: validateMap, trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    tag: {
      handler: function(val) {
        this.formData.value = val.value.keys
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    handeSelect(e) {
      this.formData.value = e
      this.$emit('change-enum', e)
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

<style scoped lang="scss">
.tag-form-item {
  margin-bottom: 0;
}
</style>