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

  var postAllMsg = function (socket) {
    var Msg = tools.getModelByName("Msg");
    // body...
    //
    Msg.find({
      where: {
        and: [{
          UserId: 1
        },
          {
            id: {
              between: [1,2]
            }
          }]
      },
      include: {},
      limit: 2,
      order: ['PostTime ASC']
    }).then(function (msgList) {
      // body...
      socket.emit('AllMsg', msgList);
    }).catch(function (err) {
      // body...
      socket.emit('AllMsg', []);
    })
  }

  var chat = io
    .of('/chat')
    .on('connection', function (socket) {

      socket.on("postMsg", function (msg, cb) {
        var Msg = tools.getModelByName("Msg");
        // PersistedModel
        // create
        //updateAll

        //find
        Msg.create({
          UserId: msg.userId,
          UserName: msg.userName,
          PostMsg: msg.postMsg,
          PostTime: tools.getCurrentDateTimeStr()
        }).then(function (data) {
          // body...
          console.log(data);
          cb(data);
          postAllMsg(socket);
        }).catch(function (err) {
          // body...
          cb(err);
        })
      })
      // body...
      postAllMsg(socket);
    });
};
