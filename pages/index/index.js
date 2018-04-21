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
        QRList:[],
        Swiper_QRList:[]
    },
    //事件处理函数
    bindViewTap: function () {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },
    updateGlobal:function(qrlist){
        let qrmap = app.globalData.QRList;
        qrlist.forEach(function(qr){
            console.log("type of _id:",typeof qr._id);
            qrmap.set(qr._id, qr);
        });
    },
    updateGlobalUser:function(guserinfo){
        if(guserinfo){
            app.globalData.user = guserinfo.userInfo;
        }

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
                          self.updateGlobalUser(backUserInfo);
                        self.globalData.backUserInfo = backUserInfo.userInfo;
                          wx.setStorageSync('sessionkey',backUserInfo.sessionkey);
                        console.log('backUserInfo:',backUserInfo);
                        Api.getAllQRList(0,"-viewCount",5).then(function(res){
                            if(res.status === 1){
                                console.log('请求二维码成功');
                                res.data.forEach(function(item){
                                    item.link = '/pages/qr/index?_id='+item._id;
                                })
                                self.updateGlobal(res.data);
                                self.setData({Swiper_QRList:res.data});
                            }else{
                                console.log('请求二维码失败');
                            }
                        }).catch(function(err){
                            console.log('ajax请求失败');
                        });
                          Api.getAllQRList(0,"-createTime").then(function(res){
                              if(res.status === 1){
                                  console.log('请求二维码成功');
                                  res.data.forEach(function(item){
                                      item.link = '/pages/qr/index?_id='+item._id;
                                  })
                                  self.updateGlobal(res.data);
                                  self.setData({QRList:res.data});
                              }else{
                                  console.log('请求二维码失败');
                              }
                          }).catch(function(err){
                              console.log('ajax请求失败');
                          });
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
