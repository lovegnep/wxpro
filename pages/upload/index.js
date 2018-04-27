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
        index:0,
        region:['中国'],
        tab:-1,
        record:false,
        grecord:[],
        perrecord:[],
        pubrecord:[]
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
            if(self.data.grecord.length < 1){
                return Api.getAllQRListOfUser({type:MsgType.QRType.EGroup}).then(function(res){
                    if(res.status === MsgType.EErrorType.EOK){
                        self.setData({grecord:res.data,record:true});
                    }
                })
            }
        }else if(self.data.tab === 2){
            if(self.data.perrecord.length < 1){
                return Api.getAllQRListOfUser({type:MsgType.QRType.EPerson}).then(function(res){
                    if(res.status === MsgType.EErrorType.EOK){
                        self.setData({perrecord:res.data,record:true});
                    }
                })
            }
        }else if(self.data.tab === 3){
            if(self.data.pubrecord.length < 1){
                return Api.getAllQRListOfUser({type:MsgType.QRType.EPublic}).then(function(res){
                    if(res.status === MsgType.EErrorType.EOK){
                        self.setData({pubrecord:res.data,record:true});
                    }
                })
            }
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
    formSubmit: function (e) {
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
        Api.uploadGroup(data).then(function(res){
            let resdata = res;
            if(resdata.status === 1){
                console.log("上传成功");
            }
            console.log("上传后的数据：", resdata.data);
            wx.showToast({
                title: '上传成功',
                icon: 'success',
            });
        }).catch(function(err){
            console.log("上传失败");
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
            default:
        }
    },
    onShow:function(){
        //this.setData({tab:-1});
    },
    initselect:function(){
        this.setData({tab:-1});
    },
    onLoad: function () {
        let self = this;
        Api.getIndustry().then(function(types){
            if(types && types.data && types.data.length > 0){
                let res = ['请选择'];
                types.data.forEach(function(item){
                    res.push(item["name"]);
                });
                self.setData({industry:res});
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
