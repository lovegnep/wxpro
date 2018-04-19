//index.js
//获取应用实例
const app = getApp()
const ApiConfig = require('../../api/config');
const Config = require('../../config');
const Api = require('../../api/api');

Page({
    data: {
        qrlist: [],
        groupavatar:'/icon/avatar.png',
        groupQR:'/icon/qr.png',
        masterQR:'/icon/qr.png',
        location:['全部'],
        industry:['请选择'],
        index:0,
        region:['中国']
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
            url: '../logs/logs'
        })
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
        wx.chooseImage({
            success: function(res) {
                var tempFilePaths = res.tempFilePaths;
                wx.uploadFile({
                    url: ApiConfig.UploadImg, //仅为示例，非真实的接口地址
                    filePath: tempFilePaths[0],
                    name: "imgFile",
                    success: function(res){
                        let data = JSON.parse(res.data);
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
