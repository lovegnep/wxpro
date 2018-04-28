//index.js
//获取应用实例
const app = getApp()
const ApiConfig = require('../../api/config');
const Config = require('../../config');
const Api = require('../../api/api');
const MsgType = require('../../common/msgtype');

Page({
    data: {
        userinfo:{},
        uploadCount:0
    },
    onLoad: function (options) {
        let self = this;
        Api.getUserInfo().then(function(res){
            if(res.status === MsgType.EErrorType.EOK){
                console.log('pages/person: get userinfo success:',res.data);
                self.setData({userinfo:res.data});
            }else{
                console.log('pages/person: get userinfo failed:',res);
            }
        });
        Api.getUploadCount().then(function(res){
            if(res.status === MsgType.EErrorType.EOK){
                self.setData({uploadCount:res.data});
            }
        });
    }
});
