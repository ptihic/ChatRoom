<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div class="am-u-md-4 blog-sidebar" style="background: #eeeeee;height: 1000px">
    <div class="am-panel-hd">好友列表</div>
    <ul class="am-list admin-sidebar-list" id="collapase-nav-1">
      <li class="am-panel">
        <ul class="am-list " id="role-nav">
          <template v-for='friend  in friendList'>
            <li v-on:click="talkingTo(friend.id,friend.FriendName)"><a>{{friend.FriendName}}</a></li>
          </template>
        </ul>
      </li>
    </ul>
  </div>
</template>
<style>

</style>
<script>
  module.exports = {
    data: function () {
      var $this = this;
      return {
        friendList: $this.friendList
      }
    },
    props: ["friendList"],
    methods: {
      talkingTo: function (UserId, FriendName) {
        var $this = this;
        $this.$dispatch("talking", UserId, FriendName);
      }
    }
  }
</script>
