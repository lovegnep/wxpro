

const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}


/**
 * 封封微信的的request
 */
function request(url, data = {}, method = "GET", needlogin) {
    if (needlogin) {
        let sessionkey = wx.getStorageSync('sessionkey');
        if (!sessionkey) {
            console.log("request: sessionkey not exist. please login first.");
            return null;
        } else {
            return new Promise(function (resolve, reject) {
                wx.request({
                    url: url,
                    data: data,
                    method: method,
                    header: {
                        'Content-Type': 'application/json',
                        sessionkey: sessionkey
                    },
                    success: function (res) {
                        console.log("success");
                        resolve(res.data);
                    },
                    fail: function (err) {
                        reject(err)
                        console.log("failed")
                    }
                })
            });
        }
    } else {
        return new Promise(function (resolve, reject) {
            wx.request({
                url: url,
                data: data,
                method: method,
                header: {
                    'Content-Type': 'application/json'
                    //'X-Nideshop-Token': wx.getStorageSync('token')
                },
                success: function (res) {
                    console.log("success");
                    resolve(res.data);
                },
                fail: function (err) {
                    reject(err)
                    console.log("failed")
                }
            })
        });
    }

}

/**
 * 检查微信会话是否过期
 */
function checkSession() {
    return new Promise(function (resolve, reject) {
        wx.checkSession({
            success: function () {
                resolve(true);
            },
            fail: function () {
                reject(false);
            }
        })
    });
}

/**
 * 调用微信登录
 */
function login() {
    return new Promise(function (resolve, reject) {
        wx.login({
            success: function (res) {
                if (res.code) {
                    //登录远程服务器
                    console.log(res)
                    resolve(res);
                } else {
                    reject(res);
                }
            },
            fail: function (err) {
                reject(err);
            }
        });
    });
}

function getUserInfo() {
    return new Promise(function (resolve, reject) {
        wx.getUserInfo({
            withCredentials: true,
            success: function (res) {
                console.log(res)
                resolve(res);
            },
            fail: function (err) {
                reject(err);
            }
        })
    });
}

function generatePath(path, obj) {
    if (!path || path.length < 1) {
        return null;
    }
    let keys = Object.keys(obj);
    let len = keys.length;
    let respath = path + '?';
    let reskv = '';
    for (let i = 0; i < len; i++) {
        if(i!==len-1){
            reskv += keys[i] + '=' + obj[keys[i]] + '&';
        }else{
            reskv += keys[i] + '=' + obj[keys[i]];
        }

    }
    if (reskv.length < 1) {
        return path;
    } else {
        return respath + reskv;
    }
}
function combineFuns(arr){
    let tmpfun = function(){};
    if(!arr || arr.length <1){
        return tmpfun;
    }
    return function(){
        let len = arr.length;
        for(let i = 0; i < len; i++){
            arr[i]();
        }
    }

}
module.exports = {
    formatTime: formatTime,
    request: request,
    checkSession: checkSession,
    login: login,
    getUserInfo: getUserInfo,
    generatePath: generatePath,
    combineFuns:combineFuns
};
