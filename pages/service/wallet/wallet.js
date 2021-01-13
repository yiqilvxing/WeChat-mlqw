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
      wx.switchTab({
        url: '../../me/me'
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