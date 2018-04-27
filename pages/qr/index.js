//index.js
//获取应用实例
const app = getApp()
const ApiConfig = require('../../api/config');
const Config = require('../../config');
const Api = require('../../api/api');
const MsgType = require('../../common/msgtype');

let touchDotx = 0;//触摸时的原点
let touchDoty = 0;//触摸时的原点
let time = 0;// 时间记录，用于滑动时且时间小于1s则执行左右滑动
let interval = "";// 记录/清理时间记录
let moveflag = false;

let gloadingflag = false;
let perloadingflag = false;
let publoadingflag = false;

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
        gindex:-1,
        perindex:-1,
        pubindex:-1,
        tab:0,//0群，1个人微信，2公众号
        gtab:0,//0显示群二难码，1显示群主二维码
        commentupdowninfo:{},
        underbarstatus:true,
        replycontent:'',
        abstractstatus:false,
        gqrlist:[],
        perqrlist:[],
        pubqrlist:[],
        poorflag:false
    },
    changegorm:function(e){
        let id = e.currentTarget.dataset.optm;
        if(id === '1'){
            this.setData({gtab:1});
        }else if(id === '0'){
            this.setData({gtab:0});
        }
    },
    changeLoadingFlag:function(is){
        if(this.data.tab === 0){
            gloadingflag = is;
        }else if(this.data.tab === 1){
            perloadingflag = is;
        }else {
            publoadingflag = is;
        }
    },
    changeIndexAndQR:function(data){
        let self = this;
        Api.viewQR(data[0]._id).then(function(res){
            if(res.status === MsgType.EErrorType.EOK){
                if(self.data.tab === 0){
                    self.setData({gqrlist:data,gindex:0, qr:data[0]});
                }else if(self.data.tab === 1){
                    self.setData({perqrlist:data,perindex:0, qr:data[0]});
                }else if(self.data.tab === 2){
                    self.setData({pubqrlist:data,pubindex:0, qr:data[0]});
                }
            }else{
                if(self.data.tab === 0){
                    self.setData({gqrlist:data,gindex:0, qr:data[0],poorflag:true});
                }else if(self.data.tab === 1){
                    self.setData({perqrlist:data,perindex:0, qr:data[0],poorflag:true});
                }else if(self.data.tab === 2){
                    self.setData({pubqrlist:data,pubindex:0, qr:data[0],poorflag:true});
                }
            }
            self.changeLoadingFlag(false);
        });

    },
    // 触摸开始事件
    touchStart: function (e) {
        touchDotx = e.touches[0].pageX; // 获取触摸时的原点
        touchDoty = e.touches[0].pageY; // 获取触摸时的原点
        // 使用js计时器记录时间
        interval = setInterval(function () {
            time++;
        }, 100);
    },
    // 触摸移动事件
    touchMove: function (e) {
        let self = this;
        let touchMovex = e.touches[0].pageX;
        let touchMovey = e.touches[0].pageY;
        //console.log("touchMovex:" + touchMovex + " touchDot:" + touchDotx + " diff:" + (touchMovex - touchDotx));
        //console.log("touchMovey:" + touchMovey + " touchDot:" + touchDoty + " diff:" + (touchMovey - touchDoty));
        if(moveflag){
            return;
        }
        // 向左滑动
        if (touchMovex - touchDotx <= -40 && time < 10) {
            console.log('向左滑动');
            moveflag = true;
            let newtab = (this.data.tab+1)%3;
            let tmpindex = (newtab === 0 ? this.data.gindex :(newtab === 1 ? this.data.perindex : this.data.pubindex));
            let tmpqrlist = (newtab === 0 ? this.data.gqrlist : (newtab === 1 ? this.data.perqrlist : this.data.pubqrlist));
            if(tmpqrlist.length < 1){
                this.setData({tab:newtab,qr:{}});
                return wx.showToast({title:'没有更多的内容'});
            }
            if(tmpindex === -1){//第一次切换到该标签
                Api.viewQR(tmpqrlist[0]._id).then(function(res){
                    if(res.status === MsgType.EErrorType.EOK){
                        if((self.data.tab+1)%3 === 0){
                            self.setData({tab:(self.data.tab+1)%3,qr:self.data.gqrlist[0],gindex:0});
                        }else if((self.data.tab+1)%3 === 1){
                            self.setData({tab:(self.data.tab+1)%3,qr:self.data.perqrlist[0],perindex:0});
                        }else if((self.data.tab+1)%3 === 2){
                            self.setData({tab:(self.data.tab+1)%3,qr:self.data.pubqrlist[0],pubindex:0});
                        }
                    }else{
                        if((self.data.tab+1)%3 === 0){
                            self.setData({tab:(self.data.tab+1)%3,qr:self.data.gqrlist[0],gindex:0,poorflag:true});
                        }else if((self.data.tab+1)%3 === 1){
                            self.setData({tab:(self.data.tab+1)%3,qr:self.data.perqrlist[0],perindex:0,poorflag:true});
                        }else if((self.data.tab+1)%3 === 2){
                            self.setData({tab:(self.data.tab+1)%3,qr:self.data.pubqrlist[0],pubindex:0,poorflag:true});
                        }
                    }
                }).catch(function(err){
                    console.log('left move:err:',err);
                    return wx.showToast({title:'内部错误'});
                })
            }else{
                if((this.data.tab+1)%3 === 0){
                    this.setData({tab:(this.data.tab+1)%3,qr:this.data.gqrlist[this.data.gindex]});
                }else if((this.data.tab+1)%3 === 1){
                    this.setData({tab:(this.data.tab+1)%3,qr:this.data.perqrlist[this.data.perindex]});
                }else if((this.data.tab+1)%3 === 2){
                    this.setData({tab:(this.data.tab+1)%3,qr:this.data.pubqrlist[this.data.pubindex]});
                }
            }

            return;
        }
        // 向右滑动
        if (touchMovex - touchDotx >= 40 && time < 10) {
            console.log('向右滑动');
            moveflag = true;
            let newtab = (this.data.tab-1+3)%3;
            let tmpindex = (newtab === 0 ? this.data.gindex :(newtab === 1 ? this.data.perindex : this.data.pubindex));
            let tmpqrlist = (newtab === 0 ? this.data.gqrlist : (newtab === 1 ? this.data.perqrlist : this.data.pubqrlist));
            if(tmpqrlist.length < 1){
                this.setData({tab:newtab,qr:{}});
                return wx.showToast({title:'没有更多的内容'});
            }
            if(tmpindex === -1){//第一次切换到该标签
                Api.viewQR(tmpqrlist[0]._id).then(function(res){
                    if(res.status === MsgType.EErrorType.EOK){
                        if(newtab === 0){
                            self.setData({tab:newtab,qr:self.data.gqrlist[0],gindex:0});
                        }else if(newtab === 1){
                            self.setData({tab:newtab,qr:self.data.perqrlist[0],perindex:0});
                        }else if(newtab === 2){
                            self.setData({tab:newtab,qr:self.data.pubqrlist[0],pubindex:0});
                        }
                    }else{
                        if(newtab === 0){
                            self.setData({tab:newtab,qr:self.data.gqrlist[0],gindex:0,poorflag:true});
                        }else if(newtab === 1){
                            self.setData({tab:newtab,qr:self.data.perqrlist[0],perindex:0,poorflag:true});
                        }else if(newtab === 2){
                            self.setData({tab:newtab,qr:self.data.pubqrlist[0],pubindex:0,poorflag:true});
                        }
                        wx.showToast({title:'积分不够请充值'})
                    }
                }).catch(function(err){
                    console.log('left move:err:',err);
                    return wx.showToast({title:'内部错误'});
                })
            }else{
                if((this.data.tab-1+3)%3 === 0){
                    this.setData({tab:(this.data.tab-1+3)%3,qr:this.data.gqrlist[this.data.gindex]});
                }else if((this.data.tab-1+3)%3 === 1){
                    this.setData({tab:(this.data.tab-1+3)%3,qr:this.data.perqrlist[this.data.perindex]});
                }else if((this.data.tab-1+3)%3 === 2){
                    this.setData({tab:(this.data.tab-1+3)%3,qr:this.data.pubqrlist[this.data.pubindex]});
                }
            }

            return;
        }

        // 向上滑动
        if (touchMovey - touchDoty <= -40 && time < 10) {
            if(this.data.poorflag){
                return wx.showToast({title:'积分不够，请先充值'});
            }
            console.log('向上滑动');
            moveflag = true;
            let tmpqrlist = (this.data.tab === 0 ? this.data.gqrlist :(this.data.tab === 1 ? this.data.perqrlist : this.data.pubqrlist));
            let tmpindex = (this.data.tab === 0 ? this.data.gindex :(this.data.tab === 1 ? this.data.perindex : this.data.pubindex));
            if(tmpqrlist.length < 1){
                return wx.showToast({title:'没有更多内容'});
            }
            if(tmpqrlist.length > 0 && tmpindex < tmpqrlist.length-1){
                Api.viewQR(tmpqrlist[tmpindex+1]).then(function(res){
                    if(res.status === MsgType.EErrorType.EOK){
                        if(self.data.tab === 0){
                            self.setData({gindex:self.data.gindex+1, qr:self.data.gqrlist[self.data.gindex+1]});
                        }else if(self.data.tab === 1){
                            self.setData({perindex:self.data.perindex+1, qr:self.data.perqrlist[self.data.perindex+1]});
                        }else if(self.data.tab === 2){
                            self.setData({pubindex:self.data.pubindex+1, qr:self.data.pubqrlist[self.data.pubindex+1]});
                        }
                    }else{
                        if(self.data.tab === 0){
                            self.setData({gindex:self.data.gindex+1, qr:self.data.gqrlist[self.data.gindex+1],poorflag:true});
                        }else if(self.data.tab === 1){
                            self.setData({perindex:self.data.perindex+1, qr:self.data.perqrlist[self.data.perindex+1],poorflag:true});
                        }else if(self.data.tab === 2){
                            self.setData({pubindex:self.data.pubindex+1, qr:self.data.pubqrlist[self.data.pubindex+1],poorflag:true});
                        }
                        wx.showToast({title:'积分不够请充值'})
                    }

                })


            }
            let tmploadingflag = this.data.tab === 0 ? gloadingflag : (this.data.tab === 1 ? perloadingflag : publoadingflag);
            if(tmpqrlist.length > 0 && tmpindex === tmpqrlist.length-1 && !tmploadingflag){//已到达最后重新加载更多
                this.changeLoadingFlag(true);
                Api.getQRListNew(this.data.tab+1,20).then(function(res){
                    if(res.status === MsgType.EErrorType.EOK){
                        console.log('请求成功：',res.data);
                        if(res.data.length < 1){
                            wx.showToast({title:'没有更多内容'});
                            return self.changeLoadingFlag(false);
                        }else{
                            return self.changeIndexAndQR(res.data);
                        }
                    }
                })
            }
            return;
        }
        // 向下滑动
        if (touchMovey - touchDoty >= 40 && time < 10) {
            if(this.data.poorflag){
                return wx.showToast({title:'积分不够，请先充值'});
            }
            console.log('向下滑动');
            moveflag = true;
            let tmpqrlist = (this.data.tab === 0 ? this.data.gqrlist :(this.data.tab === 1 ? this.data.perqrlist : this.data.pubqrlist));
            let tmpindex = (this.data.tab === 0 ? this.data.gindex :(this.data.tab === 1 ? this.data.perindex : this.data.pubindex));
            if(tmpindex === -1){
                return wx.showToast({title:'没有更多内容'});
            }
            if(tmpindex === 0){
                return wx.showToast({title:'已到顶部'});
            }
            if(tmpqrlist.length > 0 && tmpindex > 0){
                if(this.data.tab === 0){
                    this.setData({gindex:this.data.gindex-1, qr:this.data.gqrlist[this.data.gindex-1]});
                }else if(this.data.tab === 1){
                    this.setData({perindex:this.data.perindex-1, qr:this.data.perqrlist[this.data.perindex-1]});
                }else if(this.data.tab === 2){
                    this.setData({pubindex:this.data.pubindex-1, qr:this.data.pubqrlist[this.data.pubindex-1]});
                }
            }
            return;
        }
    },
    // 触摸结束事件
    touchEnd: function (e) {
        clearInterval(interval); // 清除setInterval
        time = 0;
        moveflag=false;
    },
    onShareAppMessage:function(options){
        if (options.from === 'button') {
            // 来自页面内转发按钮
            console.log(options.target);
        }else if(options.from === 'menu'){
            //来自右上角转发
            console.log('来自右上角转发');
        }
        if(!this.data.qr || !this.data.qr._id){
            return wx.showToast({
                title:'qr不存在'
            });
        }
        let path = '/pages/qr/index?' + 'qrid='+this.data.qr._id+'&isshare=1';
        return {
            title: '测试转发',
            path: path,
            success: function(res) {
                // 转发成功
            },
            fail: function(res) {
                // 转发失败
            }
        }
    },
    previewQR: function(){//预览二维码
        let self = this;
        if(!self.data.qr || !self.data.qr.groupQR){
            return console.log('invalid qr.');
        }
        /*wx.scanCode({
            success: (res) => {
                console.log(res)
            }
        })*/
        wx.previewImage({
            current: '', // 当前显示图片的http链接
            urls: [self.data.qr.groupQR] // 需要预览的图片http链接列表
        })
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
    initdata:function(qrid){
        let self = this;
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
    },
    initdatafromserver:function(qrid){
        let self = this;
        return function(){
            Api.getQR(qrid).then(function(res){
                if(res.status === 1){
                    console.log('initdatafromserver:get qr success.');
                    let qrtmp = res.data;
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
                }else{
                    console.log('initdatafromserver:get qr failed.');
                }
            }).catch(function(err){
                console.log('initdatafromserver:get qr err:.',err);
            })
        }
    },
    initdatanew:function(){
        let self = this;
        let promises = [Api.getQRListNew(1,20),Api.getQRListNew(2,20),Api.getQRListNew(3,20)];
        Promise.all(promises).then(function(res){
            console.log('initdatanew:res:',res);
            let gqr = res[0], perqr = res[1], pubqr = res[2];
            if(perqr.status === MsgType.EErrorType.EOK){
                if(perqr.data.length > 0){
                    self.setData({perqrlist:perqr.data});
                }
            }
            if(pubqr.status === MsgType.EErrorType.EOK){
                if(pubqr.data.length > 0){
                    self.setData({pubqrlist:pubqr.data});
                }
            }
            if(gqr.status === MsgType.EErrorType.EOK){
                if(gqr.data.length < 1){
                    return wx.showToast({title:'没有更多微信群'});
                }
                console.log('initdatanew:success:',gqr.data);
                self.setData({gqrlist:gqr.data});
                if(app.globalData.user.weibi > 0){

                    Api.viewQR(gqr.data[self.data.gindex+1]._id).then(function(res){
                        if(res.status === MsgType.EErrorType.EOK){
                            self.setData({gindex:self.data.gindex+1,qr:self.data.gqrlist[self.data.gindex+1]});
                        }else{
                            self.setData({poor:true});
                        }
                    })
                }else{
                    self.setData({poor:true});
                }
            }
        }).catch(function (err) {
            console.log('initdatanew:err:',err);
        })
    },
    onLoad: function (options) {
        console.log('QR开始初始化...');
        console.log('QR参数：',options);
        let self = this;
        if(options.isshare && parseInt(options.isshare) === 1){
            // 通过分享进入该页面
            if(!options.qrid){
                return wx.showToast({
                    title:'qrid不存在'
                });
            }
            if(!app.globalData.user){
                app.globalData.cb = self.initdatafromserver(options.qrid);
            }else{
                (self.initdatafromserver(options.qrid))();
            }
            return;
        }
        if(!app.globalData.user){
            app.globalData.cb = self.initdatanew;
        }else{
            self.initdatanew()
        }
    }
});
