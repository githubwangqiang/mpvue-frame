import Vue from 'vue'
// import Global from '@/utils/global'
// import global from '@/utils/global'
// import API from '@/store/flyio/apiUrl/index'
const state = {
  OpenID: '',
  UnionID: '',
  AccessToken: '',
  AccessTokenExpires: '',
  UserID: ''
}
const mutations = {
  setStorageUsertoken: (state, data) => {
    state.OpenID = data.OpenID
    state.UnionID = data.UnionID
    wx.setStorageSync('OpenID', data.OpenID)
    wx.setStorageSync('UnionID', data.UnionID)
  },
  setLoginByWxUnionID: (state, data) => {
    state.AccessToken = data.AccessToken
    state.AccessTokenExpires = data.AccessTokenExpires
    state.UserID = data.UserID
    wx.setStorageSync('AccessToken', data.AccessToken)
    wx.setStorageSync('AccessTokenExpires', data.AccessTokenExpires)
    wx.setStorageSync('UserID', data.UserID)
    wx.setStorageSync('Login', true)
  }
}
const actions = {
  // 获取1
  async getUserAccesstoken ({commit}, params = {}) {
    console.log('getUserAccesstoken==========')
    const result = await Vue.iBox.http('activity.findUserAccesstoken', {...params})({method: 'get'})
    console.log(result, 'result++++')
    commit('setStorageUsertoken', result)
    return result
  },
  // 用UnionID登陆获取AccessToken2
  async loginByWxUnionID ({commit}, params = {}) {
    const result = await Vue.iBox.http('activity.loginByWxUnionID', {...params})({method: 'post'})
    commit('setLoginByWxUnionID', result)
    return result
  },
  // 校验token有效性3
  async getUserInfo ({commit}, params = {}) {
    console.log('getUserInfo++++++')
    const result = await Vue.iBox.http('activity.getUserInfo', {...params})({method: 'get'})
    // commit('overUsertoken', result)
    return result
  },
  // 检查本地token是否有且未过期
  async inspectToken ({commit}, params = {}) {
    let token = wx.getStorageSync('AccessToken')
    if (token) {
      console.log('有token')
      const result = await Vue.iBox.http('activity.getUserInfo', {...params})({method: 'get'})
      commit('overUsertoken', result)
    } else {
      console.log('无token')
      // 逻辑需要调整
      this.gettoken()
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
