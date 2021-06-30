<template>
  <el-container class="main">
    <el-header height="48px">
      <div class="system">
        <i class="iconfont iconlogo-cc" />
      </div>
      <div style="display: flex;">
        <div class="shop">
          <img class="img" src="@/assets/images/shop.png" />
          <span>{{ shop.shopName ? shop.shopName : '暂未选择店铺' }}</span>
          <el-button type="text" size="mini" class="switch-btn" :disabled="shopList.length === 0" @click="isOpenShopModal = true">切换</el-button>
          <shop-change v-model="isOpenShopModal" @close="isOpenShopModal = false" />
        </div>
        <div style="display: flex;align-items: center;">
          <img class="img" src="@/assets/images/user.png" />
          <el-dropdown trigger="click" size="small" placement="bottom">
            <span>{{name}}<i class="iconfont iconxia" style="font-size: 12px" /></span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="logout">
                  <span style="display:block;">退出登录</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </el-header>
    <el-container style="height: calc(100vh - 48px);">
      <el-aside ref="side1" width="204px" class="aside-menu">
        <div class="el-aside-menu">
          <ul class="main-menu">
            <li v-for="(menu, index) in menus"
              :key="index"
              :class="{active: index == activeIndex}"
              @click="activeIndex = index">
              <el-tooltip effect="dark" placement="right" :content="menu.name">
                <i :class="[menu.icon, 'iconfont']" />
              </el-tooltip>
            </li>
          </ul>
          <el-menu
            v-if="showSecondList.length"
            ref="side_menu"
            :default-active="childActiveIndex"
            :default-openeds="openIndexs"
            text-color="#778092"
            active-text-color="#353C47"
            width="auto"
            @select="menuClick">
            <template v-for="(item, index) in showSecondList">
              <el-menu-item-group v-if="item.children && item.children.length > 0" :key="item.code">
                <template #title><span>{{item.name}}</span></template>
                <template v-for="(child, childIndex) in item.children" :key="child.code">
                  <el-menu-item :index="`${activeIndex}-${index}-${childIndex}`"
                    :class="{ active: routerName == child.code }">
                    <i :class="[child.icon, 'iconfont']" />
                    <template #title><span>{{child.name}}</span></template>
                  </el-menu-item>
                </template>
              </el-menu-item-group>
              <el-menu-item v-else :key="item.code" :index="`${activeIndex}-${index}`" :class="{active: routerName == item.code}">
                <i :class="[item.icon, 'iconfont']"></i>
                <template #title><span>{{item.name}}</span></template>
              </el-menu-item>
            </template>
          </el-menu>
          <div v-else class="menu-text">
            没有可选菜单，请到OC-新建流程-CDL权限中申请
          </div>
        </div>
      </el-aside>
      <el-main class="main-content">
        <div id="scrollable-content-div">
          <el-breadcrumb v-if="$route.meta.showTitle !== false">
            <el-breadcrumb-item v-for="(item, index) in $route.meta.title" :key="index">{{item}}</el-breadcrumb-item>
          </el-breadcrumb>
          <router-view v-if="isRouterAlive"></router-view>
        </div>
        <copyright />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { defineComponent, onMounted } from 'vue'
import { mapGetters } from 'vuex'
import ShopChange from '@/components/shop-change'
import copyright from '@/components/copyright'
import { getToken } from '@/libs/cookie'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'Index',
  components: { ShopChange, copyright },
  provide () {
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      showMenu: true,
      isOpenShopModal: false,
      keyWords: '',
      activeName: '',
      userId: -1,
      result: [],
      currentShopId: '',
      activeIndex: 0,
      openIndexs: [],
      isRouterAlive: true,
      childActiveIndex: '1-0'
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'menus',
      'shop',
      'shopList'
    ]),
    showSecondList() {
      return this.menus.length && this.menus[this.activeIndex] && this.menus[this.activeIndex].children
    },
    routerName() {
      return this.$route.name
    }
  },
  watch: {
    shop: {
      handler: function(newV) {
        this.currentShopId = newV.shopId + '-' + newV.shopCode
        this.reload()
      },
      deep: true
    },
    $route(val) {
      if (val.path === '/') return
      let index1 = -1
      let index2 = ''
      this.activeIndex = this.menus.findIndex(item => item.code === val.meta.parent[0])
      if (val.meta.parent && val.meta.parent[1]) {
        index1 = this.menus[this.activeIndex].children.findIndex(i => i.code == val.meta.parent[1])
        this.childActiveIndex = this.activeIndex + '-' + index1
        if (index1 > -1) {
          index2 = this.menus[this.activeIndex].children[index1].children.findIndex(i => i.code === val.name)
          this.childActiveIndex += '-' + index2
        }
      }
    }
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const getAuthData = async() => {
      try {
        await store.dispatch('user/getInfo')
        router.push({ name: 'product_set_settings' })
        const shops = await store.dispatch('user/getShopList')
        if (shops.length) {
          await store.dispatch('user/getChooseShop')
        }
      } catch (e) {
        console.log(e, '*********')
        await store.dispatch('user/logout')
        router.push({ name: 'login'})
      }
    }
    onMounted(() => {
      if (!getToken()) {
        router.push({ name: 'login' })
      } else {
        getAuthData()
      }
    })
  },
  methods: {
    reload() {
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    },
    menuClick(index) {
      this.childActiveIndex = index
      let arr = index.split('-')
      let item = this.menus[arr[0]].children[arr[1]]
      if (arr.length == 3) {
        item = item.children[arr[2]]
      }
      if (!item.children && item.code) this.goToPage(item.code)
    },
    goToPage(name) {
      if (this.shopList.length) {
        this.$nextTick(() => {
          document.documentElement.scrollTop = document.body.scrollTop = 0
          this.$router.push({ name })
        })
      }
    },
    selectSecondMenu(name) {
      this.activeName = name
    },
    async logout() {
      try {
        await this.$store.dispatch('user/logout')
        window.location.href = process.env.VUE_APP_LOGOUT_URL || ''
      } catch (error) {
        console.log(error)
      }
    }
  }
})
</script>

<style>
.qq-popper-bottom {
  padding: 0;
  box-shadow: 0px 4px 20px 0px rgba(72, 87, 119, 0.1);
  border-radius: 8px;
}
</style>
<style lang="scss" scoped>
$headerHeight: 48px;
.menu-text {
  text-align: center;
  font-size: 16px;
  margin-top: 30px;
  padding: 20px 12px;
}
.system {
  color: white;
  width: 48px;
  background: $primaryRed;
  text-align: center;
  line-height: 48px;
  height: 48px;
  i {
    font-size: 22px;
  }
}
#scrollable-content-div {
  box-shadow: 0 0 12px rgba(222, 223, 237, 0.5);
  border-radius: 6px;
  height: calc(100% - 40px);
  background: #fff;
  position: relative;
  overflow: auto;
  display: flex;
  flex-direction: column;
  .content-wrapper {
    height: 100%;
    padding: 20px 24px;
    display: flex;
    flex-direction: column;
  }
}
.img {
  width: 16px;
  height: 16px;
  margin-right: 4px;
}
.shop {
  margin-right: 24px;
  color: #353C47;
  font-size: 12px;
  display: flex;
  align-items: center;
  .switch-btn {
    margin-left: 4px;
    color: #7B879A;
    &:hover {
      color: $secondRed;
    }
  }
}
.svg-icon {
  width: 12px;
  height: 12px;
  cursor: pointer;
  outline: none;
  position: absolute;
  top: 2px;
  left: 2px;
}
.shop-select {
  :deep(.el-input__prefix) {
    line-height: 32px;
  }
  :deep(.el-input__inner){
    background-color: transparent!important;
    border: 1px solid rgba(255,255,255,0.3);
    border-radius: 2px;
    color: rgba(255,255,255,0.75);
  }
}
.main {
  height: 100vh;
  overflow: auto;
  background: linear-gradient(180deg, #EEF2F9 0%, #FDFEFF 100%);
}
.main-content {
  padding: 8px 8px 0 0;
  min-height: calc(100vh - 56px);
  overflow: hidden;
  background-color: $thirdBgCol;
}
.el-header {
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  height: $headerHeight;
  background: #F7FAFF;
  border-bottom: 1px solid rgba(151, 151, 151, 0.2);
}
.el-aside {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}
.el-aside-menu {
  border-right: 0;
  flex: 1;
  display: flex;
  .main-menu {
    min-width: $headerHeight;
    height: 100%;
    background-color: #2A364A;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    padding: 20px 0;
    border-right: 1px solid #979797;
    margin-top: 0;
    li {
      color: #7D89A3;
      height: $headerHeight;
      width: $headerHeight;
      text-align: center;
      line-height: $headerHeight;
      margin: 2px 0;
      i {
        margin: auto;
        font-size: 18px;
      }
      &:hover {
        background-color: #1D2634;
      }
    }
    .active {
      background-color: #1D2634;
      color: #FFF;
    }
  }
  .el-menu {
    padding: 20px 0;
    border-right: 0;
    flex: 1;
    background-color: $thirdBgCol;
    overflow: hidden;
    overflow: auto;
    .el-menu-item-group__title  {
      color: #BDC2C8;
    }
    .el-menu-item {
      height: 34px;
      line-height: 30px;
      width: 140px;
      border-radius: 4px;
      margin: 2px 8px;
      i {
        color: #778092;
        margin-right: 5px;
      }
      &:hover {
        background-color: #e6e9f2;
      }
      &.active {
        background-color: #e6e9f2;
        i {
          color: $primaryRed;
        }
      }
    }
  }
}
.el-footer {
  height: 40px;
  line-height: 40px;
  color: #D8D8D8;
  font-size: 12px;
  text-align: center;
}
</style>