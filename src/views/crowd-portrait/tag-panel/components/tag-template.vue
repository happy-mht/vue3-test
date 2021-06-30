<template>
  <el-dialog
    title="选择展示方案"
    v-model="show"
    width="600px"
    class="add-dialog"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    append-to-body
    :before-close="handleClose">
    <div class="template-wrapper" v-if="panelList.length">
      <div
        v-for="(item, index) in panelList"
        :key="item.panelId + '-' + index"
        :class="['item', currIndex === index ? 'active' : '']"
        @click="handleClick(item, index)">
        <div style="font-weight: 500; font-size: 14px;line-height: 22px">
          <i class="iconmoban iconfont" />
          <template v-if="editIndex !== index">
            {{ item.panelName }}
            <el-button type="text" color="#9DA4B2" size="small" v-if="!item.defaultTemplate" @click.stop="handleClickEdit(item, index)" >
              <i class="iconfont iconbianji1" />
            </el-button>
          </template>
          <el-form ref="form" v-else :model="formData" :rules="rules" @submit.prevent :show-message="false" size="small" style="display: inline-block">
            <el-form-item prop="templateName" style="margin-bottom: 0">
              <el-input
                ref="nameInput"
                v-model="formData.templateName"
                style="width:240px;margin: 0 8px;"
                :placeholder="item.panelName"
                size="mini"
                @keydown.enter="saveName(item)" />
                <i class="el-icon-success" @click.stop="saveName(item)" style="margin-right: 6px"/>
                <i class="el-icon-error" @click.stop="editIndex = -1" />
            </el-form-item>
          </el-form>
        </div>
        <el-button v-if="panelList.length > 1 && item.panelId && editIndex !== index" class="deepred" size="small" type="text" @click.stop="handleDel(item, index)">
          <i class="iconshanchu iconfont" />
        </el-button>
      </div>
      <div v-if="panelList.length < 5" class="add-wrapper" @click="addTemplate">
        <i class="el-icon-plus" />
        <span>新增方案</span>
      </div>
    </div>
    <template #footer>
      <el-button class="btn-sub" size="small" @click="handleClose">取 消</el-button>
      <el-button class="btn-primary" size="small" @click="handleOk">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { createOrUpdatePanel, delPanel, getPanelList, selectPanel } from '@/api/tag-panel'

export default {
  panelName: 'TagTemplate',
  props: {
    show: Boolean
  },
  data() {
    return {
      editIndex: -1,
      formData: {
        templateName: ''
      },
      originId: '',
      panelList: [],
      currIndex: -1,
      rules: {
        templateName: [
          { message: '首字符只能是中英文', pattern: /^[\u4e00-\u9fa5_a-zA-Z]/gi, trigger: 'blur' },
          { message: '最大10个字符，仅允许输入中英文数字下划线横杠', pattern: /^[\w\u4e00-\u9fa5][\w\u4e00-\u9fa5\-_]{0,9}$/gi, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    currentId() {
      return this.panelList[this.currIndex].panelId
    }
  },
  mounted() {
    this.refreshPage()
    this.$eventHub.$on('refreshPage', this.refreshPage)
  },
  methods: {
    refreshPage() {
      this.getPanelList().then(() => {
        this.currIndex = this.panelList.findIndex(item => item.currentSelect)
        if (this.currIndex == -1) this.currIndex = 0
        this.originId = this.panelList[this.currIndex].panelId
        this.$emit('change', this.panelList[this.currIndex])
      })
    },
    async handleClickEdit(item, index) {
      try {
        this.formData.templateName = item.panelName
        this.editIndex = index
        this.$nextTick(() => this.$refs.nameInput[0].focus())
      } catch (e) {
        console.log(e)
      }
    },
    async handleClick(item, index) {
      try {
        this.currIndex = index
      } catch (e) {
        this.$refs.nameInput[0].focus()
        console.log(e)
      }
    },
    async getPanelList() {
      try {
        this.panelList = await getPanelList()
        return Promise.resolve()
      } catch (e) {
        return Promise.reject(e)
      }
    },
    async addTemplate() {
      try {
        await createOrUpdatePanel()
        await this.getPanelList()
        this.currIndex = this.panelList.length - 1
        this.$message.success('添加成功')
      } catch (e) {
        console.log(e)
      }
    },
    async saveName(item) {
      try {
        let reg = /^[\w\u4e00-\u9fa5][\w\u4e00-\u9fa5\-_]{0,9}$/gi
        let reg2 = /^[\u4e00-\u9fa5_a-zA-Z]/gi
        let msg = ''
        if (!reg.test(this.formData.templateName)) {
          msg = '最大10个字符，仅允许输入中英文数字下划线横杠'
        } else if (!reg2.test(this.formData.templateName)) {
          msg = '首字符只能是中英文'
        }
        if (msg) {
          this.$message.error(msg)
          this.$refs.nameInput[0].focus()
          return Promise.reject()
        }
        await createOrUpdatePanel({
          panelName: this.formData.templateName,
          panelId: item.panelId
        })
        this.$message.success('修改成功')
        this.editIndex = -1
        this.formData.templateName = ''
        this.getPanelList()
        return Promise.resolve()
      } catch (e) {
        console.log(e)
        return Promise.reject(e)
      }
    },
    async handleOk() {
      try {
        if (this.currentId !== this.originId) {
          await selectPanel( { panelId: this.currentId })
          this.originId = this.currentId
        }
        this.editIndex = -1
        this.$emit('change', this.panelList[this.currIndex])
      } catch (e) {
        console.log(e)
      }
    },
    async handleDel(item, index) {
      try {
        await this.$handleConfirm({ message: '<span>确定删除该模版吗？</span>' })
        await delPanel({ panelId: item.panelId })
        this.$message.success('删除成功')
        if (this.currIndex === index) {
          this.currIndex = 0
        } else if (this.currIndex > index) this.currIndex--
        await this.getPanelList()
      } catch (e) {
        console.log(e)
      }
    },
    handleClose() {
      let index = this.panelList.findIndex(i => i.panelId === this.originId)
      // 判断是否已经被删除，如果删除择选中第一个模版
      this.currIndex = index > -1 ? index : 0
      this.editIndex = -1
      this.$emit('change', this.panelList[this.currIndex])
    }
  }
}
</script>

<style lang="scss" scoped>
.el-icon-success {
  color: $primaryRed;
  cursor: pointer;
  font-size: 14px;
  &:hover {
    opacity: 0.8;
  }
}
.el-icon-error {
  color: #9DA4B2;
  cursor: pointer;
  font-size: 14px;
  &:hover {
    opacity: 0.8;
  }
}
.add-wrapper {
  height: 48px;
  display: flex;
  align-items: center;
  border: 1px dashed #B8CDFD;
  border-radius: 8px;
  box-sizing: border-box;
  justify-content: center;
  color: #778092;
  cursor: pointer;
  margin: 0 20px;
  &:hover {
    border-color: #298CFF;
    color: #FD4378;
  }
  i {
    margin-right: 4px;
  }
}
.add-dialog ::v-deep {
  .el-dialog__body {
    padding: 4px 0;
  }
}
.template-wrapper {
  max-height: 330px;
  overflow: auto;
  margin-top: 16px;
  .item {
    position: relative;
    cursor: pointer;
    height: 48px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    background: #F8F9FD;
    border-radius: 8px;
    margin: 8px 20px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    border: 1px solid #F8F9FD;
    padding: 0 12px;
    .iconfont {
      font-size: 12px;
    }
    &.active {
      border-color: #FF74AC;
      background: #FFEBF0;
    }
    &:hover {
      .deepred {
        display: inline-block;
      }
    }
    .deepred {
      display: none;
      position: absolute;
      right: 16px;
      top: calc(50% - 6px);
    }
  }
}
</style>