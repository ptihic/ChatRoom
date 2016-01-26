<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <div class="am-g am-g-fixed blog-g-fixed">
    <div class="am-u-md-7">
      <h3 class="am-article-title blog-title">
        <a href="#"> 欢迎登录聊天室 </a>
      </h3>
      <hr>

      <div class="" v-for="talkTo in talkTos">
        <span
          v-on:click="talking(talkTo.friendId,talkTo.friendName,talkTo.groupId)"
          v-bind:class="[currentGid==talkTo.groupId?'active':'']"
        >
          {{talkTo.friendName}}
        </span>
      </div>
      <template v-for="talkTo in talkTos">
        <chat-room
          v-show="currentGid == talkTo.groupId"
          v-bind:friend-id="talkTo.friendId"
          v-bind:group-id="talkTo.groupId"
          v-bind:friend-name="talkTo.friendName"
          v-bind:msg-list="talkTo.msgList"
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
        currentGid: null,
        image1: require("./3.png"),
        image2: require("./2.png"),
        newTodo: "",
        IUserId: 1,
        IUserName: 'me',
        friendList: this.friendList
      };
    },
    methods: {
      talking: function (friendId, friendName, groupId) {
        var $this = this;
        var talkTos = $this.talkTos;
        var tl = talkTos.length;
        var flag = true;
        while (tl--) {
          var talkTo = talkTos[tl];
          if (talkTo.groupId == groupId) {
            flag = false;
            break;
          }
        }
        var $chat = $this.chat;
        if (flag) {
          talkTos.push({
            friendId: friendId,
            friendName: friendName,
            groupId: groupId,
            msgList: []
          });
          $chat.emit("openGM", groupId);
        }
        $this.currentGid = groupId;
        //loadMsg;
      },
      posting: function (groupId, msg) {
        var $this = this;
        var $chat = $this.chat;
        $chat.emit('posting', {
          groupId: groupId,
          msg: msg
        }, function (res) {
          console.log(res);
        });
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
        var userInfo = tools.getUserInfo();
        $chat.emit('sign', {userId: userInfo.userId, userName: userInfo.userName});

        $chat.on("lastMsg", function (res, cb) {
          console.log(res);
          var groupId = res.groupId;
          var msgList = res.msgList;
          var talkTos = $this.talkTos;
          var tl = talkTos.length;
          var talkTo;
          while (tl--) {
            var _talkTo = talkTos[tl];
            if (_talkTo.groupId == groupId) {
              talkTo = _talkTo;
              break;
            }
          }
          if (!talkTo) {
            //单独处理
            return;
          }
          for (var i = 0; i < msgList.length; i++) {
            talkTo.msgList.push(msgList[i]);
          }
          cb();
        });
      });
    },
    created: function (argument) {
      // body...
      var $this = this;
      $this.$http.get(tools.resolveUrl("/Friends/mine"), function (res) {
        $this.friendList = res.friendList;
      })
    }
  }

</script>
