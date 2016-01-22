<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div class='am-container'>
    <div class='am-u-md-6 am-u-sm-centered'>
      <h1>登陆聊天室</h1>
      <form class="am-form"
            data-am-validator="true"
            accept-charset="UTF-8"
            v-on:submit.prevent="login"
      >

        <div class='am-form-group'>
          <label for="userName">账号</label>
          <input class="am-radius" required="required" type="text" v-model="username" id="userName"/>
        </div>
        <div class='am-form-group'>
          <label for="passWord">密码</label>
          <input class="am-radius" required="required" type="password" v-model="password" id="passWord"/>
        </div>
        <div class='am-form-group'>
          <label for="remember-me">
            <input id="remember-me" type="checkbox" v-model="autoLogin">
            记住密码
          </label>
        </div>
        <div class='am-form-group'>
          <input type="submit" name="commit" value="登陆" id="sessions-new-login-btn"
                 class="am-btn am-btn-block am-btn-primary am-radius"/>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
  var tools = require("../tools");
  var auth = require("../auth");
  module.exports = {
    data: {
      username: null,
      password: null,
      autoLogin: null
    },
    methods: {
      login: function () {
        var $this = this;
        $this.$http.post(tools.resolveUrl("/Users/login"), {
          username: $this.username,
          password: $this.password,
          autoLogin: $this.autoLogin
        }, function (data, status, request) {
          $this.$dispatch('link', "root");
        }).error(function (data, status, request) {

        })
      }
    }
  }
</script>
