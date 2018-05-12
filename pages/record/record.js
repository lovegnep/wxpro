//index.js
//获取应用实例
const app = getApp()
const ApiConfig = require('../../api/config');
const Config = require('../../config');
const Api = require('../../api/api');
const MsgType = require('../../common/msgtype');


Page({
    data: {
        type:-1,//1为收藏记录,2浏览记录,3为上传记录
        gcollections:[],
        percollections:[],
        pubcollections:[],
        tab:1,//1群2个人微信3公众号
        tipsstatus:false
    },
    tapinside:function(e){

    },
    tapinwrap:function(e){
        this.setData({tipsstatus:false});
    },
    taptips:function(){
        this.setData({tipsstatus:true});
    },
    qroperate:function(e){
        let self = this;
        if(this.data.type !== 3){
            return;
        }
        let qrid = e.currentTarget.dataset.qrid;
        let opttype = parseInt(e.currentTarget.dataset.opttype);
        let tmptab = this.data.tab;
        let tmpqrlist = this.data.tab === 1 ? this.data.gcollections : (this.data.tab === 2 ? this.data.percollections : this.data.pubcollections);
        if(tmpqrlist.length < 1){
            return;
        }
        let tmpqr = null;
        tmpqrlist.forEach(function(item){
            if(item._id === qrid){
                tmpqr = item;
            }
        });
        if(!tmpqr){
            return;
        }
        if(opttype === 1){
            Api.f5QR({_id:qrid}).then(function(res){
                if(res.status === MsgType.EErrorType.EOK){
                    return wx.showToast({title:'刷新成功'});
                }else if(res.status === MsgType.EErrorType.ENoWeibi){
                    return wx.showToast({title:'微币不足'});
                }else if(res.status === MsgType.EErrorType.EHasF5){
                    return wx.showToast({title:'之前已经刷新过'});
                }
            })
        }else if(opttype === 2){
            let path = '/pages/updateqr/index?qrid='+qrid+'&type='+tmptab;
            wx.navigateTo({url:path});
        }else if(opttype === 3){
            let qrfun = tmpqr.secret ? Api.qrUp : Api.qrDown;
            console.log('qr.secret:',tmpqr.secret);
            qrfun({_id:qrid}).then(function(res){
                if(res.status === MsgType.EErrorType.EOK){
                    wx.showToast({title:'操作成功'});
                    let tmparr = [...tmpqrlist];
                    tmparr.forEach(function(item){
                        if(item._id === qrid){
                            item.secret = !item.secret;
                        }
                    });
                    if(tmptab === 1){
                        self.setData({gcollections:tmparr});
                    }else if(tmptab === 2){
                        self.setData({percollections:tmparr});
                    }else if(tmptab === 3){
                        self.setData({pubcollections:tmparr});
                    }
                }else{
                    console.log('qrupdown:',res);
                    wx.showToast({title:'操作失败'});
                }
            })
        }else if(opttype === 4){
            Api.deleterQr({_id:qrid}).then(function(res){
                if(res.status === MsgType.EErrorType.EOK){
                    console.log('删除成功');
                    wx.showToast({title:'删除成功'});
                    let tmparr = tmpqrlist.filter(function(item){
                        return item._id !== qrid;
                    });
                    if(tmptab === 1){
                        self.setData({gcollections:tmparr});
                    }else if(tmptab === 2){
                        self.setData({percollections:tmparr});
                    }else if(tmptab === 3){
                        self.setData({pubcollections:tmparr});
                    }
                }else{
                    console.log('deleteqr:',res);
                    wx.showToast({title:'删除失败'});
                }
            })
        }
    },
    onReachBottom:function(e){//收藏页面
        console.log('上拉触底：',e);
        let self = this;
        let type = this.data.tab;
        let qrlist = this.data.tab===1?this.data.gcollections:(this.data.tab===2?this.data.percollections:this.data.pubcollections);
        Api.getcollections({type:type,skip:qrlist.length}).then(function(res){
            if(res.status === MsgType.EErrorType.EOK && res.data.length > 0){
                if(type===1){
                    self.setData({gcollections:[...self.data.gcollections,...res.data]});
                }else if(type===2){
                    self.setData({percollections:[...self.data.percollections,...res.data]})
                }else if(type===3){
                    self.setData({pubcollections:[...self.data.pubcollections,...res.data]})
                }
            }
        })
    },
    upper:function(){
        console.log('顶部');
    },
    lower:function(){//浏览记录页面
        console.log('底部');
        let self = this;
        let type = this.data.tab;
        let qrlist = this.data.tab===1?this.data.gcollections:(this.data.tab===2?this.data.percollections:this.data.pubcollections);
        if(self.data.type === 2){
            Api.getviews({type:this.data.tab,skip:qrlist.length}).then(function(res){
                if(res.status === MsgType.EErrorType.EOK && res.data.length > 0){
                    if(type===1){
                        self.setData({gcollections:[...self.data.gcollections,...res.data]})
                    }else if(type===2){
                        self.setData({percollections:[...self.data.percollections,...res.data]})
                    }else if(type===3){
                        self.setData({pubcollections:[...self.data.pubcollections,...res.data]})
                    }
                }
            })
        }else if (self.data.type === 3 ){
            self.processSelectRecord();
        }
    },
    getqr:function(type){
        let self = this;
        let qrlist = type===1?this.data.gcollections:(type===2?this.data.percollections:this.data.pubcollections);
        if(this.data.type === 1){
            Api.getcollections({type:type,skip:qrlist.length}).then(function(res){
                if(res.status === MsgType.EErrorType.EOK && res.data.length > 0){
                    if(type===1){
                        self.setData({gcollections:[...self.data.gcollections,...res.data]});
                    }else if(type===2){
                        self.setData({percollections:[...self.data.percollections,...res.data]})
                    }else if(type===3){
                        self.setData({pubcollections:[...self.data.pubcollections,...res.data]})
                    }
                }
            })
        }else if(this.data.type === 2){
            Api.getviews({type:type,skip:qrlist.length}).then(function(res){
                if(res.status === MsgType.EErrorType.EOK && res.data.length > 0){
                    if(type===1){
                        self.setData({gcollections:[...self.data.gcollections,...res.data]})
                    }else if(type===2){
                        self.setData({percollections:[...self.data.percollections,...res.data]})
                    }else if(type===3){
                        self.setData({pubcollections:[...self.data.pubcollections,...res.data]})
                    }
                }
            })
        }else if(this.data.type === 3){
            self.processSelectRecord();
        }
    },
    taphead:function(e){
        let type = e.currentTarget.dataset.tab;
        this.setData({tab:parseInt(type)});
        if(parseInt(type) === 1 && this.data.gcollections.length < 20){//1群
            this.getqr(parseInt(type));
        }else if(parseInt(type) === 2 && this.data.percollections.length < 20){
            this.getqr(parseInt(type));
        }else if(parseInt(type) === 3 && this.data.pubcollections.length < 20){
            this.getqr(parseInt(type));
        }
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
            }else if(item.type === 2){
                perarr.push(item);
            }else if(item.type === 3){
                pubarr.push(item);
            }
        }))
        return [garr,perarr,pubarr];
    },
    initdata:function(type){
        let self = this;
        if(type === 1){
            Api.getcollections({type:1}).then(function(res){
                if(res.status === MsgType.EErrorType.EOK){
                    //let resdata = self.pickEach(res.data);
                    self.setData({gcollections:res.data});
                }
            })
        }else if (type === 2){
            Api.getviews({type:1}).then(function(res){
                if(res.status === MsgType.EErrorType.EOK){
                    //let resdata = self.pickEach(res.data);
                    self.setData({gcollections:res.data});
                }
            })
        }else if (type === 3){
            self.processSelectRecord();
        }

    },
    processSelectRecord:function(){
        let self = this;
        if(self.data.tab === 1){//群
            return Api.getAllQRListOfUser({type:MsgType.QRType.EGroup,skip:self.data.gcollections.length}).then(function(res){
                if(res.status === MsgType.EErrorType.EOK){
                    self.setData({gcollections:[...self.data.gcollections,...res.data]});
                }
            })
        }else if(self.data.tab === 2){
            return Api.getAllQRListOfUser({type:MsgType.QRType.EPerson,skip:self.data.percollections.length}).then(function(res){
                if(res.status === MsgType.EErrorType.EOK){
                    self.setData({percollections:[...self.data.percollections,...res.data]});
                }
            })
        }else if(self.data.tab === 3){
            return Api.getAllQRListOfUser({type:MsgType.QRType.EPublic,skip:self.data.pubcollections.length}).then(function(res){
                if(res.status === MsgType.EErrorType.EOK){
                    self.setData({pubcollections:[...self.data.pubcollections,...res.data]});
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
        }else if(type === 3){
            //上传记录
            this.setData({type:3});
        } else{
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
