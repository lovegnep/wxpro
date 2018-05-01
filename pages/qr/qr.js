//index.js
//获取应用实例
const app = getApp()
const Api = require('../../api/api');
const Config = require('../../config');
const Utils = require('../../utils/util');
const ApiConfig = require('../../api/config');
const MsgType = require('../../common/msgtype')
const Uuidv1 = require('../../utils/lib/uuid/we-uuidv1');

Page({
    data: {
        qr: {},
        replystatus: false,
        replyto: '',
        replytoid: '',
        iscollect: false,
        isup: false,
        isdown: false,
        comments: [],
        gtab: 0,//0显示群二难码，1显示群主二维码
        commentupdowninfo: {},
        underbarstatus: true,
        replycontent: '',
        abstractstatus: false,
        poorflag: false
    },
    doShare:function(){
        wx.showShareMenu({
            withShareTicket: true
        })
    },
    changegorm:function(e){
        let id = e.currentTarget.dataset.optm;
        if(id === '1'){
            this.setData({gtab:1});
        }else if(id === '0'){
            this.setData({gtab:0});
        }
    },
    previewQR: function () {//预览二维码
        let self = this;
        if (!self.data.qr || !self.data.qr.groupQR) {
            return console.log('invalid qr.');
        }
        /*wx.scanCode({
            success: (res) => {
                console.log(res)
            }
        })*/
        if (self.data.poorflag) {
            return;
        }
        wx.previewImage({
            current: '', // 当前显示图片的http链接
            urls: [self.data.qr.groupQR] // 需要预览的图片http链接列表
        })
    },
    tapabstract: function () {
        this.setData({abstractstatus: true});
    },
    catchtape: function (e) {
        console.log('捕获点击abstract事件，该事件不会向上冒泡');
    },
    handleglobale: function (e) {
        console.log('根结点捕获点击事件');
        this.setData({abstractstatus: false, replystatus: false, underbarstatus: !this.data.underbarstatus});
        //this.setData({replystatus:false,underbarstatus:!this.data.underbarstatus})
    },
    doreplyqr: function () {
        let self = this;
        if (!self.data.qr._id) {
            return;
        }
        if (self.data.comments.length > 0) {
            self.setData({replystatus: true, replyto: '', replytoid: ''});
            return;
        }
        Api.getQRComment({_id: self.data.qr._id}).then(function (res) {
            if (res.status === MsgType.EErrorType.EOK) {
                self.setData({replystatus: true, replyto: '', replytoid: '', comments: res.data});
            }
        });

    },
    doreplycomment: function (e) {
        let commentid = e.target.id;
        let len = this.data.comments.length;
        let toname = '';
        for (let i = 0; i < len; i++) {
            if (this.data.comments[i]._id === commentid) {
                toname = this.data.comments[i].userid.nickname;
                break;
            }
        }
        if (toname === '') {
            return console.log('error. can not find the comment with id:', commentid);
        }
        this.setData({
            replystatus: true,
            replyto: 'To ' + toname,
            replytoid: commentid
        });
    },
    handleinput: function (e) {
        let value = e.detail.value;
        this.setData({replycontent: value});
    },
    handletapinfo: function (e) {

    },
    tapdoreply: function (e) {//reply界面的点击事件，暂时不用

    },
    tapunderbar: function (e) {//底部underbar的点击事件，暂时不用

    },
    tapsendbutton: function () {
        let self = this;
        if (this.data.replycontent.length < 2) {
            return wx.showToast({
                title: '内容低于2个字符.',
            })
        }
        let qrid = this.data.qr._id;
        let content = this.data.replycontent;
        Api.newComment({qrid, content, targetid: this.data.replytoid}).then(function (res) {
            if (res.status === 1) {
                console.log('tapsendbutton: new comment success.');
                wx.showToast({title: '评论成功.'});
                res.data.userid = {
                    nickname: app.globalData.user.nickname,
                    avatar: app.globalData.user.avatar
                };
                let newcomments = [res.data, ...self.data.comments];
                self.setData({
                    comments: newcomments,
                    underbarstatus: false,
                    replyto: '',
                    replytoid: '',
                    replycontent: ''
                });

            } else {
                wx.showToast({title: '评论失败.'});
                console.log('tapsendbutton: new comment failed.err:', res.message);
            }
        }).catch(function (err) {
            console.log('tapsendbutton: new comment failed2.err:', err);
        })
    },
    updatecommentupdowninfo: function (commentid, param) {
        let tmp = Object.assign({}, this.data.commentupdowninfo);
        tmp[commentid] = param;
        this.setData({commentupdowninfo: tmp});
    },
    closeabstract: function () {
        this.setData({abstractstatus: false});
    },
    handlecommentopt: function (e) {
        let self = this;
        let opttype = e.currentTarget.dataset.opttype;
        let optid = e.currentTarget.dataset.optid;
        if (!optid || optid.length < 2) {
            return console.log('handlecommentopt:获取操作对象失败');
        }
        if (opttype === '1') {//取消对评论点赞
            Api.cUpComment({_id: optid}).then(function (res) {
                if (res.status === 1) {
                    self.updatecommentupdowninfo(optid, 0);
                    console.log('handlecommentopt: cup comment success.');
                } else {
                    console.log('handlecommentopt: cup comment failed. errmessage:', res.message);
                }
            }).catch(function (err) {
                console.log('handlecommentopt: cup comment failed. err occur:', err);
            })
        } else if (opttype === '2') {//对评论点赞
            Api.upComment({_id: optid}).then(function (res) {
                if (res.status === 1) {
                    self.updatecommentupdowninfo(optid, 1);
                    console.log('handlecommentopt: up comment success.');
                } else {
                    console.log('handlecommentopt: up comment failed. errmessage:', res.message);
                }
            }).catch(function (err) {
                console.log('handlecommentopt: up comment failed. err occur:', err);
            })
        } else if (opttype === '3') {//取消对评论踩
            Api.cDownComment({_id: optid}).then(function (res) {
                if (res.status === 1) {
                    self.updatecommentupdowninfo(optid, 0);
                    console.log('handlecommentopt: cdown comment success.');
                } else {
                    console.log('handlecommentopt: cdown comment failed. errmessage:', res.message);
                }
            }).catch(function (err) {
                console.log('handlecommentopt: cdown comment failed. err occur:', err);
            })
        } else if (opttype === '4') {//对评论踩
            Api.downComment({_id: optid}).then(function (res) {
                if (res.status === 1) {
                    self.updatecommentupdowninfo(optid, 2);
                    console.log('handlecommentopt: down comment success.');
                } else {
                    console.log('handlecommentopt: down comment failed. errmessage:', res.message);
                }
            }).catch(function (err) {
                console.log('handlecommentopt: down comment failed. err occur:', err);
            })
        } else {
            console.log('handlecommentopt: error opttype with', opttype);
        }
    },
    handleQRup: function () {
        let self = this;
        let qrid = self.data.qr._id;
        Api.upQR({_id: qrid}).then(function (res) {
            if (res.status === 1) {
                console.log('qrup success.');
                self.setData({isup: true, isdown: false});
            } else {
                console.log('qrup failed.');
            }
        }).catch(function (err) {
            console.log('qrup err:', err);
        });
    },
    handleQRcup: function () {
        let self = this;
        let qrid = self.data.qr._id;
        Api.cUpQR({_id: qrid}).then(function (res) {
            if (res.status === 1) {
                console.log('qrcup success.');
                self.setData({isup: false});
            } else {
                console.log('qrcup failed.');
            }
        }).catch(function (err) {
            console.log('qrcup err:', err);
        });
    },
    handleQRdown: function () {
        let self = this;
        let qrid = self.data.qr._id;
        Api.downQR({_id: qrid}).then(function (res) {
            if (res.status === 1) {
                console.log('qrdown success.');
                self.setData({isdown: true, isup: false});
            } else {
                console.log('qrdown failed.');
            }
        }).catch(function (err) {
            console.log('qrdown err:', err);
        });
    },
    handleQRcdown: function () {
        let self = this;
        let qrid = self.data.qr._id;
        Api.cDownQR({_id: qrid}).then(function (res) {
            if (res.status === 1) {
                console.log('qrcdown success.');
                self.setData({isdown: false});
            } else {
                console.log('qrcdown failed.');
            }
        }).catch(function (err) {
            console.log('qrcdown err:', err);
        });
    },
    handleQRcollect: function () {
        let self = this;
        let qrid = self.data.qr._id;
        Api.collectQR({_id: qrid}).then(function (res) {
            if (res.status === 1) {
                console.log('collectQR success.');
                self.setData({iscollect: true});
            } else {
                console.log('collectQR failed.');
            }
        }).catch(function (err) {
            console.log('collectQR err:', err);
        });
    },
    handleQRccollect: function () {
        let self = this;
        let qrid = self.data.qr._id;
        Api.cCollectQR({_id: qrid}).then(function (res) {
            if (res.status === 1) {
                console.log('cCollectQR success.');
                self.setData({iscollect: false});
            } else {
                console.log('cCollectQR failed.');
            }
        }).catch(function (err) {
            console.log('cCollectQR err:', err);
        });
    },
    handletap: function (e) {
        let self = this;
        let type = e.target.id;
        switch (type) {
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
                console.log('handletap:invalid type:', type);
        }
    },
    getUpDownInfo: function (tmpqr) {
        if (!tmpqr) {
            return;
        }
        let tmpisup = false, tmpisdown = false;
        if (!app.globalData.user) {
            return console.log('getUpDownInfo: no global user exist.');
        }
        if (tmpqr.ups && tmpqr.ups.indexOf(app.globalData.user._id) !== -1) {
            tmpisup = true;
        }
        if (!tmpqr.ups) {
            tmpqr.ups = [];
        }
        if (tmpqr.downs && tmpqr.downs.indexOf(app.globalData.user._id) !== -1) {
            tmpisdown = true;
        }
        if (!tmpqr.downs) {
            tmpqr.downs = [];
        }
        if (tmpisup || tmpisdown) {
            this.setData({isup: tmpisup, isdown: tmpisdown});
        }
        if (tmpisup) {
            this.setData({qrupsrc: "/icon/qrup_select.png"})
        } else {
            this.setData({qrupsrc: "/icon/qrup.png"})
        }
    },
    getCollectInfo: function (tmpqr) {
        let guser = app.globalData.user;
        if (!guser) {
            return console.log('getCollectInfo: user not exist.');
        }
        if (guser.collections && guser.collections.indexOf(tmpqr._id) !== -1) {
            this.setData({iscollect: true});
        } else {
            this.setData({iscollect: false});
        }
    },
    initdata: function (qrid) {
        let self = this;
        return function () {
            if (app.globalData.user.weibi < 1) {
                self.setData({poorflag: true});
            }
            Api.getQR(qrid).then(function (res) {
                if (res.status === MsgType.EErrorType.EOK) {
                    console.log('initdata:get qr success.');
                    let qrtmp = res.data;
                    if (qrtmp) {
                        Api.viewQR(qrid).then(function(dres){
                            if(dres.status === MsgType.EErrorType.EOK){
                                self.setData({qr: qrtmp});
                            }else if(dres.status === MsgType.EErrorType.ENoWeibi){
                                self.setData({qr: qrtmp,poorflag:true});
                                wx.showToast({title:'微币不足'});
                            }
                        })

                    } else {
                        return wx.showToast({
                            title: '找不到该二维码',
                            icon: 'success',
                        });
                    }
                    self.getUpDownInfo(qrtmp);
                    self.getCollectInfo(qrtmp);

                } else {
                    console.log('initdata:get qr failed.');
                }
            }).catch(function (err) {
                console.log('initdata:get qr err:.', err);
            })
        }
    },
    onShareAppMessage: function (options) {
        if (options.from === 'button') {
            // 来自页面内转发按钮
            console.log(options.target);
        } else if (options.from === 'menu') {
            //来自右上角转发
            console.log('来自右上角转发');
        }
        if (!this.data.qr || !this.data.qr._id) {
            return wx.showToast({
                title: 'qr不存在'
            });
        }
        let path = '/pages/qr/qr?' + 'qrid=' + this.data.qr._id + '&isshare=1';
        let index = Uuidv1();
        let url = Utils.generatePath('/pages/index/index',{index:index,userid:app.globalData.user._id,qrid:this.data.qr._id,isshare:1});
        return {
            title: '测试转发',
            path: url,
            success: function (res) {
                // 转发成功
                console.log('转发成功：',res);
                // 转发成功
                if(!res.shareTickets || res.shareTickets.length < 1){
                    Api.decodeData({path:path,index:index,type:1}).then(function(res){
                        console.log('创建分享到个人实例成功');
                    });
                    return wx.showToast({
                        title:'请转发到群'
                    });
                }
                wx.getShareInfo({
                    shareTicket:res.shareTickets[0],
                    success:function(data){
                        Api.decodeData({type:2,path:path,encryptedData:data.encryptedData,iv:data.iv}).then(function(serveres){
                            if(serveres.status === MsgType.EErrorType.EOK){
                                console.log('解密成功：',serveres.data);
                                return wx.showToast({title:'分享成功，增加微币'});
                            }else if(serveres.status === MsgType.EErrorType.EHasShareTo){
                                return wx.showToast({title:'当天已经分享过该群'});
                            }
                        });
                    },
                    fail:function(data){
                        console.log('wx.getShareInfo:fail.',data);
                    }
                });
            },
            fail: function (res) {
                // 转发失败
            }
        }
    },
    onLoad: function (options) {
        wx.showShareMenu({
            withShareTicket: true
        });
        let self = this;
        let arrFuns = [];
        if (options.isshare && parseInt(options.isshare) === 1) {
            // 通过分享进入该页面
            if (!options.qrid) {
                return wx.showToast({
                    title: 'qrid不存在'
                });
            }
            let index = options.index;
            let scene = 0;
            if(options.scene === 1007 ){//单人聊天会话中的小程序消息卡片
                scene=1;
            }else if(options.scene === 1008){//群聊会话中的小程序消息卡片
                scene = 2;
            }
            if(index&&index.length > 0){
                arrFuns.push(function(){
                    Api.shareIn({scene:scene,index:index}).then(function(res){
                        if(res.status === MsgType.EErrorType.EOK){
                            console.log('将用户添加到share son成功:',index);
                        }else{
                            console.log('将用户添加到share son失败:',index,res);
                        }
                    }).catch(function(err){
                        console.log('将用户添加到share son失败,err:',err,index);
                    })
                })
            }
            arrFuns.push(self.initdata(options.qrid));
            if (!app.globalData.user) {
                app.globalData.cb = Utils.combineFuns(arrFuns);
            } else {
                (Utils.combineFuns(arrFuns))();
            }
            return;
        }
        self.initdata(options.qrid)();
    }
})
