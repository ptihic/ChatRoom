<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div class="chatroom">
    <div class="am-g content" id="content">
      <div class="am-u-lg-12 am-center">
        <ul class="am-comments-list am-comments-list-flip">
          <template v-for='msg  in msgList'>
            <li class="am-comment " v-bind:class="[msg.userId==IUserId?'am-comment-flip':'']">
              <a href="#link-to-user-home">
                <img src="http://s.amazeui.org/media/i/demos/bw-2014-06-19.jpg?imageView/1/w/96/h/96" alt=""
                     class="am-comment-avatar" width="48" height="48">
                <div class="am-comment-main">
                  <header class="am-comment-hd">
                    <div class="am-comment-meta">
                      <a href="#link-to-user" class="am-comment-author">{{msg.UserName}}</a>发表于
                      <time>{{msg.PostTime}}</time>
                    </div>
                  </header>
                  <div class="am-comment-bd">
                    <p>{{msg.PostMsg}}</p>
                  </div>
                </div>
            </li>
          </template>
        </ul>
        <p></p>
      </div>
    </div>
    <hr class="am-article-divider blog-hr">
    <div class="text">
      <form class="" action="index.html" method="post">
        <div class="am-form-group">
          <label>请输入对话内容</label>
          </br>
          <!-- <a>
            <img id="icon1" v-bind:src="image1"   alt=""/>
          </a> -->
          <a>
            <!-- <img id="icon2" v-bind:src="image2"  alt=""/> -->
            <div class='img2'></div>
          </a>
          <input id="txt" type="text" v-model='cMsg'>

          <a id="link" href="javascript:void(0)" v-on:click="postMsg">发送</a>
        </div>
      </form>
    </div>
    <hr class="am-article-divider blog-hr">
  </div>
</template>
<script>
  module.exports = {
    data: function () {
      var $this = this;
      return {
        friendList: $this.friendList,
        groupId: $this.groupId,
        friendId: $this.friendId,
        friendName: $this.friendName,
        msgList: $this.msgList,
        cMsg: $this.cMsg
      }
    },
    props: ["msgList", "friendId", "groupId", "friendName"],
    methods: {
      postMsg: function () {
        var $this = this;
        console.log($this.groupId);
        console.log($this.cMsg);
        if ($this.cMsg) {
          $this.$dispatch("posting", $this.groupId, $this.cMsg);
        }
      }
    },
    create: function () {
      console.log(this.groupId);
    }
  }
</script>
