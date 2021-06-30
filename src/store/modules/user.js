import { login, logout, getInfo, getShopList, chooseShop, getChooseShop } from '@/api/user'
import { getToken, setToken, removeToken } from '@/libs/cookie'
import { getFirstNode } from '@/libs/util'

const state = function() {
  return {
    token: getToken(),
    name: '',
    userId: '',
    shop: {
      shopId: '',
      shopCode: ''
    },
    roles: [],
    menus: [],
    functions: [],
    shopList: [],
    firstPage: ''
  }
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_SHOP: (state, shop) => {
    state.shop = shop
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_USERID: (state, id) => {
    state.userId = id
  },
  SET_MENUS: (state, menus) => {
    state.menus = menus
  },
  SET_FUNCTIONS: (state, functions) => {
    state.functions = functions
  },
  SET_SHOPLSIT: (state, shopList) => {
    state.shopList = shopList
  },
  SET_FIRST_PAGE: (state, code) => {
    state.firstPage = code
  }
}

const actions = {
  async login({ commit }, userInfo) {
    try {
      const { username, password } = userInfo
      await login({ username: username.trim(), password: password })
      setToken('login success')
      commit('SET_TOKEN', 'login success')
      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    }
  },

  async getInfo({ commit, state }) {
    try {
      const result = await getInfo(state.token)
      const data = result.user
      if (!data) {
        return Promise.reject('Verification failed, please Login again.')
      }
      const menus = result.menus
      const functions = result.functions
      data.name = data.userName
      data.roles = ['admin']
      data.menus = menus
      const showMenuCode = getFirstNode(menus)
      commit('SET_FIRST_PAGE', showMenuCode.code || 'noShop')
      const { roles, name, id } = data
      if (!roles || roles.length <= 0) {
        return Promise.reject('getInfo: roles must be a non-null array!')
      }
      commit('SET_ROLES', roles)
      commit('SET_USERID', id)
      commit('SET_NAME', name)
      commit('SET_MENUS', menus)
      commit('SET_FUNCTIONS', functions)
      return Promise.resolve(data)
    } catch (error) {
      return Promise.reject(error)
    }
  },

  async getShopList({ commit, state }) {
    try {
      const res = await getShopList()
      if (res.length === 0 && state.menus.length) commit('SET_FIRST_PAGE', 'noShop')
      commit('SET_SHOPLSIT', res)
      return Promise.resolve(res)
    } catch (err) {
      return Promise.reject(err)
    }
  },

  async chooseShop({ dispatch }, { shopId, shopCode }) {
    try {
      await chooseShop({ shopId, shopCode })
      dispatch('getChooseShop')
      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    }
  },

  async getChooseShop({ commit }) {
    try {
      const res = await getChooseShop()
      commit('SET_SHOP', res)
    } catch (error) {
      return Promise.reject(error)
    }
  },

  async logout({ commit }) {
    try {
      await logout()
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    }
  },

  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
