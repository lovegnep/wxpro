//index.js
//获取应用实例
const app = getApp()
const Api = require('../../api/api');
const Config = require('../../config');
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
        if (app.globalData.user) {
            this.setData({
                userInfo: app.globalData.user,
                hasUserInfo: true
            });
            Api.getAllQRList(0,"-viewCount").then(function(res){
                res.data.forEach(function(item){
                    if(item.groupavatar){
                        item.groupavatar = Config.apihead+'/'+item.groupavatar;
                    }
                    if(item.groupQR){
                        item.groupQR = Config.apihead+'/'+item.groupQR;
                    }
                    if(item.masterQR){
                        item.masterQR = Config.apihead+'/'+item.masterQR;
                    }
                });
                this.setData({
                    QRList:res.data
                }).catch(function(err){
                    console.log(err);
                });
            })
        } else if (this.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                }
            })
        }
    },
    getUserInfo: function (e) {
        console.log(e)
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    }
})
