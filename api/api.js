/**
 * Created by Administrator on 2018/4/16.
 */
const Config = require('./config');
const Utils = require('../utils/util');

let getAllQRList = function(skip,sorttype,limit){
    limit = limit || 0;
    return Utils.request(Config.AllQRList,{skip:skip,sorttype:sorttype,limit:limit},"GET");
};
let getQR = function(_id){
    return Utils.request(Config.TheQR,{_id:_id},"GET");
}
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
};

let upComment = function(data){
    return Utils.request(Config.UpComment,data,"POST",true);
};
let cUpComment = function(data){
    return Utils.request(Config.CUpComment,data,"POST",true);
};
let downComment = function(data){
    return Utils.request(Config.DownComment,data,"POST",true);
};
let cDownComment = function(data){
    return Utils.request(Config.CDownComment,data,"POST",true);
};

let upQR = function(data){
    return Utils.request(Config.UpQR,data,"POST",true);
};
let cUpQR = function(data){
    return Utils.request(Config.CUpQR,data,"POST",true);
};
let downQR = function(data){
    return Utils.request(Config.DownQR,data,"POST",true);
};
let cDownQR = function(data){
    return Utils.request(Config.CDownQR,data,"POST",true);
};
let collectQR = function(data){
    return Utils.request(Config.CollectQR,data,"POST",true);
};
let cCollectQR = function(data){
    return Utils.request(Config.CCollectQR,data,"POST",true);
};

let getQRCommentNum = function(data){
    return Utils.request(Config.GetQRCommentNum,data,"POST",true);
}

let getQRComment = function(data){
    return Utils.request(Config.GetQRComment,data,"POST",true);
}

let newComment = function(data){
    return Utils.request(Config.NewComment,data,"POST",true);
}
module.exports = {
    getQR:getQR,
    getAllQRList:getAllQRList,
    getAllQRListOfUser:getAllQRListOfUser,
    getIndustry:getIndustry,
    getLocation:getLocation,
    uploadGroup:uploadGroup,

    upComment:upComment,
    cUpComment:cUpComment,
    downComment:downComment,
    cDownComment:cDownComment,
    newComment:newComment,

    upQR:upQR,
    cUpQR:cUpQR,
    downQR:downQR,
    cDownQR:cDownQR,
    collectQR:collectQR,
    cCollectQR:cCollectQR,

    getQRCommentNum:getQRCommentNum,
    getQRComment:getQRComment,
};