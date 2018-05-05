//index.js
//获取应用实例
const app = getApp()
const ApiConfig = require('../../api/config');
const Config = require('../../config');
const Api = require('../../api/api');
const MsgType = require('../../common/msgtype');
const Province = require('../../utils/province');
const Utils = require('../../utils/util');

let searchLocationRes = [];
let sortarr = ['-multiply','-viewCount','-likeCount','commentCount','-updateTime'];
Page({
    data: {
        industry:['不限'],
        index:0,
        genders:['不限','男','女'],
        genderindex:0,
        ages:[['不限',...Utils.nums],['不限',...Utils.nums]],
        ageindex:[0,0],
        tab:0,//0全部，1微信群，2个人微信，3公众号
        history:[],//搜索记录
        hotHistory:[],//最热门搜索记录
        value:'',
        groupname:[],//匹配到的groupname
        showflag:0,//0显示历史搜索，1显示搜索提示，2显示搜索结果
        res:[],//搜索到的结果
        count:0,//总共搜索到的结果数量
        multiIndex:[0,0,0],
        multiArray:[[{item_name:'不限'}],[{item_name:'不限'}],[{item_name:'不限'}]],
        location:'',
        tags:['标签'],
        tagsindex:0,
        sidebarstatus:false,
        sorttab:0
    },
    tapsortitem:function(e){
        let sortarr = ['-multiply','-viewCount','-likeCount','commentCount','-updateTime'];
        let sorttab = e.currentTarget.dataset.sorttab;
        this.setData({sorttab:parseInt(sorttab)});
        let data = {content:this.data.value,tab:this.data.tab};
        if(this.data.index !==0){
            data.industry = this.data.industry[this.data.index];
        }
        if(this.data.location!==''){
            data.location = this.data.location;
        }
        if(this.data.genderindex!==0){
            data.gender = this.data.genders[this.data.genderindex];
        }
        let agestart = this.data.ageindex[0];
        let ageend = this.data.ageindex[1];
        if(agestart){
            data.agestart = agestart;
        }
        if(ageend){
            data.ageend = ageend;
        }
        data.sort =sortarr[this.data.sorttab];
        this.doSearch(data);
    },
    tapinwrap:function(e){
        this.setData({sidebarstatus:false});
    },
    tapinside:function(e){

    },
    tapclosesidebar:function(){
        this.setData({sidebarstatus:false});
    },
    tapsidebar:function(){
        this.setData({sidebarstatus:true});
    },
    bindGenderPickerChange:function(e){
        this.setData({
            genderindex: e.detail.value
        });
        let data = {content:this.data.value,tab:this.data.tab};
        if(this.data.index !==0){
            data.industry = this.data.industry[this.data.index];
        }
        if(this.data.location!==''){
            data.location = this.data.location;
        }
        if(this.data.genderindex!==0){
            data.gender = this.data.genders[this.data.genderindex];
        }
        let agestart = this.data.ageindex[0];
        let ageend = this.data.ageindex[1];
        if(agestart){
            data.agestart = agestart;
        }
        if(ageend){
            data.ageend = ageend;
        }
        this.doSearch(data);
    },
    bindAgePickerChange:function(e){
        this.setData({ageindex:e.detail.value});
        let data = {content:this.data.value,tab:this.data.tab};
        if(this.data.index !==0){
            data.industry = this.data.industry[this.data.index];
        }
        if(this.data.location!==''){
            data.location = this.data.location;
        }
        if(this.data.genderindex!==0){
            data.gender = this.data.genders[this.data.genderindex];
        }
        let agestart = parseInt(e.detail.value[0]);
        let ageend = parseInt(e.detail.value[1]);
        if(agestart){
            data.agestart = agestart;
        }
        if(ageend){
            data.ageend = ageend;
        }
        data.sort =sortarr[this.data.sorttab];
        this.doSearch(data);
    },
    bindPickerChange: function(e) {//行业变化
        console.log('行业picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            index: parseInt(e.detail.value)
        });
        let industry = this.data.industry[parseInt(e.detail.value)];
        let content = this.data.value;
        let data = {content:this.data.value,tab:this.data.tab};
        if(parseInt(e.detail.value) !== 0){
            data.industry = industry;
        }
        if(this.data.location!==''){
            data.location = this.data.location;
        }
        if(this.data.genderindex!==0){
            data.gender = this.data.genders[this.data.genderindex];
        }
        let agestart = this.data.ageindex[0];
        let ageend = this.data.ageindex[1];
        if(agestart){
            data.agestart = agestart;
        }
        if(ageend){
            data.ageend = ageend;
        }
        data.sort =sortarr[this.data.sorttab];
        this.doSearch(data);
    },
    doSearch:function(data){
        let self = this;
        console.log('doSearch:',data);
        Api.search(data).then(function(res){
            if(res.status === MsgType.EErrorType.EOK){
                console.log("search res:",res);
                let count = res.count;
                if(count!==undefined){
                    self.setData({count:count});
                }
                let locations= res.locations;//位置数组
                if(locations&&locations.length > 0){
                    searchLocationRes = [...locations];
                    self.processLocs(locations);
                }
                let industrys = res.industrys;//行业数组
                if(industrys&&industrys.length > 0){
                    self.setData({industry:['不限',...industrys]});
                }
                let tags = res.tags;//标签数组;
                if(tags&&tags.length > 0){
                    self.setData({tags:['不限',...tags]});
                }
                self.setData({res:res.data,showflag:2});
            }
        })
    },
    bindRegionChange: function (e) {
        console.log('picker发送选择改变，携带值为', e.detail.value);
        this.setData({multiIndex:e.detail.value})
        let res = e.detail.value.filter(function(item){
            return item > 0;
        });
        let data = {content:this.data.value,tab:this.data.tab};
        if(this.data.index !== 0){
            data.industry = this.data.industry[this.data.index];
        }
        if(res.length > 0){
            data.location = this.data.multiArray[res.length-1][res[res.length-1]].item_code;
            this.setData({
                location: data.location
            });
        }else{
            this.setData({
                location: ''
            });
        }
        data.sort =sortarr[this.data.sorttab];
        this.doSearch(data);
        /*if(res.length === 1){
            //只选择了省
            this.setData({
                location: this.data.multiArray[0][res[0]].item_code
            })
        }else if(res.length === 2){
            //选择了市
            this.setData({
                location: this.data.multiArray[1][res[1]].item_code
            })
        }else if(res.length === 3){
            this.setData({
                location: this.data.multiArray[2][res[2]].item_code
            })
        }*/

    },
    bindMultiPickerColumnChange:function(e){
        let res = e.detail;
        let self = this;
        if(res.column === 0){
            //选择了省份,加载对应的市
            let tmpind = [...self.data.multiIndex];
            tmpind[0] = res.value;
            //self.setData({multiIndex:[res.value,0,0]});
            let shi =Province.filterArr( Province.getLocations(self.data.multiArray[0][res.value].item_code),Province.getShiByarr(searchLocationRes));
            let tmparr = [...self.data.multiArray];
            tmparr[1] = [{item_name:'请选择'},...shi];
            tmparr[2] = [{item_name:'请选择'}];
            self.setData({multiArray:tmparr});
        }else if(res.column === 1){
            //选择了市,加载对应的县
            let tmpind = [...self.data.multiIndex];
            tmpind[1] = res.value;
            tmpind[2] = 0;
            //self.setData({multiIndex:tmpind});
            let xian =Province.filterArr( Province.getLocations(self.data.multiArray[1][res.value].item_code),Province.getXianByarr(searchLocationRes));
            let tmparr = [...self.data.multiArray];
            tmparr[2] = [{item_name:'请选择'},...xian];
            self.setData({multiArray:tmparr});
        }else if(res.column === 2){
            let tmpind = [...self.data.multiIndex];
            tmpind[2] = res.value;
            //self.setData({multiIndex:tmpind});
        }
    },
    taphis:function(e){
        let self = this;
        let value = e.currentTarget.dataset.name;
        if(value.length < 2){
            return wx.showToast({title:'内容太短'});
        }
        this.setData({value:value});
        let data = {content:value,tab:this.data.tab};
        if(this.data.index !==0){
            data.industry = this.data.industry[this.data.index];
        }
        if(this.data.location!==''){
            data.location = this.data.location;
        }
        if(this.data.genderindex!==0){
            data.gender = this.data.genders[this.data.genderindex];
        }
        let agestart = this.data.ageindex[0];
        let ageend = this.data.ageindex[1];
        if(agestart){
            data.agestart = agestart;
        }
        if(ageend){
            data.ageend = ageend;
        }
        this.doSearch(data);
    },
    taptab:function(e){
        let self = this;
        let id = parseInt(e.currentTarget.dataset.id);
        if(id !== this.data.tab&&this.data.value.length >= 2){
            Api.groupNameSearch({tab:id,content:this.data.value}).then(function(res){
                if(res.status === MsgType.EErrorType.EOK){
                    self.setData({tab:id,groupname:res.data});
                }
            })
        }
        self.setData({tab:id});
    },
    gotoqr:function(e){
        let _id = e.currentTarget.dataset._id;
        let path = '/pages/qr/qr?qrid='+_id;
        wx.navigateTo({url:path});
    },
    tapgroupname:function(e){
        let self = this;
        let name = e.currentTarget.dataset.name;
        if(name === this.data.value){
            return console.log('相同');
        }
        this.setData({value:name});
        Api.groupNameSearch({tab:self.data.tab,content:name}).then(function(res){
            if(res.status === MsgType.EErrorType.EOK){
                self.setData({groupname:res.data});
            }
        })
    },
    upper:function(){
        console.log('顶部');
    },
    sxlower:function(){
        console.log('右边');
        let self = this;
        Api.getRecord({skip:self.data.history.length}).then(function(res){
            if(res.status === MsgType.EErrorType.EOK){
                self.setData({history:[...self.data.history,...res.data]});
            }
        })
    },
    lower:function(){
        console.log('底部');
        let self = this;
        let data = {content:this.data.value,tab:this.data.tab};
        if(this.data.index !== 0){
            data.industry = this.data.industry[this.data.index];
        }
        if(this.data.location!==''){
            data.location = this.data.location;
        }
        if(this.data.genderindex!==0){
            data.gender = this.data.genders[this.data.genderindex];
        }
        let agestart = this.data.ageindex[0];
        let ageend = this.data.ageindex[1];
        if(agestart){
            data.agestart = agestart;
        }
        if(ageend){
            data.ageend = ageend;
        }
        data.sort =sortarr[this.data.sorttab];
        data.skip = this.data.res.length;
        //this.doSearch(data);
        Api.search(data).then(function(res){
            if(res.status === MsgType.EErrorType.EOK){
                if(res.data.length > 0){
                    self.setData({res:[...self.data.res,...res.data],showflag:2});
                }else{
                    wx.showToast({title:'无更多结果'});
                }

            }else{
                console.log('lower:err:',res);
            }
        })
    },
    handlesearchchange:function(e){//input框内容变化触发
        let self = this;
        let content = e.detail.value;
        console.log('内容：',content);
        this.setData({value:content});
        if(content.length === 0){
            return self.setData({showflag:0});
        }
        if(content.length < 2){
            return;
        }
        Api.groupNameSearch({tab:this.data.tab,content:content}).then(function(res){
            if(res.status === MsgType.EErrorType.EOK){
                self.setData({showflag:1,groupname:res.data});
            }
        })
    },
    processLocs:function(arr){
        let shengarr = Province.getSheng(arr);
        let tmparr = [[{item_name:'不限'}],[{item_name:'不限'}],[{item_name:'不限'}]];
        tmparr[0] = [{item_name:'不限'},...shengarr];
        this.setData({multiArray:tmparr,multiIndex:[0,0,0]});
    },
    handleconfirm:function(e){
        let content = e.detail.value;
        console.log('内容：',content);
        let self = this;
        if(content.length < 2){
            return wx.showToast({title:'内容太短'});
        }
        self.doSearch({content:content,tab:this.data.tab});
    },
    onLoad: function () {
        let self = this;
        Api.getRecord({}).then(function(res){
            if(res.status === MsgType.EErrorType.EOK){
                self.setData({history:res.data});
            }
        });
        Api.getHotRecord({}).then(function(res){
            if(res.status === MsgType.EErrorType.EOK){
                self.setData({hotHistory:res.data});
            }
        });
        //this.setData({industry:[...this.data.industry,...Province.getTypesNames()]});
    },

});
