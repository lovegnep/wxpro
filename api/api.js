/**
 * Created by Administrator on 2018/4/16.
 */
const Config = require('./config');
const Utils = require('../utils/util');

let getAllQRList = function(skip,sorttype,limit){
    limit = limit || 0;
    return Utils.request(Config.AllQRList,{skip:skip,sorttype:sorttype,limit:limit},"GET",true);
};
let getQRListNew = function(type,limit){
    limit = limit || 0;
    return Utils.request(Config.AllQRList,{type:type,limit:limit},"GET",true);
};

let viewQR = function(qrid){
    return Utils.request(Config.ViewQR,{_id:qrid},'POST',true);
}

let getQR = function(_id){
    return Utils.request(Config.TheQR,{_id:_id},"GET", true);
}
let getAllQRListOfUser = function(data){
    return Utils.request(Config.AllQRListOfUser,data,"GET",true);
};

let getLocation = function(index){
    return Utils.request(Config.Province,{parent:index},"GET",true);
};

let getIndustry = function(){
    return Utils.request(Config.Types,{},"GET", true);
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

let getviews = function(data){
    return Utils.request(Config.GetViews,data,"POST",true);
}
let getcollections = function(data){
    return Utils.request(Config.GetCollections,data,"POST",true);
}

let doSign = function(){
    return Utils.request(Config.Sign,{},"GET",true);
}
let getUserInfo = function(){
    return Utils.request(Config.GetUserInfo,{},"GET",true);
}
let getWeiBi = function(){
    return Utils.request(Config.GetWeibi,{},"GET",true);
}
let getUploadCount = function(){
    return Utils.request(Config.GetUploadCount,{},'GET',true);
}

let decodeData = function(data){
    return Utils.request(Config.DecodeData,data,'POST',true);
};
let shareIn = function(data){
    return Utils.request(Config.ShareIn,data,'POST',true);
};
let getRecord = function(data){
    return Utils.request(Config.GetRecord,data,'POST',true);
}
let getHotRecord = function(data){
    return Utils.request(Config.GetHotRecord,data,'POST',true);
}
let search = function(data){
    return Utils.request(Config.Search,data,'POST',true);
}
let groupNameSearch = function(data){
    return Utils.request(Config.GroupNameSearch,data,'POST',true);
}
let getHotQrList = function(data){
    return Utils.request(Config.GetHotQR,data,'POST',true);
}
let getWBLog = function(data){
    return Utils.request(Config.GetWBLog,data,'POST',true);
}

let deleterQr = function(data){
    return Utils.request(Config.DelQR,data,'POST',true);
}
let cDeleterQr = function(data){
    return Utils.request(Config.CDelQR,data,'POST',true);
}
let qrUp = function(data){
    return Utils.request(Config.QRUp,data,'POST',true);
}
let qrDown = function(data){
    return Utils.request(Config.QRDown,data,'POST',true);
}
let updateQR = function(data){
    return Utils.request(Config.UpdateQR,data,'POST',true);
}
let f5QR = function(data){
    return Utils.request(Config.F5QR,data,'POST',true);
}
module.exports = {
    f5QR:f5QR,

    updateQR:updateQR,
    qrDown:qrDown,
    qrUp:qrUp,
    cDeleterQr:cDeleterQr,
    deleterQr:deleterQr,

    getWBLog:getWBLog,

    getRecord:getRecord,
    getHotRecord:getHotRecord,
    getHotQrList:getHotQrList,
    search:search,
    groupNameSearch:groupNameSearch,

    decodeData:decodeData,
    shareIn:shareIn,

    getviews:getviews,
    getcollections:getcollections,
    doSign:doSign,
    getUserInfo:getUserInfo,
    getWeiBi:getWeiBi,
    getUploadCount:getUploadCount,

    viewQR:viewQR,
    getQRListNew:getQRListNew,
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