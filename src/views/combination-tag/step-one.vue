<template>
  <div class="step-wrapper">
    <el-form
      ref="tagForm"
      :model="tagForm"
      :rules="rules"
      size="small"
      label-position="top"
      class="tag-form"
      inline>
      <el-form-item label="标签名称" prop="combinationTagName">
        <el-input v-model="tagForm.combinationTagName" placeholder="输入标签名" style="width: 240px" clearable />
      </el-form-item>
      <el-form-item label="标签内容类型" prop="combinationTagType">
        <el-select v-model="tagForm.combinationTagType" placeholder="选择类型" style="width: 240px" clearable>
          <el-option label="枚举值" :value="0"></el-option>
          <el-option label="布尔值" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标签更新周期" prop="combinationTagUpdateCycle">
        <el-select v-model="tagForm.combinationTagUpdateCycle" placeholder="选择更新周期" style="width: 240px" clearable>
          <el-option label="日" :value="1"></el-option>
          <el-option label="周" :value="2"></el-option>
          <el-option label="月" :value="3"></el-option>
          <el-option label="季" :value="4"></el-option>
          <el-option label="年" :value="5"></el-option>
          <el-option label="不更新" :value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-permission="['combination_tag_review']" class="shop-item" label="分发店铺" prop="distributionShop">
        <select-shop
          v-model="tagForm.distributionShop"
          :request="api.getShopList"
          placeholder="选择店铺"
          multiple
          @item-click="handleClickShop"
          @remove-tag="handleRemoveShop"
          class="shop-select" />
      </el-form-item>
      <el-form-item label="标签说明" prop="combinationTagDesc">
        <el-input
          type="textarea"
          v-model="tagForm.combinationTagDesc"
          :rows="3"
          placeholder="请输入说明文字，最多不超过100个字符。"
          maxlength="100"
          clearable
          resize="none"
          show-word-limit
          style="width: 800px" />
      </el-form-item>
    </el-form>
    <div class="footer">
      <el-button class="btn-primary" size="small" @click="next">下一步</el-button>
    </div>
  </div>
</template>
<script>
import selectShop from '@/components/select-shop'
import * as api from '@/api/tag'
import { mapGetters } from 'vuex'

export default {
  name: 'TagDesignStepOne',
  components: { selectShop },
  props: {
    detail: Object
  },
  data() {
    return {
      api: api,
      distributionShop: [], // 编辑时初始选中的店铺
      tagForm: {
        combinationTagId: '',
        combinationTagName: '',
        combinationTagType: '',
        combinationTagUpdateCycle: '',
        combinationTagDesc: '',
        operationType: '',
        distributionShop: []
      },
      rules: {
        combinationTagName: [
          { message: '首字符只能是中英文', pattern: /^[\u4e00-\u9fa5_a-zA-Z]/gi, trigger: 'change' },
          { message: '最大10个字符，仅允许输入中英文数字下划线横杠', pattern: /^[\w\u4e00-\u9fa5][\w\u4e00-\u9fa5\-_]{0,9}$/gi, trigger: 'change' },
          { required: true, message: '请输入标签名', trigger: 'change' }
        ],
        combinationTagType: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        combinationTagUpdateCycle: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        distributionShop: [
          { required: true, type: 'array', message: '请选择', trigger: 'change' }
        ],
        combinationTagDesc: [
          { message: '最多100个字符', pattern: /^.{0,100}$/gi, trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'shop'
    ])
  },
  watch: {
    detail: {
      handler: function(newv) {
        this.distributionShop = newv.distributionShop
        this.tagForm = {
          combinationTagId: newv.combinationTagId,
          combinationTagName: newv.combinationTagName,
          combinationTagType: newv.combinationTagType,
          combinationTagUpdateCycle: newv.combinationTagUpdateCycle,
          combinationTagDesc: newv.combinationTagDesc,
          operationType: newv.operationType,
          distributionShop: newv.distributionShop
        }
      }
    },
    'shop.shopId': {
      handler: function (val) {
        if (!this.tagForm.combinationTagId) this.tagForm.distributionShop = [val]
      },
      immediate: true
    }
  },
  methods: {
    async next() {
      try {
        await this.$refs.tagForm.validate()
        this.$emit('next', this.tagForm)
      } catch (e) {
        console.log(e)
      }
    },
    handleClickShop(item) {
      if (this.distributionShop.includes(item.shopId)
        && (this.detail.combinationTagStatus === 5 || this.detail.combinationTagStatus === 2)) {
        api.checkDeleteShop({ combinationTagId: this.tagForm.combinationTagId, shopId: item.shopId }).catch(e => {
          this.$utils.handleNotice({
            message: `<span>${e.message}</span>`
          })
        })
      }
    },
    async handleRemoveShop(val) {
      if (val === this.shop.shopId) {
        this.$message.error('不能删除当前店铺')
        this.tagForm.distributionShop.unshift(val)
      } else {
        this.handleClickShop({ shopId: val })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.step-wrapper {
  padding-top: 32px;
  position: relative;
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: white;
  height: 600px;
  min-width: 900px;
}
.tag-form {
  height: calc(100% - 64px);
  overflow: auto;
  width: 840px;
  .el-form-item {
    margin-right: 40px;
  }
}
.shop-item {
  display: block;
  margin-bottom: 4px;
  :deep(.el-form-item__error) {
    top: 32px;
  }
}
.shop-select {
  width: 800px;
}
.footer {
  position: absolute;
  bottom: 0;
  line-height: 64px;
  height: 64px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.87) 0%, #FFFFFF 100%);
  box-shadow: 0px 2px 22px -4px #EDEDED;
  width: 100%;
  text-align: center;
}
</style>