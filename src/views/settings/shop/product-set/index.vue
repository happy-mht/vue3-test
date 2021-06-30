<template>
  <div class="content-wrapper">
    <div class="goods-pattern">
      <label :class="['pattern-item', pattern === 'link' && 'active']" @click="pattern='link'">
        链接模式<el-popover
          placement="bottom"
          title="链接模式:"
          trigger="manual"
          v-model:visible = "visible"
          :offset="30"
          width="200">
          <div style="font-size: 12px;line-height: 1.5em;">以链接（或商品id）作为用户对店铺商品行为和认知的统计单位，由于同一商品因活动设置可能拥有不同的链接，链接模式的统计更适合分析活动、套装、优惠赠品策略相关场景。基于链接的分析需要为不同的平台分别设置。</div>
          <el-button v-if="isFirst" style="float: right" type="primary" size="mini" plain @click="visible = false;isFirst = false">我知道了</el-button>
          <template #reference>
            <i class="iconfont icontishi" style="font-size: 14px" @mouseenter="handlerMouse(true)" @mouseleave="handlerMouse(false)"/>
          </template>
        </el-popover>
      </label>
    </div>
    <div>
      <div style="margin-bottom: 12px;">
        <el-input
          size="small"
          class="search-input"
          v-model="goodsInput"
          style="width: 300px;"
          placeholder="搜索商品集名或宝贝ID"
          prefix-icon="el-icon-search"
          @clear="filterSearch"
          @keydown.enter = "filterSearch"
          clearable />
        <el-button style="float: right" class="btn-primary" size="small" @click="handleAdd">
          <i class="el-icon-circle-plus" style="margin-right: 4px" />新建商品集
        </el-button>
      </div>
      <el-table
        :data="list"
        size="small"
        v-loading="loading">
        <template #empty>
          <table-empty />
        </template>
        <el-table-column label="平台" prop="platformDesc" width="100px" />
        <el-table-column label="商品集" prop="name" width="228px" />
        <el-table-column label="宝贝ID" prop="numIidList" />
        <el-table-column label="操作" width="130px">
          <template v-slot="{ row }">
            <el-button type="text" style="margin-right: 8px" @click="handelEdit(row)">
              <i class="iconfont iconbianji1" />
            </el-button>
            <el-button type="text" class="deepred" size="medium" @click="handelDel(row)">
              <i class="iconfont iconshanchu" />
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <page
        v-if="total >0"
        :total="total"
        :pageSize="pageSize"
        :currentPage="pageNum"
        @size-change="sizeChange"
        @current-change="currentChange"
      />
    </div>
    <product-set :value="isOpenProductSetModal" @close="isOpenProductSetModal = false;currentSetId = ''" :id="currentSetId" @refresh="search"/>
  </div>
</template>
<script>
import page from '@/components/page'
import productSet from './product-set.vue'
import * as api from '@/api/goods-set'
export default {
  name: 'product_set_settings',
  components: { page, productSet },
  data() {
    return {
      visible: false,
      pattern: 'link',
      total: 1,
      pageSize: 10,
      pageNum: 1,
      goodsInput: '',
      tableHeight: 100,
      loading: false,
      currentSetId: '',
      isOpenProductSetModal: false,
      isFirst: false,
      list: []
    }
  },
  created() {
    this.search()
  },
  mounted() {
    this.isFirst = !localStorage.getItem('product_set_settings')
    if (this.isFirst) this.visible = true
    localStorage.setItem('product_set_settings', 1)
  },
  methods: {
    handleAdd() {
      if (this.total >= 50) this.$message.warning('无法新建，商品集最多50个。')
      else this.isOpenProductSetModal = true
    },
    handlerMouse(val) {
      if (!this.isFirst) this.visible = val
    },
    sizeChange(e) {
      this.pageSize = e
      this.search()
    },
    currentChange(e) {
      this.pageNum = e
      this.search()
    },
    filterSearch() {
      this.pageNum = 1
      this.search()
    },
    async search() {
      try {
        this.loading = true
        const res = await api.getShopGoodsList({
          name: this.goodsInput,
          pageNum: this.pageNum,
          pageSize: this.pageSize
        })
        this.list = res.list
        this.total = res.paging.totalCount
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    handelEdit(row) {
      this.currentSetId = row.id
      this.isOpenProductSetModal = true
    },
    async handelDel(row) {
      try {
        await this.$handleConfirm({
          message: '<span>确定删除当前商品集吗？</span>'
        })
        await api.delSet({ id: row.id })
        this.search()
        this.$message.success('删除成功')
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.goods-pattern {
  position: absolute;
  top: 20px;
  left: 164px;
  .pattern-item {
    font-size: 14px;
    cursor: pointer;
    margin-right: 12px;
    position: relative;
    &:hover {
      color: $primaryRed;
    }
    &.active {
      color: $primaryRed;
      font-weight: 600;
      &::after {
        position: absolute;
        content: '';
        width: 20px;
        height: 2px;
        background: #FD4378;
        border-radius: 1px;
        top: 20px;
        left: 18px;
      }
    }
    &.disabled {
      color: #BDC2C8;
      cursor: not-allowed;
    }
  }
}
</style>