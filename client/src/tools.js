/**
 * Created by bqxu on 15/12/14.
 */
var config = require("./config.js");
var pub = {};
pub.isNotEmptyStr = function (str) {
  return (typeof str == 'string' && str.length > 0);
};

pub.isNotObj = function (obj) {
  return (typeof obj == "undefined" || obj == null);
};

pub.getCurrentDateTimeStr = function () {
  return pub.getDateTimeStr(new Date());
};

pub.getDateTimeStr = function (currentDate) {
  currentDate = new Date(currentDate);
  var fmt = "yyyy-MM-dd hh:mm:ss";
  var o = {
    "M+": currentDate.getMonth() + 1, //月份
    "d+": currentDate.getDate(), //日
    "h+": currentDate.getHours(), //小时
    "m+": currentDate.getMinutes(), //分
    "s+": currentDate.getSeconds(), //秒
    "q+": Math.floor((currentDate.getMonth() + 3) / 3), //季度
    "S": currentDate.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (currentDate.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
};

pub.getDateStr = function (currentDate) {
  currentDate = new Date(currentDate);
  var fmt = "yyyy-MM-dd";
  var o = {
    "M+": currentDate.getMonth() + 1, //月份
    "d+": currentDate.getDate(), //日
    "h+": currentDate.getHours(), //小时
    "m+": currentDate.getMinutes(), //分
    "s+": currentDate.getSeconds(), //秒
    "q+": Math.floor((currentDate.getMonth() + 3) / 3), //季度
    "S": currentDate.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (currentDate.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}


pub.getUUid = function (len, radix) {
  var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  var uuid = [], i;
  radix = radix || chars.length;

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
  } else {
    // rfc4122, version 4 form
    var r;

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16;
        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
      }
    }
  }
  return uuid.join('');
};

var CurrentContext = {};
pub.checkCurrentContext = function () {
  if (!CurrentContext.id) {
    CurrentContext.id = pub.getUUid();
  }
  return CurrentContext;
};

pub.putCurrentContext = function (name, obj) {
  var context = pub.checkCurrentContext();
  context[name] = obj;
};

pub.getCurrentContext = function (name) {
  var context = pub.checkCurrentContext();
  return context[name];
};

pub.getUserInfo = function () {
  return pub.getCurrentContext("userInfo");
};

pub.setUserInfo = function (obj) {
  if (obj != null) {
    obj.userRule = obj.userRule || [];
    var rule = obj.userRule;
    obj.allowIn = pub.inArray(rule, "producer") || pub.inArray(rule, "keeper");
    obj.allowOut = pub.inArray(rule, "consumer");
    obj.allowAlarm = pub.inArray(rule, "keeper");
    obj.allowLogout = true;
    obj.allowSys = rule.length == 3;
  }
  pub.putCurrentContext("userInfo", obj);
};


pub.checkRule = function (module) {
  var userInfo = pub.setUserInfo();
  if (module == 'sys') {
    return userInfo && userInfo.userRule.length == 3;
  } else if (module == "logout") {
    return userInfo != null;
  } else {
    return tools.inArray(userInfo, module)
  }
};

pub.inArray = function (arr, el, comp) {
  arr = arr || [];
  for (var i = 0, k = arr.length; i < k; i++) {
    if (typeof comp == "function") {
      if (comp(arr[i], el)) {
        return true;
      }
    }
    else if (el == arr[i]) {
      return true;
    }
  }
};

pub.resolveUrl = function (url) {
  while (url.indexOf("/") == 0) {
    url = url.substring(1, url.length);
  }
  return config.apiUrl + "/" + url
};

pub.resolveScanUrl = function (url) {
  while (url.indexOf("/") == 0) {
    url = url.substring(1, url.length);
  }
  return config.scanUrl + "/" + url
};

pub.uploadFile = function (url) {
  while (url.indexOf("/") == 0) {
    url = url.substring(1, url.length);
  }
  return config.apiUrl + "/" + url
};

pub.loadCode = function ($http, codeType, cb) {
  $http.get(this.resolveUrl("/Codes"), {
    filter: {
      where: {
        codeType: codeType
      }
    }
  }, function (data, status, request) {
    cb(data)
  }).error(function (data, status, request) {

  })
};

pub.buildMap = function (list, code, codeName) {
  var map = {};
  list = list || [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    map[item[code]] = item[codeName];
  }
  return map;
};

pub.config = config;

pub.widthList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
pub.heightList = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

/**
 * @return {number}
 */
pub.WH2Index = function (h, w) {
  return (h.charCodeAt() - 65 ) * pub.widthList.length + parseInt(w) - 1;
};

pub.selectArg = function (id, name, unSelectedCode, unSelectedName, selected, selectedName) {
  var arg = {};
  arg["id"] = id;
  arg["text"] = name;
  arg["selected"] = {};
  arg["selected"][id] = selected;
  arg["selected"][name] = selectedName;
  arg["unSelected"] = {};
  arg["unSelected"][id] = unSelectedCode;
  arg["unSelected"][name] = unSelectedName;
  return arg;
}
module.exports = pub;
