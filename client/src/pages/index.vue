<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <div class="am-g am-g-fixed blog-g-fixed">
    <div class="am-u-md-7">
      <h3 class="am-article-title blog-title">
        <a href="#"> 欢迎登录聊天室 </a>
      </h3>
      <hr>

      <div class="" v-for="talkTo in talkTos">
        <span
          v-on:click="talking(talkTo.friendId)"
          v-bind:class="[currentFid==talkTo.friendId?'active':'']"
        >
          {{talkTo.friendName}}
        </span>
      </div>
      <template v-for="talkTo in talkTos">
        <chat-room
          v-show="currentFid==talkTo.friendId"
          v-bind:friend-id="talkTo.friendId"
          v-bind:friend-name="talkTo.friendName"
          v-on:posting="posting"
        >

        </chat-room>
      </template>
    </div>
    <friend-list
      v-bind:friend-list="friendList"
      v-on:talking="talking"

    >
    </friend-list>
  </div>
</template>
<style media="screen">
  ul.friendlist a {
    /*color: #fff;*/
  }

  ul.friendlist li {
    list-style: none;
  }

  .chatroom {
    /*background: #f88;*/
  }

  .content {
    height: 300px;
    background: #eee;
  }

  .text {
    background: #eee;
    height: 200px;
  }
</style>
<style lang='less'>
  .img2 {
    background: url("1.png") no-repeat;
    display: inline-block;
    width: 25px;
    height: 25px;
  }
</style>
<script type="text/javascript">
  var def = {
    userId: null,
    username: null,
    postMsg: null,
    postTime: null
  }

  var tools = require("../tools.js");
  var defIco = "/userImage/userid_360x360.png";
  module.exports = {
    components: {
      "friend-list": require("../components/friendList.vue"),
      "chat-room": require("../components/chatRoom.vue")
    },
    data: function () {
      var $this = this;
      if (!$this.talkTos) {
        $this.talkTos = [];
      }
      return {
        talkTos: $this.talkTos,
        chat: this.chat,
        currentFid: null,
        image1: require("./3.png"),
        image2: require("./2.png"),
        newTodo: "",
        IUserId: 1,
        IUserName: 'me',
        postMsgList: [{
          userId: 1,
          userName: 'lss',
          postMsg: '',
          postTime: '2016-01-18 08:01:00'
        }],
        friendList: this.friendList
      };
    },
    methods: {
      talking: function (friendId, friendName) {
        var $this = this;
        var talkTos = $this.talkTos;
        var tl = talkTos.length;
        var flag = true;
        while (tl--) {
          var talkTo = talkTos[tl];
          if (talkTo.friendId == friendId) {
            flag = false;
            break;
          }
        }
        if (flag) {
          talkTos.push({
            friendId: friendId,
            friendName: friendName
          })
        }
        $this.currentFid = friendId;
        var $chat = $this.chat;
        //loadMsg;
      },
      posting: function (friendId, msg) {

      }
    },
    ready: function () {
      var $this = this;
      //进入页面
      //todo ：
      //1.connect 告诉大家我上线了
      //2.注册事件，for 接受消息
      var $chat = $this.chat = $this.$socket.connect('http://localhost:3001/chat');
      $chat.on('connect', function (res) {
        $chat.emit('hi', function (res) {
          console.log(res);
        });
      });
    },
    created: function (argument) {
      // body...
      var $this = this;
      $this.$http.get(tools.resolveUrl("/Friends"), {
        filter: {
          where: {
            UserId: 0
          }
        }
      }, function (res) {
        $this.friendList = res;
      })
    }
  }

</script>
