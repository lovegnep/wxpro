//index.js
//获取应用实例
const app = getApp()
const Api = require('../../api/api');
const Config = require('../../config');
const Utils = require('../../utils/util');
const ApiConfig = require('../../api/config');

Page({
    data: {
        motto: 'Hello World',
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        QRList:[]
    },
    //事件处理函数
    bindViewTap: function () {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },
    onLoad: function () {
        let self = this;
        wx.login({
            success: function(res) {
              if (res.code) {
                self.globalData.code = res.code;
                wx.getUserInfo({
                    withCredentials:true,
                    success: function(res) {
                      self.globalData.wxuserdata = res.userInfo;
                      console.log('wxuserinfo success:',res);
                      Utils.request(ApiConfig.Login,{code:self.globalData.code,userInfo:res},"POST")
                      .then(function(backUserInfo){
                        self.globalData.backUserInfo = backUserInfo.userInfo;
                        console.log('backUserInfo:',backUserInfo);
                      }).catch(function(err){
                          console.log('req ',ApiConfig.Login, "error:",err);
                      });
                    }
                  })
                
              } else {
                console.log('登录失败！' + res.errMsg)
              }
            }
          });
    },
    getUserInfo: function (e) {
        console.log(e)
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    },
    globalData:{
        code:-1,
        wxuserdata:null,
        backUserInfo:null
    }
})
