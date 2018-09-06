import Vue from 'vue'
const state = {
  OpenID: '',
  UnionID: '',
  AccessToken: '',
  AccessTokenExpires: '',
  UserID: '',
  imgCode: {
    imgUrl: ''
  }
}
const mutations = {
  CAPTCHA (state, data) {
    state.imgCode.imgUrl = `data:image/svg+xml;utf8,${Vue.iBox.decodeBase64(data)}`
  },
  LOGINPOPUPSTATUS (state) {
    state.isShowLoginPopUp = !state.isShowLoginPopUp
  },
  // =============
  setStorageUsertoken: (state, data) => {
    // state.OpenID = data.OpenID
    // state.UnionID = data.UnionID
    wx.setStorageSync('OpenID', data.OpenID)
    wx.setStorageSync('UnionID', data.UnionID)
  },
  setLoginByWxUnionID: (state, data) => {
    // state.AccessToken = data.AccessToken
    // state.AccessTokenExpires = data.AccessTokenExpires
    // state.UserID = data.UserID
    wx.setStorageSync('AccessToken', data.AccessToken)
    wx.setStorageSync('AccessTokenExpires', data.AccessTokenExpires)
    wx.setStorageSync('UserID', data.UserID)
    wx.setStorageSync('Login', true)
  },
  refreshLoginByWxUnionID: (state, data) => {
    if (data.AccessToken !== undefined) {
      wx.setStorageSync({
        'AccessToken': data.AccessToken,
        'AccessTokenExpires': data.AccessTokenExpires,
        'UserID': data.UserID,
        'Login': true
      })
    } else {
      console.log('短信登陆接口验证不成功', data)
    }
  },
  byCodeLogin: (state, data) => {
    if (data.AccessToken === '') {
      wx.setStorageSync('OpenID', data.WxOpenID)
      wx.setStorageSync('Login', false)
    } else if (data.AccessToken !== '') {
      wx.setStorageSync('Login', true)
      wx.setStorageSync('OpenID', data.WxOpenID)
      wx.setStorageSync('AccessToken', data.AccessToken)
      wx.setStorageSync('AccessTokenExpires', data.AccessTokenExpires)
      wx.setStorageSync('UserID', data.UserID)
    }
  },
  codeTokenLogin: (state, data) => {
    if (data.AccessToken !== undefined && data.AccessToken !== '') {
      // 成功登陆的情况
      wx.setStorageSync('Login', true)
    } else if (data.status !== undefined) {
      wx.setStorageSync('Login', false)
    }
  }
}
const actions = {
  toggleLoginPopUpStatus ({commit}, params = {}) {
    commit('LOGINPOPUPSTATUS')
  },
  // 获取Session
  async checkSession ({commit}, params = {}) {
    return new Promise((resolve, reject) => {
      wx.checkSession({
        success: function (res) {
          resolve(res)
        },
        fail: function (err) {
          reject(err)
        }
      })
    })
  },
  // 获取1
  async getUserAccesstoken ({commit}, params = {}) {
    const result = await Vue.iBox.http('loginApi.findUserAccesstoken', {...params})({method: 'get'})
    commit('setStorageUsertoken', result)
    return result
  },
  // 新用户 换登陆token
  async decryptMinipUserInfo ({commit}, params = {}) {
    const result = await Vue.iBox.http('loginApi.decryptMinipUserInfo', {...params})({method: 'post'})
    commit('setStorageUsertoken', result)
    return result
  },
  // 新用户用加密code换token
  async loginByEncryptedData ({commit}, params = {}) {
    const result = await Vue.iBox.http('loginApi.loginByEncryptedData', {...params})({method: 'post'})
    wx.setStorageSync('OpenID', result.WxOpenID)
    wx.setStorageSync('AccessToken', result.AccessToken)
    wx.setStorageSync('AccessTokenExpires', result.AccessTokenExpires)
    wx.setStorageSync('UserID', result.UserID)
    commit('codeTokenLogin', result)
    return result
  },
  // 用UnionID登陆获取AccessToken2
  async loginByWxUnionID ({commit}, params = {}) {
    const result = await Vue.iBox.http('loginApi.loginByWxUnionID', {...params})({method: 'post'})
    commit('setLoginByWxUnionID', result)
    return result
  },
  // 通过code登陆获取AccessToken
  async loginByCode ({commit}, params = {}) {
    const result = await Vue.iBox.http('loginApi.loginByCode', {...params})({method: 'post'})
    commit('byCodeLogin', result)
    return result
  },
  // 校验token有效性3
  async getUserInfo ({commit}, params = {}) {
    const result = await Vue.iBox.http('loginApi.getUserInfo', {...params})({method: 'get'})
    return result
  },
  // 检查本地token是否有且未过期
  async inspectToken ({commit}, params = {}) {
    let token = wx.getStorageSync('AccessToken')
    if (token) {
      const result = await Vue.iBox.http('loginApi.getUserInfo', {...params})({method: 'get'})
      commit('overUsertoken', result)
    } else {
      // 逻辑需要调整
      this.gettoken()
    }
  },
  // 获取短信验证码
  async sendSmsCode ({commit}, params = {}) {
    let result = await Vue.iBox.http('loginApi.sendValidateCode', {...params})({}, {errorAction: true})
    return result
  },
  // 图形验证码
  async getCaptcha ({commit}, params = {}) {
    const result = await Vue.iBox.http('loginApi.captcha', {...params})({method: 'get'}, {errorAction: true})
    commit('CAPTCHA', result.Captcha)
  },
  // 图形验证码发送短信
  async endValidateCodeByCaptcha ({commit}, params = {}) {
    const result = await Vue.iBox.http('loginApi.endValidateCodeByCaptcha', {...params})({method: 'post'}, {errorAction: true})
    return result
  },
  // 验证手机短信验证码
  async checkValidateCode ({commit}, params = {}) {
    const result = await Vue.iBox.http('loginApi.checkValidateCode', {...params})({method: 'post'}, {errorAction: true})
    return result
  },
  // 修改密码
  async resetPassword ({commit}, params = {}) {
    const result = await Vue.iBox.http('loginApi.resetPassword', {...params})({method: 'post'}, {errorAction: true})
    return result
  },
  // 短信登陆
  async loginByValidateCode ({commit}, params = {}) {
    const result = await Vue.iBox.http('loginApi.loginByValidateCode', {...params})({method: 'post'}, {errorAction: true})
    commit('refreshLoginByWxUnionID', result)
    return result
  },
  // 账号密码登陆
  async loginByAccount ({commit}, params = {}) {
    const result = await Vue.iBox.http('loginApi.loginByAccount', {...params})({method: 'post'}, {errorAction: true})
    commit('refreshLoginByWxUnionID', result)
    return result
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
