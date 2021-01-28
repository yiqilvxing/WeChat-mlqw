// pages/order/after/detail.js
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var item = JSON.parse(options.item);
    this.setData({
      item: item
    })
  },

  // 预览图片，放大预览
  previewBanner: function(e) {
    var _this = this;
    let current = e.currentTarget.dataset.src;
    let urls = e.currentTarget.dataset.urls;
    wx.previewImage({
      current: current, 
      urls: urls 
    })
  },

})