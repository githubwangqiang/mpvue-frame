<template>
   <div class="task-list" v-if="items.length > 0">
     <div class="list-title">{{title}}</div>
     <div class="list-wrap">
       <div class="list-item" v-for="item in items" :key="item" @click="getWords(item)">
         <p class="item-text">{{item.text}} <i class="iconfont icon-duigou" v-if="item.isComplete"></i></p>
       </div>
     </div>
   </div>
</template>

<script>
    import Vue from 'vue'
    import {mapActions} from 'vuex'
    export default {
      name: 'task-list',
      props: ['title', 'userWordBookID', 'items'],
      mounted () {
      },
      methods: {
        ...mapActions('card', [
          'updateCurrentTask'
        ]),
        getWords: Vue.iBox.debounce(async function (item) {
          wx.showToast({
            title: '玩命加载中...',
            icon: 'loading',
            mask: true,
            duration: 2000
          })
          if (!item.isComplete) {
            this.updateCurrentTask({
              userWordBookID: this.userWordBookID,
              TaskIdx: parseInt(item.task, 10),
              UnitIdx: item.list,
              RoutineIdx: item.routineIdx,
              StepIdx: 1
            })
          }
          let currInfo = {
            userWordBookID: wx.getStorageSync('userWordBookID'),
            wordBookType: wx.getStorageSync('wordBookType'),
            taskIdx: item.task,
            currentList: item.list,
            routineIdx: item.routineIdx,
            isComplete: item.isComplete
          }
          wx.setStorageSync('currInfo', JSON.stringify(currInfo))
          let isNewWordBookArr = wx.getStorageSync('isNewWordBookArr')
          isNewWordBookArr.forEach((item) => {
            if (item.userWordBookID === wx.getStorageSync('userWordBookID')) {
              item.isNewWordBook = false
            }
          })
          wx.setStorageSync('isNewWordBookArr', isNewWordBookArr)
          wx.hideToast()
          this.$router.push({
            path: `/pages/index/index`,
            query: {
              list: item.list,
              userWordBookID: this.userWordBookID
            }
          })
        })
      }
    }
</script>

<style lang="scss" scoped>
.task-list {
  width: 100%;
  margin: 56px 0;
  .list-title {
    text-align: center;
    font-size: 28px;
    color: #999999;
    line-height: 28px;
    margin: 40px auto;
  }
  .list-wrap {
    margin: 40px 0;
    .list-item {
      width: 94%;
      height: 100px;
      line-height: 100px;
      margin: 32px 3%;
      background: #FFFFFF;
      box-shadow: 0 4px 30px 2px rgba(220,220,220,0.50);
      border-radius: 8px;
      .item-text {
        font-size: 32px;
        color: #333333;
        text-align: center;
        line-height: 100px;
        .icon-duigou {
          width: 0;
          height: 0;
          display: inline-block;
          &:before {
            position: relative;
            width: 34px;
            height: 24px;
            left: 28px;
            top: -4px;
          }
        }
      }
    }
  }
}
</style>
