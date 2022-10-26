const isPrimitiveType = (val, type) => Object.prototype.toString.call(val) === type

export function showNum(num, max = 3) {
  return ("0".repeat(Math.max(0, max - 1)) + num)
}

export function randomNumber(min, max) {
  return parseInt(Math.random() * (max - min + 1) + min);
}

export function randomColor() {
  const r = randomNumber(0, 255);
  const g = randomNumber(0, 255);
  const b = randomNumber(0, 255);

  return 'rgb(' + r + ',' + g + ',' + b + ')';
}

export function isFunction(val) {
  return isPrimitiveType(val, '[object Function]')
}

export function isNumber(val) {
  return isPrimitiveType(val, '[object Number]')
}

export function isObject(val) {
  return isPrimitiveType(val, '[object Object]')
}

export function isArray(arr) {
  if (!arr) return false
  return Array.isArray(arr)
}

export function isString(val) {
  return typeof val === 'string'
}

export function divisionDecimal(value, n) {
  //除法保留n位小数
  return Math.round(value * Math.pow(10, n)) / Math.pow(10, n)
}

export const toFixed = (num, dig = 2) => {
  return isNumOrStrNum(num) ? (Number(num) / 100).toFixed(dig) : 0
}

export const isNumOrStrNum = (numOrStr) => {
  return typeof numOrStr === 'number' || !Number.isNaN(parseInt(numOrStr))
}

export const ArrayHasVal = (arr) => Array.isArray(arr) && arr.length > 0

export function normalizeArray(...args) {
  return args.reduce((ret, item) => ret.concat(item), [])
}

export function replaceVal(url, replaceItem) {
  for (const key in replaceItem) {
    const item = replaceItem[key]
    url = url.replace(key, item)
  }
  return url
}

export function isVideo(url) {
  return /\.(mp4|avi|wmv|mpg|mpeg|mov|rm|ram|swf|flv)/.test(url)
}

export function getUrlParam(name) {
  let value = window.location.search.match(new RegExp("[?&]" + name + "=([^&]*)(&?)", "i"));
  return value ? decodeURIComponent(value[1]) : value;
}

export function encodeUrlParams(data) {
  let arr = [];
  for (let name in data) {
    let item = encodeURIComponent(name);
    let val = data[name];
    if (val !== undefined && val !== '') {
      item += '=' + encodeURIComponent(val);
    }
    arr.push(item);
  }
  return arr.join('&');
}

export function encodeUrlParams(data) {
  let arr = [];
  for (let name in data) {
    let item = encodeURIComponent(name);
    let val = data[name];
    if (val !== undefined && val !== '') {
      item += '=' + encodeURIComponent(val);
    }
    arr.push(item);
  }
  return arr.join('&');
}

export function deep_clone(data, map = new WeakMap()) {
  if (typeof data !== "object") return data;
  let obj = Array.isArray(data) ? [] : {};
  if (map.has(data)) return map.get(data);
  map.set(data, obj);
  // 不采取for in是因为for in会遍历原型上的属性
  Object.keys(data).forEach((k) => (obj[k] = deep_clone(data[k])));
  return obj;
}

export function parseParam(str) {
  let list = (str + '').split('&')
  let param = {}

  list.forEach(item => {
    if (item) {
      let kv = item.split('=')

      if (kv[0]) {
        param[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1] || '')
      }
    }
  })

  return param
}

export function getDateTimeObj(tsOrDate) {
  let date = null;
  if (typeof tsOrDate === 'number') {
    date = new Date(tsOrDate);
  } else if (tsOrDate instanceof Date) {
    date = tsOrDate;
  } else if (tsOrDate === undefined) {
    date = new Date();
  } else {
    throw new Error('[utils.getDateTimeObj] Invalid param type.');
  }

  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();
  let time = date.getTime();

  return {
    Y: year,
    M: month,
    D: day,

    YY: year,
    MM: month < 10 ? '0' + month : month,
    DD: day < 10 ? '0' + day : day,

    h: hours,
    m: minutes,
    s: seconds,

    hh: hours < 10 ? '0' + hours : hours,
    mm: minutes < 10 ? '0' + minutes : minutes,
    ss: seconds < 10 ? '0' + seconds : seconds,

    ts: time,
  }
}

export function unescapeHTML(str) {
  return str
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
}

export function detectOS() {
  let ua = navigator.userAgent;
  let isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows");
  let isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel");
  if (isMac) return "Mac";
  let isUnix = (navigator.platform == "X11") && !isWin && !isMac;
  if (isUnix) return "Unix";
  let isLinux = (String(navigator.platform).indexOf("Linux") > -1);
  if (isLinux) return "Linux";
  if (isWin) {
    let isWin2K = ua.indexOf("Windows NT 5.0") > -1 || ua.indexOf("Windows 2000") > -1;
    if (isWin2K) return "Win2000";
    let isWinXP = ua.indexOf("Windows NT 5.1") > -1 || ua.indexOf("Windows XP") > -1;
    if (isWinXP) return "WinXP";
    let isWin2003 = ua.indexOf("Windows NT 5.2") > -1 || ua.indexOf("Windows 2003") > -1;
    if (isWin2003) return "Win2003";
    let isWinVista = ua.indexOf("Windows NT 6.0") > -1 || ua.indexOf("Windows Vista") > -1;
    if (isWinVista) return "WinVista";
    let isWin7 = ua.indexOf("Windows NT 6.1") > -1 || ua.indexOf("Windows 7") > -1;
    if (isWin7) return "Win7";
    let isWin10 = ua.indexOf("Windows NT 10") > -1 || ua.indexOf("Windows 10") > -1;
    if (isWin10) return "Win10";
  }
  return "other";
}


export function openPage(url, target = '_self', btnText = '继续打开') {
  let win = window.open(url, target);

  if (!win) { //弹窗被浏览器拦截了
    Alert.show({
      title: '弹窗被拦截',
      msg: '为获得更好的游戏体验，请允许浏览器右上角的【弹出式窗口】设置。',
      ok: btnText,
      showClose: 1,
      onOK() {
        win = window.open('', target);
        setTimeout(() => win.location.href = url, 0);
      }
    })
  }
}

export function base64_decode(input) {
  // 解码，配合decodeURIComponent使用
  var base64EncodeChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
  var output = ''
  var chr1, chr2, chr3
  var enc1, enc2, enc3, enc4
  var i = 0
  input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '')
  while (i < input.length) {
    enc1 = base64EncodeChars.indexOf(input.charAt(i++))
    enc2 = base64EncodeChars.indexOf(input.charAt(i++))
    enc3 = base64EncodeChars.indexOf(input.charAt(i++))
    enc4 = base64EncodeChars.indexOf(input.charAt(i++))
    chr1 = (enc1 << 2) | (enc2 >> 4)
    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2)
    chr3 = ((enc3 & 3) << 6) | enc4
    output = output + String.fromCharCode(chr1)
    if (enc3 != 64) {
      output = output + String.fromCharCode(chr2)
    }
    if (enc4 != 64) {
      output = output + String.fromCharCode(chr3)
    }
  }
  return utf8_decode(output)
}

function utf8_decode(utftext) {
  // utf-8解码
  var string = ''
  let i = 0
  let c = 0
  let c1 = 0
  let c2 = 0
  while (i < utftext.length) {
    c = utftext.charCodeAt(i)
    if (c < 128) {
      string += String.fromCharCode(c)
      i++
    } else if (c > 191 && c < 224) {
      c1 = utftext.charCodeAt(i + 1)
      string += String.fromCharCode(((c & 31) << 6) | (c1 & 63))
      i += 2
    } else {
      c1 = utftext.charCodeAt(i + 1)
      c2 = utftext.charCodeAt(i + 2)
      string += String.fromCharCode(((c & 15) << 12) | ((c1 & 63) << 6) | (c2 & 63))
      i += 3
    }
  }
  return string
}

export function logcss(color, bgColor, borderRadius = false) {
  let css = 'padding:1px';
  if (color) css += ';color:' + color;
  if (bgColor) css += ';background:' + bgColor;
  if (borderRadius) css += ';border-radius:3px';
  return css;
}

export function once(fn) {
  let result, executed;

  return function () {
    if (!executed) {
      executed = true
      result = fn.apply(this, arguments)
    }

    return result
  }
}

export function debounce(fn, delay, immediate) {
  let timer = null

  let debounced = function () {
    if (timer) clearTimeout(timer);

    let context = this
    let args = arguments

    if (immediate) {
      if (!timer) fn.apply(context, args);

      timer = setTimeout(function () {
        timer = null
      }, delay)
    } else {
      timer = setTimeout(function () {
        timer = null
        fn.apply(context, args)
      }, delay)
    }

    return context
  }

  debounced.cancel = function () {
    clearTimeout(timer)
    timer = null
  }

  return debounced
}

export function throttle(fn, delay) {
  let firsTime = true
  let timer = null
  let args = null
  let context = null

  function throttled() {
    args = arguments
    context = this

    if (timer) {
      return
    }

    timer = setTimeout(function () {
      timer = null
      fn.apply(context, args)
      context = args = null
    }, firsTime ? 0 : delay)

    if (firsTime) firsTime = false;
  }

  throttled.cancel = function () {
    clearTimeout(timer)
    timer = context = args = null
  }

  return throttled
}

export function cooldown(fn, delay) {
  let timer = null

  function cooldownFunc() {
    if (timer) {
      return
    }

    fn.apply(this, arguments);

    timer = setTimeout(function () {
      timer = null
    }, delay)
  }

  cooldownFunc.cancel = function () {
    clearTimeout(timer)
    timer = null
  }

  return cooldownFunc;
}

export function scrollLoad(callback, triggerHeight = 0) {
  return (function (callback) {
    const onScroll = debounce(e => {
      /* 滚动条的垂直位置 */
      let scrolltop = document.documentElement.scrollTop || document.body.scrollTop;
      /* 整个页面的正文高度 */
      let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      /* 可见区域高度 */
      let clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
      /* 滚动到底部了 */
      let scrollBottom = (scrolltop + clientHeight + triggerHeight) >= scrollHeight;
      /* 执行回调 */
      scrollBottom && callback && callback();
    }, 200);
    window.addEventListener('scroll', onScroll);
    return onScroll;
  }(callback));
}

export function getRandomStr(len) {
  const _len = parseInt(len) || 0;
  if (_len <= 0) {
    return '';
  }
  let str = [];
  while (str.length < _len) {
    let r = Math.random() * 62 | 0;
    if (r < 10) {
      str.push(r);
    } else if (r < 36) {
      str.push(String.fromCharCode(r + 55));
    } else {
      str.push(String.fromCharCode(r + 61));
    }
  }
  return str.join('');
}
