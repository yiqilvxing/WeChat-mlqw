// pages/order/pay/pay.js
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
      orderPayInfo: {},
      currencyText: '',
      switch1Checked: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.orderPayInfo != null){
      var orderPayInfo = JSON.parse(options.orderPayInfo);
      var data = {
        payType: 0,
        tradeNo: orderPayInfo.tradeNo,
        fee: orderPayInfo.tradeFee,
        feeCurrency: orderPayInfo.currency
      };
      this.setData({
        orderPayInfo: data
      });
    }
  },

  /**
   * 支付
   */
  submitPay: function(){
    var _this = this;
    var option = _this.data.orderPayInfo;
    var data = _this.data.orderPayInfo;
    // 判断是否有开余额支付 如果余额减订单金额 大于或等于0 则订单支付类型是 余额支付 payType=2
    if(_this.data.switch1Checked && option.feeCurrency-option.fee >= 0){
      data.payType = 2
      data.fee = 0
      data.feeCurrency = option.fee
    } 
    // 如果余额减订单金额 小于0 则订单支付类型是 余额+微信支付 payType=3
    else if(_this.data.switch1Checked && option.feeCurrency-option.fee < 0){
      data.payType = 3
      data.fee = option.fee-option.feeCurrency
      data.feeCurrency = option.feeCurrency
    } 
    // 如果不启用余额支付开关 则订单支付类型是 微信支付 payType=0
    else if(!_this.data.switch1Checked){
      data.payType = 0
      data.fee = option.fee
      data.feeCurrency = 0
    }
    wx.showLoading({
      title: '支付中...',
    })
    wx.request({
      url: app.globalData.http_base + '/order',
      method: 'POST',
      header: app.globalData.http_header,
      data: data,
      success: function(res){
        wx.hideLoading();
        var result = res.data;
        if (result != null && result.code == app.globalData.http_ok) {
          wx.requestPayment({
            timeStamp: result.data.timestamp,
            nonceStr: result.data.nonce_str,
            package: 'prepay_id='+result.data.prepay_id,
            signType: 'MD5',
            paySign: result.data.sign,
            success: function(res){
              wx.redirectTo({
                url: '../order/list/list?orderState=-1'
              });
              },
            fail: function(res){
              wx.showModal({
                title: '支付未完成',
                content: '支付取消或失败，是否继续支付？',
                success: function (sm) {
                  if (sm.confirm) {
                    _this.submitPay();
                  }else{
                    wx.navigateBack();
                  }
                }
              })
              }
          })
        }else{
          wx.showToast({
            title: result.msg,
            icon: 'none',
          })
        }
      },
     fail: function(res){
        wx.hideLoading();
      }
    })
  },

  // 切换余额支付开关
  switch1Checked: function(e){
    var _this = this;
    let state = e.detail.value;
    let option = _this.data.orderPayInfo;
    var currency = 0;
    var currencyText = '';
    if(state){
      if(option.feeCurrency-option.fee >= 0){
        currency = option.fee / 100
      } else {
        currency = option.feeCurrency / 100
      }
      currencyText = '-¥' + currency
    }else{
      currency = 0
      currencyText = ''
      currencyText = '-¥' + currency
    }
    _this.setData({
      switch1Checked: state,
      currencyText: currencyText
    })
  },
  
})