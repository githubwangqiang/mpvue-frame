import Vue from 'vue'
const state = {
  list: {
    totalItem: 100,
    item: []
  },
  currentCardIndex: 0,
  innerAudioContext: wx.createInnerAudioContext()
}

const mutations = {
  GETP1WORDS: (state, data) => {
    state.list.totalItem = data.WordInfos.length
    state.list.item = Vue.iBox.wordSort(data.WordInfos)
    try {
      wx.setStorageSync('list', JSON.stringify(state.list))
      wx.setStorageSync('oldList', JSON.stringify(state.list))
    } catch (e) {
      throw new Error('set list fail in store/card.js')
    }
  },
  CHANGECURRENT: (state, date) => {
    state.currentCardIndex = date
  },
  CHANGECURRENTSTEP: (state, date) => {
    let oldListItem = Vue.iBox.wordSort(JSON.parse(wx.getStorageSync('oldList')).item)
    if (date === 1 || date === 2 || date === 5) {
      state.list.item = Vue.iBox.wordFilter(oldListItem)
    } else {
      state.list.item = oldListItem
    }
    state.list.totalItem = state.list.item.length
    try {
      wx.setStorageSync('list', JSON.stringify(state.list))
    } catch (e) {
      throw new Error('set list fail in store/card.js')
    }
  },
  PLAYADIO: (state) => {
    let currentItem = state.list.item[state.currentCardIndex]
    let WP = currentItem.WP.replace(/[ *]+$/gm, '')
    let prefix = WP.substring(0, 1)
    let audioUrl = ''
    parseInt(currentItem.T) === 6 || parseInt(currentItem.T) === 18 ? audioUrl = `https://audio-1252136153.costj.myqcloud.com/wb/uk/${prefix.toLowerCase()}/${WP}.mp3` : audioUrl = `https://audio-1252136153.costj.myqcloud.com/wb/un/${prefix.toLowerCase()}/${WP}.mp3`
    let src = audioUrl
    state.innerAudioContext.src = src
    state.innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
    state.innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
    state.innerAudioContext.play()
  },
  STOPPLAY: (state) => {
    if (!state.innerAudioContext.paused) {
      state.innerAudioContext.stop()
    }
  },
  SETCURRINFO: (state, params) => {
    let currInfo = {
      userWordBookID: params.userWordBookID,
      taskIdx: params.task,
      currentList: params.list,
      routineIdx: params.routineIdx,
      stepIdx: 1
    }
    try {
      wx.setStorageSync('currInfo', currInfo)
    } catch (e) {
      throw new Error('set currInfo fail in store/card.js')
    }
  },
  UPDATENOTE: (state, date) => {
    state.list.item[state.currentCardIndex].N = date.Note
    const oldListItem = []
    JSON.parse(wx.getStorageSync('oldList')).item.forEach((item) => {
      if (item.Id === date.SysWordID) {
        item.N = date.Note
      }
      oldListItem.push(item)
    })
    try {
      wx.setStorageSync('list', JSON.stringify(state.list))
      wx.setStorageSync('oldList', JSON.stringify({totalItem: oldListItem.length, item: oldListItem}))
    } catch (e) {
      throw new Error('set list fail in store/card.js')
    }
  },
  UPDATEFAMILIARITY: (state, date) => {
    state.list.item[state.currentCardIndex].F = date.NewFamiliarity
    const oldListItem = []
    JSON.parse(wx.getStorageSync('oldList')).item.forEach((item) => {
      if (item.Id === date.SysWordID) {
        item.F = date.NewFamiliarity
      }
      oldListItem.push(item)
    })
    try {
      wx.setStorageSync('list', JSON.stringify(state.list))
      wx.setStorageSync('oldList', JSON.stringify({totalItem: oldListItem.length, item: oldListItem}))
    } catch (e) {
      throw new Error('set list fail in store/card.js')
    }
  }
}
const actions = {
  async getP1Words ({commit}, params = {}) {
    const result = await Vue.iBox.http('bookUrl.findP1Words', {...params})({method: 'get'})
    commit('GETP1WORDS', result)
  },
  updateNote ({commit}, params = {}) {
    Vue.iBox.http('bookUrl.updateNote', {...params})({method: 'put'})
    commit('UPDATENOTE', params)
  },
  updateFamiliarity ({commit}, params = {}) {
    Vue.iBox.http('bookUrl.updateFamiliarity', {...params})({method: 'put'})
    commit('UPDATEFAMILIARITY', params)
  },
  updateCurrentTask ({commit}, params = {}) {
    Vue.iBox.http('bookUrl.updateCurrentTask', {...params})({method: 'put'})
  },
  markTaskItemComplete ({commit}, params = {}) {
    Vue.iBox.http('bookUrl.markTaskItemComplete', {...params})({method: 'post'})
  },
  activateP2 ({commit}, params = {}) {
    Vue.iBox.http('bookUrl.activateP2', {...params})({method: 'post'})
  },
  changeCurrent ({commit}, currentIndex) {
    commit('CHANGECURRENT', currentIndex)
  },
  changeCurrentStep ({commit}, currentStepIndex) {
    commit('CHANGECURRENTSTEP', parseInt(currentStepIndex, 10))
  },
  playAudio ({commit}) {
    commit('STOPPLAY')
    commit('PLAYADIO')
  },
  stopPlay ({commit}) {
    commit('STOPPLAY')
  },
  setCurrInfo ({commit}, params = {}) {
    commit('SETCURRINFO', params)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
