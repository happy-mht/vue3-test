<template>
  <el-dialog
    title="添加/删除标签"
    v-model="show"
    width="900px"
    class="add-dialog"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    append-to-body
    popper-class="popver"
    :before-close="handleClose">
    <el-popover
      placement="bottom"
      width="304"
      :visible-arrow="false"
      popper-class="tag-search-popper"
      trigger="click">
      <div class="empty-content" v-if="!showList1.length && !showList2.length && !showList3.length">
        <i class="iconfont iconxiaolian" />
        <span>暂无搜索结果</span>
      </div>
      <div :class="{ 'disabled': selectTags.length >= 30 }">
        <template v-if="showList1.length">
          <div class="popover-tag-title">我创建的</div>
          <div @click="handelClick($event, showList1)">
            <label
              v-for="(item, index) in showList1"
              :key="`${index}_${item.tagId}`"
              :class="['popover-tag-item', 'tag-item', item.beSelect && 'active']"
              :data-index="index"
              v-html="item.tagName.replace(reg, `<label data-index='${index}' style='color: #FF74AC;cursor:pointer'>${text}</label>`)">
            </label>
          </div>
        </template>
        <template v-if="showList2.length">
          <div class="popover-tag-title">店铺标签</div>
          <div @click="handelClick($event, showList2)">
            <label
              v-for="(item, index) in showList2"
              :key="`${index}_${item.tagId}`"
              :class="['popover-tag-item', 'tag-item', item.beSelect && 'active']"
              :data-index="index"
              v-html="item.tagName.replace(reg, `<label data-index='${index}' style='color: #FF74AC;cursor:pointer'>${text}</label>`)">
            </label>
          </div>
        </template>
        <template v-if="showList3.length">
          <div class="popover-tag-title">基础标签</div>
          <div @click="handelClick($event, showList3)">
            <label
              v-for="(item, index) in showList3"
              :key="`${index}_${item.tagId}`"
              :class="['popover-tag-item', 'tag-item', item.beSelect && 'active']"
              :data-index="index"
              v-html="item.tagName.replace(reg, `<label data-index='${index}' style='color: #FF74AC;cursor:pointer'>${text}</label>`)">
            </label>
          </div>
        </template>
      </div>
      <template #reference>
        <el-input
          size="small"
          class="search-input"
          v-model.trim="text"
          style="width: 300px;"
          placeholder="请输入标签名称搜索"
          clearable
          prefix-icon="el-icon-search" />
      </template>
    </el-popover>
    <div style="font-size: 14px;margin: 12px 0">已选择：<span class="red">{{ selectTags.length }}</span>/{{ total }}</div>
    <div :class="{ 'disabled': selectTags.length >= 30 }">
      <template v-if="myCreateTagList.length > 0">
        <div class="tag-title">我创建的</div>
        <div class="tag-content" @click="handelClick($event, myCreateTagList)">
          <label v-for="(item, index) in myCreateTagList" :key="`${index}_${item.tagId}`" :data-index="index" :class="['tag-item', item.beSelect && 'active']">
            {{item.tagName}}
          </label>
        </div>
      </template>
      <template v-if="shopOtherTagList.length > 0">
        <div class="tag-title">店铺标签</div>
        <div class="tag-content" @click="handelClick($event, shopOtherTagList)">
          <label v-for="(item, index) in shopOtherTagList" :key="`${index}_${item.tagId}`" :data-index="index" :class="['tag-item', item.beSelect && 'active']">
            {{item.tagName}}
          </label>
        </div>
      </template>
      <template v-if="baseTagList.length >0">
        <div class="tag-title">基础标签</div>
        <div class="tag-content" @click="handelClick($event, baseTagList)">
          <label v-for="(item, index) in baseTagList" :key="`${index}_${item.tagId}`" :data-index="index" :class="['tag-item', item.beSelect && 'active']">
            {{item.tagName}}
          </label>
        </div>
      </template>
    </div>
    <template #footer>
      <el-button class="btn-sub" size="small" @click="handleClose">取 消</el-button>
      <el-button class="btn-primary" size="small" @click="handleOk">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { getSelectTag, batchAddTag } from '@/api/tag-panel'

export default {
  name: 'panelTagSelect',
  props: {
    show: Boolean,
    panelId: [Number, String]
  },
  data() {
    return {
      text: '',
      myCreateTagList: [],
      shopOtherTagList: [],
      baseTagList: [],
    }
  },
  computed: {
    showList1() {
      return this.text ? this.myCreateTagList.filter(i => i.tagName.toLowerCase().indexOf(this.text.toLowerCase()) > -1) : []
    },
    showList2() {
      return this.text ? this.shopOtherTagList.filter(i => i.tagName.toLowerCase().indexOf(this.text.toLowerCase()) > -1) : []
    },
    showList3() {
      return this.text ? this.baseTagList.filter(i => i.tagName.toLowerCase().indexOf(this.text.toLowerCase()) > -1) : []
    },
    total() {
      return this.myCreateTagList.length + this.shopOtherTagList.length + this.baseTagList.length
    },
    selectTags() {
      const arr = this.myCreateTagList.filter(i => i.beSelect)
      arr.push(...this.shopOtherTagList.filter(i => i.beSelect))
      arr.push(...this.baseTagList.filter(i => i.beSelect))
      return arr
    },
    reg() {
      return new RegExp(this.text, 'gi')
    },
  },
  watch: {
    show(val) {
      if (val && this.panelId) this.getTagList()
    }
  },
  methods: {
    handelClick(e, list) {
      if (e.target.nodeName.toLowerCase() === 'label') {
        const index = parseInt(e.target.dataset.index)
        if (this.selectTags.length >= 30 && !list[index].beSelect) return
        this.$set(list[index], 'beSelect', !list[index].beSelect)
        list.splice(0, 0)
      }
    },
    getTagList() {
      getSelectTag({ panelId: this.panelId }).then(res => {
        this.myCreateTagList = res.myCreateTagList || []
        this.shopOtherTagList = res.shopOtherTagList || []
        this.baseTagList = res.baseTagList || []
      })
    },
    handleClose() {
      this.getTagList()
      this.text = ''
      this.$emit('close')
    },
    async handleOk() {
      try {
        const params = {
          panelId: this.panelId,
          selectTags: this.selectTags.map(i => ({
            tagId: i.tagId,
            tagType: i.tagType,
            tagEnName: i.tagEnName
          }))
        }
        await batchAddTag(params)
        this.text = ''
        this.$message.success('修改成功')
        this.getTagList()
        this.$emit('ok')
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.tag-search-popper {
  max-height: 400px;
  overflow: auto;
}
.empty-content {
  height: 50px;
  color: #BDC2C8;
  font-size: 12px;
  text-align: center;
  line-height: 50px;
  i {
    font-size: 12px;
    margin-right: 4px;
  }
}
.popover-tag-title {
  font-size: 12px;
  margin-bottom: 4px;
  color: #778092;
}
.red {
  color: $secondRed;
}
.tag-content {
  div {
    line-height: 28px;
  }
}
.tag-title {
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 14px;
  margin: 8px 0;
  &::before {
    content: '';
    width: 3px;
    height: 14px;
    background: #FD4378;
    display: inline-block;
    margin-right: 4px;
  }
}
.popover-tag-item {
  background: #F8F9FD;
}
.tag-item {
  padding: 5px 8px;
  border: 1px solid white;
  cursor: pointer;
  border-radius: 2px;
  margin: 0 8px 8px 0;
  display: inline-block;
  font-size: 12px;
  &.active, &:hover {
    background: $thirdRed;
    border-color: $secondRed;
  }
  &.active {
    color: $secondRed;
  }
}
.disabled {
  .tag-item:not(.active) {
    cursor: not-allowed!important;
    &:hover {
      background: white;
      border-color: white;
    }
  }
}
</style>