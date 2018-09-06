// iBoxPlugin
import handleRequest from '@/plugins/flyio/request'
import utils from './utils'
import global from '@/utils/global'

export default {
  /**
   * 自定义方法
   * 组件内使用： this.$iBox.validator
   * 全局使用：Vue.iBox.validator
   */
  install (Vue) {
    const iBox = {
      ...utils,
      http: handleRequest,
      global
    }

    Vue.iBox = iBox
    Vue.prototype.$iBox = iBox
  }
}
