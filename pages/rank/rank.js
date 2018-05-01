//index.js
//获取应用实例
const app = getApp()
const ApiConfig = require('../../api/config');
const Config = require('../../config');
const Api = require('../../api/api');
const MsgType = require('../../common/msgtype');

Page({
    data: {
        tab:1,//1微信群，2个人微信，3公众号
        gres:[],//
        perres:[],
        pubres:[]
    },
    taptab:function(e){
        let self = this;
        let id = parseInt(e.currentTarget.dataset.id);
        let tmpqrlist = id===1?self.data.gres:(id === 2 ? self.data.perres :self.data.pubres);
        if(id !== self.data.tab && tmpqrlist.length < 1){
            Api.getHotQrList({tab:id}).then(function(res){
                if(res.status === MsgType.EErrorType.EOK){
                    if(id === 1){
                        self.setData({gres:res.data,tab:id});
                    }else if(id === 2){
                        self.setData({perres:res.data,tab:id});
                    }else if(id === 3){
                        self.setData({pubres:res.data,tab:id});
                    }

                }
            })
        }else if(id !== self.data.tab && tmpqrlist.length > 0){
            self.setData({tab:id});
        }
        //self.setData({tab:id});
    },
    gotoqr:function(e){
        let _id = e.currentTarget.dataset._id;
        let path = '/pages/qr/qr?qrid='+_id;
        wx.navigateTo({url:path});
    },
    onLoad: function () {
        let self = this;
        Api.getHotQrList({tab:self.data.tab}).then(function(res){
            if(res.status === MsgType.EErrorType.EOK){
                self.setData({gres:res.data});
            }
        })
    },

});
