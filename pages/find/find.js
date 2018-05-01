//index.js
//获取应用实例
const app = getApp()
const ApiConfig = require('../../api/config');
const Config = require('../../config');
const Api = require('../../api/api');
const MsgType = require('../../common/msgtype');

Page({
    data: {
        tab:0,//0全部，1微信群，2个人微信，3公众号
        history:[],//搜索记录
        hotHistory:[],//最热门搜索记录
        value:'',
        groupname:[],//匹配到的groupname
        showflag:0,//0显示历史搜索，1显示搜索提示，2显示搜索结果
        res:[]//搜索到的结果
    },
    taphis:function(e){
        let self = this;
        let value = e.currentTarget.dataset.name;
        if(value.length < 2){
            return wx.showToast({title:'内容太短'});
        }
        this.setData({value:value});
        Api.search({content:value,tab:this.data.tab}).then(function(res){
            if(res.status === MsgType.EErrorType.EOK){
                self.setData({res:res.data,showflag:2});
            }
        })
    },
    taptab:function(e){
        let self = this;
        let id = parseInt(e.currentTarget.dataset.id);
        if(id !== this.data.tab&&this.data.value.length >= 2){
            Api.groupNameSearch({tab:id,content:this.data.value}).then(function(res){
                if(res.status === MsgType.EErrorType.EOK){
                    self.setData({tab:id,groupname:res.data});
                }
            })
        }
        self.setData({tab:id});
    },
    gotoqr:function(e){
        let _id = e.currentTarget.dataset._id;
        let path = '/pages/qr/qr?qrid='+_id;
        wx.navigateTo({url:path});
    },
    tapgroupname:function(e){
        let self = this;
        let name = e.currentTarget.dataset.name;
        if(name === this.data.value){
            return console.log('相同');
        }
        this.setData({value:name});
        Api.groupNameSearch({tab:self.data.tab,content:name}).then(function(res){
            if(res.status === MsgType.EErrorType.EOK){
                self.setData({groupname:res.data});
            }
        })
    },
    upper:function(){
        console.log('顶部');
    },
    sxlower:function(){
        console.log('右边');
        let self = this;
        Api.getRecord({skip:self.data.history.length}).then(function(res){
            if(res.status === MsgType.EErrorType.EOK){
                self.setData({history:[...self.data.history,...res.data]});
            }
        })
    },
    lower:function(){
        console.log('底部');
        let self = this;
        Api.search({content:this.data.value,tab:this.data.tab,skip:this.data.res.length}).then(function(res){
            if(res.status === MsgType.EErrorType.EOK){
                if(res.data.length > 0){
                    self.setData({res:[...self.data.res,...res.data],showflag:2});
                }else{
                    wx.showToast({title:'无更多结果'});
                }

            }else{
                console.log('lower:err:',res);
            }
        })
    },
    handlesearchchange:function(e){//input框内容变化触发
        let self = this;
        let content = e.detail.value;
        console.log('内容：',content);
        this.setData({value:content});
        if(content.length === 0){
            return self.setData({showflag:0});
        }
        if(content.length < 2){
            return;
        }
        Api.groupNameSearch({tab:this.data.tab,content:content}).then(function(res){
            if(res.status === MsgType.EErrorType.EOK){
                self.setData({showflag:1,groupname:res.data});
            }
        })
    },
    handleconfirm:function(e){
        let content = e.detail.value;
        console.log('内容：',content);
        let self = this;
        if(content.length < 2){
            return wx.showToast({title:'内容太短'});
        }
        Api.search({content:content,tab:this.data.tab}).then(function(res){
            if(res.status === MsgType.EErrorType.EOK){
                self.setData({res:res.data,showflag:2});
            }
        })
    },
    onLoad: function () {
        let self = this;
        Api.getRecord({}).then(function(res){
            if(res.status === MsgType.EErrorType.EOK){
                self.setData({history:res.data});
            }
        });
        Api.getHotRecord({}).then(function(res){
            if(res.status === MsgType.EErrorType.EOK){
                self.setData({hotHistory:res.data});
            }
        });
    },

});
