//index.js
//获取应用实例
const app = getApp()
const ApiConfig = require('../../api/config');
const Config = require('../../config');
const Api = require('../../api/api');
const MsgType = require('../../common/msgtype');
const moment = require('../../utils/lib/moment/we-moment');



Page({
    data: {
        wblog:[],
        listData:[
            {"code":"01","text":"text1","type":"type1"},
            {"code":"02","text":"text2","type":"type2"},
            {"code":"03","text":"text3","type":"type3"},
            {"code":"04","text":"text4","type":"type4"},
            {"code":"05","text":"text5","type":"type5"},
            {"code":"06","text":"text6","type":"type6"},
            {"code":"07","text":"text7","type":"type7"}
        ]
    },
    processData:function(arr){
        arr.forEach(function(item){
            item.chinese = MsgType.WBChinese[item.source];
            console.log(moment(item.createTime).format('YYYY-MM-DD HH:mm:ss'));
            item.createTime = moment(item.createTime).format('YYYY-MM-DD HH:mm:ss');
        })
    },
    onLoad: function () {
        console.log('onLoad');
        let self = this;
        Api.getWBLog({skip:0,limit:20}).then(function(res){
            if(res.status === MsgType.EErrorType.EOK){
                if(res.data.length > 0){
                    self.processData(res.data);
                    self.setData({wblog:res.data});
                }
            }
        })
    },
    onReachBottom:function(e){//
        console.log('上拉触底：',e);
        let self = this;
        Api.getWBLog({skip:self.data.wblog.length,limit:20}).then(function(res){
            if(res.status === MsgType.EErrorType.EOK){
                if(res.data.length > 0){
                    console.log(res.data);
                    self.processData(res.data);
                    self.setData({wblog:[...self.data.wblog,...res.data]});
                }else{
                    return wx.showToast({title:'无更多内容'});
                }
            }
        })
    }

})
