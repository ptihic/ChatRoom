var tools = require("./tools");
module.exports = {
  valid: function (app, success, error) {
    if (!tools.getUserInfo()) {
      app.$http.post(tools.resolveUrl("/Users/info"), function (data, status, request) {
        if (data.userInfo) {
          tools.setUserInfo(data.userInfo);
          success()
        } else {
          tools.setUserInfo(null);
          error();
        }
      }).error(function () {
        error();
      });
    } else {
      success();
    }
  },
  login: function (userInfo) {
    tools.setUserInfo(userInfo);
  },
  loginOut: function () {
    tools.setUserInfo(null);
  }
};
