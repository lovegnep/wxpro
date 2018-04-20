const Utils = require('./utils/util');
const Apiconfig = require('./api/config');
//app.js
App({
  onLaunch: function () {
    let self = this;

    // 登录
    /*wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
          self.globalData.code = res.code;

      }
    })*/
    // 获取用户信息
    /*wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              self.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (code !== -1) {
                  Utils.request(Apiconfig.Login,{code:res.code,userInfo:res.userInfo},"POST").then(function(userinfo){
                    self.globalData.user = userinfo;
                    console.log('app get back user success: ',userinfo);
                  }).catch(function(err){

                      console.log('app get back user failed: ',err);
                  })
              }else{
                  console.log('app get back user faile because of code not exist.');
              }
            }
          })
        }
      }
    })*/
  },
  globalData: {
    userInfo: null,
      code:-1,
      user:null,
      QRList:new Map()
  }
})