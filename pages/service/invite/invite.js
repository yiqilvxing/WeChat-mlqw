// pages/service/invite/invite.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  // 生成邀请海报
  startPoster: function(){
    wx.navigateTo({
      url: '../invite/poster',
    })
  },

})