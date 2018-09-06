// 正则匹配
let Pattern = {
  isEmpty: /(^\s*)|(\s*$)/g,
  isMobile: /^1[3|4|5|6|7|8][0-9]{9}$/,
  isCnAndEn: /^[\u4E00-\u9FA5]+$/,
  isCnAndEnAndNum: /^[\u4e00-\u9fa5-a-zA-Z0-9]+$/,
  isUserName: /^[(\u4e00-\u9fa5)a-zA-Z]+$/,
  isPassword: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/,
  isAuthCode: /^[0-9]{6}$/,
  isTelAndMobile: /^(1[3|4|5|7|8][\d]{9}|0[\d]{2,3}-[\d]{7,8}|400[-]?[\d]{3}[-]?[\d]{4})$/
}

const validator = {
  /**
   * 执行正则表达式
   * @param pattern 校验的正则表达式
   * @param strValue 校验的值
   * @returns {boolean}
   */
  executeExp: function (pattern, strValue) {
    return pattern.test(strValue)
  },
  /**
   * 判断字符串是否为空
   * @param strValue 校验的值
   * @returns {boolean}
   */
  isEmpty: function (strValue) {
    strValue = strValue.replace(Pattern.isEmpty, '')
    return strValue.length === 0
  },
  /**
   * 判断字符串是否非空
   * @param strValue 校验的值
   * @returns {boolean}
   */
  isNotEmpty: function (strValue) {
    return !this.isEmpty(strValue)
  },
  /**
   * 判断是否为中文
   * @param strValue 校验的值
   * @returns {boolean}
   */
  isCnAndEn: function (strValue) {
    if (this.isEmpty(strValue)) { return false }

    return this.executeExp(Pattern.isCnAndEn, strValue)
  },
  /**
   * 判断是否为中英文、数字及'-'
   * @param strValue 校验的值
   * @returns {boolean}
   */
  isCnAndEnAndNum: function (strValue) {
    if (this.isEmpty(strValue)) { return false }

    return this.executeExp(Pattern.isCnAndEnAndNum, strValue)
  },
  /**
   * 判断是否为用户名
   * @param strValue 校验的值
   * @returns {boolean}
   */
  isUserName: function (strValue) {
    if (this.isEmpty(strValue)) { return false }

    return this.executeExp(Pattern.isUserName, strValue)
  },
  /**
   * 判断验证码格式
   * @param strValue 校验的值
   * @returns {boolean}
   */
  isAuthCode: function (strValue) {
    if (this.isEmpty(strValue)) { return false }
    return this.executeExp(Pattern.isAuthCode, strValue)
  },
  /**
   * 判断是否为手机号码
   * @param strValue 校验的值
   * @returns {boolean}
   */
  isMobile: function (strValue) {
    if (this.isEmpty(strValue)) { return false }
    return this.executeExp(Pattern.isMobile, strValue)
  },
  /**
   * 判断是否为手机或电话号码
   * @param strValue 校验的值
   * @returns {boolean}
   */
  isTelAndMobile: function (strValue) {
    if (this.isEmpty(strValue)) { return false }
    return this.executeExp(Pattern.isTelAndMobile, strValue)
  },
  /**
   * 判断是否符合密码规则
   * @param strValue 校验的值
   * @returns {boolean}
   */
  isPassword: function (strValue) {
    if (this.isEmpty(strValue)) { return false }
    return this.executeExp(Pattern.isPassword, strValue)
  },
  /**
   * 对象是否为空
   * @param obj 检验对象
   * @returns {boolean}
   */
  isEmptyObj: (obj) => {
    return Object.keys(obj).length === 0
  },
  /**
   * 是否在范围长度内
   * @returns {boolean}
   * @param strValue
   * @param lenArr
   */
  isLenRange: (strValue, lenArr) => {
    return strValue.length >= lenArr[0] && strValue.length <= lenArr[1]
  },
  /**
   * 是否在数值范围内
   * @returns {boolean}
   * @param numValue
   * @param numArr
   */
  isNumRange: (numValue, numArr) => {
    return numValue >= numArr[0] && numValue <= numArr[1]
  }
}

  /**
   * 防抖函数
   * @param func
   * @param wait
   * @param immediate
   * @returns {Function}
   */
  function debounce (func, wait, immediate) {
    let _wait = wait || 800
    let timeout
    return function () {
      const context = this, args = arguments
      let later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, _wait);
      if (callNow) func.apply(context, args);
    };
  }

/**
 * 洗牌算法  （打乱选项）
 * @param arr  数组对象
 * @returns {*}
 */
function shuffle(arr) {
  var length = arr.length,
    randomIndex,
    temp;
  while (length) {
    randomIndex = Math.floor(Math.random() * (length--));
    temp = arr[randomIndex];
    arr[randomIndex] = arr[length];
    arr[length] = temp
  }
  return arr;
}

/**
 * 初始化选项  在每个选项前添加字母
 * @param obj
 * @returns {*}
 */
function addChoiceLetter (arr) {
  const choiceLetter = ['A', 'B', 'C', 'D']

  arr.forEach((item, index) => {
    item.value = `${choiceLetter[index]}. ${item.value}`
  })
  return arr
}

/**
 * 选项添加 我不确定项
 * @param obj
 * @returns {*}
 */
function addIndeterminateChoice (arr) {
  arr.push({
    answer: 0,
    value: '我不知道'
  })
  return arr
}

/**
 * 倒计时
 * @param count
 * @param cb
 */
function countTime(count, cb) {
  let timer = null
  if (timer) {
    clearTimeout(timer)
  }
  timer = setTimeout(() => {
    cb()
    clearTimeout(timer)
  }, count * 1000)
}

/**
 * 排序 按列表的 F字段
 * @param arr
 * @returns {*}
 */
function wordSort(arr) {
  const wordCopare = (data) => {
    if ((typeof arr[0][data]) !== 'number') { // 不为数字
      return (obja, objb) => {
        let a = obja[data]
        let b = objb[data]
        return a.localeCompare(b)
      }
    } else {
      return (obja, objb) => { // 为数字
        let a = obja[data]
        let b = objb[data]
        return a - b
      }
    }
  }
  return arr.sort(wordCopare('F'))
}

/**
 * 过滤 3星
 * @param arr
 * @returns {Array}
 */
function wordFilter(arr) {
  let filterItem = []
  arr.map(vla => {
    if (parseInt(vla['F']) < 2) {
      filterItem.push(Object.assign({}, vla))
    }
  })
  return filterItem
}

/**
 * 将data数组的index对应的元素，移动到数组首位，其余元素顺序往后排。
 *
 * @param data
 * @param index
 * @returns {*}
 */
function bringToTop (data, index) {
  if (data.length <= index || index <= 0) {
    return data;
  }
  const targetElem = data.splice(index, 1);
  data.unshift(targetElem[0]);
  return data;
}

/**
 * base64 构造函数
 * @constructor
 */
function Base64() {

  // private property
  const _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

  // public method for encoding
  this.encode = function (input) {
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;
    input = _utf8_encode(input);
    while (i < input.length) {
      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);
      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;
      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
        enc4 = 64;
      }
      output = output +
        _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
        _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
    }
    return output;
  }

  // public method for decoding
  this.decode = function (input) {
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    while (i < input.length) {
      enc1 = _keyStr.indexOf(input.charAt(i++));
      enc2 = _keyStr.indexOf(input.charAt(i++));
      enc3 = _keyStr.indexOf(input.charAt(i++));
      enc4 = _keyStr.indexOf(input.charAt(i++));
      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;
      output = output + String.fromCharCode(chr1);
      if (enc3 != 64) {
        output = output + String.fromCharCode(chr2);
      }
      if (enc4 != 64) {
        output = output + String.fromCharCode(chr3);
      }
    }
    output = _utf8_decode(output);
    return output;
  }

  // private method for UTF-8 encoding
  const _utf8_encode = function (string) {
    string = string.replace(/\r\n/g,"\n");
    var utftext = "";
    for (var n = 0; n < string.length; n++) {
      var c = string.charCodeAt(n);
      if (c < 128) {
        utftext += String.fromCharCode(c);
      } else if((c > 127) && (c < 2048)) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      } else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }

    }
    return utftext;
  }

  // private method for UTF-8 decoding
  const _utf8_decode = function (utftext) {
    var string = "";
    var i = 0;
    var c = 0;
    var c1 = c1;
    var c2 = 0;
    while ( i < utftext.length ) {
      c = utftext.charCodeAt(i);
      if (c < 128) {
        string += String.fromCharCode(c);
        i++;
      } else if((c > 191) && (c < 224)) {
        c2 = utftext.charCodeAt(i+1);
        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
        i += 2;
      } else {
        c2 = utftext.charCodeAt(i+1);
        c3 = utftext.charCodeAt(i+2);
        string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
        i += 3;
      }
    }
    return string;
  }
}

/**
 * decodeBase64 调用
 * @param text
 */
function decodeBase64 (text) {
  const base = new Base64()
  return base.decode(text)
}
/**
 * 判断环境
 * @param selector
 * @returns {Promise<any>}
 */
function boundingClientRect (selector) {
  // 在mpvue中target被设置为global
  if (!window) {
    return new Promise((resolve, reject) => {
      const query = wx.createSelectorQuery()
      query.select(selector).boundingClientRect(res => {
        resolve(res)
      }).exec()
    })
  }

  return new Promise((resolve, reject) => {
    resolve(document.querySelector(selector).getBoundingClientRect())
  })
}
/**
 * @desc 生成滑动动画
 * @param {number} speed - 动画运行时间
 * @param {number} transX - 横向偏移量
 * @return {object} animationData
 */
function slideAnimate (speed, transX, selector) {
  if (!window) {
    const animation = wx.createAnimation({
      transformOrigin: 'left top',
      timingFunction: 'linear',
      duration: speed || 17,
      delay: 0
    })
    animation.translateX(transX).step()
    return animation.export()
  }

  // 非微信环境就操作dom
  const target = document.querySelector(selector)
  target.setAttribute(
    'style',
    `transform: translateX(${transX}px); transition: transform ${speed || 17}ms linear`
  )
  return null
}
export default {
  validator,
  debounce,
  shuffle,
  addChoiceLetter,
  addIndeterminateChoice,
  countTime,
  wordSort,
  wordFilter,
  bringToTop,
  decodeBase64,
  boundingClientRect,
  slideAnimate
}
