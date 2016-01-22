<template>
  <div class="am-g am-g-fixed" id="bd-warp">
    <div class="am-u-md-9 am-u-md-push-3 doc-content">
      <section>
        <router-view>

        </router-view>
      </section>
    </div>
    <div class="am-u-md-3 am-u-md-pull-9 ">
      <nav id="ge-nav" class="amz-sidebar">
        <ge-nav v-bind:module-name="moduleName">

        </ge-nav>
      </nav>
    </div>
  </div>
</template>
<style>
  #bd-warp {
    min-width: 1000px;
  }
</style>
<script>
  var geNav = require("../components/nav.vue");
  var tools = require("../tools");
  module.exports = {
    components: {
      "ge-nav": geNav
    },
    compiled: function () {
    },
    data: function () {
      return {
        moduleName: this.moduleName
      }
    },
    route: {
      data: function (transition) {
        var $this = this;
        var to = transition.to;
        if (to.matched && to.matched[1]) {
          $this.moduleName = transition.to.matched[1].handler.name;
        }
      }
    }
  }
</script>
