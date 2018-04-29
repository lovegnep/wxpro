//index.js
//获取应用实例
const app = getApp()
const ApiConfig = require('../../api/config');
const Config = require('../../config');
const Api = require('../../api/api');
const MsgType = require('../../common/msgtype');


Page({
    data: {
        type:-1,//1为收藏记录,2浏览记录
        gcollections:[],
        percollections:[],
        pubcollections:[],
        tab:1,//1群2个人微信3公众号
    },
    taphead:function(e){
        let type = e.currentTarget.dataset.tab;
        this.setData({tab:parseInt(type)});
    },
    gotoqr:function(e){
        let _id = e.currentTarget.dataset._id;
        let path = '/pages/qr/qr?qrid='+_id;
        wx.navigateTo({url:path});
    },
    pickEach:function(data){
        let garr = [];
        let perarr = [];
        let pubarr = [];
        data.forEach((function(item){
            if(item.type === 1){
                garr.push(item);
            }else if(type === 2){
                perarr.push(item);
            }else if(type === 3){
                pubarr.push(item);
            }
        }))
        return [garr,perarr,pubarr];
    },
    initdata:function(type){
        let self = this;
        if(type === 1){
            Api.getcollections({}).then(function(res){
                if(res.status === MsgType.EErrorType.EOK){
                    let resdata = self.pickEach(res.data);
                    self.setData({gcollections:resdata[0],percollections:resdata[1],pubcollections:resdata[2],});
                }
            })
        }else if (type === 2){
            Api.getviews({}).then(function(res){
                if(res.status === MsgType.EErrorType.EOK){
                    let resdata = self.pickEach(res.data);
                    self.setData({gcollections:resdata[0],percollections:resdata[1],pubcollections:resdata[2],});
                }
            })
        }

    },

    onLoad: function (options) {
        console.log('record开始初始化...');
        console.log('record参数：',options);
        let self = this;
        let type = parseInt(options.type);
        if(type === 1){
            //收藏
            this.setData({type:1});
        }else if(type === 2){
            //浏览记录
            this.setData({type:2});
        }else{
            return wx.showToast({title:'传递值非法'});
        }
        let userid = app.globalData.user._id;
        if(!userid){
            return wx.showToast({title:'请先登陆'});
        }
        self.initdata(type);

    },
    onShow:function(){
    }
});
