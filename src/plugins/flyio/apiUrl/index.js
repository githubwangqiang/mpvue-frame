import global from '@/utils/global'
const modulesContext = require.context('./', true, /\.js$/)
let API = {}

let baseUrl = ''
let loginUrl = ''

switch (process.env.NODE_ENV) {
  case 'development':
    baseUrl = global.baseUrl.development.baseApi
    loginUrl = global.baseUrl.development.loginApi
    break
  case 'production':
    baseUrl = global.baseUrl.production.baseApi
    loginUrl = global.baseUrl.production.loginApi
    break
}

const chunks = modulesContext.keys().reduce((modules, key) => {
  if (key !== './index.js') {
    API = {...API, ...modulesContext(key).default}
    const moduleAPI = {...modulesContext(key).default}
    for (let key in moduleAPI) {
      if (/loginApi\./.test(key)) {
        moduleAPI[key] = loginUrl + moduleAPI[key]
      } else {
        moduleAPI[key] = baseUrl + moduleAPI[key]
      }
    }
    Object.assign(API, moduleAPI)
  }
  return API
}, {})
export default {
  ...chunks
}
