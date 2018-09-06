// AppId
const AppID = 'wx316f452dd0549fed'
// http请求Host
const baseUrl = {
  development: {
    // 'baseApi': 'https://appwb-dev.langb.cn',
    // 'loginApi': 'https://proxy-dev.langb.cn'
    'baseApi': 'https://appwb.langb.cn',
    'loginApi': 'https://proxy.langb.cn'
  },
  // development: 'http://192.168.1.165:55244',
  production: {
    'baseApi': 'https://appwb.langlib.com',
    'loginApi': 'https://proxy.langlib.com'
  }
}

module.exports = {
  AppID,
  baseUrl
}
