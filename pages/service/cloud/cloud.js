// pages/service/cloud/cloud.js
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsStoreItem: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取云仓商品
    this.requestCloudGoods();
  },

  /**
   * 获取云仓商品
   */
  requestCloudGoods: function(){
    var _this = this;
    wx.showLoading({
      title: app.globalData.loading,
    })
    wx.request({
      url: app.globalData.http_base + '/cloud',
      method: 'GET',
      header: app.globalData.http_header,
      success: function(res) {
        wx.hideLoading();
        if (res != null && res.data != null) {
          var result = res.data;
          if (result != null && result.code == app.globalData.http_ok) {
            _this.setData({
              goodsStoreItem: result.data,
            });
          }
        }
      },
      fail: function(res){
        wx.hideLoading();
      }
    });
  },

})