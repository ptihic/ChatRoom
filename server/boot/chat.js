/**
 * Created by bqxu on 16/1/24.
 */
var tools = require("../../tools");
module.exports = function (app) {

  var cApp = require('http').createServer(handler);
  var io = require('socket.io')(cApp);

  cApp.listen(3001);

  function handler (req, res) {
    res.send("ok");
  }

  var chat = io
    .of('/chat')
    .on('connection', function (socket) {
      socket.emit('hi', {
        that: 'only'
        , '/chat': 'will get'
      });
      chat.on("hi",function(res,fn){
        fn(res);
      })
    });
};
