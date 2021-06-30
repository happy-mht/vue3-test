<template>
  <div>
    <template v-if="!isEdit">
      <div style="margin: 12px 0">
        购买次数：N {{ tag.buyNumber.value.operator }}
        <template v-if="tag.buyNumber.inputType == 0">{{ tag.buyNumber.value.number }}</template>
        <template v-else>{{ tag.buyNumber.value.referenceTagName }}</template>
      </div>
      <div style="margin: 12px 0">
        购买金额：N {{ tag.buyAmount.value.operator }}
        <template v-if="tag.buyAmount.inputType == 0">{{ tag.buyAmount.value.number }}</template>
        <template v-else>{{ tag.buyAmount.value.referenceTagName }}</template>
      </div>
      <div style="margin: 12px 0">
        选择商品：
        <el-popover
          placement="top"
          width="268"
          ref="popper"
          trigger="click"
          popper-class="tag-goods-popper">
          <el-table :data="selectGoodsInfo" border size="mini" max-height="500px" style="margin-top: 8px;">
            <el-table-column label="商品名称" prop="goodsName" min-width="200px" show-overflow-tooltip />
            <el-table-column label="商品编码" prop="goodsCode" width="180px" show-overflow-tooltip />
          </el-table>
          <template #reference>
            <el-button type="text" size="small" class="red">查看已选商品</el-button>
          </template>
        </el-popover>
      </div>
      <div style="margin: 12px 0">
        购买时间：
        <template v-if=" tag.selectTime.value.time">
          N {{ tag.selectTime.value.operator }} {{ tag.selectTime.value.time }}
        </template>
        <template v-else>暂无</template>
      </div>
    </template>
    <template v-else>
      <el-form ref="form" :model="tag" :rules="rules" :show-message="false" class="form" size="small">
        <div>
          <el-form-item label="购买次数：" label-width="60px" style="display: inline-block">
            <el-select v-model="buyNumber.inputType" style="width: 56px;" @change="$emit('change-tag-5', { key: 'buyNumber.inputType', val: $event })">
              <el-option :value="0" label="数值" />
              <el-option :value="1" label="标签" />
            </el-select>
            <span style="margin: 0 8px">N</span>
          </el-form-item>
          <el-form-item style="display: inline-block" prop="buyNumber" class="tag-form-item">
            <el-input
              v-if="buyNumber.inputType === 0"
              v-model="buyNumber.value.number"
              size="small"
              style="width: 200px;"
              placeholder="请输入"
              @input="handleInput"
              clearable>
              <template #prepend>
                <el-select
                  v-model="buyNumber.value.operator"
                  size="small"
                  style="width: 50px"
                  @change="$emit('change-tag-5', { key: 'buyNumber.operator', val: $event })">
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
              :base-tag-type="1"
              :tag-id="tag.tagId"
              v-model="referenceTag.buyNumber"
              @change="handleChangeTag('buyNumber.referenceTagId', $event)"
              @change-tag="handleChangeTag('buyNumber.referenceTagId', $event)"
              :operator="tag.buyNumber.value.operator" />
          </el-form-item>
        </div>
        <div>
          <el-form-item label="购买金额：" label-width="60px" style="display: inline-block">
            <el-select v-model="buyAmount.inputType" style="width: 56px;" @change="$emit('change-tag-5', { key: 'buyAmount.inputType', val: $event })">
              <el-option :value="0" label="数值" />
              <el-option :value="1" label="标签" />
            </el-select>
            <span style="margin: 0 8px">N</span>
          </el-form-item>
          <el-form-item prop="buyAmount" style="display: inline-block" class="tag-form-item">
            <el-input
              v-if="buyAmount.inputType === 0"
              v-model="buyAmount.value.number"
              size="small"
              style="width: 200px;"
              placeholder="请输入"
              @input="e => buyAmount.value.number = e.replace(/[^\d]/g, '')"
              clearable>
              <template #prepend>
                <el-select
                  v-model="buyAmount.value.operator"
                  size="small"
                  style="width: 50px"
                  @change="$emit('change-tag-5', { key: 'buyAmount.operator', val: $event })">
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
              v-model="referenceTag.buyAmount"
              :base-tag-type="1"
              :tag-id="tag.tagId"
              @change="handleChangeTag('buyNumber.referenceTagId', $event)"
              :operator="tag.buyAmount.value.operator"
              @change-tag="handleChangeTag('buyAmount.referenceTagId', $event)" />
          </el-form-item>
        </div>
        <div>
          <el-form-item label="购买商品：">
            <select-product
              ref="selectProduct"
              style="margin-right: 8px;"
              width="200px"
              placeholder="请选择商品"
              :selectedList="selectGoodsInfo.map(i => i.goodsCode)"
              @select="handleSelectGoods"
              multiple
              clearAfterSelect
              :collapse-tags="true">
            </select-product>
            <el-popover
              placement="top"
              width="268"
              ref="popper"
              trigger="click"
              popper-class="tag-goods-popper">
              <el-table :data="tag.selectGoodsInfo" border size="mini" style="margin-top: 8px;" max-height="500px" empty-text="全部">
                <el-table-column label="商品名称" prop="goodsName" min-width="200px" show-overflow-tooltip />
                <el-table-column label="商品编码" prop="goodsCode" width="180px" show-overflow-tooltip />
                <el-table-column width="50px" align="center">
                  <template v-slot="{ $index }">
                    <el-button type="text" class="red" @click="deleteGood($index)"><i class="iconfont iconshanchu" /></el-button>
                  </template>
                </el-table-column>
              </el-table>
              <template #reference>
                <el-button type="text" class="red">查看已选商品</el-button>
              </template>
            </el-popover>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="购买时间：" label-width="60px" prop="selectTime" style="display: inline-block" class="tag-form-item">
            <span style="margin: 0 8px">N</span>
            <el-input size="small" class="date-input">
              <template #prepend>
                <el-select v-model="tag.selectTime.value.operator" size="small" style="width: 50px">
                  <el-option label=">" value=">" />
                  <el-option label="<" value="<" />
                  <el-option label="=" value="=" />
                  <el-option label=">=" value=">=" />
                  <el-option label="<=" value="<=" />
                </el-select>
              </template>
            </el-input>
            <el-date-picker
              type="date"
              class="date-picker"
              size="small"
              style="width: 203px"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              v-model="tag.selectTime.value.time"
              :picker-options="pickerOptions"
              placeholder="选择日期" />
          </el-form-item>
        </div>
      </el-form>
    </template>
  </div>
</template>

<script>
import selectTag from './select-tag.vue'
import selectProduct from '@/components/select-product'
import dayjs from 'dayjs'
export default {
  components: { selectTag, selectProduct },
  name: 'compontent_5',
  props: {
    isEdit: {
      type: Boolean
    },
    tag: {
      type: Object
    }
  },
  data() {
    const validateAmount = (rule, value, cb) => {
      if (value.inputType === 0) {
        if (!value.value.number) cb('请输入')
        else if (value.value.number == 0 && value.value.operator === '<') {
          cb('不能小于0')
        } else cb()
      }
      else if (value.inputType === 1 && !value.value.referenceTagId) {
        cb('请选择')
      } else cb()
    }
    const validateTime = (rule, value, cb) => {
      if (!value.value.time) cb('请输入')
      else cb()
    }
    return {
      selectGoodsInfo: [],
      pickerOptions: {
        disabledDate(time) {
          return dayjs(time) <= dayjs().subtract(721, 'day')
        }
      },
      buyAmount: { inputType: '', value: { operator: '<' }},
      buyNumber: { inputType: '', value: { operator: '<' }},
      selectTime: { inputType: '', value: { operator: '<', time: '' }},
      referenceTag: {
        buyAmount: '',
        buyNumber: ''
      },
      rules: {
        buyAmount: [
          { type: 'object', validator: validateAmount }
        ],
        buyNumber: [
          { type: 'object', validator: validateAmount }
        ],
        selectTime: [
          { type: 'object', validator: validateTime }
        ]
      }
    }
  },
  watch: {
    tag: {
      handler: function(val) {
        if (val.buyAmount) {
          this.buyAmount = val.buyAmount
          this.buyNumber = val.buyNumber
          this.selectTime = val.selectTime
          this.selectTime.value.time = val.selectTime.value.time || ''
          this.referenceTag.buyAmount = val.buyAmount.value.referenceTagName
          this.referenceTag.buyNumber = val.buyNumber.value.referenceTagName
          this.selectGoodsInfo = val.selectGoodsInfo
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handleInput(e) {
      let val = e.replace(/[^\d]/g, '')
      this.buyNumber.value.number = val
      this.$emit('change-tag-5', { key: 'buyNumber.number', val })
    },
    handleSelectGoods(val, goodsList) {
      if (goodsList) {
        this.tag.selectGoodsInfo.push(...goodsList)
        this.$refs.selectProduct.clearValue()
      }
    },
    deleteGood(index) {
      this.$emit('delete-goods', index)
    },
    handleChangeTag(key, e) {
      this.$emit('change-tag-5', { key, val: e })
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

<style>
.tag-goods-popper {
  width: 494px!important;
  padding: 16px;
}
</style>
<style lang="scss" scoped>
.red {
  color: $secondRed;
}
.form {
  display: grid;
}
@media only screen and (max-width: 1630px) {
  .form {
    grid-template-columns: repeat(1, 100%);
  }
}
@media only screen and (min-width: 1631px) {
  .form {
    grid-template-columns: repeat(2, 50%);
  }
}
:deep(.el-form) {
  padding-top: 12px;
  .el-form-item {
    margin-bottom: 12px;
  }
  .el-form-item__content {
    display: flex;
    align-items: center;
  }
  .el-form-item__label {
    padding: 0;
  }
}
.tag-form-item :deep(.el-form-item__error) {
  left: 50px;
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
.date-picker :deep(.el-input__inner) {
  border-radius: 0 8px 8px 0;
  border-left: none;
}
</style>