/**
 * Created by Administrator on 2018/4/16.
 */
const Config = require('../config');

module.exports = {
    AllQRList: Config.apihead + "/api/getallqrlist",
    AllQRListOfUser: Config.apihead + "/api/getqrlist",
    UploadImg: Config.apihead + "/api/uploadImg",
    UploadGroup: Config.apihead + "/api/uploadGroup",
    Login: Config.apihead + "/api/auth",
    Province: Config.apihead + "/api/province",
    Types:Config.apihead + "/api/getTypes"
};