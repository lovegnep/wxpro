//index.js
//获取应用实例
const app = getApp()
const ApiConfig = require('../../api/config');
const Config = require('../../config');
const Api = require('../../api/api');
const MsgType = require('../../common/msgtype');
const Province = require('../../utils/province');

Page({
    data: {
        qrlist: [],
        groupavatar:'/icon/avatar.png',
        groupQR:'/icon/qr.png',
        masterQR:'/icon/qr.png',
        location:'',
        industry:['请选择'],
        birthday:'2000-01-01',
        gender:3,
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
        pubrecord:[],
        genderitems:[{value:'男',name:1,checked:false},{value:'女',name:2,checked:false},{value:'保密',name:3,checked:false}],
        multiIndex:[0,0,0],
        multiArray:[[{item_name:'请选择'}],[{item_name:'请选择'}],[{item_name:'请选择'}]]
    },
    radioChange:function(e){
        let gender = parseInt(e.detail.value);
        console.log(gender);
        this.setData({gender:gender});
    },
    bindBirthdayChange:function(e){
        let birthday = e.detail.value;
        console.log(birthday);
        this.setData({birthday});
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
        console.log('picker发送选择改变，携带值为', e.detail.value);
        let res = e.detail.value.filter(function(item){
            return item > 0;
        });
        if(res.length < 1 || res.length > 3){
            console.log('非法选择位置');
            return;
        }
        this.setData({
            location: this.data.multiArray[res.length-1][res[res.length-1]].item_code
        })
        /*if(res.length === 1){
            //只选择了省
            this.setData({
                location: this.data.multiArray[0][res[0]].item_code
            })
        }else if(res.length === 2){
            //选择了市
            this.setData({
                location: this.data.multiArray[1][res[1]].item_code
            })
        }else if(res.length === 3){
            this.setData({
                location: this.data.multiArray[2][res[2]].item_code
            })
        }*/

    },
    bindMultiPickerColumnChange:function(e){
        let res = e.detail;
        let self = this;
        if(res.column === 0){
            //选择了省份,加载对应的市
            let tmpind = [...self.data.multiIndex];
            tmpind[0] = res.value;
            self.setData({multiIndex:[res.value,0,0]});
            let shi = Province.getLocations(self.data.multiArray[0][res.value].item_code);
            let tmparr = [...self.data.multiArray];
            tmparr[1] = [{item_name:'请选择'},...shi];
            tmparr[2] = [{item_name:'请选择'}];
            self.setData({multiArray:tmparr});
        }else if(res.column === 1){
            //选择了市,加载对应的县
            let tmpind = [...self.data.multiIndex];
            tmpind[1] = res.value;
            tmpind[2] = 0;
            self.setData({multiIndex:tmpind});
            let xian = Province.getLocations(self.data.multiArray[1][res.value].item_code);
            let tmparr = [...self.data.multiArray];
            tmparr[2] = [{item_name:'请选择'},...xian];
            self.setData({multiArray:tmparr});
        }else if(res.column === 2){
            let tmpind = [...self.data.multiIndex];
            tmpind[2] = res.value;
            self.setData({multiIndex:tmpind});
        }
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
        data.location = this.data.location;
        console.log("location:",data.location);
        if(this.data.tab === -1){
            return wx.showToast({
                title: '未知错误',
                icon: 'fail',
            });
        }
        if(this.data.index === 0){
            return wx.showToast({title:'请选择行业'});
        }
        data.industry = this.data.industry[this.data.index];
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
        wx.showLoading({title:'上传中...',mask:true});
        Api.uploadGroup(data).then(function(res){
            wx.hideLoading();
            if(res.status === MsgType.EErrorType.EOK){
                wx.showToast({
                    title: '上传成功',
                });
                console.log("上传后的数据：", res.data);
            }else{
                console.log('upload:res',res);
            }
        }).catch(function(err){
            wx.hideLoading();
            wx.showToast({
                title: '上传失败',
            });
            console.log('upload：err',err);
        })
    },
    formReset: function () {
        console.log('form发生了reset事件');
        this.setData({
            qrlist: [],
            groupavatar:'/icon/avatar.png',
            groupQR:'/icon/qr.png',
            masterQR:'/icon/qr.png',
            location:'',
            index:0,
            birthday:'2000-01-01',
            gender:3,
            genderitems:[{value:'男',name:1,checked:false},{value:'女',name:2,checked:false},{value:'保密',name:3,checked:true}],
            multiIndex:[0,0,0],
            multiArray:[[{item_name:'请选择'}],[{item_name:'请选择'}],[{item_name:'请选择'}]]
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
        let res = Province.getLocations();
        let tmparr = [...self.data.multiArray];
        tmparr[0] = [...tmparr[0],...res];
        self.setData({multiArray:tmparr});

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
                let sessionkey = wx.getStorageSync('sessionkey');
                wx.uploadFile({
                    url: ApiConfig.UploadImg, //
                    filePath: tempFilePaths[0],
                    name: "imgFile",
                    formData:{
                        type:imgtype
                    },
                    header:{
                        sessionkey: sessionkey
                    },
                    success: function(res){
                        let data = JSON.parse(res.data);
                        if(parseInt(data.status) === MsgType.EErrorType.EInvalidQR){
                            return wx.showToast({
                                title:'请上传二维码'
                            })
                        }else if(parseInt(data.status) !== MsgType.EErrorType.EOK){
                            return wx.showToast({title:'错误码'+data.status});
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
                    },
                    fail:function(){
                        wx.showToast({title:'失败'});
                    }
                })
            }
        });
    },
    handleImg:function(e){
        this.uploadImg(e.target.id);
    }
});
