
const nums = [ 1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    26,
    27,
    28,
    29,
    30,
    31,
    32,
    33,
    34,
    35,
    36,
    37,
    38,
    39,
    40,
    41,
    42,
    43,
    44,
    45,
    46,
    47,
    48,
    49,
    50,
    51,
    52,
    53,
    54,
    55,
    56,
    57,
    58,
    59,
    60,
    61,
    62,
    63,
    64,
    65,
    66,
    67,
    68,
    69,
    70,
    71,
    72,
    73,
    74,
    75,
    76,
    77,
    78,
    79,
    80,
    81,
    82,
    83,
    84,
    85,
    86,
    87,
    88,
    89,
    90,
    91,
    92,
    93,
    94,
    95,
    96,
    97,
    98,
    99,
    100,101,
    102,
    103,
    104,
    105,
    106,
    107,
    108,
    109,
    110,
    111,
    112,
    113,
    114,
    115,
    116,
    117,
    118,
    119,
    120,
    121,
    122,
    123,
    124,
    125,
    126,
    127,
    128,
    129,
    130,
    131,
    132,
    133,
    134,
    135,
    136,
    137,
    138,
    139,
    140,
    141,
    142,
    143,
    144,
    145,
    146,
    147,
    148,
    149,
    150];
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
    combineFuns:combineFuns,
    nums:nums,
};
