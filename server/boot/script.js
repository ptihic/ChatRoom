/**
 * Created by bqxu on 16/1/5.
 */
var tools = require("../../tools");
module.exports = function (app) {
  var User = tools.getModelByName("User");
  User.findOrCreate({
    "loginName": "Admin",
    "password": "123456",
    "userName": "管理员",
    "state": 1,
    "id": 1
  }, function (err, user) {
    if (err) {
      console.log(err)
    } else {
      console.log(user)
    }
  });
  User.findOrCreate({
    "loginName": "Test",
    "password": "123456",
    "userName": "测试员",
    "state": 1,
    "id": 2
  }, function (err, user) {
    if (err) {
      console.log(err)
    } else {
      console.log(user)
    }
  })
};
