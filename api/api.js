/**
 * Created by Administrator on 2018/4/16.
 */
const Config = require('./config');
const Utils = require('../utils/util');

let getAllQRList = function(skip,sorttype){
    return Utils.request(Config.AllQRList,{skip:skip,sorttype:sorttype},"GET");
};

let getAllQRListOfUser = function(){
    return Utils.request(Config.AllQRListOfUser,{},"GET");
};


module.exports = {
    getAllQRList:getAllQRList,
    getAllQRListOfUser:getAllQRListOfUser
};