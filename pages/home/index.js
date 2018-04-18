//index.js
//获取应用实例
const app = getApp()
const ApiConfig = require('../../api/config');
const Config = require('../../config');
const Api = require('../../api/api');

Page({
    data: {
        qrlist: [],
        groupavatar:'',
        groupQR:'',
        masterQR:'',
        location:[],
        industry:[],
        index:0
    },
    bindPickerChange: function(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
          index: e.detail.value
        })
    },
    formSubmit: function (e) {
        console.log('form发生了submit事件，携带数据为：', e.detail.value)
    },
    formReset: function () {
        console.log('form发生了reset事件')
    },
    //事件处理函数
    bindViewTap: function () {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },
    onLoad: function () {
        let self = this;
        Api.getIndustry().then(function(types){
            if(types && types.data && types.data.length > 0){
                let res = [];
                types.data.forEach(function(item){
                    res.push(item["name"]);
                })
                self.setData({industry:res});
                console.log('getIndustry:success:',types);
            }
        }).catch(function(err){
            console.log('onLoad:getindustry err:',err);
        });
        Api.getLocation(1).then(function(locations){
            if(locations && locations.data &&locations.data.length > 0){
                self.setData({location:locations.data});
                console.log('getLocation:success:',locations);
            }
        }).catch(function(err){
            console.log('onLoad:getLocation err:',err);
        });
    },
    uploadImg:function(type){
        let self = this;
        wx.chooseImage({
            success: function(res) {
                var tempFilePaths = res.tempFilePaths;
                wx.uploadFile({
                    url: ApiConfig.UploadImg, //仅为示例，非真实的接口地址
                    filePath: tempFilePaths[0],
                    name: "imgFile",
                    success: function(res){
                        let filename = res.data.filename;
                        switch(type){
                            case '1':
                                self.setData({groupavatar:Config.apihead+"/"+filename});
                                break;
                            case '2':
                                self.setData({groupQR:Config.apihead+"/"+filename});
                                break;
                            case '3':
                                self.setData({masterQR:Config.apihead+"/"+filename});
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
