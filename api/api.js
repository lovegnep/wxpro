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

let getLocation = function(index,first){
    if(index === 1){
        return Utils.request(Config.Province,{index:index},"GET");
    }else if(index === 2){
        return Utils.request(Config.Province,{index:index,first:first},"GET");
    }else{
        console.log('getLocation : err index');
        return null;
    }

};

let getIndustry = function(){
    return Utils.request(Config.Types,{},"GET");
};

let uploadGroup = function(data){
    return Utils.request(Config.UploadGroup,data,"POST",true);
}

module.exports = {
    getAllQRList:getAllQRList,
    getAllQRListOfUser:getAllQRListOfUser,
    getIndustry:getIndustry,
    getLocation:getLocation,
    uploadGroup:uploadGroup
};