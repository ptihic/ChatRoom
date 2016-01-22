<template xmlns:v-bind="http://www.w3.org/1999/xhtml" xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div class="am-collapse am-topbar-collapse">
    <ul class="am-nav am-nav-pills am-topbar-nav">
      <li
      >
        <a
        >HOME PAGE</a>
      </li>
    </ul>

    <div class="am-topbar-right">
      <ul class="am-nav am-nav-pills am-topbar-nav">
        <li
        >
          <a>
            {{userInfo.userName}}
          </a>
        </li>
        <li
          v-link="{name:'in',activeClass: 'am-active'}"
          v-if="userInfo.allowIn"
        >
          <button v-on:click="logout()" class="am-btn am-topbar-btn am-btn-sm"
                  v-if="userInfo.allowLogout"
          >注销
          </button>
        </li>
        <li
          v-link="{name:'out',activeClass: 'am-active'}"
          v-if="userInfo.allowOut"
        >
          <button class="am-btn am-topbar-btn am-btn-sm"
                  v-if="userInfo.allowSys"
                  v-link="{name:'sys',activeClass: 'am-active'}"
          >系统设置
          </button>
        </li>
      </ul>


    </div>
  </div>
</template>
<script>
  var tools = require("../tools");
  var auth = require("../auth");
  module.exports = {
    created: function () {

    },
    data: function () {
      return {
        userInfo: this.userInfo
      };
    },
    props: ["userInfo"],
    methods: {
      logout: function () {
        var $this = this;
        $this.$http.post(tools.resolveUrl("/Users/logout"), function (data, status, request) {
          auth.loginOut();
          $this.$dispatch('link', "root");
        })
      }
    }
  }
</script>
