//index.js
//获取应用实例
const app = getApp()
const ApiConfig = require('../../api/config');
const Config = require('../../config');
const Api = require('../../api/api');
const MsgType = require('../../common/msgtype');

let initflag = false;

Page({
    data: {
        userinfo:{},
        uploadCount:0
    },
    tapcollection:function(){
        let path = '/pages/record/record?type=1';
        wx.navigateTo({url:path});
    },
    tapwb:function(){
        let path = '/pages/weibi/wb';
        wx.navigateTo({url:path});
    },
    tapview:function(){
        let path = '/pages/record/record?type=2';
        wx.navigateTo({url:path});
    },
    tapupload:function(){
        let path = '/pages/record/record?type=3';
        wx.navigateTo({url:path});
    },
    getWeiBi:function(){
        let self = this;
        Api.getWeiBi().then(function(res){
            if(res.status === MsgType.EErrorType.EOK){
                let tmp = Object.assign({},self.data.userinfo,{weibi:res.data});
                self.setData({userinfo:tmp});
                app.globalData.user.weibi = res.data;
            }
        })
    },
    doSign:function(){
        let self = this;
        Api.doSign().then(function(res){
            if(res.status === MsgType.EErrorType.EOK){
                wx.showToast({title:'签到成功'});
                self.getWeiBi();
            }else{
                wx.showToast({title:'今天已签到过'});
            }
        })
    },
    initData:function(){
        let self = this;
        Api.getUserInfo().then(function(res){
            if(res.status === MsgType.EErrorType.EOK){
                console.log('pages/person: get userinfo success:',res.data);
                self.setData({userinfo:res.data});
                app.globalData.user = res.data;
            }else{
                console.log('pages/person: get userinfo failed:',res);
            }
        });
        Api.getUploadCount().then(function(res){
            if(res.status === MsgType.EErrorType.EOK){
                self.setData({uploadCount:res.data});
            }
        });
    },
    onLoad: function (options) {
        this.initData();
        initflag = true;
    },
    onShow:function(){
        if(initflag){
            initflag = false;
        }else{
            this.initData();
        }
    }
});
