//index.js
//获取应用实例
const app = getApp()
const ApiConfig = require('../../api/config');
const Config = require('../../config');

Page({
    data: {
        qrlist: [],
        groupavatar:'',
        groupQR:'',
        masterQR:''
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
