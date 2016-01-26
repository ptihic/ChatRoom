/**
 * Created by bqxu on 16/1/24.
 */
var tools = require("../../tools");
module.exports = function (app) {

  var cApp = require('http').createServer(handler);
  var io = require('socket.io')(cApp);

  cApp.listen(3001);

  function handler(req, res) {
    res.send("ok");
  }

  var userTK = "userTK";
  var GMId = "GMId";

  var setUser = function (socket, user) {
    var handshakeData = socket.request;
    handshakeData["userTK"] = user;
  };

  var getUser = function (socket) {
    var handshakeData = socket.request;
    return handshakeData["userTK"] || {};
  };

  var setGMId = function (socket, groupId, msgId) {
    var handshakeData = socket.request;
    if (!handshakeData["GMId"]) {
      handshakeData["GMId"] = {};
    }
    var GM = handshakeData["GMId"];
    GM[groupId] = msgId;
  };

  var getGMId = function (socket, groupId) {
    var handshakeData = socket.request;
    if (!handshakeData["GMId"]) {
      handshakeData["GMId"] = {};
    }
    var GM = handshakeData["GMId"];
    if (!GM[groupId]) {
      GM[groupId] = 0;
    }
    return GM[groupId];
  };

  var clearGMId = function (socket) {
    var handshakeData = socket.request;
    handshakeData["GMId"] = {};
  };

  var GlobalGM = {};


  var GMIn = function (groupId, socket) {
    if (!GlobalGM[groupId]) {
      GlobalGM[groupId] = [];
    }
    var GM = GlobalGM[groupId];
    GM.push(socket);
  };

  var GMOut = function (groupId, socket) {
    if (!GlobalGM[groupId]) {
      GlobalGM[groupId] = [];
    }
    var GM = GlobalGM[groupId];
    var gl = GM.length;
    while (gl--) {
      var gms = GM[gl];
      if (gms == socket) {
        GM.splice(gl, 1);
        break;
      }
    }
  };

  var GMAction = function (groupId) {
    if (!GlobalGM[groupId]) {
      GlobalGM[groupId] = [];
    }
    var GM = GlobalGM[groupId];
    var gl = GM.length;
    while (gl--) {
      var socket = GM[gl];
      postCM(groupId, socket);
    }
  };

  var postCM = function (groupId, socket) {
    var mid = getGMId(socket, groupId);
    var Msg = tools.getModelByName("Msg");
    Msg.find({
      where: {
        GroupId: groupId,
        id: {
          gt: mid
        }
      },
      Order: ["id ASC"]
    }).then(function (msgList) {
      if (msgList.length > 0) {
        var last = msgList[msgList.length - 1];
        socket.emit("lastMsg", {
          groupId: groupId,
          msgList: msgList
        }, function () {
          setGMId(socket, groupId, last.id);
        })
      }
    }).catch(function (err) {

    })
  };
  var chat = io
    .of('/chat')
    .on('connection', function (socket) {

      socket.on("posting", function (msg, cb) {
        var Msg = tools.getModelByName("Msg");
        // PersistedModel
        // create
        //updateAll
        var user = getUser(socket);
        //find
        Msg.create({
          GroupId: msg.groupId,
          UserId: user.userId,
          UserName: user.userName,
          PostMsg: msg.msg,
          PostTime: tools.getCurrentDateTimeStr()
        }).then(function (data) {
          GMAction(msg.groupId);
          cb(data);
        }).catch(function (err) {
          cb(err);
        })
      });

      socket.on("openGM", function (groupId) {
        GMIn(groupId, socket);
        postCM(groupId, socket);
      });

      socket.on("sign", function (user) {
        setUser(socket, user);
        clearGMId(socket);
      });
      // body...
    });
};
