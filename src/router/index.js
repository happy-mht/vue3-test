import { createRouter, createWebHashHistory } from 'vue-router'
const Index = () => import(/* webpackChunkName: 'Index' */ '@/index')
const login = () => import(/* webpackChunkName: 'login' */ '@/views/login')
const SecondMenu = () => import(/* webpackChunkName: 'Index' */ '@/second-menu')
const noShop = () => import(/* webpackChunkName: 'Index' */ '@/views/error-page/no-shop')
const noOpen = () => import(/* webpackChunkName: 'Index' */ '@/views/error-page/no-open')

// 场景分析
const purchasePath = () => import(/* webpackChunkName: 'scene_analysis' */ '@/views/scene-analysis/associated-repurchase-scenes/purchase-path')
const sceneSettingAssociated = () => import(/* webpackChunkName: 'scene_analysis' */ '@/views/scene-analysis/associated-repurchase-scenes/scene-setting')

// 标签管理
const tagManage = () => import(/* webpackChunkName: 'combination_tag' */ '@/views/combination-tag/manage/index')
const tagDesign = () => import(/* webpackChunkName: 'combination_tag' */ '@/views/combination-tag/tag-design')
const tagReview = () => import(/* webpackChunkName: 'combination_tag' */ '@/views/combination-tag/tag-review')

// 人群画像
const tagPanel = () => import(/* webpackChunkName: 'crowd_tag_portrait' */ '@/views/crowd-portrait/tag-panel/index')

const routes = [
  {
    path: '/',
    component: Index,
    name: 'Home',
  },
  {
    path: '/login',
    name: 'login',
    component: login,
    hidden: true
  },
  {
    path: '/scene-analysis',
    name: 'scene_analysis',
    component: Index,
    meta: { title: ['场景分析'] },
    children: [
      {
        path: 'associated-associated-scene',
        name: 'repurchase_scene',
        component: SecondMenu,
        meta: { title: ['关联复购'] },
        children: [
          {
            path: 'purchase-path',
            name: 'purchase_path_analysis',
            meta: { title: ['购买路径分析'], parent: ['scene_analysis', 'repurchase_scene'], showTitle: false },
            component: purchasePath
          }, {
            path: 'scene_setting',
            name: 'related_purchase_scene_set',
            meta: { title: ['场景设置'], parent: ['scene_analysis', 'repurchase_scene'] },
            component: sceneSettingAssociated
          }
        ]
      }
    ]
  },
  {
    path: '/setting',
    name: 'settings',
    component: Index,
    mete: { title: ['设置'] },
    children: [{
      path: 'shop',
      name: 'shop_settings',
      component: SecondMenu,
      meta: { title: ['店铺设置'] },
      children: [
        {
          path: 'product-set',
          name: 'product_set_settings',
          meta: { title: ['商品集设置'], parent: ['settings', 'shop_settings'] },
          component: () => import(/* webpackChunkName: 'settings' */ '@/views/settings/shop/product-set/index')
        }
      ]
    }, {
      path: 'scene',
      name: 'scene_settings',
      component: SecondMenu,
      meta: { title: ['场景设置'] },
      children: [
        {
          path: 'advice-unpurchased',
          name: 'advice_unpurchased_setting',
          meta: { title: ['咨询未购设置'], parent: ['settings', 'scene_settings'] },
          component: () => import(/* webpackChunkName: 'settings' */ '@/views/settings/scene/advice-unpurchased/index')
        }
      ]
    }]
  },
  {
    path: '/crowd-portrait',
    name: 'crowd_portrait',
    component: Index,
    mete: { title: ['人群画像'] },
    children: [{
      path: 'tag-panel',
      name: 'crowd_tag_panel',
      meta: { title: ['人群标签画像'], parent: ['crowd_portrait'], showTitle: false },
      component: tagPanel
    }]
  },
  {
    path: '/combination-tag',
    name: 'combination_tag',
    component: Index,
    meta: { title: ['组合标签'] },
    children: [{
      path: 'manage',
      name: 'combination_tag_manage',
      meta: { title: ['组合标签管理'], parent: ['combination_tag'] },
      component: tagManage
    }]
  },
  {
    path: '/tag-design/:id?',
    name: 'TagDesign',
    component: tagDesign,
    meta: { title: ['标签设计'] }
  },
  {
    path: '/tag-review/:id',
    name: 'TagReview',
    component: tagReview,
    meta: { title: ['标签审核'] }
  },
  {
    path: '/info',
    component: Index,
    name: 'Info',
    children: [
      {
        path: 'noShop',
        component: noShop,
        name: 'noShop',
        meta: {}
      },
      {
        path: 'no-open',
        name: 'scene_no_open',
        meta: { title: ['订单未购米有开通'] },
        component: noOpen
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
