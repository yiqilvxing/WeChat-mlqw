// pages/service/wallet/wallet.js
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: 20,
    tabItem: ['小金库', '余额'],
    currentTab: 0,
    money: '0.00',
    detailItem: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          statusBarHeight: res.statusBarHeight
        });
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    requestWallet(this);
  },

  // 页面返回
  pageBack: function() {
    wx.navigateBack();
  },

  // 去提现、去消费
  startFuck: function(){
    if(this.data.currentTab==0){
      wx.navigateTo({
        url: '../cash/cash'
      })
    }else{
      wx.switchTab({
        url: '../../index/index'
      })
    }
  },

  /**
   * Tab点击切换
   */
  onTabClick: function(e){
    var _this = this;
    let index = e.currentTarget.dataset.index;
    _this.setData({
      currentTab: index
    });
    requestWallet(_this);
  },

  // 查看全部
  selectAllList: function(e){
    var type = this.data.currentTab;
    wx.navigateTo({
      url: '../wallet/list?type='+type,
    })
  },

  // 查看详情
  startDetail: function(e){
    var index = e.currentTarget.dataset.index;
    var item = this.data.detailItem[index];
    wx.navigateTo({
      url: '../wallet/detail?item='+JSON.stringify(item),
    })
  },

})
/**
 * 获取钱包信息
 */
function requestWallet(_this){
  wx.showLoading({
    title: app.globalData.loading
  })
  var type = _this.data.currentTab;
  wx.request({
    url: app.globalData.http_base + '/detailed/wallet/'+type,
    method: 'GET',
    header: app.globalData.http_header,
    success: function(res) {
      wx.hideLoading();
      if (res != null && res.data != null) {
        var result = res.data;
        if (result != null && result.code == app.globalData.http_ok) {
          var money = type==0 ? result.data.vault : result.data.currency;
          var detailItem = type==0 ? result.data.vaultList : result.data.currencyList;
          if(app.globalData.debug_mode){
            money = type==0 ? 656000: 1000000;
            if(type == 0){
              detailItem = [{
                "id": 202055661111,
                "type": 1,
                "mark": "申请提现10元",
                "num": 1000,
                "isIncome": false,
                "state": 1,
                "createTime": "2020-07-09 12:02:22",
              },{
                "id": 202055661112,
                "type": 1,
                "mark": "申请提现20元",
                "num": 2000,
                "isIncome": false,
                "state": 1,
                "createTime": "2020-07-08 11:05:30",
              },{
                "id": 202055661113,
                "type": 1,
                "mark": "申请提现50元",
                "num": 5000,
                "isIncome": false,
                "state": 1,
                "createTime": "2020-07-06 10:05:56",
              },{
                "id": 202055661114,
                "type": 1,
                "mark": "申请提现30元",
                "num": 3000,
                "isIncome": false,
                "state": 1,
                "createTime": "2020-07-06 06:06:06",
              },{
                "id": 202055661115,
                "type": 1,
                "mark": "申请提现10元",
                "num": 1000,
                "isIncome": false,
                "state": 1,
                "createTime": "2020-07-01 11:11:11",
              }]
            }else{
              detailItem = [{
                "id": 12898092047208444,
                "type": 0,
                "mark": "后台余额充值:1000元",
                "num": 100000,
                "isIncome": true,
                "createTime": "2020-07-15 09:04:51"
              },{
                "id": 12898092047208443,
                "type": 0,
                "mark": "后台余额充值:5000元",
                "num": 500000,
                "isIncome": true,
                "createTime": "2020-07-14 10:04:52"
              },{
                "id": 12898092047208442,
                "type": 0,
                "mark": "后台余额充值:3000元",
                "num": 300000,
                "isIncome": true,
                "createTime": "2020-07-12 16:04:51"
              },{
                "id": 12898092047208441,
                "type": 0,
                "mark": "后台余额充值:1000元",
                "num": 100000,
                "isIncome": true,
                "createTime": "2020-07-11 11:11:11"
              }]
            }
          }
          if(money==0){
            money = '0.00';
          }if(detailItem==null){
            detailItem = [];
          }
          _this.setData({
            money: money,
            detailItem: detailItem,
          });
        }
      }
    },
    fail: function(res){
      wx.hideLoading();
    }
  });
}