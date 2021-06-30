<template>
  <el-dialog
    :title="id ? '编辑商品集' : '新建商品集'"
    v-model="visible"
    width="720px"
    custom-class="add-dialog"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    append-to-body
    @close="handleClose"
    @open="handleOpen"
    @opened="handleOpened">
    <el-form ref="setForm" :model="setForm" :rules="rules" size="small" inline class="form">
      <div style="border-bottom: 1px dashed #D0D6E4;margin-bottom: 16px">
        <el-form-item label="平台：" prop="platform">
          <el-select v-model="setForm.platform" style="width: 200px" :disabled="!!id">
            <el-option v-for="item in platformList" :value="item.key" :label="item.desc" :key="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="商品集名称：" prop="name">
          <el-input v-model.trim="setForm.name" style="width: 200px" placeholder="请输入" clearable />
        </el-form-item>
      </div>
      <div>
        <el-form-item label="平台宝贝ID：" prop="plformNumIid">
          <el-input v-model="setForm.plformNumIid" style="width: 200px" placeholder="宝贝ID精确匹配" clearable />
        </el-form-item>
        <el-form-item label="平台宝贝名：" prop="plformSkuName">
          <el-input v-model="setForm.plformSkuName" style="width: 200px" placeholder="宝贝名称模糊匹配" clearable />
        </el-form-item>
        <el-button type="primary" plain size="small" @click="searchGoods">查询</el-button>
      </div>
    </el-form>
    <div class="godds-tab">
      <label :class="['tab-title', active === 1 && 'active']" @click="active = 1">所有商品</label>
      <label :class="['tab-title', active === 2 && 'active']" @click="active = 2">已选商品({{ numIidList.length }})</label>
      <el-popover
        placement="bottom-start"
        trigger="manual"
        v-model="isShowPopover"
        :visible-arrow="false"
        width="510">
        <div>
          <el-input type="textarea" v-model="goodsInput" size="small" :placeholder="`请输入商品id，格式如下：\n商品id1\n商品id2\n商品id3`" :rows="17" resize="none"/>
          <div style="float: right;margin-top: 12px">
            <el-button class="btn-sub" size="mini" @click="isShowPopover = false;goodsInput = ''">取消</el-button>
            <el-button  type="primary" size="mini" plain @click="handleImportOk">确定</el-button>
          </div>
        </div>
        <template #reference>
          <el-button style="margin-left: 4px;padding: 6px 15px" type="primary" plain size="tiny" @click="isShowPopover = true">批量导入</el-button>
        </template>
      </el-popover>
      <el-table
        ref="table1"
        v-show="active === 1"
        :data="showList"
        size="small"
        height="320px"
        @select="handleSelection"
        v-loading="loading"
        @select-all="handSelectAll">
        <template #empty>
          <table-empty />
        </template>
        <el-table-column type="selection" width="50px" align="center" :selectable="selectable" />
        <el-table-column label="宝贝ID" prop="plformNumIid" width="120px" />
        <el-table-column label="宝贝名称" prop="plformSkuName" />
      </el-table>
      <el-table ref="table2" v-show="active === 2" :data="selectedList" size="small" height="320px" @selection-change="handSelectChange2">
        <template #empty>
          <table-empty />
        </template>
        <el-table-column type="selection" width="50px" align="center"/>
        <el-table-column label="宝贝ID" prop="plformNumIid" width="120px" />
        <el-table-column label="宝贝名称" prop="plformSkuName" />
        <el-table-column label="操作" width="48px">
          <template v-slot="{ row, $index }">
            <el-button type="text" class="deepred" size="medium" @click="handleDel(row, $index)"><i class="iconfont iconshanchu" /></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button class="del-btn" v-if="selection2.length > 0" size="small" plain type="primary" @click="handleBatchDel">批量删除</el-button>
    </div>
    <template #footer>
      <el-button class="btn-sub" size="small" @click="visible = false">取 消</el-button>
      <el-button class="btn-primary" size="small" @click="handleOk">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import * as api from '@/api/advice-unpurchased'
import { getDict } from '@/api/goods-set'
export default {
  name: 'productSetModal',
  props: {
    value: Boolean,
    id: [Number, String],
    productProjectId: [Number, String]
  },
  data() {
    return {
      goodsInput: '',
      isShowPopover: false,
      visible: false,
      active: 1,
      setForm: {
        platform: '',
        name: '',
        plformNumIid: '',
        plformSkuName: ''
      },
      loading: false,
      platformList: [],
      showList: [],
      allList: [],
      allSelectedList: [], // 商品集方案中的商品不能重复被选
      selection2: [],
      selectedList: [],
      rules: {
        name: [
          { required: true, message: '不可为空' },
          { message: '限制2~20个的中英文数字下划线横杠', pattern: /^[\w\u4e00-\u9fa5\-_]{2,20}$/gi, trigger: 'blur' }
        ]
      }
    }
  },
  emits: ['close', 'refresh'],
  computed: {
    numIidList() {
      return this.selectedList.map(i => i.plformNumIid)
    },
    disabledList() {
      let arr = this.allSelectedList.filter(item => {
        return this.selectedList.findIndex(item2 => item2.plformNumIid === item.plformNumIid) === -1
      })
      return arr.map(i => i.plformNumIid)
    }
  },
  watch: {
    value(val) {
      this.visible = val
    }
  },
  created() {
    getDict().then(res => {
      this.platformList = res.platformType
      if (this.platformList.length === 1) this.setForm.platform = this.platformList[0].key
    })
  },
  methods: {
    selectable(row) {
      return this.disabledList.findIndex(item => item === row.plformNumIid) == -1
    },
    searchGoods() {
      if (this.setForm.plformNumIid) this.showList = this.allList.filter(i => i.plformNumIid === this.setForm.plformNumIid)
      else if (this.setForm.plformSkuName) {
        this.showList = this.allList.filter(item => {
          const label = item.plformSkuName
          return label.toLowerCase().indexOf(this.setForm.plformSkuName.toLowerCase()) > -1
        })
      } else {
        this.showList = this.allList
      }
      this.$nextTick(() => {
        this.showList.forEach(row => {
          this.$refs.table1.toggleRowSelection(row, !!row.isSelected)
        })
      })
    },
    async getDetail() {
      try {
        this.loading = true
        const res = await api.getSetDetail({ productSetId: this.id || 0, productProjectId: this.productProjectId })
        if (this.id) {
          this.setForm.name = res.name
          this.setForm.platform = res.platform || []
          this.selectedList = res.selectedList || []
          this.$nextTick(() => {
            this.selectedList.forEach(item => {
              let row = this.showList.find(i => i.plformNumIid === item.plformNumIid)
              row.isSelected = true
              this.$refs.table1.toggleRowSelection(row, true)
            })
          })
        }
        this.allList = res.allList
        this.showList = this.allList
        this.allSelectedList = res.allSelectedList || []
        this.loading = false
      } catch (e) {
        this.loading = false
        console.log(e)
      }
    },
    async handleImportOk() {
      let temp = this.goodsInput.split(/[,，\n\r]/).map(i => i.replace(/\s/g, ''))
      let arr = []
      let isSelected = []
      let isNotExist = []
      let isOtherSelected = []
      let msg = ''
      temp = [...new Set(temp)]
      temp.forEach(i => {
        if (!i) return
        if (this.disabledList.includes(i)) {
          isOtherSelected.push(i)
        } else if (this.numIidList.includes(i)) {
          isSelected.push(i)
        } else {
          let goods = this.allList.find(item => item.plformNumIid === i)
          goods ? arr.push(goods) : isNotExist.push(i)
        }
      })
      this.selectedList.push(...arr)
      if (isNotExist.length > 0) msg += `<div>【${isNotExist.join('、')}】不存在</div>`
      if (isSelected.length > 0) msg += `<div>【${isSelected.join('、')}】已选择</div>`
      if (isOtherSelected.length > 0) msg += `<div>【${isOtherSelected.join('、')}】已存在，系统已默认去除</div>`
      if (msg) {
        this.$message.warning({
          dangerouslyUseHTMLString: true,
          message: `<div style="line-height: 1.5;font-size: 12px">${msg}</div>`,
          duration: 4000
        })
      }
      arr.forEach(item => {
        item.isSelected = true
        this.$refs.table1.toggleRowSelection(item, true)
      })
      this.goodsInput = ''
      this.active = 2
      this.isShowPopover = false
    },
    handleSelection(selection, row) {
      row.isSelected = !row.isSelected
      const index = this.selectedList.findIndex(i => i.plformNumIid === row.plformNumIid)
      if (row.isSelected) {
        this.selectedList.push(row)
      } else {
        this.selectedList.splice(index, 1)
      }
    },
    handSelectAll(selection) {
      if (selection.length > 0) {
        this.showList.forEach(row => {
          if (this.disabledList.includes(row.plformNumIid)) return
          else {
            row.isSelected = true
            const index = this.selectedList.findIndex(i => i.plformNumIid === row.plformNumIid)
            if (index === -1) this.selectedList.push(row)
          }
        })
      } else {
        this.showList.forEach(row => {
          row.isSelected = false
          const index = this.selectedList.findIndex(i => i.plformNumIid === row.plformNumIid)
          if (index > -1) this.selectedList.splice(index, 1)
        })
      }
    },
    handSelectChange2(selection) {
      this.selection2 = selection
    },
    handleBatchDel() {
      this.selection2.forEach(row => {
        const index = this.selectedList.findIndex(item => item.plformNumIid === row.plformNumIid)
        this.handleDel(row, index)
      })
    },
    handleDel(item, index) {
      this.selectedList.splice(index, 1)
      let row = this.allList.find(row => row.plformNumIid === item.plformNumIid)
      row.isSelected = false
      if (row) this.$refs.table1.toggleRowSelection(row, false)
    },
    handleClose() {
      this.isShowPopover = false
      this.$emit('close')
    },
    handleOpen() {
      this.setForm.plformNumIid = ''
      this.setForm.plformSkuName = ''
      this.selection2 = []
      this.active = 1
      this.allList = []
      this.showList = []
      this.selectedList = []
      this.setForm.name = ''
      this.$refs.setForm && this.$refs.setForm.resetFields()
    },
    handleOpened() {
      this.getDetail()
    },
    async handleOk() {
      try {
        await this.$refs.setForm.validate()
        if (this.selectedList.length === 0) {
          this.$message.error('请选择商品')
          return
        }
        const params = {
          platform: this.setForm.platform,
          name: this.setForm.name,
          productCodeList: this.numIidList,
          productProjectId: this.productProjectId
        }
        if (this.id) params.productSetId = this.id
        const newId = await api.updateSet(params)
        const msg = this.id ? '修改成功' : '新建成功'
        this.$message.success(msg)
        this.isShowPopover = false
        this.$emit('close')
        this.$emit('refresh', newId)
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.form {
  padding: 0 16px;
  :deep(.el-form-item__label) {
    padding-right: 0;
  }
}
.godds-tab {
  padding: 0 16px;
  .tab-title {
    font-size: 14px;
    color: #353C47;
    cursor: pointer;
    position: relative;
    margin-bottom: 16px;
    display: inline-block;
    & + .tab-title {
      margin-left: 16px;
    }
    &:hover {
      color: $primaryRed;
    }
    &.active {
      color: $primaryRed;
      font-weight: 600;
      &::after {
        position: absolute;
        content: '';
        width: 100%;
        height: 2px;
        background: #FD4378;
        border-radius: 1px;
        top: 24px;
        left: 0;
      }
    }
  }
}
.del-btn {
  position: absolute;
  left: 45%;
  bottom: 75px;
}
</style>