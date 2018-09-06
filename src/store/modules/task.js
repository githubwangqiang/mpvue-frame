import Vue from 'vue'

const state = {
  taskInfos: [],
  currentTask: {
    TaskIdx: 1,
    UnitIdx: 1,
    RoutineIdx: 0,
    StepIdx: 1
  },
  taskArr: {
    totalTask: 34,
    items: ['Task1']
  },
  currentList: {
    newList: [],
    reviewList: []
  },
  taskStatus: {
    CurrentTask: {
      FinishStatus: 2, // 某一个task是否已经完成 1完成 2未完成
      CheckInStatus: 2 // 打卡状态 1.已打 2.未打
    },
    AllTaskStatus: 2 // 所有的task是否已经完成 1完成 2未完成
  }
}

const mutations = {
  GETTASKS: (state, data) => {
    state.taskArr.items = []
    state.taskInfos = data.TaskInfos
    if (data.CurrentTask.TaskIdx === 0) {
      state.currentTask = {
        RoutineIdx: 0,
        StepIdx: 1,
        TaskIdx: 1,
        UnitIdx: 1
      }
    } else {
      state.currentTask = data.CurrentTask
    }
    state.taskArr.totalTask = state.taskInfos.length
    for (let i = 1; i <= state.taskArr.totalTask; i++) {
      state.taskArr.items.push(`Task ${i}`)
    }
  },
  GETLIST: (state, taskIndex) => {
    let lists = state.taskInfos[taskIndex]
    state.currentList.reviewList = []
    state.currentList.newList = []
    lists.forEach((item) => {
      if (item['R'] > 0) {
        if (item['C'] === 0) {
          state.currentList.reviewList.push({'text': `List ${item['U']}`, 'list': item['U'], 'task': parseInt(taskIndex, 10) + 1, 'routineIdx': item['R'], 'isComplete': false})
        } else {
          state.currentList.reviewList.push({'text': `List ${item['U']}`, 'list': item['U'], 'task': parseInt(taskIndex, 10) + 1, 'routineIdx': item['R'], 'isComplete': true})
        }
      } else {
        if (item['C'] === 0) {
          state.currentList.newList.push({'text': `List ${item['U']}`, 'list': item['U'], 'task': parseInt(taskIndex, 10) + 1, 'routineIdx': item['R'], 'isComplete': false})
        } else {
          state.currentList.newList.push({'text': `List ${item['U']}`, 'list': item['U'], 'task': parseInt(taskIndex, 10) + 1, 'routineIdx': item['R'], 'isComplete': true})
        }
      }
    })
  },
  TASKSTATUS: (state, date) => {
    state.taskStatus = date
    // try {
    //   wx.setStorageSync('taskStatus', JSON.stringify(state.list))
    // } catch (e) {
    //   throw new Error('set list fail in store/card.js')
    // }
  },
  INITTASKSTATUS: (state) => {
    state.taskStatus = {
      CurrentTask: {
        FinishStatus: 2, // 某一个task是否已经完成 1完成 2未完成
        CheckInStatus: 2 // 打卡状态 1.已打 2.未打
      },
      AllTaskStatus: 2 // 所有的task是否已经完成 1完成 2未完成
    }
  },
  MARKUPCOMPLETIONLIST: (state, list) => {
    // let newCurrentList = {
    //   newList: [],
    //   reviewList: []
    // }
    state.currentList.newList.forEach((item) => {
      if (item.list === list) {
        item.isComplete = true
      }
    })
    state.currentList.reviewList.forEach((item) => {
      if (item.list === list) {
        item.isComplete = true
      }
    })
  }
}

const actions = {
  async getTasks ({commit}, params = {}) {
    const result = await Vue.iBox.http('bookUrl.findTasks', {...params})({method: 'get'})
    commit('GETTASKS', result)
  },
  async taskStatus ({commit}, params = {}) {
    const result = await Vue.iBox.http('bookUrl.taskStatus', {...params})({method: 'get'})
    commit('TASKSTATUS', result)
  },
  getList ({commit}, taskIndex) {
    commit('GETLIST', taskIndex)
  },
  initTaskStatus ({commit}) {
    commit('INITTASKSTATUS')
  },
  markupCompletionList ({commit}, list) {
    commit('MARKUPCOMPLETIONLIST', list)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
