// pages/service/cash/cash.js
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [],
    userInfo: {},
    enableCash: 10000,
    currentMoney: 0,
    inputError: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo
    })
  },

  // 提现金额
  cashBindInupt: function(e){
    var value = e.detail.value;
    this.setData({
      inputError: null,
      currentMoney: value
    })
    if(value<=0){
      this.setData({
        inputError: '提现金额需大于0'
      })
    }
    if(value>this.data.enableCash){
      this.setData({
        inputError: '已超过可提现金额'
      })
    }
  },

  // 全部提现
  selectAll: function(e){
    this.setData({
      inputError: null,
      currentMoney: this.data.enableCash
    })
  },

  // 确认提现
  cashOutCommit: function(){
    var value = this.data.currentMoney;
    if(value<=0){
      return;
    }
    if(value>this.data.enableCash){
      return;
    }
    wx.navigateBack();
  }
  
})