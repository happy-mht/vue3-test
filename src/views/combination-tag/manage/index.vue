<template>
  <div>
    <div class="tab-header">
      <div class="left">组合标签管理</div>
      <div class="right" v-if="bussinessOpen">
        <el-button class="btn-primary" size="small" @click="addNewTag"><i class="el-icon-plus" />新建标签</el-button>
        <span class="icon-wrapper"><i class="el-icon-refresh" @click="refresh" /></span>
      </div>
    </div>
    <div class="tab-wrapper" v-if="bussinessOpen">
      <div class="tab-select">
        <div class="tab-select-status">标签状态：</div>
        <div :class="[allCheck ? 'block-press' : '', 'status-item']" @click="setAllCheck">全部</div>
        <div
          v-for="(item, index) in tagStatus" :key="index" @click="setCheck(item.key)"
          :class="[searchForm.combinationTagStatus === item.key ? 'block-press' : '', 'status-item']">
          {{item.text}}
          <span
            v-if="item.key == 1 && tips.flag && tips.reviewCount"
            :class="[searchForm.combinationTagStatus === 1  ?  'tab-tips-press' : 'tab-tips']">+{{tips.reviewCount}}</span>
        </div>
        <el-divider direction="vertical"></el-divider>
        <div style="color:#778092;margin: 0 8px">创建人：</div>
        <el-checkbox v-model="searchForm.oneselfTag" style="margin-top: -2px" @change='handleTagStatus'>只看我创建的</el-checkbox>
        <el-input
          v-model="searchForm.combinationTagName"
          size="small"
          class="tag-search"
          placeholder="请输入标签名称搜索"
          @change="handleSelect"
          debounce=300
        >
        <template #prefix><i class="el-input__icon el-icon-search" ></i></template>
        </el-input>
      </div>
      <el-table
        ref="topictable"
        size="small"
        :data="myList"
        style="width: 100%;"
        :row-class-name="tableRowClassName"
        :height="tableHeight"
        v-loading='loading'
        @sort-change='sortChange'
      >
        <template #empty>
          <table-empty />
        </template>
        <el-table-column label="标签类型/标签名称"  width="210" >
          <template v-slot="scope">
            <div class="name-container">
              <span :class=" 'tag-type-'+ scope.row.combinationTagType">{{tagType(scope.row)}}</span>
              <el-tooltip class="item" effect="dark" :content="scope.row.combinationTagName" placement="top" :hide-after="1000" :disabled="scope.row.combinationTagName.length < 6">
                <span class="tag-name"
                  :hide-after="20"
                  @click="handleIconClick('iconchakan1', scope)">{{ scope.row.combinationTagName }}</span>
              </el-tooltip>
            </div>
            <el-tooltip class="item" effect="dark" :content="editPersonTips" placement="top" :open-delay="200" :hide-after="1000" popper-class="lock-tooltip">
              <i
                class="iconfont iconlock1"
                style="color:#7086B5;outline: none;font-size:14px"
                v-show="scope.row.isBeUpdate"
                @mouseenter="checkEditPerson(scope)"
                @click="cancleLock(scope)"
              />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="标签内容" prop="combinationContentTypeNames"  min-width="100" show-overflow-tooltip>
          <template v-slot="scope">
            <span class="tag-content">{{ scope.row.combinationContentTypeNames }}</span>
          </template>
        </el-table-column>
        <el-table-column label="更新周期" prop="combinationTagUpdateCycleDesc" min-width="80">
          <template v-slot="{ row }">
            {{row.combinationTagUpdateCycleDesc}}
          </template>
        </el-table-column>
        <el-table-column label="创建人" prop="createUserName" min-width="80">
          <template v-slot="scope">
            <div v-if="scope.row.key === 'fold'" @click="foldTag" class="fold">
              <span :class="[`iconfont ${cheverons}`]" style="vertical-align: middle;" />{{foldText}}{{foldCount}}条数据
            </div>
            <span v-else>{{ scope.row.createUserName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" sortable="custom" min-width="150"></el-table-column>
        <el-table-column label="标签状态" prop="combinationTagStatusDesc" width="120">
          <template v-slot="{ row }">
            <span :class="['bg bg-'+row.combinationTagStatus, PERMISIION===false&&row.combinationTagStatus===1 ? 'bg bg-3':'']"></span>
            <span :class="[row.combinationTagStatus === 0 ? 'caogao' : `color-${row.combinationTagStatus}`]">{{row.combinationTagStatusDesc}}</span>
          </template>
        </el-table-column>
        <el-table-column label="分发店铺" min-width="80" v-if="PERMISIION">
          <template v-slot="scope">
            <cdl-text font="link" :text="scope.row.shopDistributionCount" @onClick="handleIconClick('shop', scope)" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template v-slot="scope" v-permission="[COMBINATION_TAG_REVIEW]">
            <div class="iconfont-block" v-for="item in status" :key="item.key">
              <template v-if="scope.row.combinationTagStatus === item.key" >
                <div v-for="(icon,index) in item[authCondition(scope.row.createUserName)]" :key="index">
                    <span
                      v-if="icon.indexOf('icon') === -1"
                        class="check-reason"
                      @click="handleIconClick('reason', scope)" >查看原因</span>
                    <i
                      v-else
                      :class="[`iconfont ${icon}`]"
                      :title="iconTitle[icon]"
                      @click="handleIconClick(icon, scope)" />
                </div>
              </template>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="分发店铺" v-model="dialogTableVisible" custom-class="shop-dialog">
        <el-table :data="shopDetailList" size="small" :height="390">
          <el-table-column
            prop="shopName"
            label="店铺"
          ></el-table-column>
          <el-table-column
            prop="shopCalculationStatusDesc"
            label="状态"
            width="200"
          >
            <template v-slot="{ row }">
              <span :class="`bg bg-${shopStatus(row)}`"></span>
              <span :class="[row.shopCalculationStatusDesc === '草稿' ? 'caogao' : `color-${shopStatus(row)}`]">{{row.shopCalculationStatusDesc}}</span>
            </template>
          </el-table-column>
        </el-table>
        <el-button class="btn-primary" @click="dialogTableVisible = false">确定</el-button>
      </el-dialog>
      <page
        v-if="total > 0"
        :total="total"
        :page-size="pageSize"
        :current-page="pageNum"
        @size-change="sizeChange"
        @current-change="currentChange"
        />
    </div>
    <div v-else class="no-open">
      <no-open msg='该店铺尚未开通【组合标签管理】场景' />
    </div>
  </div>
</template>

<script>
import page from '@/components/page'
import * as api from '@/api/tag'
import cdlText from './cdl-text'
import noOpen from '@/views/error-page/no-open'
const uuidV4 = require('uuid-v4')

const HAS_PERMISSION_SELF = 0
const NO_PERMISSION_SELF = 1
const HAS_PERMISSION_OTHER = 2
const NO_PERMISSION_OTHER = 3
const COMBINATION_TAG_REVIEW = 'combination_tag_review'

export default {
  components: { page, cdlText, noOpen },
  props: {

  },
  filters: {
    filterSubStr(value){
      if(value.length < 6){
        return value
      }else{
        return value.substr(0, 5) + '...'
      }
    }
  },
  data() {
    return {
      bussinessOpen: true,
      tagNameShow: false,
      r: false,
      dialogTableVisible: false,
      editPersonTips: '',
      tableHeight: 500,
      allList: [],
      myList: [],
      shopDetailList: [],
      foldList: [],
      otherList: [],
      isFold: true,
      loading: true,
      searchForm: {
        combinationTagStatus: '',
        combinationTagName: '',
        combinationTagType: -1,
        createTime: '',
        oneselfTag: false,
        createTimeSortAsc: false
      },
      tips: {
        reviewCount: 0,
        flag: true
      },
      total: 0,
      pageNum: 1,
      pageSize: 10,
      currentPage: 1,
      allCheck: true,
      status: [
        {
          key: 0, text: '草稿', checked: false,
          [NO_PERMISSION_SELF]: ['iconbianji1', 'iconshanchu1'],
          [NO_PERMISSION_OTHER]: [],
          [HAS_PERMISSION_SELF]: ['iconbianji1', 'iconshanchu1'],
          [HAS_PERMISSION_OTHER]: ['iconbianji1'],
        },
        {
          key: 1, text: '待审核', checked: false,
          [NO_PERMISSION_SELF]: ['iconchakan1'],
          [NO_PERMISSION_OTHER]: ['iconchakan1'],
          [HAS_PERMISSION_SELF]: ['iconshenhe'],
          [HAS_PERMISSION_OTHER]: ['iconshenhe'],
        },
        {
          key: 3, text: '计算中', checked: false,
          [NO_PERMISSION_SELF]: ['iconchakan1'],
          [NO_PERMISSION_OTHER]: ['iconchakan1'],
          [HAS_PERMISSION_SELF]: ['iconchakan1'],
          [HAS_PERMISSION_OTHER]: ['iconchakan1'],
        },
        {
          key: 4, text: '已失败', checked: false,
          [NO_PERMISSION_SELF]: ['iconchakan1', 'iconxiaxian'],
          [NO_PERMISSION_OTHER]: ['iconchakan1'],
          [HAS_PERMISSION_SELF]: ['iconchakan1', 'iconxiaxian'],
          [HAS_PERMISSION_OTHER]: ['iconchakan1', 'iconxiaxian'],

        },
        {
          key: 2, text: '已驳回', checked: false,
          [NO_PERMISSION_SELF]: ['iconbianji1', 'iconxiaxian', '查看原因'],
          [NO_PERMISSION_OTHER]: ['iconchakan1'],
          [HAS_PERMISSION_SELF]: ['iconchakan1', 'iconbianji1', 'iconxiaxian', '查看原因'],
          [HAS_PERMISSION_OTHER]: ['iconchakan1', 'iconbianji1', 'iconxiaxian', '查看原因'],
        },
        {
          key: 5, text: '已完成', checked: false,
          [NO_PERMISSION_SELF]: ['iconchakan1', 'iconbianji1', 'iconxiaxian'],
          [NO_PERMISSION_OTHER]: ['iconchakan1'],
          [HAS_PERMISSION_SELF]: ['iconchakan1', 'iconbianji1', 'iconxiaxian'],
          [HAS_PERMISSION_OTHER]: ['iconchakan1', 'iconbianji1', 'iconxiaxian'],
        },
        {
          key: 6, text: '已下线', checked: false,
          [NO_PERMISSION_SELF]: ['iconchakan1'],
          [NO_PERMISSION_OTHER]: ['iconchakan1'],
          [HAS_PERMISSION_SELF]: ['iconchakan1'],
          [HAS_PERMISSION_OTHER]: ['iconchakan1'],
        },
      ],
      iconTitle: {
        iconshenhe: '审核',
        iconbianji1: '修改',
        iconxiaxian: '下线',
        iconshanchu1: '删除',
        iconchakan1: '查看'
      },
    }
  },
  computed: {
    shopStatus(){
      return row => {
        const map = {
          '草稿': 0,
          '待审核': 1,
          '已驳回': 2,
          '计算中': 3,
          '已失败': 4,
          '已完成': 5,
          '已下线': 6,
        }
        return map[row.shopCalculationStatusDesc]
      }
    },
    foldText(){
      return this.isFold ? '展开' : '收起'
    },
    foldCount(){
      return this.foldList.length
    },
    cheverons(){
      if(this.isFold){
        return 'iconchevrons-down'
      }else {
        return 'iconchevrons-up'
      }
    },
    tagType(){
      const map = {
        0: '枚举值',
        1: '布尔值'
      }
      return (row) => {
        return map[row.combinationTagType] ?? ''
      }
    },
    PERMISIION(){
      return this.$store.state.user.functions.some(item => item.code === COMBINATION_TAG_REVIEW)
    },
    authCondition(){
      return (name) => {
        const SELF = this.$store.state.user.name === name
        const map = {
          [HAS_PERMISSION_SELF]: { PERMISIION: true, SELF: true },
          [NO_PERMISSION_SELF]: { PERMISIION: false, SELF: true },
          [HAS_PERMISSION_OTHER]: { PERMISIION: true, SELF: false },
          [NO_PERMISSION_OTHER]: { PERMISIION: false, SELF: false },
        }
        return Object.keys(map).find(key => map[key].PERMISIION === this.PERMISIION && map[key].SELF === SELF)[0]
      }
    },
    tagStatus(){
      if(this.PERMISIION){
        return this.status.slice(0)
      }else{
        return this.status.slice(0, this.status.length - 1)
      }
    },
    createdByUser(){
      return (name) => {
        return this.$store.state.user.name === name
      }
    },
    createdByOther(){
      return (name) => {
        return this.$store.state.user.name !== name
      }
    },
  },
  created(){
    this.checkBussiness()
  },
  mounted(){
    this.getCountOfReview()
    window.addEventListener('storage', e => {
      if (e.key === 'refreshTag') {
        this.search()
        this.isFold = true
      }
    })
    this.setAllCheck()
  },
  methods: {
    refresh(){
      this.search()
      this.getCountOfReview()
      this.checkBussiness()
    },
    checkBussiness(){
      api.getShopTags({
        firstTagType: 0
      }).then(res => {
        if(res.length === 0){
          this.bussinessOpen = false
        }else{
          this.bussinessOpen = true
        }
      })
    },
    foldTag(){
      if(this.isFold){
        this.isFold = false
        this.myList = [...this.foldList, { key: 'fold' }, ...this.otherList]
      }else{
        this.isFold = true
        this.myList = [this.foldList[0], { key: 'fold' }, ...this.otherList]
      }
    },
    handleIconClick(icon, scope) {
      switch(icon){
        case "shop":
          this.getShopStatus(scope.row)
          break
        case "iconchakan1":
          if(scope.row.combinationTagStatus === 0){
            this.handleLockEvent(scope, () => this.gotopage(scope.row))
          }else{
            this.tagNameShow = true
            this.handleLockEvent(scope, () => this.gotoShenHe(scope.row, 'look'), 'look')
          }
          break
        case "iconshenhe":
          // this.handleLockEvent(scope, () => this.gotoShenHe(scope.row))
          this.gotoShenHe(scope.row, 'review')
          break
        case "iconbianji1":
          this.handleLockEvent(scope, () => this.gotopage(scope.row))
          break
        case "iconxiaxian":
          this.$utils.handleConfirm({
            message: `
              <span>确定下线该标签吗</span>
              <span>下线后数据将不再恢复，但不影响已引用该标签的其他标签</span>
            `
          }).then(async () => {
            this.handleLockEvent(scope, () => this.xiaxian(scope.row))
            const box = document.getElementsByClassName('cdl-confirm')
            this.r && box[0].parentNode.removeChild(box[0].parentNode.lastChild)
            this.r = false
          }).catch(() => {
            const box = document.getElementsByClassName('cdl-confirm')
            this.r && box[0].parentNode.removeChild(box[0].parentNode.lastChild)
            this.r = false
          })
          break
        case "iconshanchu1":
          this.$utils.handleConfirm({
            message: `
              <span>确定删除该标签吗</span>
              <span>删除后数据将不被保存</span>
            `
          }).then(async () => {
            this.handleLockEvent(scope, () => this.delete(scope.row))
          }).catch(() => {})
          break
        case "reason":
          this.$utils.handleNotice({
            message: `
              <span>${scope.row.rejectionReason}</span>
            `,
            title: '驳回原因'
          }).then(() => {}).catch(() => {})
          break
      }
    },
    sortChange({ order }){
      if(order === "descending"){
        this.searchForm.createTimeSortAsc = true
      }else {
        this.searchForm.createTimeSortAsc = false
      }
      this.search()
    },
    handleSelect(){
      this.search()
    },
    handleTagStatus(val){
      this.oneselfTag = val
      this.search()
    },
    tableRowClassName(scope){
      if(scope.row.combinationTagStatus === 0){
        return 'caogao'
      }
      if(scope.row?.key === 'fold') {
        return 'fold'
      }
      if(scope.row.combinationTagStatus === 6){
        return 'xiaxian'
      }
    },
    setCheck(key){
      if(key === 1){
        this.tips.flag = false
      }
      this.pageNum = 1
      this.searchForm.combinationTagStatus = key
      this.allCheck = false
      this.search()
    },
    setAllCheck(){
      this.allCheck = true
      this.searchForm.combinationTagStatus = ''
      this.search()
    },
    gotoShenHe(row, type){
      let newhref = `//${window.location.host}/#/tag-review/${row.combinationTagId}?type=${type}`
      window.open(newhref)
    },
    gotopage(row) {
      console.log(123123)
      let newhref = `//${window.location.host}/#/tag-design/${row.combinationTagId}`
      window.open(newhref)
    },
    sizeChange(e) {
      this.pageSize = e
      this.search()
    },
    currentChange(e) {
      this.pageNum = e
      this.search()
    },
    checkEditPerson(scope){
      console.log(1)
      api.getLabelEditPerson({
        combinationTagId: scope.row.combinationTagId
      }).then(res => {
        this.editPersonTips = `当前标签正在被"${res}"编辑`
      })
    },
    getCountOfReview(){
      api.getLabelReviewCount().then( res => {
        this.tips.reviewCount = res
      })
    },
    getBracketStr(text) {
      let result = ''
      let regex = /"(.+?)"/g
      let options = text.match(regex)
      let option = options[0]
      result = option.substring(1, option.length - 1)
      return result
    },
    async getShopStatus(row){
      const res = await api.getLabelShopStatus({
        combinationTagId: row.combinationTagId
      })
      this.dialogTableVisible = true
      this.shopDetailList = res
    },

    async cancleLock(scope){
      const res = await this.$store.dispatch('user/getInfo')
      if(res.realName !== this.getBracketStr(this.editPersonTips)){
        this.$message.warning(this.editPersonTips + '，请稍后操作')
      }else{
        this.$utils.handleConfirm({
          message: ' 解锁后将无法再对标签编辑或保存，确定解锁吗？'
        }).then(() => {
          api.labelCancelUpdate({ combinationTagId: scope.row.combinationTagId }).then(() => {
            this.$message.success('解锁成功')
            this.refresh()
            localStorage.setItem('unLockTag', JSON.stringify({ id: scope.row.combinationTagId, uuid: uuidV4() }))
          })
        })
      }
    },
    async xiaxian(row){
      const res = await api.getLabelOffline({
        combinationTagId: row.combinationTagId
      })
      if(res.code === 200){
        this.$message.success('下线成功')
        this.search()
      }
    },
    async delete(row){
      const res = await api.deleteTag({
        combinationTagId: row.combinationTagId
      })
      if(res.code === 200){
        this.$message.success('删除成功')
        this.search()
      }
    },
    async handleLockEvent(scope, cb, type){
      let res = await api.getLabelIsHasUpdate({
        combinationTagId: scope.row.combinationTagId
      })
      if(res){
        let person = await api.getLabelEditPerson({
          combinationTagId: scope.row.combinationTagId
        })
        this.$message.warning(`该标签正在被"${person}"编辑，请稍后操作`)
        scope.row.isBeUpdate = true
        this.editPersonTips = `当前标签正在被"${person}"编辑`
      }else{
        if(type !== 'look'){
          api.getLabelSetUpdate({
            combinationTagId: scope.row.combinationTagId
          }).then(() => {
            cb()
            this.refresh()
          })
        }else{
          this.$nextTick( () => {
            this.refresh()
            cb()
          })
        }
      }
    },
    async addNewTag(){
      let newhref = `//${window.location.host}/#/tag-design`
      window.open(newhref)
    },
    async search() {
      try {
        this.loading = true
        this.isFold = true
        const res = await api.getTagList({
          combinationTagName: this.searchForm.combinationTagName,
          combinationTagStatus: this.searchForm.combinationTagStatus,
          oneselfTag: this.searchForm.oneselfTag,
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          createTimeSortAsc: this.searchForm.createTimeSortAsc
        })
        // const topList = this.allCheck && await api.getTagTopList({
        //   combinationTagName: this.searchForm.combinationTagName,
        //   oneselfTag: this.searchForm.oneselfTag,
        //   pageSize: this.pageSize,
        //   pageNum: this.pageNum,
        //   createTimeSortAsc: this.searchForm.createTimeSortAsc
        // }) || []
        if(res.list){
          this.myList = res.list
          this.total = res.paging?.totalCount
          this.loading = false
        }
        // 折叠
        // if(res.list && topList){
        //   this.foldList = topList
        //   this.otherList = res.list
        //   if(topList.length > 1){
        //     this.myList = [topList[0], {
        //       "key": "fold",
        //     }, ...res.list] || this.mockList
        //   }else if(topList.length === 1){
        //     this.myList = [...topList, ...res.list]
        //   }else {
        //     this.myList = [...res.list]
        //   }
        //   this.total = res.paging?.totalCount
        //   this.loading = false
        // }
      } catch (e) {
        this.myList = []
        this.loading = false
      }
    }
  }
}
</script>
<style lang="scss">
  .shop-dialog{
    width: 800px;
    height: 540px;
    background: #FFFFFF;
    box-shadow: 0px 2px 16px 0px rgba(72, 74, 119, 0.2);
    border-radius: 6px;
    position: relative;
    & > .el-dialog__body > button {
      position: absolute;
      bottom: 20px;
      right: 28px;
    }
    & > .el-dialog__header > span {
      font-size: 16px;
    }
  }
  .r_dialog{
    position :absolute;
    width :280px;
    height :220px;
    background:#fff;
    top: 50%;
    left: 50%;
    box-shadow: 5px 5px 5px rgba(69, 23, 56, 0.2);
    transform:translate(calc(350px - 50%), -50%);
    &_content{
      width :100%;
      height :100%;
      overflow-y: auto;
      padding: 41px 18px 0;
      text-align: left;
    }
    &::after{
      position: absolute;
      content: '已引用标签';
      font-family: PingFangSC-Regular, PingFang SC;
      font-size: 16px;
      padding: 15px 0 10px;
      box-sizing: border-box;
      font-weight: 600;
      top: 0px;
      left: 16px;
      height: 41px;
      line-height: 12px;
      width: 85%;
      background: #fff;
      text-align: left;
    }
    &::before{
      position: absolute;
      content: '';
      left: -12px;
      top: 12px;
      border-right: 10px solid transparent;
      border-left: 10px solid transparent;
      border-bottom: 10px solid #fff;
      transform: rotate(-90deg);
    }
  }
</style>
<style lang="scss" scoped>
:deep(.el-table__row.xiaxian) {
  background-color: #F5F5F5;
  color:#ACA899;
}
:deep(.el-table__fixed-right-patch) {
  background: #EEF0F6;
}
:deep(.el-checkbox__inner) {
  background: #F3F7FF;
  border-radius: 4px;
  border: 1px solid #7086B5;
}
:deep(.el-table__row.fold) {
  height: 15px;
  background: #FDF9FA;
  &:hover{
    cursor: pointer;
  }
  td{
    padding: 0;
  }
}
:deep(.el-table__body .fold.current-row>td) {
  background: #FDF9FA!important;
}
:deep(.el-table--enable-row-hover .el-table__body .fold:hover > td) {
  background-color: #FDF9FA!important
}
:deep(.el-table--small th){
  padding: 0;
  .cell {
    height: 32px;
    line-height: 32px;
  }
}
:deep(.el-icon-search){
  font-size: 16px;
  padding-left: 4px;
}
.tab-header {
  height: 60px;
  line-height: 60px;
  padding: 0 24px;
  position: absolute;
  border-radius: 16px;
  top: 0;
  right: 0;
  width: 100%;
  background: #fff;
  .left {
    font-size: 20px;
    font-family: "SimHei";
    font-weight: 600;
    position: absolute;
    left: 20px;
  }
  .right {
    position: absolute;
    right: 24px;
    top: 0;
  }
  .icon-wrapper {
    width: 32px;
    height: 32px;
    background: #7086B5;
    border-radius: 16px;
    display: inline-block;
    line-height: 32px;
    text-align: center;
    color: white;
    margin-left: 8px;
    &:hover{
      cursor: pointer;
    }
  }

}
.no-open{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.fold{
  transform:translateX(-20px);
  position: absolute;
  top: 0;
  left: 0;
  width: 200px;
}
.el-table__body tr,
  .el-table__body td {
    padding: 0;
}
.tag-search {
  width: 200px;
  position: absolute;
  right: 100px;
  :deep(.el-input__inner) {
    background: #F8F8FD;
    width: 300px;
    border-radius: 16px ;
    border-color: transparent;
}
}
.red {
  color: $secondRed;
}
.tab-select{
  display: flex;
  margin: 16px 0;
  align-items: center;
  line-height: 20px;
  position: relative;
  &-status{
    color:#778092;
    line-height: 20px
  }
}
.check-reason{
    color: #FD4378;
    position: relative;
    &::before{
      content:'';
      position: absolute;
      width:1px;
      height:16px;
      position:absolute;
      left: -10px;
      top: 0;
      background: #E1E6EB;
    }
    &:hover{
      cursor: pointer;
      text-decoration: underline;
    }
}
.tag-name{
    margin-right: 3px;
    outline: none;
  &:hover{
    color: #FD4378;
    text-decoration:underline;
    cursor: pointer;
  }
}
.tag-content{
  width: 120px;
  text-overflow: ellipsis;
}
.name-container{
    white-space: nowrap;
    width: auto;
    max-width: 140px;
    display: inline-block;
    vertical-align: middle;
    margin-right: 2px;
}
@mixin tag-type($bcgColor, $fontColor, $paddingLR){
  padding: 2px $paddingLR;
  // margin-left: 8px;
  margin-right: 10px;
  border-radius: 14px;
  text-overflow: ellipsis;
  background: $bcgColor;
  color: $fontColor
}
.caogao{
  @include tag-type(#FFECF1,#FD4378, 10px);
  padding: 5px 18px;
}
.tag-type-0{
  @include tag-type(#EAF5FF, #6492E8, 6px);
}
.tag-type-1{
  @include tag-type(#F1ECFF, #8F6FE4, 6px);
}
.bg {
  margin-right: 6px;
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 90px;
}
.bg-0 {
  margin-right: -10px;
}
.bg-1 {
  background: #FF931E;
  border: 2px solid #FFE5C9;
}
.bg-6 {
  background: #BFBFBF;
  color: #8C8C8C;
  border: 2px solid #E5E5E5;
}
.bg-3 {
  background: #4587FF;
  border: 2px solid #D5E2FC;
}
.color-4, .color-2{
  color: #FF5A1E;
}
.bg-4, .bg-2 {
  background: #FF5A1E;
  border: 2px solid #FFDFD3;
}
.bg-5 {
  background: #56BE0D;
  border: 2px solid #DDF1C9;
}
.tab-wrapper {
  padding: 0 24px;
}
.status-item {
  cursor: pointer;
  margin: 0 4px;
  width: 64px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  border-radius: 10px;
  transition: all .3s ease-in-out;
  position: relative;
  &.active {
    background: #7086B5;
    color: white;
  }
  &:hover{
    background: #F1F3FE;
    color: #353C47;
  }
}
.block-press {
  background: #7086b5;
  color: white;
}
.tab-tips-press{
  display: none;
}
.tab-tips{
  width: auto;
  min-width: 30px;
  height: 20px;
  line-height: 20px;
  padding: 0 5px;
  font-size: 12px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #FFFFFF;
  border-radius: 10px;
  background: #FD4378;
  display: block;
  position: absolute;
  top: -20px;
  right: -5px;
  pointer-events: none;
  &::after{
    content: " ";
    border-left: solid transparent 5px;
    border-right: solid transparent 5px;
    border-top: solid #FD4378 5px;
    transform: skew(145deg);
    height: 0;
    bottom: -3px;
    left: 10%;
    position: absolute;
    width: 0;
  }
}
.iconfont-block{
  width: 100%;
  display: flex;
  .iconfont {
    transition: all .1s ease-in-out;
    display: block;
    margin-right: 20px;
    position: relative;
    &::after{
      content: '';
      position: absolute;
      $radius: -7px;
      top: $radius; right: $radius;
      bottom: $radius; left: $radius;
    }
    &:hover{
      transform: scale(1.2);
    }
  }
  @mixin icon-hover($color){
    color: $color;
    cursor: pointer;
  }
  .iconbianji1:hover{
    @include icon-hover(#FF6B95)
  }
  .iconshenhe{
    color: #FD4378;
  }
  .iconshenhe:hover{
    @include icon-hover(#FF6B95);
    opacity: .8;
  }
  .iconchakan1:hover{
    @include icon-hover(#FF6B95)
  }
  .iconxiaxian:hover{
    @include icon-hover(#FF5A1E)
  }
  .iconshanchu1:hover{
    @include icon-hover(#FF5A1E)
  }
}
</style>