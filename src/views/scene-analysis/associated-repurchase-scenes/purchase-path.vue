<template>
  <div class="content-wrapper">
    <section class="page-top-panel">
      <div class="item">
        <div style="font-size: 20px;font-weight: 600;font-family: SimHei">购买路径分析</div>
        <span style="color: rgba(0,0,0,0.65)">根据关联购买路径、购买人数和营销周期指导触达</span>
      </div>
      <div class="item">
        <div>数据更新时间</div>
        <div class="bold">{{lastUpdateTime[currentScene] ? lastUpdateTime[currentScene] : '--'}}</div>
      </div>
      <div class="item">
        <div>店铺监控主商品</div>
        <div class="bold">
          {{ settingType === 1 ? '90天热销前20' : '自定义' }}
          <el-button type="text" size="small" @click="gotoPage">前往调整</el-button>
        </div>
      </div>
      <div class="item">
        <div>复购大促排除规则
          <el-tooltip content="排除大促间复购对商品最佳复购周期的影响，该规则不会影响复购人数的计算">
            <i class="el-icon-info" style="color: rgba(0, 0, 0, 0.65)"></i>
          </el-tooltip>
        </div>
        <div class="bold">
          {{ excludeRuleStatus === 0 ? '未设置' : '已设置' }}
          <el-button type="text" size="small" @click="gotoPage">前往设置</el-button>
        </div>
      </div>
      <!-- <div class="top-right">
        <el-button type="text" size="small"><i class="el-icon-document-copy" /> 规则说明</el-button><br>
      </div> -->
    </section>
    <section class="page-main-panel">
      <el-form ref="formInline" :model="formInline" :rules="rules" size="small" class="form-panel" inline>
        <el-form-item label="主商品" style="margin-right: 0">
          <el-select v-model="formInline.targetType" style="width: 80px;margin-right: 8px">
            <el-option :value="0" label="上游" />
            <el-option :value="1" label="下游" />
          </el-select>
        </el-form-item>
        <el-form-item prop="goodsCode">
          <el-select
            v-model="formInline.goodsCode"
            placeholder="选择或输入商品名搜索"
            filterable
            clearable
            style="width: 200px"
            @change="$refs.formInline.validateField('goodsCode')">
            <el-option
              v-for="item in goodsList"
              :key="item.goodsCode"
              :label="item.goodsName"
              :value="item.goodsCode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-button class="primary-btn" :disabled="loading" @click="query">查询</el-button>
      </el-form>
      <div class="content-panel" v-loading="loading">
        <div v-if="isEmpty" class="empty-panel">
          <img src="@/assets/images/scene.png" style="margin: 15% 0 20px 0;;width: 400px"/>
          <span>选择目标商品，确定需要分析上游或下游的购买路径，<br>查询目标商品近720天内不同购买路径复购关联购情况</span>
        </div>
        <div v-else>
          <div class="summary-panel">
            <span>时间：近720天内</span>
            <span>总购买人数：{{ summary.totalBuyPeopleCount }}</span>
            <span>发生复购关联购人数：{{ summary.relateRepurchasePeopleCount }}</span>
            <span>发生复购关联购人数占比：{{ summary.relateRepurchaseScale }}</span>
          </div>
          <div class="list-panel" v-infinite-scroll="load" :style="`height: ${tableHeight}px;overflow: auto`">
            <div v-for="(item, index) in list" :key="index" class="list-item">
              <i class="iconzhiding iconfont" v-if="item.buyType === 0 || item.buyType === 1" />
              <div class="left">
                <template v-if="item.buyType === 0">
                  <span class="tag">无</span>
                </template>
                <template v-else-if="item.buyType === 1">
                  <span class="tag" style="width: 20px">复购</span>
                </template>
                <template v-else>
                  <span class="tag">{{ item.index }}</span>
                </template>
                <div class="left-content">
                  <div>购买人数：{{ item.buyPeopleCount }}</div>
                  <div>占总购买人数比例：{{ item.scale }}</div>
                </div>
              </div>
              <el-divider direction="vertical" class="divider-vertical"></el-divider>
              <div class="right">
                <div style="margin-left: 90px">
                  <span :class="[currentType === 0 ? 'left-radius' : 'right-radius']"></span>
                  <template v-if="item.downstreamGoodName">
                    <el-divider class="divider-horizontal">{{ item.startCycle + '～' + item.endCycle }}天</el-divider>
                    <span :class="[currentType === 1 ? 'left-radius' : 'right-radius']"></span>
                  </template>
                </div>
                <div style="display: flex;width: 560px;justify-content:space-between;">
                  <div>
                    <el-tooltip :disabled="!item.showUpTip">
                      <template #content>
                        <div style="max-width: 300px">{{ item.upstreamGoodName }}</div>
                      </template>
                      <div v-ellipsis="{ index, key: 'showUpTip' }" class="ellipsis">
                        <span>{{ item.upstreamGoodName }}</span>
                      </div>
                    </el-tooltip>
                  </div>
                  <div v-if="item.downstreamGoodName">
                    <el-tooltip :disabled="!item.showDownTip">
                      <template #content>
                        <div style="max-width: 300px">{{ item.downstreamGoodName }}</div>
                      </template>
                      <div v-ellipsis="{ index, key: 'showDownTip' }" class="ellipsis">
                        <span>{{ item.downstreamGoodName }}</span>
                      </div>
                    </el-tooltip>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getPathAnalysisList, getSetStatus, getMonitorGoods } from '@/api/repurchase-scene'
export default {
  name: 'purchase_path_analysis',
  data() {
    return {
      currentType: 0,
      excludeRuleStatus: '',
      settingType: '',
      summary: {
        totalBuyPeopleCount: '',
        relateRepurchasePeopleCount: '',
        relateRepurchaseScale: ''
      },
      list: [],
      goodsList: [],
      loading: false,
      formInline: {
        targetType: 0,
        goodsCode: ''
      },
      tableHeight: 300,
      pageNum: 1,
      pageSize: 10,
      isEmpty: false,
      btnDisabled: false,
      rules: {
        goodsCode: [
          { required: true, message: '请选择商品', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'lastUpdateTime',
      'currentScene'
    ])
  },
  directives: {
    ellipsis: {
      inserted: function(el, binding, vnode) {
        const { index, key } = binding.value
        const elSpan = el.firstElementChild
        vnode.context.list[index][key] = elSpan.offsetHeight > el.clientHeight
        vnode.context.list.splice(0, 0)
      }
    }
  },
  mounted() {
    this.refreshPage()
  },
  methods: {
    getTableHeight() {
      this.tableHeight = document.body.clientHeight - 346
    },
    gotoPage() {
      this.$router.push({ name: 'related_purchase_scene_set' })
    },
    refreshPage() {
      this.loading = false
      if (this.$refs.formInline) this.$refs.formInline.resetFields()
      this.isEmpty = true
      getSetStatus().then(res => {
        this.excludeRuleStatus = res.excludeRuleStatus
        this.settingType = res.settingType
      })
      getMonitorGoods().then(res => {
        this.goodsList = res
      })
      this.$nextTick(() => {
        this.getTableHeight()
      })
    },
    load() {
      if (this.list.length >= 50) return
      if (this.list.length < this.pageNum * 10) return
      this.pageNum += 1
      this.query()
    },
    async query(pageNum) {
      if (this.loading) return
      this.currentType = this.formInline.targetType
      if (pageNum) {
        this.pageNum = 1
        this.list = []
      }
      try {
        this.loading = true
        await this.$refs.formInline.validate()
        const params = {
          ...this.formInline,
          pageNum: this.pageNum,
          pageSize: this.pageSize
        }
        const res = await getPathAnalysisList(params)
        if (res.totalBuyPeopleCount) {
          this.summary = {
            totalBuyPeopleCount: res.totalBuyPeopleCount,
            relateRepurchasePeopleCount: res.relateRepurchasePeopleCount,
            relateRepurchaseScale: res.relateRepurchaseScale
          }
          this.isEmpty = false
          if (this.pageNum === 1) this.list = res.topDataList
          const topDataLen = res.topDataList.length
          if (res.dataList) {
            this.list.push(...res.dataList)
          }
          let tempCount = ''
          let index = ''
          this.list.forEach((item, j) => {
            if (item.buyPeopleCount !== tempCount) {
              tempCount = item.buyPeopleCount
              index = j - topDataLen + 1
              item.index = index
            } else item.index = index
          })
        } else {
          this.isEmpty = true
          this.$message.warning('所选商品无数据！')
        }
        this.loading = false
      } catch (err) {
        this.loading = false
        console.log(err)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.iconfont {
  font-size: 16px;
  color: rgba(0,0,0,0.25);
  position: absolute;
  top: 0;
  left: 0;
}
.summary-panel {
  background: white;
  padding: 12px 14px;
  span + span {
    margin-left: 20px;
  }
}
.divider-horizontal {
  display: inline-block;
  margin: 8px 20px;
  width: 300px;
  ::v-deep .el-divider__text{
    border: 1px solid rgba(0,0,0,0.65);
    color: rgba(0,0,0,0.65);
    font-size: 12px;
    width: 90px;
    padding: 0;
    text-align: center;
  }
}
.divider-vertical {
  height: 100%;
}
.left-radius {
  display: inline-block;
  width: 18px;
  height: 18px;
  border-radius: 90px;
  background-color: rgb(180, 182, 193);
}
.right-radius {
  display: inline-block;
  width: 18px;
  height: 18px;
  border-radius: 90px;
  background-color: rgba(0,0,0,0.6);
}
.ellipsis {
  word-break: break-all;
  width: 200px;
  display: -webkit-box;
  overflow: hidden;
  white-space: normal;
  text-overflow: ellipsis;
  word-wrap: break-word;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  text-align: center;
}
.list-panel {
  min-width: 830px;
}
.list-item {
  display: flex;
  height: 80px;
  padding: 12px 20px;
  position: relative;
  border-bottom: 1px solid rgba(0,0,0,0.15);
  .left {
    display: flex;
    align-items: center;
    width: 240px;
    .left-content {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
    }
    .tag {
      background-color: rgb(180, 182, 193);
      color: white;
      padding: 2px 4px;
      border-radius: 2px;
      margin-right: 20px;
      min-width: 20px;
      text-align: center;
    }
  }
  .right {
    margin-left: 10px;
  }
}
.page-top-panel {
  background-color: white;
  display: flex;
  position: relative;
  align-items: center;
  color: $black85;
  .top-right {
    position: absolute;
    right: 20px;
  }
  .el-button--text {
    padding: 0;
    font-weight: normal;
    line-height: 2em;
  }
  .bold {
    font-weight: bold;
  }
  .item {
    margin-right: 5%;
    line-height: 2em;
  }
}
.page-main-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  .form-panel {
    background-color: $blackground;
    padding: 16px 20px;
    margin: 12px 0;
    .el-form-item {
      margin-bottom: 0;
    }
  }
  .content-panel {
    background-color: $blackground;
    flex: 1;
    overflow: auto;
    color: $black65;
  }
  .empty-panel {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
.form {
  .el-form-item {
    margin-bottom: 0px;
  }
  ::v-deep .el-form-item__error {
    padding-top: 0;
    top: 36px;
    left: 20px;
  }
}
</style>