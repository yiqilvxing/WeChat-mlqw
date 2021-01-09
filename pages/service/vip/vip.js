// pages/service/vip/vip.js
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.requestVipCards();
  },

  // 跳转到店铺
  startStore: function(e){
    wx.navigateTo({
      url: '../../store/store?storeId='+e.currentTarget.dataset.id
    })
  },

  /**
   * 获取会员权益
   */
  requestVipCards: function(){
    var _this = this;
    wx.showLoading({
      title: '正在加载...',
    });
    wx.request({
      url: app.globalData.http_base + '/member/membershipInterests',
      method: 'GET',
      header: app.globalData.http_header,
      success: function(res) {
        wx.hideLoading();
        if (res != null && res.data != null) {
          var result = res.data;
          if (result != null && result.code == app.globalData.http_ok) {
            _this.setData({
                items: result.data
            })
          }
        }
      },
      fail: function(res){
        wx.hideLoading();
      },
    });
  },
  
})