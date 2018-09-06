import Vue from 'vue'

const state = {
  checkInRecords: null,
  punchBackgroundUrl: {
    httpHost: 'https://ssl-static.langlib.com/miniprogram/wordbook/',
    imgUrl: {
      1: {background: 'bg_dk_liuji.png', title: 'text_rq_tongyong.png'},
      2: {background: 'bg_dk_gaokao.png', title: 'text_rq_tongyong.png'},
      6: {background: 'bg_dk_yasi.png', title: 'text_rq_tongyong.png'},
      7: {background: 'bg_dk_shangwu.png', title: 'text_rq_tongyong.png'},
      8: {background: 'bg_dk_gmat.png', title: 'text_rq_tongyong.png'},
      9: {background: 'bg_dk_sat.png', title: 'text_rq_tongyong.png'},
      10: {background: 'bg_dk_gre.png', title: 'text_rq_tongyong.png'},
      11: {background: 'bg_dk_gre.png', title: 'text_rq_tongyong.png'},
      12: {background: 'bg_dk_gre.png', title: 'text_rq_gre.png'},
      13: {background: 'bg_dk_siji.png', title: 'text_rq_tongyong.png'},
      15: {background: 'bg_dk_kaoyan.png', title: 'text_rq_tongyong.png'},
      16: {background: 'bg_dk_tuofu.png', title: 'text_rq_tongyong.png'},
      17: {background: 'bg_dk_tuofu.png', title: 'text_rq_tuofu.png'},
      18: {background: 'bg_dk_yasi.png', title: 'text_rq_yasi.png'},
      19: {background: 'bg_dk_sat.png', title: 'text_rq_sat.png'},
      20: {background: 'bg_dk_shiyongyingyu.png', title: 'text_rq_shiyong.png'},
      21: {background: 'bg_dk_gmat.png', title: 'text_rq_gmat.png'},
      22: {background: 'bg_dk_tuofu.png', title: 'text_rq_tongyong.png'},
      23: {background: 'bg_dk_siji.png', title: 'text_rq_siji.png'},
      24: {background: 'bg_dk_act.png', title: 'text_rq_act.png'},
      25: {background: 'bg_dk_liuji.png', title: 'text_rq_liuji.png'},
      26: {background: 'bg_dk_siji.png', title: 'text_rq_tongyong.png'},
      27: {background: 'bg_dk_liuji.png', title: 'text_rq_tongyong.png'},
      28: {background: 'bg_dk_gaokao.png', title: 'text_rq_tongyong.png'}
    }
  },
  quotations: {
    1: 'text_1.png',
    2: 'text_2.png',
    3: 'text_3.png',
    4: 'text_4.png',
    5: 'text_5.png',
    6: 'text_6.png',
    7: 'text_7.png',
    8: 'text_8.png',
    9: 'text_9.png',
    10: 'text_10.png',
    11: 'text_11.png',
    12: 'text_12.png',
    13: 'text_13.png',
    14: 'text_14.png'
  }
}
const mutations = {
  CHECKINRECORD: (state, data) => {
    let oneBookId = wx.getStorageSync('oneBookId')
    if (!oneBookId || data.length === 0) {
      state.checkInRecords = data
      return
    }
    if (oneBookId !== data[0].WordBookID) {
      data.map((val, index) => {
        if (oneBookId === val.WordBookID) {
          data.splice(index, 1)
          data.unshift(val)
          state.checkInRecords = data
        }
      })
    } else {
      state.checkInRecords = data
    }
  }
}

const actions = {
  async getcheckInRecords ({commit}, params = {}) {
    const result = await Vue.iBox.http('punchUrl.userCheckInRecords', {...params})({method: 'get'})
    commit('CHECKINRECORD', result)
  },
  async userDayLabel ({commit}, params = {}) {
    return Vue.iBox.http('punchUrl.userDayLabel', {...params})({method: 'get'})
  },
  async userWordBookID ({commit}, params = {}) {
    return Vue.iBox.http('punchUrl.userWordBookID', {...params})({method: 'post'})
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
