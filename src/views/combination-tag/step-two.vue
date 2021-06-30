<template>
  <div class="design-panel">
    <div class="left">
      <div class="left-top">
        <span class="title">{{tagForm.combinationTagName}}</span>
        <span class="add-btn" @click="addContent" v-if="combinationTagType === 0 && combinationContentList.length < 10">
          <i class="iconfont icontianjia_mianxing" />
          添加枚举值
        </span>
      </div>
      <div v-for="(item, index) in combinationContentList" :key="index" class="tag-item">
        <el-button v-if="index > 0 && !(index === 1 && tagForm.combinationTagType === 1)" class="del-btn" type="text" @click="deleteContent(index)"><i class="iconshanchu iconfont" /></el-button>
        <el-form :ref="setItemRef" :model="item" :rules="rules" size="small" class="tag-left" :style="`padding-top:${combinationTagType === 1 ? '8px' : '0'}`">
          <div v-if="combinationTagType === 1" :class="['boolean-type', index === 1 ? 'boolean-type-0' : 'boolean-type-1']">
            {{ index === 0 ? 'TRUE' : 'FALSE' }}
          </div>
          <div v-if="!item.isNameEdit && item.contentEnumId" style="margin-bottom: 12px;">
            <span class="title" @click="item.isNameEdit = true">{{ item.name }}</span>
          </div>
          <el-form-item prop="name" v-else>
            <el-input
              v-model="item.name"
              size="small"
              style="width: 200px;"
              :placeholder="`${combinationTagType === 1 ? '请输入布尔值名称' : '请输入枚举值名称'}`"
              clearable
              @blur="handleEditName(item)" />
          </el-form-item>
          <div
            v-if="!item.isDescEdit && item.contentEnumId"
            @click="item.isDescEdit = true"
            style="word-break: break-all"
            >{{ item.description }}</div>
          <el-form-item v-else prop="description">
            <el-input
              v-model="item.description"
              size="small"
              style="width: 200px"
              :placeholder="`${combinationTagType === 1 ? '请输入布尔值描述' : '请输入枚举值描述'}`"
              type="textarea"
              clearable
              @blur="handleEditDesc(item)"
              :rows="5"
              maxlength="100"
              resize="none" />
          </el-form-item>
        </el-form>
        <div class="tag-edit-panel">
          <template v-for="(item2, index2) in item.combinationDetail">
            <group v-if="item2.dataType === 'group'" :key="'container' + index2" @delete-tag="deleteTag(item, index2)" is-edit>
              <template v-for="(item3, index3) in item2.groupContent">
                <container
                  v-if="item3.dataType === 'tag'"
                  :key="'children-node-' + index3"
                  :tag="item3"
                  is-leaf
                  :is-edit="isEdit"
                  @delete-tag="deleteTag(item2, index3)">
                  <component
                    :ref="setTagComp"
                    v-bind="$attrs"
                    :is="'component_' + item3.tagType"
                    :tag="item3"
                    :is-edit="isEdit"
                    @delete-goods="deleteGoods(item3, $event)"
                    @change-tag="handleChangeTag(item3, $event)"
                    @change-tag-5="handleChangeTagType5(item3, $event)"
                    @change="handleChange(item3, $event)"
                    @change-enum="handleChangeEnum(item3, $event)" />
                </container>
                <oper-node v-else :key="'children-oper-' + index3" v-model="item3.logic" isEdit/>
              </template>
              <add-panel :disabled="tagItemLen[index] >= 10" :item="item2" @add-tag="handleAddTag(item2)" is-leaf />
            </group>

            <container
              v-else-if="item2.dataType === 'tag'"
              :key="'node-' + index2"
              :tag="item2"
              :is-edit="isEdit"
              @delete-tag="deleteTag(item, index2)">
              <component
                :ref="setTagComp"
                v-bind="$attrs"
                :is="'component_' + item2.tagType" :tag="item2"
                :is-edit="isEdit"
                @delete-goods="deleteGoods(item2, $event)"
                @change-tag="handleChangeTag(item2, $event)"
                @change-tag-5="handleChangeTagType5(item2, $event)"
                @change="handleChange(item2, $event)"
                @change-enum="handleChangeEnum(item2, $event)" />
            </container>
            <oper-node v-else :key="'oper-' + index2" v-model="item2.logic" isEdit/>
          </template>
          <container v-if="index === 1 && tagForm.combinationTagType === 1" is-empty></container>
          <template v-else>
            <add-panel :disabled="tagItemLen[index] >= 10" v-if="tagItemLen[index] < 10 && item.combinationDetail.length < 18" :item="item" @add-tag="handleAddTag(item)" @add-container="handleAddContainer(item, index)" />
          </template>
        </div>
      </div>
    </div>
    <div class="right">
      <el-input
        v-model="tagName"
        placeholder="请输入关键词回车搜索标签"
        size="small"
        style="width: 200px;margin-bottom: 20px"
        @change="getTagList('tagName')">
        <template #prepend>
          <el-select style="width: 64px" v-model="firstTagType" @change="getTagList('firstTagType')">
            <el-option label="基础" :value="0" />
            <el-option label="行为" :value="1" />
            <!-- <el-option label="组合" :value="2" /> -->
          </el-select>
        </template>
      </el-input>
      <el-tree
        :data="tagList"
        :props="defaultProps"
        :class="['tag-tree', isAdd && 'addable']"
        default-expand-all>
        <template v-slot="{ node, data }">
          <span class="tag-tree-node" @click="addTagNode(data)">
            <span v-if="!isAdd" :class="['dot color-' + data.tagType]">
              {{ node.label }}
            </span>
            <span v-else :class="['add-icon', 'color-add-' + data.tagType]">{{ node.label }}</span>
          </span>
        </template>
      </el-tree>
    </div>
  </div>
</template>

<script>
import * as api from '@/api/tag'
import component from './tag-panel'

export default {
  name: 'TagDesignStepTwo',
  mixins: [component],
  props: {
    contentList: Array,
    tagForm: Object,
    isEdit: Boolean
  },
  provide() {
    return {
      firstTagType: this.firstTagType
    }
  },
  data() {
    return {
      tagCompRefs: [],
      formRefs: [],
      isAdd: false,
      combinationContentList: [
        {
          description: '',
          name: '',
          combinationDetail: []
        }
      ],
      rules: {
        name: [
          { message: '请以中英文开头，最多输入10个字符', pattern: /^[\u4e00-\u9fa5_a-zA-Z][\s\S]{0,9}$/gi, trigger: 'change' },
          { message: '仅允许输入中英文数字下划线横杠', pattern: /^[\w\u4e00-\u9fa5\-_]{1,10}$/gi, trigger: 'change' },
          { required: true, message: '请输入', trigger: 'change' }
        ],
        description: [
          { message: '最多输入100个字符', pattern: /^.{1,100}$/gi, trigger: 'change' },
          { required: true, message: '请输入', trigger: 'change' }
        ],
      },
      currentContainer: null,
      defaultProps: {
        children: 'threeTagList',
        label: 'tagName'
      },
      tagList: [],
      firstTagType: 0,
      tagName: '',
      operData: []
    }
  },
  computed: {
    combinationTagType() {
      return this.tagForm.combinationTagType
    },
    tagItemLen() {
      let map = {}
      this.combinationContentList.map((item, index) => {
        let len1 = item.combinationDetail.filter(item2 => item2.dataType === 'tag').length
        let groups = item.combinationDetail.filter(item2 => item2.dataType === 'group')
        let len2 = groups.reduce((total, curr) => total + curr.groupContent.filter(item2 => item2.dataType === 'tag').length, 0)
        map[index] = len1 + len2
      })
      return map
    }
  },
  watch: {
    contentList: {
      handler: function(val) {
        const forms = this.formRefs
        forms.forEach(form => form.resetFields())
        this.combinationContentList = JSON.parse(JSON.stringify(val))
        if (this.combinationContentList.length == 0) {
          this.combinationContentList = [
            {
              description: '',
              name: '',
              combinationDetail: []
            }
          ]
          if (this.combinationTagType === 1 ) {
            this.combinationContentList.push({
              description: '',
              name: '',
              combinationDetail: []
            })
          }
          return
        }
        this.combinationContentList.forEach(item => {
          if (!item.combinationDetail) {
            item.combinationDetail = []
            return
          }
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
      },
      deep: true,
      immediate: true
    },
    combinationTagType(val) {
      if (val === 1 && this.combinationContentList.length === 1) {
        this.addContent()
      }
    }
  },
  mounted() {
    this.getTagList()
  },
  methods: {
    setTagComp(el) {
      this.tagCompRefs.push(el)
    },
    setItemRef(el) {
      this.formRefs.push(el)
    },
    deleteContent(index) {
      this.combinationContentList.splice(index, 1)
    },
    async validate() {
      let pArr = []
      const conponents = this.tagCompRefs
      const forms = this.formRefs
      for (let i = 0; i < forms.length; i++){
        pArr.push(forms[i].validate())
      }
      if (conponents) {
        for (let i = 0; i < conponents.length; i++) {
          if (conponents[i].validate) pArr.push(conponents[i].validate())
        }
      }
      try {
        await Promise.all(pArr)
        let emptyArr = []
        let nameArr = []
        let repeatArr = []
        this.combinationContentList.forEach((item, index) => {
          if (nameArr.includes(item.name)) repeatArr.push(item.name)
          else nameArr.push(item.name)
          if (this.combinationTagType === 1 && index === 1) return
          if (item.combinationDetail.length === 0) emptyArr.push(item.name)
          else if (item.combinationDetail.filter(item => item.dataType !== 'logic').every(item => item.dataType === 'group' && item.groupContent.length === 0)) {
            emptyArr.push(item.name)
          }
        })
        if (emptyArr.length === 0 && repeatArr.length === 0) return Promise.resolve(this.combinationContentList)
        else {
          let msg1 = emptyArr.map(i => `【${i}】`).join(',')
          let msg2 = repeatArr.map(i => `【${i}】`).join(',')
          let msg = ''
          if (msg1) msg = `<div>${msg1}生成逻辑不可为空</div>`
          if (msg2) msg += `<div>${msg2}命名重复，请更正</div>`
          this.$utils.handleNotice({
            message: msg
          })
          return Promise.reject()
        }
      } catch (e) {
        console.log(e)
        this.$message.error('标签输入/引用值不能为空，请检查【枚举值名字-规则标签名字】规则')
        return Promise.reject(e)
      }
    },
    handleChangeTagType5(item, { key, val }) {
      let [key1, key2] = key.split('.')
      if (key2 === 'inputType') {
        item[key1][key2] = val
        item[key1].value.referenceTagId = ''
        item[key1].value.referenceTagEnName = ''
        item[key1].value.referenceTagName = ''
        if (item[key1].value.time) item[key1].value.time = ''
        if (item[key1].value.number) item[key1].value.number = ''
      } else if (key2 === 'referenceTagId') {
        item[key1].value.referenceTagId = val.tagId
        item[key1].value.referenceTagEnName = val.tagEnName
        item[key1].value.referenceTagName = val.tagName
      } else {
        item[key1].value[key2] = val
      }
      this.combinationContentList.splice(0, 0)
    },
    handleChangeTag(item, e) {
      console.log(item, e)
      item.value.referenceTagId = e.tagId
      item.value.referenceTagEnName = e.tagEnName
      item.value.referenceTagName = e.tagName
      this.combinationContentList.splice(0, 0)
    },
    deleteGoods(item, index) {
      item.selectGoodsInfo.splice(index, 1)
      this.combinationContentList.splice(0, 0)
    },
    handleChange(item, { key, val }) {
      if (key === 'inputType') {
        item[key] = val
        const value = {
          operator: item.value.operator,
          referenceTagId: '',
          referenceTagName: '',
          referenceTagEnName: ''
        }
        item.tagType === 1 ? value.number = '' : value.time = ''
        item.value = value
      }
      else item.value[key] = val
      this.combinationContentList.splice(0, 0)
    },
    handleChangeEnum(item, keys) {
      const list = item.tagEnumInfo || item.enumList
      const values = keys.map(i => {
        const obj = list.find(j => j.key === i)
        return obj.value
      })
      item.value = { values, keys }
      this.combinationContentList.splice(0, 0)
    },
    async handleEditDesc(item) {
      if (!item.contentEnumId) return
      const reg = /^.{1,100}$/gi
      if (!reg.test(item.description)) {
        return
      }
      try {
        await api.updateTagEnum({
          combinationTagId: item.combinationTagId,
          contentEnumId: item.contentEnumId,
          name: item.name,
          description: item.description
        })
        this.$message.success('修改成功！')
        item.isDescEdit = false
      } catch (e) {
        console.log(e)
      }
    },
    async handleEditName(item) {
      if (!item.contentEnumId) return
      const reg = /^[\u4e00-\u9fa5_a-zA-Z][\w\u4e00-\u9fa5\-_]{0,99}$/gi
      if (!reg.test(item.name)) {
        return
      }
      try {
        await api.updateTagEnum({
          combinationTagId: item.combinationTagId,
          contentEnumId: item.contentEnumId,
          name: item.name,
          description: item.description
        })
        this.$message.success('修改成功！')
        item.isNameEdit = false
      } catch (e) {
        console.log(e)
      }
    },
    handleAddContainer(item) {
      if (item.combinationDetail.length > 0) {
        item.combinationDetail.push({ dataType: 'logic', logic: 0 })
      }
      item.combinationDetail.push({
        dataType: 'group',
        groupContent: []
      })
      this.combinationContentList.splice(0, 0)
    },
    deleteTag(item, index) {
      let list = item.combinationDetail || item.groupContent
      list.splice(index, 1)
      if (index > 0 && list[index - 1].dataType === 'logic') list.splice(index - 1, 1)
      if (list[index] && list[index].dataType === 'logic') list.splice(index, 1)
    },
    handleAddTag(item) {
      if (this.currentContainer) this.currentContainer.isAdd = false
      this.isAdd = true
      this.currentContainer = item
      item.isAdd = true
    },
    addTagNode(data) {
      if (!this.currentContainer || !data.tagType) return
      const node = {
        tagId: data.tagId,
        tagDesc: data.tagDesc,
        tagName: data.tagName,
        tagEnName: data.tagEnName,
        tagType: data.tagType,
        tagEnumInfo: data.tagEnumInfo,
        firstTagType: this.firstTagType,
        dataType: 'tag',
        value: {
          referenceTagId: '',
          referenceTagName: ''
        }
      }
      switch(data.tagType) {
        case 1:
          node.inputType = 0
          node.value.operator = '>'
          node.value.number = ''
          break
        case 2:
          node.inputType = 0
          node.value.operator = '>'
          node.value.time = ''
          break
        case 3:
        case 6:
          node.value = {
            values: [],
            keys: []
          }
          break
        case 4:
        case 7:
          node.value = {
            keys: [data.tagEnumInfo[0].key],
            values: [data.tagEnumInfo[0].value]
          }
          break
        case 5:
          delete node.value
          delete node.tagEnumInfo
          node.selectGoods = [],
          node.selectGoodsInfo = []
          node.buyNumber = { inputType: 0, tagType: 1, value: { operator: '>', referenceTagId: '', referenceTagName: '', number: '' }},
          node.buyAmount = { inputType: 0, tagType: 1, value: { operator: '>', referenceTagId: '', referenceTagName: '', number: '' }},
          node.selectTime = { tagType: 2, value: { operator: '>', time: '' }}
          break
      }
      const list = this.currentContainer.combinationDetail || this.currentContainer.groupContent
      if (list.length > 0) {
        list.push({ dataType: 'logic', logic: 0 })
      }
      list.push(node)
      this.isAdd = false
      this.currentContainer.isAdd = false
      this.currentContainer = null
    },
    addContent() {
      this.combinationContentList.push(
        {
          description: '',
          name: '',
          combinationDetail: []
        }
      )
    },
    async getTagList(e) {
      if (e === 'firstTagType') this.tagName = ''
      try {
        this.tagList = await api.getShopTags({
          firstTagType: this.firstTagType, // 一级标签  0:基础, 1:行为, 2:组合
          tagName: this.tagName
        })
        this.tagList.forEach(item => item.tagName = item.secTagName)
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.del-btn {
  color: $secondRed;
  position: absolute;
  right: 16px;
  top: 16px;
  display: none;
  &:hover {
    opacity: 0.8;
  }
  .iconfont {
    font-size: 14px;
  }
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
.tag-edit-panel {
  display: flex;
  flex-direction: column;
  padding: 0 48px;
  flex: 1;
  align-items: center;
}
.tag-tree :deep(.el-tree-node__children .el-tree-node__content) {
  width: 200px;
  height: 32px;
  background: #FAFAFF;
  border-radius: 8px;
  margin: 8px 0;
  position: relative;
  padding-left: 12px;
  cursor: default;
  .dot {
    &::before {
      position: absolute;
      left: 16px;
      top: 13px;
      content: '';
      width: 8px;
      height: 8px;
      border-radius: 90px;
    }
    &.color-1::before {
      background: #298CFF;
    }
    &.color-2::before {
      background: #FD4378;
    }
    &.color-3::before, &.color-6::before {
      background: #71E11C;
    }
    &.color-4::before, &.color-7::before  {
      background: #FFB044;
    }
    &.color-5::before {
      background: #61646D;
    }
  }
  .add-icon {
    &::before {
      position: absolute;
      left: 16px;
      top: 6px;
      content: '+';
      width: 8px;
      height: 8px;
      border-radius: 90px;
    }
    &.color-add-1::before {
      color: #298CFF;
    }
    &.color-add-2::before {
      color: #FD4378;
    }
    &.color-add-3::before, &.color-add-6::before {
      color: #71E11C;
    }
    &.color-add-4::before, &.color-add-7::before {
      color: #FFB044;
    }
    &.color-add-5::before {
      color: #61646D;
    }
  }
}
.tag-tree.addable :deep(.el-tree-node__children .el-tree-node__content) {
  cursor: pointer;
  &:hover {
    background: #F1F3FE;
  }
}
.tag-tree-node {
  width: 100%;
}
.design-panel {
  display: flex;
  background-color: white;
  height: calc(100% - 64px);
  .left {
    flex: 1;
    padding: 16px;
    overflow: auto;
    .left-top {
      display: flex;
      text-align: left;
      margin-bottom: 16px;
      .title {
        font-size: 18px;
        font-weight: 500;
        color: #353C47;
        line-height: 25px;
      }
      .add-btn {
        margin-left: 16px;
        width: 110px;
        height: 25px;
        background: #FFEBF0;
        justify-content: center;
        align-items: center;
        border-radius: 16px;
        color: #FF74AC;
        display: flex;
        padding: 4px 10px;
        cursor: pointer;
        i {
          font-size: 12px;
          margin-right: 4px;
        }
        &:hover {
          background: #FFD6E2;
        }
      }
    }
  }
  .right {
    overflow-y: auto;
    width: 264px;
    padding: 16px;
    background-color: white;
    border-left: 1px solid $black10;
    position: relative;
  }
}
.tag-item {
  display: flex;
  background: #FBFBFF;
  margin-bottom: 16px;
  position: relative;
  padding: 16px;
  &:hover .del-btn{
    display: inline-block;
  }
  .tag-left {
    padding-right: 16px;
    min-width: 220px;
    width: 220px;
    border-right: 2px solid #DEE2FA;
    .title {
      font-size: 14px;
      margin-right: 4px;
    }
  }
}
</style>