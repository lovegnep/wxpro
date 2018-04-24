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
        replystatus:false,
        replyto:'',
        replytoid:'',
        comments:[],
        commentupdowninfo:{},
        underbarstatus:true,
        replycontent:'',
        abstractstatus:false
    },
    previewQR: function(){//预览二维码
        let self = this;
        if(!self.data.qr || !self.data.qr.groupQR){
            return console.log('invalid qr.');
        }
        wx.scanCode({
            success: (res) => {
                console.log(res)
            }
        })
        /*wx.previewImage({
            current: '', // 当前显示图片的http链接
            urls: [self.data.qr.groupQR] // 需要预览的图片http链接列表
        })*/
    },
    tapabstract:function(){
        this.setData({abstractstatus:true});
    },
    catchtape:function(e){
        console.log('捕获点击abstract事件，该事件不会向上冒泡');
    },
    handleglobale:function(e){
        console.log('根结点捕获点击事件');
        this.setData({abstractstatus:false,replystatus:false,underbarstatus:!this.data.underbarstatus});
        //this.setData({replystatus:false,underbarstatus:!this.data.underbarstatus})
    },
    doreplyqr:function(){
        this.setData({
            replystatus:true,
            underbarstatus:false,
            replyto:'',
            replytoid:''
        });
    },
    doreplycomment:function(e){
          let commentid= e.target.id;
          let len = this.data.comments.length;
          let toname = '';
          for(let i = 0; i < len; i++){
              if(this.data.comments[i]._id === commentid){
                  toname = this.data.comments[i].userid.nickname;
                  break;
              }
          }
          if(toname === ''){
              return console.log('error. can not find the comment with id:',commentid);
          }
          this.setData({
              replystatus:true,
              replyto:'To '+toname,
              replytoid:commentid
          });
    },
    handleinput:function(e){
        let value = e.detail.value;
        this.setData({replycontent:value});
    },
    handletapinfo:function(e){

    },
    tapdoreply:function(e){//reply界面的点击事件，暂时不用

    },
    tapunderbar:function(e){//底部underbar的点击事件，暂时不用

    },
    tapsendbutton:function(){
        let self = this;
        if(this.data.replycontent.length < 2){
            return wx.showToast({
                title:'内容低于2个字符.',
            })
        }
        let qrid = this.data.qr._id;
        let content = this.data.replycontent;
        Api.newComment({qrid,content,targetid:this.data.replytoid}).then(function(res){
            if(res.status === 1){
                console.log('tapsendbutton: new comment success.');
                wx.showToast({title:'评论成功.'});
                self.setData({
                    replystatus:false,
                    underbarstatus:false,
                    replyto:'',
                    replytoid:'',
                    replycontent:''
                });
            }else{
                wx.showToast({title:'评论失败.'});
                console.log('tapsendbutton: new comment failed.err:',res.message);
            }
        }).catch(function(err){
            console.log('tapsendbutton: new comment failed2.err:',err);
        })
    },
    updatecommentupdowninfo:function(commentid,param){
        let tmp = Object.assign({},this.data.commentupdowninfo);
        tmp[commentid] = param;
        this.setData({commentupdowninfo:tmp});
    },
    closeabstract:function(){
        this.setData({abstractstatus:false});
    },
    handlecommentopt:function(e){
        let self = this;
        let opttype = e.currentTarget.dataset.opttype;
        let optid = e.currentTarget.dataset.optid;
        if(!optid || optid.length < 2){
            return console.log('handlecommentopt:获取操作对象失败');
        }
        if(opttype === '1'){//取消对评论点赞
            Api.cUpComment({_id:optid}).then(function(res){
                if(res.status === 1){
                    self.updatecommentupdowninfo(optid,0);
                    console.log('handlecommentopt: cup comment success.');
                }else{
                    console.log('handlecommentopt: cup comment failed. errmessage:',res.message);
                }
            }).catch(function(err){
                console.log('handlecommentopt: cup comment failed. err occur:',err);
            })
        }else if(opttype === '2'){//对评论点赞
            Api.upComment({_id:optid}).then(function(res){
                if(res.status === 1){
                    self.updatecommentupdowninfo(optid,1);
                    console.log('handlecommentopt: up comment success.');
                }else{
                    console.log('handlecommentopt: up comment failed. errmessage:',res.message);
                }
            }).catch(function(err){
                console.log('handlecommentopt: up comment failed. err occur:',err);
            })
        }else if(opttype === '3'){//取消对评论踩
            Api.cDownComment({_id:optid}).then(function(res){
                if(res.status === 1){
                    self.updatecommentupdowninfo(optid,0);
                    console.log('handlecommentopt: cdown comment success.');
                }else{
                    console.log('handlecommentopt: cdown comment failed. errmessage:',res.message);
                }
            }).catch(function(err){
                console.log('handlecommentopt: cdown comment failed. err occur:',err);
            })
        }else if(opttype === '4'){//对评论踩
            Api.downComment({_id:optid}).then(function(res){
                if(res.status === 1){
                    self.updatecommentupdowninfo(optid,2);
                    console.log('handlecommentopt: down comment success.');
                }else{
                    console.log('handlecommentopt: down comment failed. errmessage:',res.message);
                }
            }).catch(function(err){
                console.log('handlecommentopt: down comment failed. err occur:',err);
            })
        }else{
            console.log('handlecommentopt: error opttype with',opttype);
        }
    },
    handleQRup:function(){
        let self = this;
        let qrid = self.data.qr._id;
        Api.upQR({_id:qrid}).then(function(res){
            if(res.status === 1){
                console.log('qrup success.');
                self.setData({isup:true,isdown:false});
            }else{
                console.log('qrup failed.');
            }
        }).catch(function(err){
            console.log('qrup err:',err);
        });
    },
    handleQRcup:function(){
        let self = this;
        let qrid = self.data.qr._id;
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
        let qrid = self.data.qr._id;
        Api.downQR({_id:qrid}).then(function(res){
            if(res.status === 1){
                console.log('qrdown success.');
                self.setData({isdown:true,isup:false});
            }else{
                console.log('qrdown failed.');
            }
        }).catch(function(err){
            console.log('qrdown err:',err);
        });
    },
    handleQRcdown:function(){
        let self = this;
        let qrid = self.data.qr._id;
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
        let qrid = self.data.qr._id;
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
        let qrid = self.data.qr._id;
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
        let self = this;
        let type = e.target.id;
        switch(type){
            case '1'://up
                (self.data.isup ? this.handleQRcup() : this.handleQRup());
                break;
            case '2'://down
                (self.data.isdown ? this.handleQRcdown() : this.handleQRdown());
                break;
            case '3':
                (self.data.iscollect ? this.handleQRccollect() : this.handleQRcollect());
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
        Api.getQRComment({_id:qrid}).then(function(res){
            let guser = app.globalData.user;
            if(res.status === 1){
                res.data.sort(function(a,b){
                    let bups = b.ups||[];
                    let aups = a.ups||[];
                    return bups.length - aups.length;
                });
                let tmpupdowninfo = {};
                res.data.forEach(function(item){
                    if(item.ups && item.ups.indexOf(guser._id) !== -1){
                        tmpupdowninfo[item._id] = 1;
                    }else if(item.downs && item.downs.indexOf(guser._id) !== -1){
                        tmpupdowninfo[item._id] = 2;
                    }
                })
                self.setData({commentupdowninfo:tmpupdowninfo,comments:res.data});
            }else{
                console.log('getQRComment:error:');
            }
        }).catch(function(err){
            console.log('getQRComment:err:',err);
        });
    }
});
