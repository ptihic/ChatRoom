<template>

  <section>
    <router-view></router-view>
  </section>
</template>
<script>
  var tools = require("../tools");
  module.exports = {

    data: function () {
      return {
        userInfo: this.userInfo
      }
    },
    route: {
      data: function (transition) {
        this.userInfo = tools.getUserInfo();
      }
    }
  }
</script>
