const Utils = require('./utils/util');
const Apiconfig = require('./api/config');
//app.js
App({
    updateGlobalUser: function (guserinfo) {
        if (guserinfo) {
            this.globalData.user = guserinfo.userInfo;
        }

    },
    processShareIn:function(options){
        if(options.scene === 1007){
            //单人

        }else if(options.scene === 1008){
            //群聊

        }
    },
    onPageNotFound:function(res){
        wx.showToast({
            title:'页面不存在，2s后中转到主页'
        });
        setTimeout(function(){
            wx.switchTab({
                url: '/"pages/index/index'
            });
        },2000);

    },
    onLaunch: function (options) {
        console.log('APP开始初始化...');
        let self = this;
        console.log('APP参数：',options);
        self.processShareIn(options);
        let shareIndex = '';
        console.log('query:',options.query);
        if (options.query.isshare && parseInt(options.query.isshare) === 1) {
            // 通过分享进入
            let index = options.query.index;
            if(index&&index.length > 0){
                shareIndex = index;
            }
            if(options.scene === 1007 ){//单人聊天会话中的小程序消息卡片

            }else if(options.scene === 1008){//群聊会话中的小程序消息卡片

            }
            console.log('通过分享进入：shareindex:',shareIndex,index);
        }
        wx.showLoading({
            title: '登陆中',
            mask: true
        });
        wx.login({
            success: function (res) {
                if (res.code) {
                    self.globalData.code = res.code;
                    wx.getUserInfo({
                        withCredentials: true,
                        success: function (res) {
                            self.globalData.wxuserdata = res.userInfo;
                            console.log('wxuserinfo success:', res);
                            Utils.request(Apiconfig.Login, {shareIndex:shareIndex,code: self.globalData.code, userInfo: res}, "POST")
                                .then(function (backUserInfo) {
                                    self.updateGlobalUser(backUserInfo);
                                    //self.globalData.backUserInfo = backUserInfo.userInfo;
                                    wx.setStorageSync('sessionkey', backUserInfo.sessionkey);
                                    console.log('backUserInfo:', backUserInfo);
                                    wx.hideLoading();
                                    if(self.globalData.cb){
                                        self.globalData.cb();
                                    }
                                }).catch(function (err) {
                                console.log('req ', Apiconfig.Login, "error:", err);
                            });
                        }
                    })

                } else {
                    console.log('登录失败！' + res.errMsg)
                }
            }
        });
    },
    globalData: {
        userInfo: null,
        code: -1,
        user: null,
        QRList: new Map(),
        wxuserdata: null,
        cb:null
    }
})