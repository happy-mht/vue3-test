import { getLastUpdateTime } from '@/api/common'
const state = {
  lastUpdateTime: {
    repurchase: '',
    unpurchased: '',
    shop: true,
    scene: true,
    advice: true,
    marketing: true,
  },
  sceneMap: {
    repurchase: { val: 2, name: '关联复购' },
    unpurchased: { val: 1, name: '询单未购' }
  },
  currentScene: ''
}

const mutations = {
  SET_SCENE: (state, val) => {
    state.currentScene = val
  },
  SET_TIME: (state, time) => {
    state.lastUpdateTime[state.currentScene] = time
  }
}

const actions = {
  async changeScene({ commit, state }, val) {
    try {
      commit('SET_SCENE', val)
      const res = await getLastUpdateTime({ type: state.sceneMap[state.currentScene].val })
      commit('SET_TIME', res.lastUpdateTime)
      return Promise.resolve()
    } catch (e) {
      return Promise.reject(e)
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
