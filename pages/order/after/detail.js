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

})