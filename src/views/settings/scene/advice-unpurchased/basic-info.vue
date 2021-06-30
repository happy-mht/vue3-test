<template>
  <div>
    <div class="top-panel">
      <span class="title">自动投放设置</span>
      <el-switch
        :value="opened"
        active-color="#78CC2F"
        inactive-color="#D9D9D9"
        :active-value="1"
        :inactive-value="0"
        :disabled="!planForm.shopAutoPutSetId"
        @click="handleClickSwitch" />
      <span style="color:#8C94A0">{{ opened ? '已开启' : '已关闭'}}</span>
    </div>
    <div class="form-panel">
      <el-form ref="planForm" v-show="isEdit" :model="planForm" :rules="rules" size="small" label-width="100px" inline inline-message>
        <el-form-item prop="productProjectId">
          <template #label>
            <i class="iconfont iconshangpinji-mianxing" /><span>商品集方案</span>
          </template>
          <el-select v-model="planForm.productProjectId" style="width: 480px" placeholder="暂无方案，请前往“商品集方案”设置">
            <el-option v-for="item in projectList" :value="item.id" :key="item.id" :label="item.projectName" />
          </el-select>
        </el-form-item>
        <el-form-item prop="putDays">
          <template #label>
            <i class="iconfont iconshijian-mian" /><span>投放时间</span>
          </template>
          第 N+
          <el-input
            v-model="planForm.putDays"
            style="width: 60px"
            placeholder="请输入"
            @input="e => planForm.putDays = e.replace(/[^\d]/g, '')" />
          日，投放N日咨询未购的人群
          <el-tooltip placement="top">
            <template #content>
              <div style="max-width: 230px">
                第二日中午13:00前可获取到前一天数据，自动投放时间默认为14:00，遇到任务冲突顺延，超过18:00则顺延到下一天9:00以后
              </div>
            </template>
            <i class="iconfont icontishi" />
          </el-tooltip>
        </el-form-item>
        <el-form-item class="flex-item">
          <template #label>
            <i class="iconfont iconguolv-mian" /><span>过滤设置</span>
          </template>
          <div>
            <div class="filter-set">
              <i class="order-num">1</i>
              <div>
                排除在前
                <el-form-item prop="excludeAlBuyDays" style="margin-bottom: 0" :rules="rules.excludeAlBuyDays">
                  <el-input
                    v-model="planForm.excludeAlBuyDays"
                    style="width: 60px"
                    placeholder="请输入"
                    @input="e => planForm.excludeAlBuyDays = e.replace(/[^\d]/g, '')"/>
                    日内在本店铺购买任意商品的用户
                </el-form-item>
                <div style="color: #8C94A0">
                  <el-checkbox v-model="excludeAlAmountRule" @change="$refs.planForm.clearValidate('excludeAlAmount')"/>
                  购买商品排除小样（小样为价格
                  <el-form-item prop="excludeAlAmount" :rules="rules.validateAmount" style="margin-bottom: 0">
                    <el-input
                      v-model="planForm.excludeAlAmount"
                      size="small"
                      placeholder="请输入"
                      :disabled="!excludeAlAmountRule"
                      style="width: 60px"
                      @input="e => planForm.excludeAlAmount = e.replace(/[^\d]/g, '')" />
                    <span style="color: #8C94A0">元以下的商品）</span>
                  </el-form-item>
                </div>
              </div>
            </div>
            <div class="filter-set">
              <i class="order-num">2</i>
              <div>
                排除在前
                <el-form-item prop="excludeAlTrackDays" style="margin-bottom: 0" :rules="rules.putDays" :inline-message="false">
                  <el-input
                    v-model.trim="planForm.excludeAlTrackDays"
                    style="width: 60px"
                    placeholder="请输入"
                    @input="e => planForm.excludeAlTrackDays = e.replace(/[^\d]/g, '')"/>
                  日内在本店铺被旺旺
                </el-form-item>
                <el-select v-model="planForm.param" style="width: 120px">
                  <el-option v-for="item in paramsList" :key="item.key" :value="item.key" :label="item.label" />
                </el-select>
                营销过的
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item class="flex-item">
          <template #label>
            <i class="iconzhuanhua iconfont" /><span>转化追踪</span>
          </template>
          <div>
            目标用户在投放后
            <el-form-item prop="trackDays" style="margin-bottom: 0" :rules="rules.putDays">
              <el-input
                v-model="planForm.trackDays"
                style="width: 60px"
                @input="e => planForm.trackDays = e.replace(/[^\d]/g, '')"/>
              日内购买本店铺任意商品
            </el-form-item>
          </div>
          <div style="color: #8C94A0">
            <el-checkbox v-model="excludeAmountRule" @change="$refs.planForm.clearValidate('excludeAmount')" />
            购买商品排除小样（小样为价格
            <el-form-item prop="excludeAmount" style="margin-bottom: 0" :rules="rules.validateAmount">
              <el-input
                v-model="planForm.excludeAmount"
                size="small"
                placeholder="请输入"
                :disabled="!excludeAmountRule"
                style="width: 60px"
                @input="e => planForm.excludeAmount = e.replace(/[^\d]/g, '')"/>
              元以下的商品）
            </el-form-item>
          </div>
        </el-form-item>
        <el-form-item>
          <div style="margin-left: 100px">
            <el-button size="small" class="btn-primary" @click="save">保存</el-button>
            <el-button size="small" class="btn-sub" @click="cancelEdit">取消</el-button>
          </div>
        </el-form-item>
      </el-form>
      <div class="plan-info" v-show="!isEdit">
        <div class="info-item">
          <label>
            <i class="iconfont iconshangpinji-mianxing" /><span>商品集方案</span>
          </label>
          <div>
            <span v-if="planForm.productProjectName" class="red">{{planForm.productProjectName}}</span>
            <span v-else style="color: #BDC2C8">暂无方案，请前往“商品集方案”设置</span>
          </div>
        </div>
        <div class="info-item">
          <label>
            <i class="iconfont iconshijian-mian" /><span>投放时间</span>
          </label>
          <div>
            第 N+ <span class="red">{{planForm.putDays}}</span> 日，投放N日咨询未购的人群
            <el-tooltip placement="top">
              <template #content>
                <div style="max-width: 230px">
                  第二日中午13:00前可获取到前一天数据，自动投放时间默认为14:00，遇到任务冲突顺延，超过18:00则顺延到下一天9:00以后
                </div>
              </template>
              <i class="iconfont icontishi" />
            </el-tooltip>
          </div>
        </div>
        <div class="info-item">
          <label>
            <i class="iconfont iconguolv-mian" /><span>过滤设置</span>
          </label>
          <div>
            <div class="filter-set">
              <i class="order-num">1</i>
              <div>
                排除在前 <span class="red">{{planForm.excludeAlBuyDays}}</span> 日内在本店铺购买任意商品的用户
                <div style="color: #8C94A0" v-if="planForm.excludeAlAmount !== ''">
                  购买商品排除小样（小样价格{{planForm.excludeAlAmount}}元以下的商品）
                </div>
              </div>
            </div>
            <div class="filter-set">
              <i class="order-num">2</i>
              <div>
                排除在前 <span class="red">{{planForm.excludeAlTrackDays}}</span> 日内在本店铺被旺旺
                <span class="red">{{paramName}}</span> 营销过的
              </div>
            </div>
          </div>
        </div>
        <div class="info-item">
          <label>
            <i class="iconzhuanhua iconfont" /><span>转化追踪</span>
          </label>
          <div>
            <div>
              目标用户在投放后 <span class="red">{{planForm.trackDays}}</span> 日内购买本店铺任意商品
            </div>
            <div style="color: #8C94A0" v-if="planForm.excludeAmount !== ''">
              购买商品排除小样（小样为价格{{planForm.excludeAmount}}元以下的商品）
            </div>
          </div>
        </div>
        <div>
          <el-button type="primary" plain size="small" style="width: 160px;margin-left:100px" @click="isEdit = true">
            <i class="iconfont iconbianji1" style="margin-right: 4px"/>修改
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { addShopAutoPut, checkShopAutoSet, getProjectList, switchShopAutoPutSet } from '@/api/advice-unpurchased'

export default {
  name: 'basicInfo',
  data() {
    const validateDays = (rule, val, cb) => {
      if (val === '') cb('不可为空')
      else if (rule.field === 'putDays') {
        if (val > 14 || val <= 0) {
          cb('请输入【1-14】范围内的值')
        } else {
          cb()
        }
      } else if (rule.field === 'trackDays') {
        if (val > 30 || val <= 0) {
          cb('请输入【1-30】范围内的值')
        } else {
          cb()
        }
      } else if (rule.field === 'excludeAlTrackDays') {
        if (val == 0) {
          cb('请输入大于0的整数')
        } else {
          cb()
        }
      }
    }
    const validateAlBuyDays = (rule, val, cb) => {
      if (val > 720 || val <= 0) {
        cb('请输入【1-720】范围内的值')
      } else if (val < this.planForm.putDays) {
        cb('不能小于投放时间')
      } else cb()
    }
    const validateAmount = (rule, val, cb) => {
      if (val === '' && this[rule.field+'Rule']) cb('不可为空')
      else if (val > 9999) cb('请输入【0-9999】范围内的值')
      else cb()
    }
    return {
      opened: 0,
      paramsList: [
        { key: 'INQUIRY', label: '咨询未购场景' },
        { key: 'ALL_WANG', label: '所有旺旺营销' },
        { key: 'ALL_CHANNEL', label: '所有渠道营销' }
      ],
      planForm: {
        shopAutoPutSetId: '',
        productProjectName: '',
        productProjectId: '',
        excludeAlBuyDays: '',
        excludeAlAmount: '',
        param: '',
        excludeAlTrackDays: '',
        trackDays: '',
        excludeAmount: '',
        putDays: ''
      },
      excludeAlAmountRule: false,
      excludeAmountRule: false,
      projectList: [],
      isEdit: false,
      rules: {
        excludeAlBuyDays: [
          { validator: validateAlBuyDays }
        ],
        putDays: [
          { validator: validateDays }
        ],
        validateAmount: [
          { validator: validateAmount }
        ]
      }
    }
  },
  computed: {
    paramName() {
      let obj = this.paramsList.find(i => i.key == this.planForm.param)
      return obj ? obj.label : ''
    }
  },
  created() {
    this.init()
    this.getProjectList()
  },
  methods: {
    init() {
      checkShopAutoSet().then(res => {
        this.planForm.excludeAlAmount = res.excludeAlAmount === null ? '' : res.excludeAlAmount
        this.planForm.excludeAmount = res.excludeAmount === null ? '' : res.excludeAmount
        this.planForm.shopAutoPutSetId = res.shopAutoPutSetId || ''
        this.planForm.productProjectName = res.productProjectName || ''
        this.planForm.productProjectId = res.productProjectId || ''
        this.planForm.excludeAlBuyDays = res.excludeAlBuyDays || ''
        this.planForm.param = res.param || ''
        this.planForm.excludeAlTrackDays = res.excludeAlTrackDays || ''
        this.planForm.putDays = res.putDays || ''
        this.planForm.trackDays = res.trackDays || ''
        this.opened = res.opened || 0
        this.excludeAlAmountRule = res.excludeAlAmount !== null
        this.excludeAmountRule = res.excludeAmount !== null
      })
    },
    getProjectList() {
      const _self = this
      getProjectList().then(res => {
        _self.projectList = res
        if (_self.planForm.productProjectName) {
          let obj = _self.projectList.find(i => i.projectName === _self.planForm.productProjectName)
          if (obj) _self.planForm.productProjectId = obj.id
        }
      })
    },
    cancelEdit() {
      this.$refs.planForm.clearValidate()
      this.init()
      this.isEdit = false
    },
    async save() {
      try {
        await this.$refs.planForm.validate()
        let params = {
          ...this.planForm,
          opened: this.opened
        }
        if (!this.excludeAmountRule) delete params.excludeAmount
        if (!this.excludeAlAmountRule) delete params.excludeAlAmount
        delete params.productProjectName
        await addShopAutoPut(params)
        this.init()
        this.$message.success('保存成功')
        this.isEdit = false
      } catch (e) {
        console.log(e)
      }
    },
    async handleClickSwitch() {
      if (!this.planForm.shopAutoPutSetId) return
      try {
        const opened = this.opened == 1 ? 0 : 1
        await switchShopAutoPutSet({ shopAutoPutSetId: this.planForm.shopAutoPutSetId, opened })
        this.opened = opened
        const msg = opened == 1 ? '已开启自动投放' : '已关闭自动投放'
        this.$message.success(msg)
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>
<style scoped lang="scss">
.el-checkbox {
  margin-right: 4px;
}
.top-panel {
  font-size: 14px;
  height: 60px;
  background: #F7F8FB;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  .title {
    font-weight: bold;
  }
  .el-switch {
    margin: 0 4px 0 24px;
  }
}
.filter-set {
  padding: 8px 24px;
  display: flex;
  background: #F7F8FB;
  border-radius: 4px;
  margin-bottom: 12px;
}
.order-num {
  font-size: 14px;
  font-weight: bold;
  color: #353C47;
  min-width: 24px;
}
.form-panel {
  display: flex;
  justify-content: center;
  padding: 40px 0;
  .el-form {
    display: flex;
    flex-direction: column;
    // width: 600px;
    :deep(.el-form-item__label) {
      text-align: left;
      font-size: 14px;
    }
    .el-form-item {
      margin-bottom: 40px;
      .el-form-item__label span {
        color: #353C47;
        font-weight: 600;
      }
    }
    .flex-item {
      display: flex;
      :deep(.el-form-item__content) {
        margin-left: 0!important;
      }
    }
  }
  label .iconfont {
    font-size: 14px;
    color: #7086B5;
    margin-right: 4px;
  }
}
.plan-info {
  display: flex;
  flex-direction: column;
  label {
    color: #353C47;
    font-weight: 600;
    width: 100px;
    font-size: 14px;
  }
  & > div {
    margin-bottom: 40px;
    display: flex;
    line-height: 20px;
  }
  .filter-set {
    background-color: white;
    padding: 0;
  }
}
.red {
  color: $primaryRed;
}
.icontishi {
  cursor: pointer;
  font-size: 14px;
  color: #9DA4B2;
}
</style>
