<template>
  <div :class="{'wrapper-width': tagList.length > 3}" style="height: 100%;overflow: auto" ref="scroll" v-if="total">
    <div class="top-panel" v-show="!isAdjust">
      <div class="title">人群画像</div>
      <div class="content">
        <div class="item">
          <svg class="svg-icon">
            <use :xlink:href="`#iconrenqun1`"></use>
          </svg>
          <span style="font-weight: 500;font-size: 18px;margin: 0 2px;color: #353C47">全店购买人群</span>
        </div>
        <div class="item">
          <span>人数：{{ total }}</span>
          <el-divider direction="vertical"></el-divider>
          <span>系统默认创建</span>
        </div>
        <!-- <div class="vs-btn">
          人群对比
        </div> -->
      </div>
      <div class="unit">统计单位：人</div>
    </div>
    <div class="portrait-content" v-loading="loading">
      <div class="top">
        <template v-if="!isAdjust">
          <div>当前使用：<i class="iconmoban iconfont" /><span style="color:#353C47;">{{ panelName }}</span>
            <el-button size="small" class="switch-btn" type="text" @click="isOpenTemplateModal = true">切换</el-button>
          </div>
          <div>
            <el-button
              v-if="tagList.length > 0"
              type="text"
              size="small"
              class="move-btn"
              @click="handleAdjust">
              <i class="iconfont iconyidong" />
              <span class="text">调整布局</span>
            </el-button>
            <el-button class="btn-primary" size="small" @click="isOpenAddTagModal = true">添加/删除标签</el-button>
          </div>
        </template>
        <template v-else>
          <span style="font-size: 20px;font-weight: 600;color: #353C47;">人群画像</span>
          <span>
            布局调整中：
            <el-button size="mini" class="btn-sub" @click="handleCancelAdjust">取消</el-button>
            <el-button size="mini" class="btn-primary" @click="handleSaveAdjust">保存</el-button>
          </span>
        </template>
      </div>
      <draggable
        v-if="tagList.length > 0"
        v-model="tagList"
        class="dashboard"
        ghost-class="ghost"
        chosen-class="chosen"
        :disabled="!isAdjust"
        animation="300"
        scroll
        @change="onChange"
        @start="drag = true"
        @end="drag = false">
        <div v-for="(item, index) in tagList" :key="index+'-'+item.id" :class="['dashboard-item', isAdjust && 'move', !!item.tagStatus && item.tagStatus !== '已完成' && 'offline-tag']">
          <div class="item-top">
            <div>
              <i :class="['iconfont', item.tagStatus === '已下线' ? 'iconxiaxian-mian' : 'iconbiaoqian-mianxing']" />
              <span class="tag-name">{{ item.tagName }}
                <template v-if="item.tagStatus && item.tagStatus !== '已完成'">({{item.tagStatus}})</template>
              </span>
              <el-tooltip placement="top" v-if="item.desc">
                <template #content>
                  <div style="max-width: 300px">{{ item.desc }}</div>
                </template>
                <i class="iconfont icontishi" />
              </el-tooltip>
            </div>
            <div v-if="!isAdjust">
              <template v-if="!item.tagStatus || item.tagStatus == '已完成' || item.tagStatus == '已下线'">
                <el-button v-if="item.tagType === 1" type="text" size="small" @click="isOpenConfigModal = true;currentIndex = index">
                  <i class="iconfont iconshezhi-xianxing" />
                </el-button>
                <tag-config-popover v-else :tag-type="item.tagType" :style-type="item.styleType" @change="handelChangeStyle(item, $event, index)" />
              </template>
              <el-dropdown trigger="click" size="small" placement="bottom">
                <el-button type="text" size="small">
                  <i class="iconfont icongengduo1" />
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="handelClickDel(item, index)">
                      <el-button class="deepred" size="small" type="text">
                        <i class="iconshanchu iconfont" />删除标签
                      </el-button>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
          <div class="graph" :id="'tag_portrait_graph_'+item.id"></div>
        </div>
      </draggable>
      <div v-else class="no-tag-wrapper">
        <img src="@/assets/images/noTagPortrait.png" />
        <div class="right">
          <span class="name">{{ panelName }}</span>
          <span style="margin: 4px 0;font-size: 14px">暂无标签内容</span>
          <el-button
            class="btn-primary"
            size="small"
            @click="isOpenAddTagModal = true">
            <i class="el-icon-circle-plus" style="margin-right: 4px" />添加标签
          </el-button>
        </div>
      </div>
    </div>
    <div class="to-top" @click="toTop" v-if="tagList.length > 9">
      <i class="iconfont iconzhiding" />
    </div>
    <tag-select :show="isOpenAddTagModal" :panel-id="panelId" @close="isOpenAddTagModal = false" @ok="addTag" />
    <tag-template :show="isOpenTemplateModal" @change="handleChangePanel"/>
    <tag-config
      v-model:show="isOpenConfigModal"
      :tag="currentTag"
      @ok="handelChangeTag($event)" />
  </div>
  <div v-else class="no-open">
    <no-open msg='该店铺尚未开通【人群画像】场景' />
  </div>
</template>

<script>

import noOpen from '@/views/error-page/no-open'
import draggable from 'vuedraggable'
import TagConfig from './components/tag-config'
import TagConfigPopover from './components/tag-config-popover'
import TagTemplate from './components/tag-template'
import tagSelect from './components/tag-select.vue'
import * as graph from './graph.js'
import { Pie, Line, Area, Bar, Column } from '@antv/g2plot'
import * as api from '@/api/tag-panel'

export default {
  name: 'tag-portrait',
  components: { TagConfig, TagTemplate, draggable, tagSelect, noOpen, TagConfigPopover },
  data() {
    return {
      isOpenConfigModal: false,
      currentIndex: '',
      loading: false,
      isOpenAddTagModal: false,
      isOpenTemplateModal: false,
      tagList: [],
      panelId: '',
      plots: [],
      drag: false,
      isAdjust: false,
      panelName: '',
      originList: [],
      total: false
    }
  },
  computed: {
    currentTag() {
      return this.tagList[this.currentIndex]
    }
  },
  async beforeRouteLeave (to, from, next) {
    try {
      if (!this.isAdjust) {
        next()
        return
      }
      await this.$handleConfirm({
        message: `
          <span>布局调整暂未保存，确定关闭页面吗？</span>
          <span>关闭后当前页面数据将不会保存</span>`,
        confirmButtonText: "关闭页面",
        cancelButtonText: "暂不关闭"
      })
      next()
    } catch (e) {
      next(false)
    }
  },
  mounted() {
    this.refreshPage()
  },
  methods: {
    refreshPage() {
      this.panelId = ''
      this.isAdjust = false
      this.loading = true
      api.getPanelPeople().then(res => {
        this.total = res ? graph.numFormat(res) : ''
        this.loading = false
      }).catch(() => this.loading = false)
    },
    async handelChangeStyle(item, styleType, index) {
      try {
        await api.editPanelTag({
          id: item.id,
          styleType
        })
        this.$set(item, 'styleType', styleType)
        this.plots[index].destroy()
        this.drawItemGraph(item, index)
      } catch (e) {
        console.log(e)
      }
    },
    async handelChangeTag(item) {
      try {
        this.isOpenConfigModal = false
        item.tagDataList && item.tagDataList.forEach(i => i.key = `[${i.key})`)
        this.tagList[this.currentIndex] = item
        this.tagList.splice(0, 0)
        this.plots[this.currentIndex].destroy()
        this.drawItemGraph(item, this.currentIndex)
      } catch (e) {
        console.log(e)
      }
    },
    toTop() {
      this.$refs.scroll.scrollTop = 0
    },
    async getTagData() {
      try {
        this.loading = true
        this.tagList = await api.getTagData({ panelId: this.panelId })
        this.tagList.filter(i => i.tagType === 1).forEach(tag => {
          tag.tagDataList && tag.tagDataList.forEach(i => i.key = `[${i.key})`)
        })
        this.onChange()
        this.loading = false
      } catch (e) {
        console.log(e)
        this.loading = false
      }
    },
    handleChangePanel(panel) {
      this.isOpenTemplateModal = false
      if (this.panelId !== panel.panelId) {
        this.panelId = panel.panelId
        this.getTagData()
      }
      this.panelName = panel.panelName
    },
    async addTag() {
      try {
        this.isOpenAddTagModal = false
        this.getTagData()
      } catch (e) {
        console.log(e)
      }
    },
    handleAdjust() {
      this.isAdjust = true
      this.originList = JSON.parse(JSON.stringify(this.tagList))
    },
    handleSaveAdjust() {
      this.isAdjust = false
      const params = this.tagList.map((item, index) => {
        return {
          id: item.id,
          panelId: this.panelId,
          currentIndex: index + 1,
        }
      })
      api.sortTag(params).then(() => {
        this.$message.success('调整成功')
      })
    },
    handleCancelAdjust() {
      this.isAdjust = false
      this.tagList = this.originList
      this.onChange()
    },
    onChange() {
      this.plots.forEach(i => i.destroy())
      this.plots = []
      this.$nextTick(() => this.draw())
      this.loading = false
    },
    async handelClickDel(item, index) {
      try {
        await api.deleteTag({ id: item.id })
        this.$message.success('删除成功')
        this.tagList.splice(index, 1)
        this.onChange()
      } catch (e) {
        console.log(e)
        if (e && e.message) this.$handleNotice({ message: e.message })
      }
    },
    drawItemGraph(tag, index) {
      let config = {
        ...graph[tag.styleType + 'Config'],
        data: tag.tagDataList || [],
      }
      if (tag.tagStatus && tag.tagStatus !== '已完成' && tag.tagStatus !== '已下线') {
        config.interactions = [
          { type: 'tooltip', enable: false }
        ]
        config.label = undefined
      }
      let total = ''
      config.data.forEach(i => i.value = Number(i.value))
      switch(tag.styleType) {
        case 'Pie':
          total = config.data.reduce((prev, curr) => prev + curr.value, 0)
          config.data.forEach(i => i.ratio = ((i.value / total) * 100 ).toFixed())
          this.plots[index] = new Pie(`tag_portrait_graph_${tag.id}`, config)
          break
        case 'Line':
          if (config.data.length > 24) {
            config.slider = {
              start: 0.7,
              end: 1
            }
          }
          this.plots[index] = new Line(`tag_portrait_graph_${tag.id}`, config)
          break
        case 'Histogram':
          if (config.data.length > 24) {
            config.slider = {
              start: 0.7,
              end: 1
            }
          }
          config.color = tag.tagType === 1 ? '#70B3FF' : '#FF83A8'
          this.plots[index] = new Column(`tag_portrait_graph_${tag.id}`, config)
          break
        case 'Area':
          config.color = tag.tagType === 1 ? '#70B3FF' : '#FF83A8'
          config.areaStyle = () => {
            return {
              fill: `l(270) 0:#ffffff 1:${config.color}`
            }
          }
          this.plots[index] = new Area(`tag_portrait_graph_${tag.id}`, config)
          break
        case 'Bar':
          config.color = (tag.tagType === 3 || tag.tagType === 6) ? '#78D2B2' : '#FDC220'
          if (config.data.length > 12) {
            config.scrollbar = { type: 'vertical' }
          }
          this.plots[index] = new Bar(`tag_portrait_graph_${tag.id}`, config)
          break
        case 'Column':
          if (config.data.length > 12) {
            config.scrollbar = { type: 'horizontal' }
          }
          config.color = (tag.tagType === 3 || tag.tagType === 6) ? '#78D2B2' : tag.tagType === 1 ? '#70B3FF' : '#FDC220'
          this.plots[index] = new Column(`tag_portrait_graph_${tag.id}`, config)
          break
      }
      this.plots[index] && this.plots[index].render()
    },
    draw() {
      this.tagList.forEach((tag, index) => {
        this.drawItemGraph(tag, index)
      })
    }
  }
}
</script>

<style scoped lang="scss">
.no-open{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.to-top {
  position: fixed;
  bottom: 72px;
  right: 40px;
  width: 40px;
  height: 40px;
  background: #B9C2D4;
  box-shadow: 0px 4px 8px 0px rgba(185, 194, 212, 0.2);
  border-radius: 40px;
  color: white;
  line-height: 40px;
  text-align: center;
  cursor: pointer;
  &:hover {
    background: #7086B5;
  }
}
.wrapper-width {
  min-width: 1144px;
}
.no-tag-wrapper {
  display: flex;
  min-height: 400px;
  justify-content: center;
  align-items: center;
  img {
    margin-right: 40px;
    width: 120px;
    height: 120px;
  }
  .right {
    display: flex;
    flex-direction: column;
    .name {
      font-size: 18px;
      font-weight: 500;
      color: #353C47;
      line-height: 26px;
    }
  }
}
.ghost {
  opacity: 1;
  background: white;
}
.chosen {
  opacity: 1;
  background: white;
}
.dashboard {
  display: grid;
  grid-row-gap: 12px;
  grid-column-gap: 12px;
  grid-template-columns: repeat(3, 33%);
  padding-bottom: 12px;
  .dashboard-item {
    padding: 8px 12px 12px;
    min-width: 360px;
    min-height: 230px;
    height: 17.7vw;
    background: #FFFFFF;
    box-shadow: 0px 1px 4px 0px rgba(184, 205, 253, 0.26);
    border-radius: 8px;
    color:#353C47;
    border: 1px solid #E6E8F3;
    .tag-name {
      font-weight: 600;
      margin: 0 4px
    }
    &.move {
      cursor: move;
    }
    &.offline-tag {
      background: #F9F9FB;
      color: #BDC2C8;
    }
  }
  .graph {
    height: calc(100% - 30px);
    .loading-tip {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: #BDC2C8;
      background: #F8F9FD;
      i {
        font-size: 30px;
      }
    }
  }
}
.portrait-content {
  padding: 8px 24px 12px 24px;
  color: #778092;
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
  .switch-btn {
    color: #778092;
    margin-left: 4px;
  }
  .item-top {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    margin-bottom: 16px;
    .el-button:hover {
      .iconfont {
        color: $secondRed;
      }
    }
    .iconbiaoqian-mianxing {
      color: #7086B5!important;
    }
    .iconfont {
      color: #9DA4B2;
      font-size: 14px;
      cursor: pointer;
    }
  }
}
.top-panel {
  padding: 18px 24px;
  height: 120px;
  background-image:
    linear-gradient(90deg, transparent, transparent, transparent, rgba(255,255,255, 0.7)),
    linear-gradient(90deg, #EBF4FF 0%, #FFEBF0 100%);
  border-radius: 8px 8px 0px 0px;
  border: 2px solid #FFFFFF;
  filter: blur(0px);
  position: relative;
  .content {
    display: flex;
    justify-content: center;
    flex-direction: column;
    .iconbianji1 {
      color: #9DA4B2;
      font-size: 16px;
    }
    .item {
      color: #9DA4B2;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .vs-btn {
      text-align: center;
      width: 84px;
      line-height: 24px;
      background: rgba(112, 134, 181, 0.1);
      border-radius: 12px;
      color: #778092;
    }
  }
  .svg-icon {
    width: 18px;
    height: 18px;
    cursor: pointer;
    outline: none;
  }
  .title {
    color: #353C47;
    font-size: 20px;
    font-weight: 600;
    font-family: "SimHei";
  }
  .unit {
    position: absolute;
    right: 24px;
    bottom: 12px;
    color: #BDC2C8;
  }
}
</style>