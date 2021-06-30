<template>
  <div class="content-wrapper" v-loading="loading">
    <div style="margin-bottom: 12px;">
      <el-form :model="formInline" ref="formInline" size="small" label-width="130px" style="max-width: 800px; border-bottom: 1px solid rgb(0,0,0,0.15);">
        <el-form-item style="margin-bottom: 0">
          <el-alert
            type="info"
            class="alert-tip"
            :closable="false">
            <template #title>对目标商品设置将于下一次数据更新时生效，下一次数据更新：{{dayjs(lastUpdateTime[currentScene]).add(1, 'day').format('YYYY/MM/DD')}}。</template>
          </el-alert>
        </el-form-item>
        <el-form-item label="店铺监控商品" prop="settingType">
          <el-radio v-model="formInline.settingType" :label="1" @change="handleChangeType">90天热销前20</el-radio><br>
          <el-radio v-model="formInline.settingType" :label="2" @change="handleChangeType">自定义</el-radio>
          <div style="background: white; padding: 16px">
            <select-product
              ref="product"
              width="400px"
              :disabled="formInline.settingType === 1"
              :selectedList="productCodeList"
              multiple
              @select="handeSelectGoods" />
            <el-button class="primary-btn" style="margin-left: 10px" :disabled="formInline.settingType === 1" @click="addGoods">增加</el-button>
            <el-table :data="productInfoList" border size="mini" style="margin-top: 8px;line-height:1em;">
              <el-table-column type="index" width="50px" align="center">
                <template #header>#</template>
              </el-table-column>
              <el-table-column label="商品名称" prop="goodsName" min-width="200px" />
              <el-table-column label="操作" width="100px" align="center">
                <template v-slot="{ row }">
                  <el-button type="text" class="red" :disabled="formInline.settingType === 1" @click="deleteGood(row)"><i class="el-icon-delete" /></el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form-item>
      </el-form>
      <el-form label-width="130px" size="small" style="margin-top: 20px;max-width: 800px">
        <el-form-item>
          <template #label>复购大促排除规则
            <el-tooltip content="排除大促间复购对商品最佳复购周期的影响，该规则不会影响复购人数的计算" placement="bottom-start">
              <i class="el-icon-info" />
            </el-tooltip>
          </template>
          <el-button class="primary-btn" @click="isOpenAddModal = true">
            <i class="el-icon-plus" />增加
          </el-button>
          <div style="background: white; padding: 16px;margin-top: 10px">
            <el-table :data="excludeRuleList" size='mini' border style="margin-top: 8px;line-height:1em;">
              <el-table-column type="index" width="50px" align="center">
                <template #header>#</template>
              </el-table-column>
              <el-table-column label="排除规则" prop="activityName" min-width="200px">
                <template v-slot="{ row }">
                  {{row.activityName}} {{ row.activityStartTime }}~{{ row.activityEndTime }}
                </template>
              </el-table-column>
              <el-table-column label="操作" width="100px" align="center">
                  <template v-slot="{ row }">
                    <el-button type="text" class="red" @click="deleteRule(row)"><i class="el-icon-delete" /></el-button>
                  </template>
                </el-table-column>
            </el-table>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog
      title="新增活动"
      v-model="isOpenAddModal"
      width="400px"
      @close="$refs.addForm.resetFields()"
      :close-on-click-modal="false">
      <el-form ref="addForm" :model="addForm" size="mini" label-position="top">
        <el-form-item prop="activityName" label="活动名" :rules="rules.activityName">
          <el-input style="width: 300px" v-model="addForm.activityName" placeholder="请输入活动名" />
        </el-form-item>
        <el-form-item label="活动日期范围" prop="activityTime" :rules="rules.activityTime">
          <el-date-picker
            v-model="addForm.activityTime"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy/MM/dd"
            :picker-options="pickerOptions"
            value-format="yyyy/MM/dd"
            style="width: 300px" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button class="primary-btn" size="small" @click="isOpenAddModal = false">取消</el-button>
        <el-button type="primary" size="small" @click="addRule">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import * as api from '@/api/repurchase-scene'
import selectProduct from '@/components/select-product'
import { mapGetters } from 'vuex'
import dayjs from 'dayjs'

export default {
  name: 'goods_set_maintenance',
  components: { selectProduct },
  data() {
    const validateDays = (rule, value, cb) => {
      if (value.length === 0 || (value && !value[0])) {
        cb('请选择时间范围')
      } else {
        const diff = dayjs(value[1]).diff(dayjs(value[0]), 'day')
        diff >= 30 ? cb('时间跨度不能超过30日') : cb()
      }
    }
    return {
      loading: false,
      pickerOptions: {
        disabledDate(time) {
          return dayjs(time) <= dayjs().subtract(720, 'day')
        }
      },
      dayjs: dayjs,
      excludeRuleList: [],
      top20List: [],
      btnDisabled: false,
      isOpenAddModal: false,
      settingId: '',
      productInfoList: [],
      formInline: {
        settingType: 1,
        activityName: '',
        tempProductList: []
      },
      addForm: {
        activityName: '',
        activityTime: []
      },
      rules: {
        activityName: [
          { message: '首字符只能是中英文', pattern: /^[\u4e00-\u9fa5_a-zA-Z]/gi, trigger: 'change' },
          { message: '最大10个字符，仅允许输入中英文数字下划线横杠', pattern: /^[\w\u4e00-\u9fa5][\w\u4e00-\u9fa5\-_]{0,9}$/gi, trigger: 'change' },
          { required: true, message: '请输入活动名', trigger: 'change' }
        ],
        activityTime: [
          { type: 'array', required: true, trigger: 'blur', validator: validateDays }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'lastUpdateTime',
      'currentScene'
    ]),
    productCodeList() {
      return this.productInfoList.map(i => i.goodsCode)
    }
  },
  mounted() {
    this.refreshPage()
  },
  methods: {
    handleChangeType(val) {
      this.formInline.tempProductList = []
      this.$refs.product.clear()
      this.setData({
        settingType: val,
        goodsCodeList: this.productInfoList,
        excludeRuleList: this.excludeRuleList
      }, '修改成功')
    },
    handeSelectGoods(val, goodsList) {
      this.formInline.tempProductList = goodsList
    },
    deleteGood(row) {
      this.setData({
        settingType: this.formInline.settingType,
        goodsCodeList: this.productInfoList.filter(i => i.goodsCode !== row.goodsCode),
        excludeRuleList: this.excludeRuleList
      }, '删除成功')
    },
    deleteRule(row) {
      this.setData({
        settingType: this.formInline.settingType,
        goodsCodeList: this.productInfoList,
        excludeRuleList: this.excludeRuleList.filter(i => i.id !== row.id)
      }, '删除成功')
    },
    async setData(params, msg) {
      try {
        params.settingId = this.settingId
        params.goodsCodeList = params.goodsCodeList.map(i => i.goodsCode)
        params.excludeRuleList = params.excludeRuleList ? params.excludeRuleList : []
        await api.setMonitorData(params)
        this.$message.success(msg)
        this.getData()
        return Promise.resolve()
      } catch (e) {
        console.log(e)
        return Promise.reject()
      }
    },
    async addGoods() {
      if ((this.productInfoList.length + this.formInline.tempProductList.length) > 20) {
        this.$message.error('超过20个商品，请先删减')
        return
      }
      const goodsCodeList = [
        ...this.formInline.tempProductList,
        ...this.productInfoList
      ]
      try {
        await this.setData({
          settingType: this.formInline.settingType,
          goodsCodeList,
          excludeRuleList: this.excludeRuleList
        }, '添加成功')
        this.formInline.tempProductList = []
        this.$refs.product.clear()
      } catch (e) {
        console.log(e)
      }
    },
    refreshPage() {
      this.loading = false
      if (this.$refs.formInline) this.$refs.formInline.resetFields()
      this.getData()
    },
    getData() {
      this.loading = true
      api.getMonitorData().then(res => {
        this.formInline.settingType = res.settingType
        if (res.settingType === 1) this.top20List = res.productInfoList
        this.productInfoList = res.productInfoList
        this.excludeRuleList = res.excludeRuleList
        this.settingId = res.settingId
        this.loading = false
      }).catch(() => this.loading = false)
    },
    async addRule() {
      try {
        await this.$refs.addForm.validate()
        const excludeRuleList = [{
          activityName: this.addForm.activityName,
          activityStartTime: this.addForm.activityTime[0],
          activityEndTime: this.addForm.activityTime[1]
        }]
        if (this.excludeRuleList) excludeRuleList.push(...this.excludeRuleList)
        const params = {
          settingType: this.formInline.settingType,
          goodsCodeList: this.productInfoList.filter(i => i.goodsCode),
          excludeRuleList
        }
        await this.setData(params, '提交成功')
        this.isOpenAddModal = false
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.red {
  color: $secondRed;
  font-size: 14px;
  padding: 0 8px;
}
.alert-tip {
  line-height: 1em;
  width: 500px;
  display: inline-block;
}
</style>