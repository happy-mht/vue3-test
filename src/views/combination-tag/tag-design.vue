<template>
  <div id="tag_design_svg">
    <pageHeader pageName="标签设计" />
    <div class="main" :style="`height: ${step === 2 ? 'calc(100vh - 60px - 64px)' : 'calc(100vh - 60px'}`">
      <steps :active="step - 1" :completed-step="completedStep">
        <step>创建组合标签基础信息</step>
        <step>完善标签组</step>
      </steps>
      <design-step-one v-show="step === 1" @next="handleNext" :detail="detail" />
      <design-step-two ref="stepTwo" v-show="step === 2" :content-list="contentList" :tag-form="tagForm" isEdit />
    </div>
    <div class="fixed-footer" v-if="step === 2">
      <el-button class="btn-text" size="small" type="text" @click="reset">重置</el-button>
      <el-button class="btn-sub" size="small" @click="step = 1">上一步</el-button>
      <el-button class="btn-sub" size="small" :disabled="detail.combinationTagStatus !== 0 && !!combinationTagId" @click="save(0)">存草稿</el-button>
      <el-button class="btn-primary" size="small" @click="save(1)">保存</el-button>
    </div>
  </div>
</template>

<script>
import pageHeader from '@/components/page-header'
import steps from '@/components/steps'
import step from '@/components/steps/step'
import designStepTwo from './step-two'
import designStepOne from './step-one'
import { getTagDetail, addOrUpdate, labelCancelUpdate } from '@/api/tag'
const uuidV4 = require('uuid-v4')

export default {
  name: 'TagDesign',
  components: { pageHeader, steps, step, designStepTwo, designStepOne },
  data() {
    return {
      step: 1,
      combinationTagId: '',
      tagForm: {
        combinationTagType: '',
        combinationTagId: ''
      },
      detail: {
        combinationContentList: [],
        combinationTagStatus: ''
      },
      contentList: [],
      completedStep: -1,
      operationType: 0
    }
  },
  watch: {
    combinationTagId(newV) {
      if (newV) {
        this.completedStep = 1
        this.getTagDetail()
      }
    },
    'tagForm.combinationTagType'(newv, oldv) {
      if (oldv !== '') this.contentList = []
    }
  },
  mounted() {
    window.addEventListener('beforeunload', this.beforeUnloadListener)
    this.combinationTagId = this.$route.params.id
    window.addEventListener('storage', e => {
      if (e.key === 'shopChange') {
        this.clear()
      } else if (e.key === 'unLockTag') {
        const { id } = JSON.parse(e.newValue)
        if (id == this.combinationTagId) this.closeByUnlock()
      }
    })
  },
  methods: {
    async closeByUnlock() {
      await this.$utils.handleNotice({
        message: '当前标签已被解锁，请重新进入'
      })
      window.close()
    },
    async clear() {
      await this.$utils.handleNotice({
        message: '您已切换店铺，请重新进入'
      })
      window.close()
    },
    async beforeUnloadListener(e) {
      e.preventDefault()
      const _self = this
      localStorage.setItem('refreshTag', uuidV4())
      try {
        if (_self.combinationTagId) {
          await labelCancelUpdate({ combinationTagId: _self.combinationTagId })
        }
      } catch (err) {
        console.log(err)
      }
      return
    },
    async reset() {
      try {
        const msg = this.combinationTagId ? '您确定要还原初始设计吗？' : '您确定要清空画布重新设计吗？'
        await this.$utils.handleConfirm({
          message: `<span>${msg}</span>`
        })
        this.contentList = this.combinationTagId ? JSON.parse(JSON.stringify(this.detail.combinationContentList)) : []
      } catch (e) {
        console.log(e)
      }
    },
    handleNext(e) {
      if (this.completedStep === -1) this.completedStep = 0
      this.step = 2
      this.tagForm = e
    },
    async getTagDetail() {
      try {
        const res = await getTagDetail({ combinationTagId: this.combinationTagId })
        this.detail = res
        this.detail.distributionShop = res.shopInfoList.map(i => i.shopId)
        this.contentList = JSON.parse(JSON.stringify(res.combinationContentList))
        this.tagForm = {
          combinationTagId: res.combinationTagId,
          combinationTagType: res.combinationTagType,
          combinationTagName: res.combinationTagName,
          combinationTagUpdateCycle: res.combinationTagUpdateCycle,
          combinationTagDesc: res.combinationTagDesc,
          operationType: res.operationType,
          distributionShop: res.distributionShop
        }
      } catch (e) {
        console.log(e)
      }
    },
    async confirmSave(params) {
      try {
        const id = await addOrUpdate({
          ...params,
          isContinue: true
        })
        this.combinationTagId = id
        this.getTagDetail()
        this.$message.success('保存成功')
        localStorage.setItem('refreshTag', uuidV4())
        if (this.operationType === 1) {
          window.close()
        } else {
          this.operationType = ''
        }
      } catch (e) {
        if (e && e.message) this.$message.error(e.message)
      }
    },
    async save(operation) {
      this.operationType = operation
      let params = {}
      let isValid = true
      try {
        const res = await this.$refs.stepTwo.validate()
        const combinationContentList = res.map(item => {
          let tempArr = item.combinationDetail.map(item2 => {
            let obj = {
              dataType: item2.dataType,
              tagEnName: item2.tagEnName,
              tagId: item2.tagId,
              tagType: item2.tagType,
              tagDesc: item2.tagDesc,
              tagContent: {
                tagName: item2.tagName,
                inputType: item2.inputType,
                value: item2.value,
                enumList: item2.tagEnumInfo || item2.enumList
              }
            }
            if (item2.dataType === 'logic') {
              obj = {
                dataType: 'logic',
                logic: item2.logic
              }
            } else if (item2.dataType === 'group') {
              if (item2.groupContent.length === 0) obj = null
              else {
                obj = { dataType: item2.dataType }
                obj.groupContent = item2.groupContent.map(item3 => {
                  let obj = {
                    tagDesc: item3.tagDesc,
                    dataType: item3.dataType,
                    tagEnName: item3.tagEnName,
                    tagId: item3.tagId,
                    tagType: item3.tagType,
                  }
                  if (item3.dataType === 'tag') {
                    if (item3.tagType === 5) {
                      obj.tagContent = {
                        tagName: item3.tagName,
                        buyAmount: item3.buyAmount,
                        buyNumber: item3.buyNumber,
                        selectGoods: item3.selectGoodsInfo.map(i => i.goodsCode),
                        selectTime: item3.selectTime,
                        selectGoodsInfo: item3.selectGoodsInfo
                      }
                    } else {
                      obj.tagContent = {
                        tagName: item3.tagName,
                        inputType: item3.inputType,
                        value: item3.value,
                        enumList: item3.tagEnumInfo || item3.enumList
                      }
                    }
                  } else {
                    obj = {
                      dataType: 'logic',
                      logic: item3.logic
                    }
                  }
                  return obj
                })
              }
            } else if (item2.tagType === 5) { // 动作类型
              obj.tagContent = {
                tagName: item2.tagName,
                buyAmount: item2.buyAmount,
                buyNumber: item2.buyNumber,
                selectGoods: item2.selectGoodsInfo.map(i => i.goodsCode),
                selectTime: item2.selectTime,
                selectGoodsInfo: item2.selectGoodsInfo
              }
            }
            return obj
          })
          tempArr = tempArr.filter(i => !!i)
          let combinationDetail = []
          // 删除空的容器和多余的逻辑符
          // 头尾不能是逻辑符号
          while(tempArr.length && tempArr[0].dataType === 'logic') tempArr.splice(0, 1)
          while(tempArr.length && tempArr[tempArr.length - 1].dataType === 'logic') tempArr.pop()
          // 中间不能有连续的逻辑符号
          if (tempArr.length > 0) {
            let prev = tempArr[0]
            combinationDetail = [tempArr[0]]
            for (let i = 1, len = tempArr.length; i < len; i++) {
              if (!(prev.dataType === 'logic' && tempArr[i].dataType === 'logic')) {
                combinationDetail.push(tempArr[i])
              } else {
                combinationDetail.pop()
                combinationDetail.push(tempArr[i])
              }
              prev = tempArr[i]
            }
          }
          return {
            contentEnumId: item.contentEnumId,
            name: item.name,
            description: item.description,
            combinationDetail
          }
        })
        params = {
          ...this.tagForm,
          combinationContentList,
          isContinue: false
        }
        params.operationType = this.operationType
      } catch (e) {
        console.log(e)
        isValid = false
      }
      if (!isValid) return Promise.resolve()
      try {
        const id = await addOrUpdate(params)
        this.combinationTagId = id
        this.getTagDetail()
        this.$message.success('保存成功')
        if (this.detail.combinationTagStatus === 5) {
          this.$utils.handleNotice({
            message: '保存会使正在运行的标签重新进入审阅流程'
          })
        }
        localStorage.setItem('refreshTag', uuidV4())
        if (this.operationType === 1) {
          window.close()
        } else {
          this.operationType = ''
        }
      } catch (e) {
        if (e && e.code === 205) {
          await this.$utils.handleConfirm({
            message: `<span>${e.message}</span>`
          })
          if (this.detail.combinationTagStatus === 5) {
            await this.$utils.handleNotice({
              message: '保存会使正在运行的标签重新进入审阅流程'
            })
          }
          this.confirmSave(params)
        }
        else if (e && e.message) this.$message.error(e.message)
      }
      return Promise.resolve()
    }
  },
  beforeUnmount() {
    localStorage.setItem('refreshTag', uuidV4())
    window.removeEventListener('beforeunload', this.beforeUnloadListener)
    localStorage.setItem('refreshTag', uuidV4())
  },
}
</script>

<style scoped lang="scss">
.main {
  background-color: #F9F8FD;
  padding: 0 32px;
  overflow: auto;
}
.fixed-footer {
  position: fixed;
  bottom: 0;
  width: 100vw;
  height: 64px;
  line-height: 64px;
  background-color: white;
  border-top: 1px solid $black10;
  box-shadow: 0px 2px 22px -4px #EDEDED;
  text-align: center;
  .el-button + .el-button {
    margin-left: 16px;
  }
}
</style>