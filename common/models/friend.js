var tools = require("../../tools");
var async = require("async");
module.exports = function (Friend) {

  Friend.buddy = function (friendId, cb) {
    var userInfo = tools.getUser();
    var userId = userInfo.userId;
    var userName = userInfo.userName;
    var User = tools.getModelByName("User");
    var Group = tools.getModelByName("Group");
    User.findOne({
      where: {
        id: friendId
      }
    }).then(function (user) {
      if (!user) {
        return cb(tools.error("undefined userId"));
      }
      var friendName = user.userName;
      var groupId = tools.getUUid();
      async.series([
        function (cbs) {
          Friend.findOne({
            where: {
              UserId: userId,
              FriendId: friendId
            }
          }).then(function (friend) {
            if (friend) {
              return cbs(tools.error("is Friend now", 200));
            }
            Group.create({
              GroupId: groupId,
              UserId: userId
            }).then(function () {
              Friend.create({
                GroupId: groupId,
                UserId: userId,
                FriendId: friendId,
                FriendName: friendName
              }).then(function (friend) {
                cbs(null);
              }).catch(function (err) {
                cbs(err);
              });
            }).catch(function (err) {
              cbs(err);
            });
          })
        },
        function (cbs) {
          Friend.findOne({
            where: {
              UserId: friendId,
              FriendId: userId
            }
          }).then(function (friend) {
            if (friend) {
              return cb(tools.error("is Friend now", 200));
            }
            Group.create({
              GroupId: groupId,
              UserId: friendId
            }).then(function () {
              Friend.create({
                GroupId: groupId,
                UserId: friendId,
                FriendId: userId,
                FriendName: userName
              }).then(function (friend) {
                cbs(null);
              }).catch(function (err) {
                cbs(err);
              });
            }).catch(function (err) {
              cbs(err);
            });
          })
        }
      ], function (err, result) {
        if (err) {
          return cb(err);
        }
        cb(null, "success");
      });
    }).catch(function (err) {
      cb(err);
    });
  }


  Friend.remoteMethod("buddy", {
    accepts: [
      {arg: 'friendId', type: 'number'}
    ],
    returns: {arg: 'state', type: 'string'},
    http: {path: "/buddy", verb: "post"}
  });

  Friend.mine = function (cb) {
    var userInfo = tools.getUser();
    var userId = userInfo.userId;
    Friend.find({
      where: {
        UserId: userId
      }
    }).then(function (friendList) {
      cb(null, friendList)
    }).catch(function (err) {
      cb(err);
    });
  };

  Friend.remoteMethod("mine", {
    returns: {arg: 'friendList', type: 'array'},
    http: {path: "/mine", verb: "get"}
  });
}
;
