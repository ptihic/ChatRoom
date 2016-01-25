/**
 * Created by bqxu on 15/12/10.
 */
var Vue = require('vue');
var VueRouter = require('vue-router');
var VueResource = require('vue-resource');
var tools = require('./tools');
var auth = require('./auth');
var socket = require('socket.io-client');

Vue.use(function(vue){
  vue.prototype.$socket=socket;
});

//layout
Vue.use(VueRouter);
Vue.use(VueResource);
//component

//main
var App = Vue.extend({
  events: {
    link: function (pathName, params) {
      router.go({
        name: pathName,
        params: params || {}
      })
    }
  }
});

var router = new VueRouter();
router.map({
  '/': {
    name: "root",
    component: require("./layouts/root.vue"),
    subRoutes: {
      "login": {
        name: "login",
        component: require("./pages/login.vue")
      },
        "sign": {
          name: "sign",
          component: require("./pages/sign.vue")
        },
          "chatroom": {
            name: "chatroom",
            component: require("./pages/index.vue")
          }
    },
    "*": {
      "name": "40x",
      component: require("./pages/40x.vue")
    }
  }
});

router.redirect({
  "/":"/chatroom"
})

router.beforeEach(function (transition) {
  if (tools.config.auth.ignoreAll) {
    transition.next()
  } else if (tools.inArray(tools.config.auth.ignore, transition.to.path)) {
    transition.next()
  } else {
    auth.valid(transition.to.router.app, function () {
      transition.next();
    }, function () {
      transition.redirect("/login")
    });
  }
});

router.start(App, 'body');
