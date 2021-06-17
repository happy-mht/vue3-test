import { createRouter, createWebHashHistory } from 'vue-router'
const Index = () => import(/* webpackChunkName: 'Index' */ '@/index')
const login = () => import(/* webpackChunkName: 'login' */ '@/views/login')

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
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
