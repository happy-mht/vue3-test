<template>
  <el-dialog
    width="580px"
    v-model="show"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    append-to-body
    :before-close="handleCancel">
    <template #title>
      <div style="font-size: 16px">
        <span class="bold">设置</span>
        <span style="color: #778092">（{{ tag.tagName }}）</span>
      </div>
    </template>
    <div style="padding: 0 12px">
      <div style="font-size:12px;margin-bottom: 12px;" class="bold">展示样式</div>
      <div>
        <span
          :class="['style-radio', styleType == 'Column' && 'active']"
          title="柱形图-y"
          @click="styleType = 'Column'">
          <svg class="svg-icon">
            <use :xlink:href="`#iconzhuxingtu-y`"></use>
          </svg>
        </span>
        <span
          :class="['style-radio', styleType == 'Area' && 'active']"
          title="面积图"
          @click="styleType = 'Area'">
          <svg class="svg-icon">
            <use :xlink:href="`#iconmianjitu`"></use>
          </svg>
        </span>
      </div>
      <div style="font-size:12px;margin: 16px 0 12px 0">
        <span class="bold">自定义分段</span>
        <span style="color: #778092;">（数值含左不含右）</span>
        <div style="float: right">
          <el-button type="text" size="small" class="blueGrey deepred" @click="clearData">
            <i class="iconqingkong iconfont" style="margin-right: 2px" />清空
          </el-button>
          <el-divider direction="vertical"></el-divider>
          <el-button type="text" size="small" class="blueGrey" @click="init">
            <i class="iconzhongzhi iconfont" style="margin-right: 2px" />重置
          </el-button>
        </div>
      </div>
      <el-form
        ref="intervalForm"
        :model="intervalForm"
        :rules="rules"
        inline
        hide-required-asterisk
        inline-message
        size="mini"
        style="background: #FAFBFE;padding: 10px 20px">
        <div v-for="(item, index) in intervals" :key="item.uuid" style="display: flex;align-items:center">
          <label style="width:55px;text-align:left;" class="el-form-item__label">分段{{(index + 1)}}:</label>
          <el-input
            disabled
            v-model="item.startValue"
            size="mini"
            placeholder="自动填充"
            style="width: 100px;" />
          <span style="margin: 4px">~</span>
          <el-form-item
            :prop="'endValue_' + index + '_' + item.id"
            :rules="rules.num"
            style="margin-bottom: 0;">
            <el-input
              :disabled="index === intervals.length - 1"
              :value="item.endValue"
              placeholder="请输入"
              @input="handeInputNumber($event, item, index)"
              style="width: 100px;" />
            <span style="margin-left: 8px">
              <el-button style="margin-right:2px" type="text" class="blueGrey" size="small" v-if="index < intervals.length - 1 && intervals.length < 11" @click="handleAdd(item, index)">
                <i class="iconjia iconfont" />
              </el-button>
              <el-button type="text" style="margin-left: 0" size="small" class="deepred lightgray" v-if="index < intervals.length - 1 && index > 0" @click="handleDelete(item, index)">
                <i class="iconjian iconfont" />
              </el-button>
            </span>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div ref="iframe"></div>
    <template #footer>
      <el-button class="btn-sub" size="small" @click="handleCancel">取消</el-button>
      <el-button class="btn-primary" size="small" @click="handleOk">确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { editPanelTag } from '@/api/tag-panel'
import uuid from 'uuid-v4'
export default {
  name: 'tagConfigPopver',
  props: {
    tag: {
      default: () => ({})
    },
    show: Boolean
  },
  data() {
    const validateNum = async (rule, val, cb) => {
      const index = rule.field.split('_')[1] - 0
      const _self = this
      const len = _self.intervals.length
      if (index === len - 1) {
        cb()
        return
      }
      let num = _self.intervals[index].endValue
      if (num === '' ) {
        cb(new Error('*请输入数据'))
      } else {
        num -= 0
        if (num == _self.intervals[index].startValue) {
          cb(`*上限必须大于下限`)
        } else if (index > 0 && _self.intervals[index - 1].endValue >= num) {
          cb(`*必须大于分段${index}下限`)
        } else if(index < len - 1 && _self.intervals[index + 1].endValue <= num) {
          cb(`*必须小于分段${index + 2}下限`)
        }
        else cb()
      }
    }
    return {
      styleType: '',
      intervalForm: {},
      intervals: [],
      rules: {
        num: [
          { validator: validateNum, trigger: 'blur' }
        ],
      },
    }
  },
  watch: {
    intervals: {
      handler: function (newV) {
        newV.forEach((item, index) => {
          this.$set(this.intervalForm, 'endValue_' + index + '_' + item.id, item.endValue)
        })
      },
      deep: true
    },
    tag: {
      handler: function () {
        this.init()
      },
      deep: true
    },
  },
  methods: {
    handleCancel() {
      this.$emit('update:show', false)
      this.init()
    },
    clearData() {
      this.intervals = [this.intervals[0], this.intervals[this.intervals.length - 1]]
      this.intervals[0].endValue = ''
      this.intervals[1].startValue = ''
      this.$refs.intervalForm.clearValidate()
    },
    init() {
      if (!this.tag) return
      this.styleType = this.tag.styleType
      if (this.tag.tagDataList) {
        this.intervals = this.tag.tagDataList.map(data => {
          let arr = data.key.replace(/\[|\)/g, '').split(',')
          return {
            startValue: arr[0],
            endValue: arr[1],
            id: uuid()
          }
        })
      }
      else this.intervals = []
      if (this.$refs.intervalForm) this.$refs.intervalForm.clearValidate()
    },
    async handleOk() {
      try {
        let params = {
          id: this.tag.id,
          styleType: this.styleType
        }
        params.intervals = this.intervals.map(i => {
          return {
            startValue: i.startValue,
            endValue: i.endValue
          }
        })
        await this.$refs.intervalForm.validate()
        const res = await editPanelTag(params)
        this.$emit('ok', res)
      } catch (e) {
        console.log(e)
      }
    },
    handeInputNumber(e, obj, index) {
      let v = e.replace(/[^\d]/g, '')
      if (v < 0) v = -v
      obj.endValue = v
      this.intervals[index + 1].startValue = v
      this.intervals.splice(0, 0)
    },
    async handleAdd(obj, index) {
      try {
        await this.$refs.intervalForm.validate()
        this.intervals.splice(index + 1, 0, {
          startValue: obj.endValue,
          endValue: '',
          id: uuid()
        })
        this.intervals[index + 2].startValue = ''
      } catch (e) {
        console.log(e)
      }
    },
    handleDelete(item, index) {
      this.$refs.intervalForm.clearValidate('endValue_' + index + '_' + item.id)
      this.intervals[index + 1].startValue = this.intervals[index - 1].endValue
      this.intervals.splice(index, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
.iframe {
  border: 0;
}
.bold {
  color: #353C47;
  font-weight: 600;
}
.el-button:hover {
  .iconfont {
    color: $secondRed;
  }
}
.iconshezhi-xianxing {
  color: #9DA4B2;
  font-size: 14px;
  cursor: pointer;
}
.style-radio {
  margin-right: 8px;
  display: inline-block;
  text-align: center;
  width: 36px;
  height: 36px;
  padding: 5px;
  cursor: pointer;
  box-sizing: border-box;
  border: 1px solid #FFFFFF;
  border-radius: 4px;
  &.active {
    background: #FFEBF0;
    border-color: #FF74AC;
  }
  &:hover:not(.active) {
    background: #F1F3FE;
    border-color: #F1F3FE;
  }
}
.svg-icon {
  width: 24px;
  height: 24px;
  cursor: pointer;
  outline: none;
}
</style>