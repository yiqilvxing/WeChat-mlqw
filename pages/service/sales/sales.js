// pages/service/sales/sales.js
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    code: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  // 核销码
  bindCodeInput: function(e){
    this.setData({
      code: e.detail.value
    })
  },

  // 扫一扫
  scanCode: function(){
    var _this = this;
    wx.scanCode({
      success: (res) => {
        var code = res.result;
        console.log(code);
        _this.setData({
          code: code,
        })
        _this.startConfirm();
      }
    });
  },

  // 开始核销
  startConfirm: function(){
    if(this.data.code == null || this.data.code == ''){
      return;
    }
    wx.navigateTo({
      url: '../sales/confirm?code='+this.data.code,
    });
  },

  // 核销记录
  startRecord: function(){
    wx.navigateTo({
      url: '../sales/record',
    });
  },

})