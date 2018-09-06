import Vue from 'vue'
import {userStatus, booksInfos} from '@/utils/global'

const state = {
  userWordBookList: null,
  userStatus: {
    newUser: { // 是否新用户标识  以安装第一次使用为基准
      step1: userStatus.newUser.step1, // step1 是否为新手引导 默认是新用户 true
      step5: userStatus.newUser.step5 // step5 是否为新手引导 默认是新用户 true
    },
    autoPlay: userStatus.autoPlay, // 是否自动播放发音  默认 是自动发音 true
    changeCard: userStatus.changeCard // 是否自动切换卡片、显示倒计时  默认 不自动切换、显示倒计时 false
  },
  isNewWordBookArr: [],
  operation: true // 是否处于操作状态  此时要停止定时器    默认 是处于操作状态 true
}

const mutations = {
  GETUSERWORDBOOKLISR: (state, data) => {
    state.userWordBookList = []
    state.isNewWordBookArr = []
    if (data.length > 0) {
      data.forEach((item) => {
        if (item.CurrStatus > 0) {
          state.isNewWordBookArr.push({userWordBookID: item.UserWordBookID, wordBookType: item.WordBookType, isNewWordBook: true})
          state.userWordBookList.push(Object.assign({}, item, booksInfos[item.WordBookType]))
        }
      })
    }
    let userStatus
    try {
      userStatus = wx.getStorageSync('userStatus')
    } catch (e) {
      throw new Error('get userStatus fail in store/book.js')
    }
    if (!userStatus) {
      try {
        wx.setStorageSync('userStatus', state.userStatus)
      } catch (e) {
        throw new Error('set userStatus fail in store/book.js')
      }
    }
    let isNewWordBookArr
    try {
      isNewWordBookArr = wx.getStorageSync('isNewWordBookArr')
    } catch (e) {
      throw new Error('get userStatus fail in store/book.js')
    }
    if (!isNewWordBookArr) {
      try {
        wx.setStorageSync('isNewWordBookArr', state.isNewWordBookArr)
      } catch (e) {
        throw new Error('set userStatus fail in store/book.js')
      }
    } else {
      isNewWordBookArr.push(Object.assign({}, state.isNewWordBookArr, isNewWordBookArr))
      try {
        wx.setStorageSync('isNewWordBookArr', state.isNewWordBookArr)
      } catch (e) {
        throw new Error('set userStatus fail in store/book.js')
      }
    }
  },
  SETNEWUSERSTEP1TOOLD: (state) => {
    state.userStatus.newUser.step1 = false
    let userStatus
    try {
      userStatus = wx.getStorageSync('userStatus')
    } catch (e) {
      throw new Error('get userStatus fail in store/book.js')
    }
    userStatus.newUser.step1 = state.userStatus.newUser.step1
    try {
      wx.setStorageSync('userStatus', userStatus)
    } catch (e) {
      throw new Error('set userStatus fail in store/book.js')
    }
  },
  SETNEWUSERSTEP5TOOLD: (state) => {
    state.userStatus.newUser.step5 = false
    let userStatus
    try {
      userStatus = wx.getStorageSync('userStatus')
    } catch (e) {
      throw new Error('get userStatus fail in store/book.js')
    }
    userStatus.newUser.step5 = state.userStatus.newUser.step5
    try {
      wx.setStorageSync('userStatus', userStatus)
    } catch (e) {
      throw new Error('set userStatus fail in store/book.js')
    }
  },
  SETUSERSTATUSAUTOPLAY: (state, date) => {
    state.userStatus.autoPlay = date
    let userStatus
    try {
      userStatus = wx.getStorageSync('userStatus')
    } catch (e) {
      throw new Error('get userStatus fail in store/book.js')
    }
    userStatus.autoPlay = state.userStatus.autoPlay
    try {
      wx.setStorageSync('userStatus', userStatus)
    } catch (e) {
      throw new Error('set userStatus fail in store/book.js')
    }
  },
  SETUSERSTATUSCHANGECARD: (state, date) => {
    state.userStatus.changeCard = date
    let userStatus
    try {
      userStatus = wx.getStorageSync('userStatus')
    } catch (e) {
      throw new Error('get userStatus fail in store/book.js')
    }
    userStatus.changeCard = state.userStatus.changeCard
    try {
      wx.setStorageSync('userStatus', userStatus)
    } catch (e) {
      throw new Error('set userStatus fail in store/book.js')
    }
  },
  SETOPERATION: (state, date) => {
    state.operation = date
  },
  SORTUSERWORDBOOKLIST: (state, index) => {
    state.userWordBookList = Vue.iBox.bringToTop(state.userWordBookList, index)
  },
  ACTIVEP2WORDBOOKLIST: (state, date) => {
    state.userWordBookList.forEach((item) => {
      if (item.userWordBookID === date.userWordBookID && item.wordBookType === date.wordBookType) {
        item.CurrStatus = 21
      }
    })
  }
}

const actions = {
  async getUserWordBookList ({commit}, params = {}) {
    const result = await Vue.iBox.http('bookUrl.findAllBooks', {...params})({method: 'get'})
    commit('GETUSERWORDBOOKLISR', result.UserWordBookList)
  },
  setNewUserStep1ToOld ({commit}) {
    commit('SETNEWUSERSTEP1TOOLD')
  },
  setNewUserStep5ToOld ({commit}) {
    commit('SETNEWUSERSTEP5TOOLD')
  },
  setUserStatusAutoPlay ({commit}, date) {
    commit('SETUSERSTATUSAUTOPLAY', date)
  },
  setUserStatusChangeCard ({commit}, date) {
    commit('SETUSERSTATUSCHANGECARD', date)
  },
  setOperation ({commit}, date) {
    commit('SETOPERATION', date)
  },
  sortUserWordBookList ({commit}, index) {
    commit('SORTUSERWORDBOOKLIST', index)
  },
  activeP2WordBook ({commit}, date) {
    commit('ACTIVEP2WORDBOOKLIST', date)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
