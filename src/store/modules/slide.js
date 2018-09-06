/**
 * 设置页面相关
 * @type {{isSlide: boolean}}
 */

// import Vue from 'vue'
const state = {
  isSlide: false
}

const mutations = {
  NOTSLIDE: (state) => {
    const obj = state
    obj.isSlide = false
  },
  ISSLIDE: (state) => {
    const obj = state
    obj.isSlide = true
  }
}

const actions = {
  notslide ({commit}) {
    commit('NOTSLIDE')
  },
  isslide ({commit}) {
    commit('ISSLIDE')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
