<template>
  <div>
    <div class="top-panel">
      <el-dropdown v-if="projectList.length > 0" trigger="click" placement="bottom-end" @visible-change="e => isShowDropDown = e">
        <label style="font-size: 20px;font-weight: 600;">
          <span style="color:#353C47;cursor: pointer">{{projectName}}
            <i class="iconfont iconxia" :style="`color: ${isShowDropDown ? '#FD4378' : '#BDC2C8'}`" />
          </span>
        </label>
        <template #dropdown>
          <el-dropdown-menu class="plan-menu">
            <el-dropdown-item
              v-for="item in projectList"
              @click="handleChooseProject(item, true)"
              class="ellipsis"
              :class="{'active': item.id === productProjectId }"
              :key="item.id">
              {{item.projectName}}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <span v-else style="color: #BDC2C8">暂无方案，请点击右侧新建</span>
      <div class="btn" style="margin-left: 24px;margin-right: 8px;" @click="handleOpenAddProject">
        <i class="iconjia iconfont" />
      </div>
      <div v-if="projectList.length > 0" class="btn" @click="handleDelProject">
        <i class="iconfont iconshanchu1" />
      </div>
    </div>
    <div class="top">
      <div style="font-size:14px">
        <span style="font-weight: 600">商品集详情</span>
        <span v-if="productProjectId" style="color: #8C94A0">（已新建商品集数：<span class="red">{{total}}</span>/20）</span>
      </div>
      <div v-if="!dragging && productProjectId">
        <el-button
          type="text"
          size="small"
          class="move-btn"
          :disabled="!sortAbel"
          @click="handleSort">
          <i class="iconfont iconyidong" />
          <span class="text">调整优先级</span>
        </el-button>
        <el-popover
          v-if="total < 20"
          placement="top-end"
          width="264"
          popper-class="product-set-plan-add"
          trigger="hover">
          <div class="title">
            <i class="el-icon-warning" />温馨提示：
          </div>
          <div class="content">
            <div style="font-weight: 600">建议在"<span class="set-txt" @click="$router.push({ name: 'product_set_settings' })">商品集设置</span>"页面新建和引用商品集</div>
            <div style="color: #8C94A0;">店铺商品集在所有包含商品选择的场景中都可以复用，而人群策略中建立的商品集只会被询单未购当前人群分群方案所使用</div>
          </div>
          <template #reference>
            <el-button style="margin: 0 8px" type="primary" plain size="small" @click="isOpenProductSetModal = true">
              <i class="iconjia iconfont" />新建商品集
            </el-button>
          </template>
        </el-popover>
        <el-button class="btn-primary" size="small" @click="isOpenIntroduceModal = true">
          <i class="iconfont icondaochu" />
          引入店铺商品集
        </el-button>
      </div>
      <div v-else-if="dragging">
        <span style="color: #8C94A0;">优先级调整中：</span>
        <el-button size="mini" class="btn-sub" @click="handleSortCancel">取消</el-button>
        <el-button size="mini" class="btn-primary" @click="handleSortSave">保存</el-button>
      </div>
    </div>
    <el-alert v-if="productProjectId" type="info" style="margin-bottom: 8px" :closable="false">
      <template #title>
        <span><i class="iconfont icontishi-mianxing" />营销消息设置不完整的商品集方案将不可被选</span>
      </template>
    </el-alert>
    <el-table ref="table" :data="tableData" size="small" v-loading="loading">
      <template #empty>
        <table-empty />
      </template>
      <el-table-column label="优先级" width="100px" prop="priority">
        <template v-slot="{ row }">
          <span v-if="row.priority == 50" style="display: inline-block;width: 20px;text-align: center;"> - </span>
          <span v-else class="priority" :style="`margin-left: ${dragging ? '56px' : 'auto'}`">{{row.priority}}</span>
          <span v-if="dragging" class="sort"><i class="iconliebiao iconfont" /></span>
        </template>
      </el-table-column>
      <el-table-column label="商品集名称" width="160px" prop="name" />
      <el-table-column label="宝贝ID" min-width="200px" prop="goodsNames" />
      <el-table-column label="营销消息设置" width="160px" prop="setMessage">
        <template v-slot="{ row }">
          <el-button :class="[row.setMessage ? 'blueGrey' : 'red']" type="text" size="small" @click="handleOpenSet(row)" :disabled="dragging">
            <i class="iconshezhi-xianxing iconfont" style="margin-right: 2px;font-size: 12px" />{{row.setMessage ? '已设置' : '立即设置' }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160px">
        <template v-slot="{ row, $index }" v-if="!dragging">
          <template v-if="row.priority < 50">
            <el-button type="text" size="medium" style="margin-right: 10px" @click="currentSetId = row.productSetId;isOpenProductSetModal = true"><i class="iconbianji1 iconfont" /></el-button>
            <el-button type="text" class="deepred" size="medium" @click="handleDel(row, $index)"><i class="iconfont iconshanchu" /></el-button>
          </template>
          <template v-else>
            <el-switch
              :value="row.setOpened"
              active-color="#78CC2F"
              :active-value="1"
              :inactive-value="0"
              inactive-color="#D9D9D9"
              style="margin-right: 4px"
              @click="handleClickSwitch(row)" />
            <span style="color:#8C94A0">{{ row.setOpened ? '已开启' : '已关闭'}}</span>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      width="400px"
      title="新建商品集方案"
      v-model="isOpenCreatModal"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      append-to-body
      @close="$refs.projectForm.resetFields()">
      <el-form ref="projectForm" :model="projectForm" :rules="rules" @submit.prevent size="small" hide-required-asterisk label-position="top">
        <el-form-item label="商品集方案名称" prop="name">
          <el-input ref="projectInput" v-model="projectForm.name" placeholder="请输入，支持2～10个中英文字符" style="width: 300px" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button class="btn-sub" size="small" @click="isOpenCreatModal = false">取 消</el-button>
        <el-button class="btn-primary" size="small" @click="handleAddProject">确 定</el-button>
      </template>
    </el-dialog>
    <el-dialog
      width="400px"
      title="营销消息设置"
      v-model="isOpenSetModal"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      append-to-body
      @close="$refs.msgForm.resetFields()">
      <el-form ref="msgForm" :model="msgForm" :rules="rules" @submit.prevent size="small" hide-required-asterisk label-position="top">
        <el-form-item prop="message" style="margin-bottom: 6px">
          <el-input
            type="textarea"
            v-model="msgForm.message"
            placeholder="请输入营销消息"
            style="width: 352px"
            :rows="6"
            maxlength="500"
            resize="none" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button class="btn-sub" size="small" @click="isOpenSetModal = false">取 消</el-button>
        <el-button class="btn-primary" size="small" @click="handleSet">确 定</el-button>
      </template>
    </el-dialog>
    <el-dialog
      width="400px"
      title="引入店铺商品集"
      v-model="isOpenIntroduceModal"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      append-to-body
      @close="$refs.setForm.resetFields()">
      <el-form :model="setForm" ref="setForm" :rules="rules" @submit.prevent size="small" hide-required-asterisk label-position="top">
        <el-form-item label="商品集" prop="setId">
          <el-select v-model="setForm.setId" placeholder="请选择商品集" style="width: 300px">
            <el-option v-for="item in shopGoodsSetList" :key="item.id" :value="item.id" :label="item.name" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button class="btn-sub" size="small" @click="isOpenIntroduceModal = false">取 消</el-button>
        <el-button class="btn-primary" size="small" @click="handleIntroduce">确 定</el-button>
      </template>
    </el-dialog>
    <product-set
      :value="isOpenProductSetModal"
      :id="currentSetId"
      :productProjectId="productProjectId"
      @refresh="getProjectList"
      @close="isOpenProductSetModal = false; currentSetId = ''" />
  </div>
</template>
<script>
import Sortable from 'sortablejs'
import * as api from '@/api/advice-unpurchased'
import productSet from './product-set.vue'
export default {
  name: 'productSetPlan',
  components: { productSet },
  data() {
    return {
      isShowDropDown: false,
      currentSetId: '',
      isOpenProductSetModal: false,
      isOpenSetModal: false,
      isOpenCreatModal: false,
      isOpenIntroduceModal: false,
      loading: false,
      dragging: false,
      tableHeight: 500,
      projectForm: {
        name: ''
      },
      setForm: {
        setId: ''
      },
      msgForm: {
        message: ''
      },
      projectList: [],
      shopGoodsSetList: [],
      productProjectId: 1,
      sortable: null,
      tableData: [],
      originList: [],
      defaultList: [],
      rules: {
        name: [
          { required: true, message: '*请输入名称' },
          { message: '*请以中英文开头', pattern: /^[\u4e00-\u9fa5_a-zA-Z]/gi },
          { message: '限制2~10个的中英文数字下划线横杠', pattern: /^[\w\u4e00-\u9fa5][\w\u4e00-\u9fa5\-_]{1,9}$/gi }
        ],
        setId: [
          { required: true, message: '*请选择商品集' }
        ],
        message: [
          { required: true, message: '请输入' }
        ]
      }
    }
  },
  computed: {
    total() {
      return this.tableData.filter(i => i.priority < 50).length
    },
    projectName() {
      const obj = this.projectList.find(i => i.id === this.productProjectId )
      return obj ? obj.projectName : ''
    },
    sortAbel() {
      return this.tableData.some(i => i.priority < 50)
    }
  },
  created() {
    this.productProjectId = ''
    this.getProjectList()
    api.getShopGoodsSet().then(res => {
      this.shopGoodsSetList = res || []
    })
  },
  mounted() {
    this.$nextTick(() => {
      this.rowDrop()
    })
  },
  methods: {
    getProjectList(id) {
      api.getProjectList().then(res => {
        this.projectList = res
        if (res.length === 0) this.productProjectId = ''
        else if (id) this.productProjectId = id
        else if (this.projectList.length > 0) this.productProjectId = res[0].id
        this.search()
      })
    },
    async search() {
      try {
        if (!this.productProjectId) {
          this.tableData = []
          return
        }
        this.loading = true
        const res = await api.getProjectSetList(this.productProjectId)
        this.tableData = res
        this.loading = false
      } catch (e) {
        console.log(e)
        this.loading = false
      }
    },
    async handleIntroduce() {
      try {
        await this.$refs.setForm.validate()
        const res = await api.inputShopSet({
          productProjectId: this.productProjectId,
          ShopGoodsSetId: this.setForm.setId
        })
        let msg = res.unPutGoodsList.length > 0 ? ('引入成功！商品ID【' + res.unPutGoodsList.join('、') + '】重复，已自动去除') : '引入成功！'
        this.$message.success(msg)
        this.isOpenIntroduceModal = false
        this.setForm.setId = ''
        this.getProjectList(res.productProjectId)
      } catch (e) {
        console.log(e)
      }
    },
    handleOpenSet(row) {
      this.msgForm.productSetId = row.productSetId
      this.msgForm.message = row.message
      this.isOpenSetModal = true
    },
    async handleSet() {
      try {
        await this.$refs.msgForm.validate()
        await api.addSetMsg({
          productSetId: this.msgForm.productSetId,
          message: this.msgForm.message
        })
        this.$message.success('设置成功！')
        this.isOpenSetModal = false
        this.search()
      } catch (e) {
        console.log(e)
      }
    },
    handleOpenAddProject() {
      this.isOpenCreatModal = true
      this.$nextTick(() => {
        this.$refs.projectInput.focus()
      })
    },
    async handleAddProject() {
      try {
        await this.$refs.projectForm.validate()
        const newId = await api.createProject({ projectName: this.projectForm.name })
        this.getProjectList(newId)
        this.projectForm.name = ''
        this.$message.success('新建成功！')
        this.isOpenCreatModal = false
      } catch (e) {
        console.log(e)
      }
    },
    handleSort() {
      this.sortable.disabled = true
      this.dragging = true
      this.defaultList = this.tableData.filter(i => i.priority === 50)
      this.tableData = this.tableData.filter(i => i.priority < 50)
      this.originList = JSON.parse(JSON.stringify(this.tableData))
    },
    async handleSortSave() {
      try {
        const productSetPriorityList = this.originList.map((i, index) => {
          return {
            productSetId: i.productSetId,
            priority: index + 1
          }
        })
        const newId = await api.updatePriority({
          productProjectId: this.productProjectId,
          productSetPriorityList
        })
        this.$message.success('保存成功！')
        this.tableData = []
        this.getProjectList(newId)
        this.sortable.disabled = false
        this.dragging = false
      } catch (e) {
        console.log(e)
      }
    },
    handleSortCancel() {
      this.sortable.disabled = false
      const temp = this.tableData
      this.tableData = []
      this.dragging = false
      this.$nextTick(() => {
        this.tableData = temp.concat(this.defaultList)
      })
    },
    async handleClickSwitch(row) {
      try {
        const newId = await api.switchSetOpened({
          productProjectId: this.productProjectId,
          productSetId: row.productSetId,
          setOpened: row.setOpened == 1 ? 0 : 1
        })
        const msg = row.setOpened == 1 ? '关闭成功' : '打开成功'
        this.$message.success(msg)
        this.getProjectList(newId)
      } catch (e) {
        console.log(e)
      }
      this.$set(row, 'isOpen', !row.isOpen)
    },
    async handleDelProject() {
      try {
        await this.$handleConfirm({
          message: '<span>确定要删除当前方案吗？</span>'
        })
        await api.delProject(this.productProjectId)
        this.$message.success('删除成功！')
        this.getProjectList()
      } catch (e) {
        console.log(e)
      }
    },
    async handleDel(row) {
      try {
        await this.$handleConfirm({
          message: '<span>确定要删除当前商品集吗？</span>'
        })
        const newId = await api.deleteSet({
          productProjectId: this.productProjectId,
          productSetId: row.productSetId
        })
        this.$message.success('删除成功！')
        this.getProjectList(newId)
      } catch (e) {
        console.log(e)
      }
    },
    handleChooseProject(item) {
      this.productProjectId = item.id
      this.handleSortCancel()
      this.search()
    },
    rowDrop() {
      const tbody = this.$refs.table.$el.querySelector('tbody')
      const _this = this
      this.sortable = Sortable.create(tbody, {
        disabled: false,
        handle: '.sort',
        onEnd({ newIndex, oldIndex }) {
          let currRow = _this.originList.splice(oldIndex, 1)[0]
          _this.originList.splice(newIndex, 0, currRow)
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
.product-set-plan-add {
 .title {
   font-size: 12px;font-weight: bold;margin-bottom: 8px;
   i {
     color: #7086B5;
     font-size: 14px;
     margin-right: 2px;
   }
 }
 .content {
   font-size: 12px;
   line-height: 20px
 }
 .set-txt {
   color: #FD4378;
   text-decoration:underline;
   cursor: pointer;
 }
}
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.priority {
  display: inline-block;
  width: 20px;
  height: 20px;
  font-size: 12px;
  font-weight: 400;
  color: #353C47;
  background-color: #EEF4FF;
  text-align: center;
  line-height: 20px;
  border-radius: 20px;
}
.sort {
  cursor: move;
  width: 56px;
  background: #F9FAFD;
  text-align: center;
  color: #979797;
  left: 0;
  position: absolute;
  top: 0;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  .iconfont {
    margin-right: 2px;
    font-size: 12px;
  }
  .move-btn {
    color: #7086B5;
    .text {
      color:#353C47;
    }
    &:hover {
      .text {
        color: $secondRed;
      }
    }
  }
}
.top-panel {
  font-size: 14px;
  height: 60px;
  background: #F7F8FB;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
  .title {
    font-weight: bold;
  }
  .btn {
    width: 32px;
    height: 32px;
    background: #EEF4FF;
    border-radius: 4px;
    border: 1px solid #DEE2FA;
    text-align: center;
    line-height: 32px;
    cursor: pointer;
    .iconfont {
      font-size: 14px;
      color: #7086B5;
    }
    &:hover {
      background: #FFE3EB;
      border-color: #FFE3EB;
      .iconfont{
        color: $primaryRed;
      }
      .iconshanchu1 {
        color: $deepred;
      }
    }
  }
}
.plan-menu {
  width: 240px;
  max-height: 400px;
  padding: 6px 0;
  overflow: auto;
  li {
    padding: 0 12px;
    font-size: 12px;
  }
}
.red {
  color: $primaryRed;
}
</style>

