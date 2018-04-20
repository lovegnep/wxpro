//index.js
//获取应用实例
const app = getApp()
const ApiConfig = require('../../api/config');
const Config = require('../../config');
const Api = require('../../api/api');

Page({
    data: {
        qr:{},
        iscollect:false,
        isup:false,
        isdown:false,
        qrupsrc:'',
        replystatus:false
    },
    handleQRup:function(){
        let self = this;
        let qrid = qr._id;
        Api.upQR({_id:qrid}).then(function(res){
            if(res.status === 1){
                console.log('qrup success.');
                self.setData({isup:true});
            }else{
                console.log('qrup failed.');
            }
        }).catch(function(err){
            console.log('qrup err:',err);
        });
    },
    handleQRcup:function(){
        let self = this;
        let qrid = qr._id;
        Api.cUpQR({_id:qrid}).then(function(res){
            if(res.status === 1){
                console.log('qrcup success.');
                self.setData({isup:false});
            }else{
                console.log('qrcup failed.');
            }
        }).catch(function(err){
            console.log('qrcup err:',err);
        });
    },
    handleQRdown:function(){
        let self = this;
        let qrid = qr._id;
        Api.downQR({_id:qrid}).then(function(res){
            if(res.status === 1){
                console.log('qrdown success.');
                self.setData({isdown:true});
            }else{
                console.log('qrdown failed.');
            }
        }).catch(function(err){
            console.log('qrdown err:',err);
        });
    },
    handleQRcdown:function(){
        let self = this;
        let qrid = qr._id;
        Api.cDownQR({_id:qrid}).then(function(res){
            if(res.status === 1){
                console.log('qrcdown success.');
                self.setData({isdown:false});
            }else{
                console.log('qrcdown failed.');
            }
        }).catch(function(err){
            console.log('qrcdown err:',err);
        });
    },
    handleQRcollect:function(){
        let self = this;
        let qrid = qr._id;
        Api.collectQR({_id:qrid}).then(function(res){
            if(res.status === 1){
                console.log('collectQR success.');
                self.setData({iscollect:true});
            }else{
                console.log('collectQR failed.');
            }
        }).catch(function(err){
            console.log('collectQR err:',err);
        });
    },
    handleQRccollect:function(){
        let self = this;
        let qrid = qr._id;
        Api.cCollectQR({_id:qrid}).then(function(res){
            if(res.status === 1){
                console.log('cCollectQR success.');
                self.setData({iscollect:false});
            }else{
                console.log('cCollectQR failed.');
            }
        }).catch(function(err){
            console.log('cCollectQR err:',err);
        });
    },
    handletap:function(e){
        let type = e.target.id;
        switch(type){
            case '1'://up
                (isup ? this.handleQRcup() : this.handleQRup());
                break;
            case '2'://down
                (isdown ? this.handleQRcdown() : this.handleQRdown());
                break;
            case '3':
                (iscollect ? this.handleQRccollect() : this.handleQRcollect());
                break;
            default:
                console.log('handletap:invalid type:',type);
        }
    },
    getUpDownInfo:function(tmpqr){
        if(!tmpqr){
          return;
        }
        let tmpisup = false, tmpisdown = false;
        if(!app.globalData.user){
            return console.log('getUpDownInfo: no global user exist.');
        }
         if(tmpqr.ups && tmpqr.ups.indexOf(app.globalData.user._id) !== -1){
            tmpisup = true;
         }
         if(!tmpqr.ups){
             tmpqr.ups = [];
         }
         if(tmpqr.downs && tmpqr.downs.indexOf(app.globalData.user._id) !== -1){
             tmpisdown = true;
         }
         if(!tmpqr.downs){
             tmpqr.downs = [];
         }
         if(tmpisup || tmpisdown){
             this.setData({isup:tmpisup,isdown:tmpisdown});
         }
         if(tmpisup){
             this.setData({qrupsrc:"/icon/qrup_select.png"})
         }else{
             this.setData({qrupsrc:"/icon/qrup.png"})
         }
    },
    getCollectInfo:function(tmpqr){
        let guser = app.globalData.user;
        if(!guser){
            return console.log('getCollectInfo: user not exist.');
        }
        if(guser.collections && guser.collections.indexOf(tmpqr._id) !== -1){
            this.setData({iscollect:true});
        }
    },
    onLoad: function (options) {
        let self = this;
        let qrid = options._id;
        if(!qrid || qrid === ''){
            return wx.showToast({
                title: '二维码ID非法',
                icon: 'success',
            });
        }
        let qrtmp = app.globalData.QRList.get(qrid);
        if(qrtmp){
            self.setData({qr:qrtmp});
        }else{
            return wx.showToast({
                title: '找不到该二维码',
                icon: 'success',
            });
        }
        self.getUpDownInfo(qrtmp);
        self.getCollectInfo(qrtmp);
        Api.getQRCommentNum({_id:qrid}).then(function(res){
            if(res.status === 1){
                self.setData({qr:{commentnum:res.data,...qrtmp}})
            }else{
                console.log('getQRCommentNum:error:');
            }
        }).catch(function(err){
            console.log('getQRCommentNum:err:',err);
        });
    }
});
