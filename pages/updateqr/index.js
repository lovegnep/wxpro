//index.js
//获取应用实例
const app = getApp()
const ApiConfig = require('../../api/config');
const Config = require('../../config');
const Api = require('../../api/api');
const MsgType = require('../../common/msgtype');

Page({
    data: {
        qrlist: [],
        groupavatar:'/icon/avatar.png',
        groupQR:'/icon/qr.png',
        masterQR:'/icon/qr.png',
        location:['全部'],
        industry:['请选择'],
        birthday:'',
        groupname:'',
        abstract:'',
        grouptag:'',
        masterwx:'',//上传都微信号，个人微信号，公众呈ID
        gender:0,
        index:0,
        region:['中国'],
        tab:-1,
        record:false,
        grecord:[],
        perrecord:[],
        pubrecord:[],
        qr:{}
    },
    selecttab:function(e){
        let id = e.target.id;
        switch(id){
            case '1' :
                this.setData({tab:1});
                break;
            case '2':
                this.setData({tab:2});
                break;
            case '3':
                this.setData({tab:3});
                break;
            default:
        }
    },
    processSelectRecord:function(){
        let self = this;
        if(self.data.tab === 1){//群
            return Api.getAllQRListOfUser({type:MsgType.QRType.EGroup,skip:self.data.grecord.length}).then(function(res){
                if(res.status === MsgType.EErrorType.EOK){
                    self.setData({grecord:[...self.data.grecord,...res.data],record:true});
                }
            })
        }else if(self.data.tab === 2){
            return Api.getAllQRListOfUser({type:MsgType.QRType.EPerson,skip:self.data.perrecord.length}).then(function(res){
                if(res.status === MsgType.EErrorType.EOK){
                    self.setData({perrecord:[...self.data.perrecord,...res.data],record:true});
                }
            })
        }else if(self.data.tab === 3){
            return Api.getAllQRListOfUser({type:MsgType.QRType.EPublic,skip:self.data.pubrecord.length}).then(function(res){
                if(res.status === MsgType.EErrorType.EOK){
                    self.setData({pubrecord:[...self.data.pubrecord,...res.data],record:true});
                }
            })
        }
        self.setData({record:true});
    },
    selectUorR:function(e){
        let type =  e.currentTarget.dataset.type;
        switch(type){
            case '1':
                this.setData({record:false});
                break;
            case '2':
                this.processSelectRecord();
                break;
        }
    },
    upper:function(e){

    },
    lower:function(e){
        console.log('滑到底部重新加载');

        this.processSelectRecord();
    },
    bindRegionChange: function (e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            region: e.detail.value
        })
    },
    bindPickerChange: function(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
          index: e.detail.value
        })
    },
    cmpobj:function(old,newobj){
        let flag = true;
        if(old.groupavatar !== newobj.groupavatar){
            flag = false;
        }
        if(old.groupQR !== newobj.groupQR){
            flag = false;
        }
        if(old.masterQR !== newobj.masterQR){
            flag = false;
        }
        if(old.location !== newobj.location){
            flag = false;
        }
        if(old.industry !== newobj.industry){
            flag = false;
        }
        if(old.birthday !== newobj.birthday){
            flag = false;
        }
        if(old.groupname !== newobj.groupname){
            flag = false;
        }
        if(old.abstract !== newobj.abstract){
            flag = false;
        }
        if(old.grouptag !== newobj.grouptag){
            flag = false;
        }
        if(old.masterwx !== newobj.masterwx){
            flag = false;
        }
        if(old.gender !== newobj.gender){
            flag = false;
        }
        return flag;
    },
    formSubmit: function (e) {
        let self = this;
        console.log('form发生了submit事件，携带数据为：', e.detail.value);
        let data = e.detail.value;
        data.location = data.location.join(',');
        console.log("location:",data.location);
        if(this.data.tab === -1){
            return wx.showToast({
                title: '未知错误',
                icon: 'fail',
            });
        }
        data.type = parseInt(this.data.tab);
        if(!data.groupname || data.groupname === '' || data.groupname.length < 2){
            return wx.showToast({
                title: 'groupname非法',
                icon: 'fail',
            });
        }
        if(!data.groupavatar || data.groupavatar === '' || data.groupavatar.length < 10){
            return wx.showToast({
                title: 'groupavatar非法',
                icon: 'fail',
            });
        }
        if(this.cmpobj(this.data.qr,data)){
            return wx.showToast({title:'没有修改'});
        }
        data.qrid = this.data.qr._id;
        Api.updateQR(data).then(function(res){
            if(res.status === MsgType.EErrorType.EOK){
                wx.showToast({
                    title: '上传成功',
                    icon: 'success',
                });
                let path = '/pages/qr/qr?qrid='+self.data.qr._id;
                wx.navigateTo({url:path});
            }
        }).catch(function(err){
            console.log("上传失败",err);
            wx.showToast({
                title: '上传失败',
            });
        })
    },
    formReset: function () {
        console.log('form发生了reset事件');
        this.setData({
            qrlist: [],
            groupavatar:'/icon/avatar.png',
            groupQR:'/icon/qr.png',
            masterQR:'/icon/qr.png',
            location:['全部'],
            industry:['请选择'],
            index:0,
            region:['中国']
        });
    },
    //事件处理函数
    bindViewTap: function () {
        wx.navigateTo({
            url: ''
        })
    },
    processInput:function(e){
        let type = e.currentTarget.dataset.type;
        let value = e.detail.value;
        console.log('processInput:',type,value);
        switch(type){
            case '1':
                this.setData({masterwx:value});
                break;
            case '2':
                this.setData({groupname:value});
                break;
            case '3':
                this.setData({abstract:value});
                break;
            case '4':
                this.setData({grouptag:value});
                break;
            case '5':
                this.setData({birthday:value});
                break;
            case '6':
                this.setData({gender:value});
                break;
            default:
        }
    },
    onShow:function(){
        //this.setData({tab:-1});
    },
    initselect:function(){
        this.setData({tab:-1});
    },
    onLoad: function (options) {
        let self = this;
        let qrid = options.query.qrid;
        let tab = parseInt(options.query.type);
        if(tab !== 1 && tab !== 2 && tab !== 3){
            return wx.showToast({title:'初始化失败'});
        }
        let cb = function(indus,ind){
            let index = indus.indexOf(ind);
            if(index > -1){
                self.setData({index:index});
            }
        };
        let cbtmp = null;
        Api.getQR(qrid).then(function(res){
            if(res.status === MsgType.EErrorType.EOK){
                let [groupavatar,groupQR,masterQR,location,industry,birthday,groupname,abstract,grouptag,masterwx,gender] = res.data;
                let query = {};
                if(groupavatar&&groupavatar!==''){
                    query.groupavatar = groupavatar;
                }
                if(groupQR&&groupQR!==''){
                    query.groupQR = groupQR;
                }
                if(masterQR&&masterQR!==''){
                    query.masterQR = masterQR;
                }
                if(location&&location!==''){
                    query.location = location;
                }
                if(industry&&industry!==''){
                    //query.industry = industry;
                    if(self.data.industry.length > 1){
                        cb(self.data.industry,industry);
                    }else{
                        cbtmp = function(indus){
                            let index = indus.indexOf(industry);
                            if(index > -1){
                                self.setData({index:index});
                            }
                        }
                    }
                }
                if(birthday&&birthday!==''){
                    query.birthday = birthday;
                }
                if(groupname&&groupname!==''){
                    query.groupname = groupname;
                }
                if(abstract&&abstract!==''){
                    query.abstract = abstract;
                }
                if(grouptag&&grouptag!==''){
                    query.grouptag = grouptag;
                }
                if(masterwx&&masterwx!==''){
                    query.masterwx = masterwx;
                }
                if(gender){
                    query.gender = gender;
                }
                query.qr = res.data;
                query.tab = tab;
                self.setData(query);
            }
        })
        Api.getIndustry().then(function(types){
            if(types && types.data && types.data.length > 0){
                let res = ['请选择'];
                types.data.forEach(function(item){
                    res.push(item["name"]);
                });
                self.setData({industry:res});
                if(cbtmp){
                    cbtmp(res);
                }
                console.log('getIndustry:success:',types);
            }
        }).catch(function(err){
            console.log('onLoad:getindustry err:',err);
        });
        Api.getLocation(1).then(function(locations){
            if(locations && locations.data &&locations.data.length > 0){
                let res = ['全部',...locations.data];
                self.setData({location:res});
                console.log('getLocation:success:',locations);
            }
        }).catch(function(err){
            console.log('onLoad:getLocation err:',err);
        });
    },
    uploadImg:function(type){
        let self = this;
        let imgtype = 0;
        switch(type){
            case '1':
                imgtype = MsgType.ImgType.EAvatar;
                break;
            case '2':
                imgtype = MsgType.ImgType.EGQR;
                break;
            case '3':
                imgtype = MsgType.ImgType.EUploaderQR;
                break;
            default:
                return console.log('invalid type');
        }
        wx.chooseImage({
            success: function(res) {
                var tempFilePaths = res.tempFilePaths;
                wx.uploadFile({
                    url: ApiConfig.UploadImg, //
                    filePath: tempFilePaths[0],
                    name: "imgFile",
                    formData:{
                        type:imgtype
                    },
                    success: function(res){
                        let data = JSON.parse(res.data);
                        if(parseInt(data.status) === MsgType.EErrorType.EInvalidQR){
                            return wx.showToast({
                                title:'请上传二维码'
                            })
                        }
                        let filename = data.filename;
                        switch(type){
                            case '1':
                                self.setData({groupavatar:Config.apihead+filename});
                                break;
                            case '2':
                                self.setData({groupQR:Config.apihead+filename});
                                break;
                            case '3':
                                self.setData({masterQR:Config.apihead+filename});
                                break;
                        }
                    }
                })
            }
        });
    },
    handleImg:function(e){
        this.uploadImg(e.target.id);
    }
});