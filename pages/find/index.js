//index.js
//获取应用实例
const app = getApp()
const ApiConfig = require('../../api/config');
const Config = require('../../config');
const Api = require('../../api/api');

Page({
    data: {
    },
    handlesearch:function(e){
        let content = e.detail.value;
        console.log('内容：',content);
    },
    onLoad: function () {

    },

});
