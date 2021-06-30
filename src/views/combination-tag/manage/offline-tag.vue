<template>
  <div class="tab-wrapper">
    <div>
      <el-table size="small" :data="$list" style="width: 100%;border-radius: 8px;" @cell-click="show" border
        :row-class-name="tableRowClassName"
      >
        <el-table-column label="标签类型/标签名称" width="400">>
          <template slot-scope="{ row }">
            <span :class=" 'tag-type-'+row.combinationTagType">{{ row.combinationTagType == 0 ? '枚举值': '布尔值' }}</span>
            {{ row.combinationTagName }}
          </template>
        </el-table-column>
        <el-table-column label="标签内容" prop="combinationContentTypeNames" width="300">
          <template slot-scope="scope">
            <span class="tag-content">{{ scope.row.combinationContentTypeNames }}</span>
            <i class="iconfont iconlock" style="color:red" v-show="lockIndex == scope.$index" />
          </template>
        </el-table-column>
        <el-table-column label="更新周期" prop="combinationTagUpdateCycleDesc" width="300"></el-table-column>
        <el-table-column label="创建人" prop="createUserName" width="300"></el-table-column>
        <el-table-column label="创建时间" prop="createTime" sortable></el-table-column>
      </el-table>
      <page
        :total="total"
        :pageSize="pageSize"
        :currentPage="pageNum"
        @size-change="sizeChange"
        @current-change="currentChange" />
    </div>
  </div>
</template>

<script>
import page from "@/components/page"
import * as api from "@/api/tag"

export default {
  components: { page },
  props: {
    // list: {
    //   type: Array,
    //   default: () => []
    // }
  },
  data() {
    return {
      lockIndex: -1,
      isPress: false,
      searchForm: {
        combinationTagStatus: "",
        combinationTagName: "",
        combinationTagType: -1,
        createTime: "",
        oneselfTag: false,
      },
      loading: true,
      total: 0,
      pageNum: 1,
      pageSize: 10,
      $list: [],
    }
  },
  computed: {

  },
  watch: {
    searchForm: {
      handler: function (newSearchForm) {
        this.search(newSearchForm.combinationTagStatus)
      },
      deep: true,
    },
  },
  created() {
  },
  methods: {
    gotopage(scope) {
      console.log(33, scope)
      let newhref = `//${window.location.host}/#/tag-design?id=${scope.row.combinationTagId}`
      this.lockIndex = scope.$index
      const _store = window.sessionStorage
      _store.setItem(`$lock`, scope.$index)
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
    async search(pageNum) {
      if (pageNum) this.pageNum = pageNum
      try {
        await api.getTagList({
          combinationTagName: this.combinationTagName,
          combinationTagStatus: 6,
          oneselfTag: this.oneselfTag,
          pageSize: this.pageSize,
          pageNum: this.pageNum,
        })
        if(res.list){
          this.$list = [...res.list]
          this.total = res.paging?.totalCount
          this.loading = false
        }
      } catch (e) {
        console.log(e)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
:deep(.el-table__row.lock) {
  background-color: #f5f5f5;
  color: #aca899;
  cursor: no-drop;
  pointer-events: none;
}
.red {
  color: $secondRed;
}
.tag-content {
  // font-weight: 600;
  display: inline-block;
  margin-right: 15px;
  &:hover {
    color: #fd4378;
    text-decoration: underline;
    cursor: pointer;
  }
}
.tag-type-0 {
  padding: 2px 6px;
  background: #eaf5ff;
  border-radius: 14px;
  color: #6492e8;
}
.tag-type-1 {
  padding: 2px 6px;
  background: #f1ecff;
  border-radius: 14px;
  color: #8f6fe4;
}
.bg {
  margin-right: 6px;
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 90px;
}
.bg-1 {
  background: #ff931e;
  border: 2px solid #ffe5c9;
}
.bg-6 {
  background: #bfbfbf;
  border: 2px solid #e5e5e5;
}
.bg-3 {
  background: #4587ff;
  border: 2px solid rgba(69, 135, 255, 0.2);
}
.bg-4,
.bg-2 {
  background: #ff5a1e;
  border: 2px solid #ffdfd3;
}
.bg-5 {
  background: #56be0d;
  border: 2px solid rgba(109, 212, 0, 0.2);
}
.tab-wrapper {
  padding: 16px 24px;
}
.status-item {
  cursor: pointer;
  margin: 0 4px;
  width: 60px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  border-radius: 10px;
  transition: all 0.3s ease-in-out;
  &.active {
    background: #7086b5;
    color: white;
  }
  &:hover {
    background: #7086b5;
    opacity: 0.8;
    color: white;
  }
}
.block-press {
  background: #7086b5;
  color: white;
}
.iconfont-block {
  width: 100%;
  display: flex;
  .iconfont {
    transition: all 0.1s ease-in-out;
    display: block;
    margin-right: 20px;
  }
  @mixin icon-hover($color) {
    color: $color;
    cursor: pointer;
  }
  .iconbianji1:hover {
    @include icon-hover(#778092);
  }
  .iconshanchu:hover {
    @include icon-hover(#ff5a1e);
  }
  .iconshenhe {
    color: #fd4378;
  }
  .iconshenhe:hover {
    @include icon-hover(#ff6b95);
  }
  .iconxiaxian:hover {
    @include icon-hover(#778092);
  }
}
</style>