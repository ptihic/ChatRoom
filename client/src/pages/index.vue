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
    height: 600px;
    background: #eee;
  }
  .text {
    background: #eee;
    height: 200px;
  }
</style>
<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div class="am-g am-g-fixed blog-g-fixed">
    <div class="am-u-md-7">
      <h3 class="am-article-title blog-title">
        <a href="#"> 欢迎登录聊天室 </a>
      </h3>
      <hr></hr>
      <div class="chatroom">
        <div class="am-g content" id="content">
          <div class="am-u-lg-12 am-center">
            <ul class="am-comments-list am-comments-list-flip">
            <template v-for='msg  in postMsgList'>
            <li class="am-comment " v-bind:class="[msg.userId==IUserId?'am-comment-flip':'']">
              <a href="#link-to-user-home">
                <img src="http://s.amazeui.org/media/i/demos/bw-2014-06-19.jpg?imageView/1/w/96/h/96" alt="" class="am-comment-avatar" width="48" height="48">
                <div class="am-comment-main">
                  <header class="am-comment-hd">
                    <div class="am-comment-meta">
                      <a href="#link-to-user" class="am-comment-author">{{msg.userName}}</a>发表于
                      <time>{{msg.postTime}}</time>
                    </div>
                  </header>
                  <div class="am-comment-bd">
                    <p>{{msg.postMsg}}</p>
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
              <label for="doc-ta-1">请输入对话内容</label>
              </br>
              <!-- <a>
                <img id="icon1" v-bind:src="image1"   alt=""/>
              </a> -->
              <a>
                <!-- <img id="icon2" v-bind:src="image2"  alt=""/> -->
                <div class='img2' ></div>
              </a>
              <input id="txt" type="text"  v-model='newTodo'>

              <a id="link" href="javascript:void(0)" v-on:click.stop="addTodo">发送</a>
            </div>
          </form>
        </div>
        <hr class="am-article-divider blog-hr">
      </div>
    </div>
    <div class="am-u-md-4 blog-sidebar" style="background: #eeeeee">
      <div class="am-panel-hd">好友列表</div>
      <ul class="am-list admin-sidebar-list" id="collapase-nav-1">
        <li class="am-panel">
        <a data-am-collapse="{parent: '#collapase-nav-1', target: '#role-nav'}">
          冰淇淋 <i class="am-icon-angle-right am-fr am-margin-right"></i>
        </a>
        <ul class="am-list am-collapse admin-sidebar-sub" id="role-nav">
          <template v-for='friend  in friendList'>
            <li><a>{{friend.FriendName}}</a></li>
          </template>
        </ul>
        </li>
      </ul>
    </div>
  </div>
</template>
<style lang='less'>
.img2{
  background: url("1.png") no-repeat;
  display: inline-block;
  width: 25px;
  height: 25px;
}

</style>
<script type="text/javascript">
var def={
  userId:null,
  username:null,
  postMsg:null,
  postTime:null
}

var tools=require("../tools.js");
var defIco="/userImage/userid_360x360.png";
module.exports = {
    data:function(){
      return {
        friendId:2,
        friendName:'friend',
        image1:require("./3.png"),
        image2:require("./2.png"),
        newTodo:"",
        IUserId:1,
        IUserName:'me',
        postMsgList:[{
          userId:1,
          userName:'lss',
          postMsg:'Hello',
          postTime:'2016-01-18 08:01:00'
        },
        {
          userId:2,
          userName:'zx',
          postMsg:'Hi',
          postTime:'2016-01-18 08:02:00'
        },
        {
          userId:1,
          userName:'lss',
          postMsg:'Are you ok?',
          postTime:'2016-01-18 08:03:00'
        }],
        friendList:this.friendList
      };

    },
    methods: {
      addTodo: function () {
        var $this=this;
        var text = $this.newTodo.trim()
        if (text) {
          $this.$http.post(tools.resolveUrl("/Msgs/"),{
            userId:$this.IUserId,
            userName:$this.IUserName,
            postMsg:text,
            postTime:tools.getCurrentDateTimeStr()
          },function(){
          $this.postMsgList.push()
          })

        }
        $this.newTodo='';
      },
      show: function () {
      }
    },
    created:function (argument) {
      // body...
  var $this=this;
      $this.$http.get(tools.resolveUrl("/Friends"),{
          filter:{
            where:{
              UserId:0
            }
          }
      },function(res){
      $this.friendList=res;
      })

    }

}

</script>
