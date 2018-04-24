/**
 * Created by Administrator on 2018/4/16.
 */
const Config = require('../config');

module.exports = {
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
};