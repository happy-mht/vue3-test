<!--
  @doc: 全局店铺切换组件
-->
<template>
  <el-dialog
    title="切换店铺"
    v-model="visible"
    width="500px"
    class="add-dialog"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    append-to-body
    @close="handleClose"
    @open="handleOpen">
    <el-input
      size="small"
      class="search-input"
      v-model="text"
      style="width: 240px;margin-left: 24px"
      placeholder="请输入店铺名称"
      prefix-icon="el-icon-search" />
    <div class="shop-wrapper" v-if="showList.length">
      <div
        v-for="(shop, index) in showList"
        :key="shop.shopId + shop.shopCode + '-' + index"
        :class="['item', currentShop === (shop.shopId + '-' + shop.shopCode) ? 'active' : '']"
        @click="handleClick(shop)">
        {{ shop.shopName }}
      </div>
    </div>
    <div v-else class="no-data">
      <img src="@/assets/images/search.png" />
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button class="btn-sub" size="small" @click="visible = false">取 消</el-button>
        <el-button class="btn-primary" size="small" @click="handleOk">确 定</el-button>
      </span>
    </template>
    
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
const uuidV4 = require('uuid-v4')

export default {
  name: 'ShopChange',
  props: {
    value: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      text: '',
      showList: [],
      currentShop: '',
      visible: false
    }
  },
  computed: {
    ...mapGetters([
      'shopList',
      'shop'
    ])
  },
  watch: {
    value (val) {
      this.visible = val
    },
    shopList: {
      handler: function (val) {
        this.showList = val
      },
      deep: true,
      immediate: true
    },
    shop: {
      handler: function (val) {
        this.currentShop = val.shopId + '-' + val.shopCode
      },
      deep: true
    },
    text(val) {
      if (!val) this.showList = this.shopList
      else this.showList = this.shopList.filter(i => {
        return i.shopName.indexOf(val) > -1
      })
    }
  },
  methods: {
    handleOpen() {
      this.currentShop = this.shop.shopId + '-' + this.shop.shopCode
    },
    handleClick(shop) {
      this.currentShop = shop.shopId + '-' + shop.shopCode
    },
    async handleOk() {
      if (this.currentShop === this.shop.shopId + '-' + this.shop.shopCode) {
        this.visible = false
        return
      }
      try {
        await this.$handleConfirm({
          message: `
            <span>确定切换店铺吗？</span>
            <span>切换后未保存的数据将会丢失</span>
          `,
        })
        const params = {
          shopId: this.currentShop.split('-')[0],
          shopCode: this.currentShop.split('-')[1]
        }
        await this.$store.dispatch('user/chooseShop', params)
        localStorage.setItem('shopChange', uuidV4())
        this.visible = false
      } catch (e) {
        console.log(e)
      }
    },
    handleClose() {
      this.text = ''
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.add-dialog ::v-deep {
  .el-dialog__body {
    padding: 0 0 4px 0;
  }
}
.no-data {
  padding: 100px;
  img {
    width: 260px;
    height: 140px;
  }
}
.shop-wrapper {
  max-height: 330px;
  overflow: auto;
  margin-top: 16px;
  .item {
    cursor: pointer;
    height: 40px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    background: #FAFAFF;
    border-radius: 8px;
    margin: 4px 20px 0 20px;
    box-sizing: border-box;
    line-height: 40px;
    padding: 0 12px;
    &.active {
      border: 1px solid #FF74AC;
      background: #FFEBF0;
    }
    &:hover {
      border: 1px solid #FF74AC;
      background: #FFEBF0;
    }
  }
}
</style>