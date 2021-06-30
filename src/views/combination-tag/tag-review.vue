<template>
   <div id="tag_design_svg">
    <pageHeader pageName="标签设计" />
    <div class="design-panel" :style="`height: ${type === 'review' ? 'calc(100vh - 60px - 64px )' : 'calc(100vh - 60px)'}`">
      <div class="tag-detail">
        <span class="title">{{detail.combinationTagName}}</span>
        <span>标签类型：组合标签</span>
        <span>标签内容类型：{{ detail.combinationTagType === 0 ? '枚举值' : '布尔值' }}</span>
        <span>标签更新间隔：{{ detail.combinationTagUpdateCycleDesc }}</span>
        <el-tooltip :disabled="!showDescTip">
          <template #content>
            <div style="max-width: 300px">{{ detail.combinationTagDesc}}</div>
          </template>
          <div ref="descTip" class="ellipsis">
            <span>标签说明：{{ detail.combinationTagDesc }}</span>
          </div>
        </el-tooltip>
      </div>
      <div class="main">
        <div v-for="(item, index) in contentList" :key="index" class="tag-item">
          <el-form ref="contentForm" :model="item" :rules="rules" size="small" class="tag-left" :style="`padding-top:${detail.combinationTagType === 1 ? '8px' : '0'}`">
            <div v-if="detail.combinationTagType === 1" :class="['boolean-type', index === 1 ? 'boolean-type-0' : 'boolean-type-1']">
              {{ index === 0 ? 'TRUE' : 'FALSE' }}
            </div>
            <div style="margin-bottom: 12px;">
              <span class="title">{{ item.name }}</span>
            </div>
            <div style="word-break: break-all">{{ item.description }}</div>
          </el-form>
          <div class="tag-edit-panel">
            <template v-for="(item2, index2) in item.combinationDetail">
              <group v-if="item2.dataType === 'group'" :key="'container' + index2">
                <template v-for="(item3, index3) in item2.groupContent">
                  <container
                    v-if="item3.dataType === 'tag'"
                    :key="'children-node-' + index3"
                    :tag="item3"
                    is-leaf
                    :is-edit="false">
                    <component
                      v-bind="$attrs"
                      ref="tagComponent"
                      :is="'component_' + item3.tagType"
                      :tag="item3"
                      :is-edit="false" />
                  </container>
                  <oper-node v-else :key="'children-oper-' + index3" v-model="item3.logic" />
                </template>
              </group>
              <container
                v-else-if="item2.dataType === 'tag'"
                :key="'node-' + index2"
                :tag="item2"
                :is-edit="false">
                <component
                  ref="tagComponent"
                  :is="'component_' + item2.tagType" :tag="item2"
                  :is-edit="false" />
              </container>
              <oper-node v-else :key="'oper-' + index2" v-model="item2.logic" />
            </template>
            <container v-if="index === 1 && detail.combinationTagType === 1" is-empty></container>
          </div>
        </div>
      </div>
      <div class="fixed-footer" v-if="type === 'review'">
        <el-button class="btn-sub" size="small" @click="isOpenRejectModal = true">驳回</el-button>
        <el-button class="btn-primary" size="small" @click="review">审核通过</el-button>
      </div>
    </div>
    <el-dialog
      title="驳回原因"
      v-model="isOpenRejectModal"
      width="400px"
      @close="$refs.rejectForm.resetFields()"
      :close-on-click-modal="false">
      <el-form ref="rejectForm" :model="rejectForm" :rules="rules" @submit.prevent size="small">
        <el-form-item prop="rejectionReason">
          <el-input
            v-model="rejectForm.rejectionReason"
            size="small"
            style="width: 352px"
            placeholder="请输入驳回原因"
            type="textarea"
            clearable
            :rows="5"
            maxlength="100"
            resize="none"
            show-word-limit />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button class="btn-primary" size="small" @click="commitReject">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import pageHeader from '@/components/page-header'
import designStepTwo from './step-two'
import { getTagDetail, reviewTag } from '@/api/tag'
import component from './tag-panel'
const uuidV4 = require('uuid-v4')

export default {
  name: 'TagReview',
  components: { pageHeader, designStepTwo },
  mixins: [component],
  data() {
    return {
      type: '',
      showDescTip: false,
      detail: {},
      contentList: [],
      isOpenRejectModal: false,
      rejectForm: {
        rejectionReason: ''
      },
      firstTagType: 0,
      rules: {
        rejectionReason: [
          { message: '最多100个字符', pattern: /^.{0,100}$/gi, trigger: 'change' },
          { required: true, message: '请输入驳回原因', trigger: 'change' }
        ]
      }
    }
  },
  mounted() {
    this.combinationTagId = this.$route.params.id
    this.type = this.$route.query.type
    if (this.combinationTagId) {
      this.getTagDetail()
    }
  },
  methods: {
    async getTagDetail() {
      try {
        const res = await getTagDetail({ combinationTagId: this.combinationTagId })
        this.detail = res
        this.detail.distributionShop = res.shopInfoList.map(i => i.shopId)
        this.contentList = res.combinationContentList
        this.tagForm = {
          combinationTagId: res.combinationTagId,
          combinationTagType: res.combinationTagType
        }
        this.contentList.forEach(item => {
          item.combinationDetail = item.combinationDetail || []
          item.combinationDetail.forEach(item2 => {
            if (item2.dataType === 'group') {
              item2.groupContent.forEach(item3 => {
                if (item3.dataType === 'logic') return
                let tagContent = item3.tagContent.replace(/^(\s|")+|(\s|")+$/g, '')
                tagContent = JSON.parse(item3.tagContent)
                Object.keys(tagContent).forEach(key => {
                  item3[key] = tagContent[key]
                })
              })
            } else if (item2.dataType === 'tag') {
              let tagContent = item2.tagContent.replace(/^(\s|")+|(\s|")+$/g, '')
              tagContent = JSON.parse(item2.tagContent)
              Object.keys(tagContent).forEach(key => {
                item2[key] = tagContent[key]
              })
            }
          })
        })
        this.$nextTick(() => {
          const el = this.$refs.descTip
          const elSpan = el.firstElementChild
          this.showDescTip = elSpan.offsetWidth > el.clientWidth
        })
      } catch (e) {
        console.log(e)
      }
    },
    async review() {
      try {
        await reviewTag({
          combinationTagId: this.detail.combinationTagId,
          operationType: 1
        })
        localStorage.setItem('refreshTag', uuidV4())
        this.$message.success('审核通过')
        this.$nextTick(() => window.close())
      } catch (e) {
        console.log(e)
      }
    },
    async commitReject() {
      try {
        await this.$refs.rejectForm.validate()
        await reviewTag({
          combinationTagId: this.detail.combinationTagId,
          operationType: 0,
          rejectionReason: this.rejectForm.rejectionReason
        })
        localStorage.setItem('refreshTag', uuidV4())
        this.$message.success('驳回成功')
        this.$nextTick(() => window.close())
        this.isOpenRejectModal = false
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.ellipsis {
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: inline-block;
}
.boolean-type {
  position: absolute;
  left: 0;
  top: 0;
  width: 56px;
  height: 16px;
  border-radius: 8px 0px 8px 0px;
  color: white;
  text-align: center;
  &.boolean-type-0 {
    background: #FD4378;
  }
  &.boolean-type-1 {
    background: #298CFF;
  }
}
.tag-detail {
  padding: 20px 110px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  .title {
    font-size: 24px;
    font-weight: 500;
  }
  span {
    margin-right: 40px;
  }
}
.tag-edit-panel {
  display: flex;
  flex-direction: column;
  padding: 0 48px;
  flex: 1;
  align-items: center;
}
.main {
  background-color: white;
  padding: 32px;
  overflow: auto;
  width: calc(100vw - 240px);
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
.design-panel {
  display: flex;
  flex-direction: column;
  background-color: #F9F8FD;
  align-items: center;
}
.tag-item {
  display: flex;
  background: #FBFBFF;
  margin-bottom: 16px;
  position: relative;
  padding: 16px;
  .tag-left {
    padding-right: 16px;
    min-width: 220px;
    width: 220px;
    border-right: 2px solid #DEE2FA;
    .title {
      font-size: 14px;
      margin-right: 4px;
    }
    svg {
      width: 16px;
      height: 16px;
      cursor: pointer;
    }
  }
}
</style>