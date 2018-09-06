import '../static/sdk/ald-stat'
import Vue from 'vue'
import App from '@/App'
import store from '@/store'
import '@/style/weui.css'
import '@/style/iconfont.wxss'

import IboxPlugin from '@/plugins/ibox'
import MpvueRouterPatch from 'mpvue-router-patch'
Vue.config.productionTip = false
Vue.use(IboxPlugin)
Vue.use(MpvueRouterPatch)

const app = new Vue({
  store,
  ...App
})

app.$mount()

export default {
  config: {
    pages: [],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    }
  }
}
