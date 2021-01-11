// pages/service/coupon/detail.js
var util = require('../../../utils/util')
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.requestCouponDetail(options.id);
  },

  // 立即使用
  startIndex: function(e){
    wx.switchTab({
      url: '../../index/index',
    })
  },

  /**
   * 获取优惠券明细
   */
  requestCouponDetail: function(id){
    wx.showLoading({
      title: '正在加载...',
    })
    var _this = this;
    wx.request({
      url: app.globalData.http_base + '/coupon/details/'+id,
      method: 'GET',
      header: app.globalData.http_header,
      success: function(res) {
        wx.hideLoading();
        if (res != null && res.data != null) {
          var result = res.data;
          if (result != null && result.code == app.globalData.http_ok) {
            var item = result.data;
            item.beginTime = util.formatTime(item.beginTime, 'YY-MM-DD')
            item.endTime = util.formatTime(item.endTime, 'YY-MM-DD')
            _this.setData({
              item: item,
            });
          }
        }
      },
      fail: function(res){
        wx.hideLoading();
      },
    });
  },

  
})