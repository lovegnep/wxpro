/**
 * Created by Administrator on 2018/4/16.
 */
const Config = require('../config');

module.exports = {
    ViewQR:Config.apihead + '/api/viewqr',
    TheQR: Config.apihead + "/api/getqr",
    AllQRList: Config.apihead + "/api/getallqrlist",
    AllQRListOfUser: Config.apihead + "/api/getqrlist",
    UploadImg: Config.apihead + "/api/uploadImg",
    UploadGroup: Config.apihead + "/api/uploadGroup",
    Login: Config.apihead + "/api/auth",
    Province: Config.apihead + "/api/province",
    Types:Config.apihead + "/api/getTypes",

    UpComment:Config.apihead + "/api/upcomment",
    CUpComment:Config.apihead + "/api/cupcomment",
    DownComment:Config.apihead + "/api/downcomment",
    CDownComment:Config.apihead + "/api/cdowncomment",

    UpQR:Config.apihead + "/api/upqr",
    CUpQR:Config.apihead + "/api/cupqr",
    DownQR:Config.apihead + "/api/downqr",
    CDownQR:Config.apihead + "/api/cdownqr",

    CollectQR:Config.apihead + "/api/collectqr",
    CCollectQR:Config.apihead + "/api/ccollectqr",
    GetQRCommentNum:Config.apihead + "/api/getqrcommentnum",
    GetQRComment:Config.apihead + "/api/getqrcomment",
    NewComment:Config.apihead + "/api/newcomment",

    GetViews:Config.apihead + "/api/getviews",
    GetCollections:Config.apihead + "/api/getcollections",
    GetUserInfo:Config.apihead + "/api/getuserinfo",
    GetWeibi:Config.apihead + "/api/getweibi",
    Sign:Config.apihead + "/api/sign",
    GetUploadCount:Config.apihead + "/api/getuploadcount",

    DecodeData:Config.apihead+"/api/decode",
    ShareIn:Config.apihead+"/api/sharein",
    GetRecord:Config.apihead+"/api/getsearchrecords",
    Search:Config.apihead+"/api/search",
    GroupNameSearch:Config.apihead+"/api/groupnamesearch",
};