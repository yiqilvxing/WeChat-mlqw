// pages/me/me.js
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin: false,
    userEntity: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options){
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    var isLogin =  app.globalData.isLogin;
    if(isLogin){
     this.setData({
       isLogin: isLogin
     });
    }
    if(isLogin){
      // 获取用户信息
      requestUserMessage(this);
    }
  },

  // 跳转到登录
  startLogin: function(e){
    wx.navigateTo({
      url: '../login/login'
    });
  },

  // 订单列表
  startOrderList: function(e){
    app.checkUserLogin(function () {
      wx.navigateTo({
        url: '../order/list/list?orderState=' + e.currentTarget.dataset.state
      });
    });
  },

  // 个人资料
  startMeData: function(e){
    app.checkUserLogin(function () {
      wx.navigateTo({
        url: '../me/data/data'
      });
    });
  },

  // 收货地址
  startMeAddress: function(e){
    app.checkUserLogin(function () {
      wx.navigateTo({
        url: '../me/address/address'
      });
    });
  },

  // 我的收藏
  startMeCollect: function(e){
    app.checkUserLogin(function () {
      wx.navigateTo({
        url: '../me/collect/collect'
      });
    });
  },

  // 我的钱包
  startWallet: function(e){
    app.checkUserLogin(function () {
      wx.navigateTo({
        url: '../service/wallet/wallet'
      });
    });
  },

  // 会员权益
  startVip: function(){
    app.checkUserLogin(function () {
      wx.navigateTo({
        url: '../service/vip/vip'
      });
    });
  },

  // 业绩统计
  startAchieve: function(){
    app.checkUserLogin(function () {
      wx.navigateTo({
        url: '../service/achieve/achieve'
      });
    });
  },

  // 休息一下
  startGirls: function(e){
    wx.navigateTo({
      url: '../service/girls/girls'
    });
  },

})
/**
 * 获取用户信息
 */
function requestUserMessage(_this){
  wx.request({
    url: app.globalData.http_base + '/member/getUserInfo',
    method: 'GET',
    header: app.globalData.http_header,
    success: function(res) {
      if (res != null && res.data != null) {
        var result = res.data;
        if (result != null && result.code == app.globalData.http_ok) {
          result.data.levelStore = "美丽蔷薇";
          wx.setStorageSync('userInfo', result.data);
          _this.setData({
            userEntity: result.data,
            isLogin: true
          });
        }
      }
    },
    fail: function(res) {
      var userInfo = wx.getStorageSync('userInfo')
      if(userInfo != null){
        _this.setData({
          userEntity: userInfo,
          isLogin: true
        });
      }
    }
  });
}