import Vue from 'vue'
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
  getUsertoken: (state, data) => {
    console.log(data, 'data')
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
  wordBookActivities ({commit}, params = {}) {
    return Vue.iBox.http('activity.wordBookActivities', {...params})({method: 'get'})
  },
  helpFriendBoost ({commit}, params = {}) {
    return Vue.iBox.http('activity.helpFriendBoost', {...params})({method: 'post'})
  },
  userWordBookActivityDetail ({commit}, params = {}) {
    return Vue.iBox.http('activity.userWordBookActivityDetail', {...params})({method: 'get'})
  },
  // 参加活动
  joinActivity ({commit}, params = {}) {
    return Vue.iBox.http('activity.joinActivity', {...params})({method: 'post'})
  },
  // 参加活动行为记录
  recordUserBehavior ({commit}, params = {}) {
    return Vue.iBox.http('activity.recordUserBehavior', {...params})({method: 'post'})
  },
  // 传递formId
  cacheFormId ({commit}, params = {}) {
    return Vue.iBox.http('activity.recordWxFormID', {...params})({method: 'post'}, {errorAction: true})
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
