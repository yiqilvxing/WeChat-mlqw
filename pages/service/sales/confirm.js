// pages/service/sales/confirm.js
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    code: null,
    salesEntiy: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    var code = options.code;
    _this.setData({
      code: code
    });
    // 获取订单信息
    _this.requestOrderMessage(code);    
  },

  /**
   * 获取订单信息
   */
  requestOrderMessage: function(code){
    if(code == null || code == ''){
      return;
    }
    var _this = this;
    wx.showLoading({
      title: app.globalData.loading,
    })
    wx.request({
      url: app.globalData.http_base + '/order/good/selfRaising/'+code,
      method: 'GET',
      header: app.globalData.http_header,
      success: function(res) {
        wx.hideLoading();
        if (res != null && res.data != null) {
          var result = res.data;
          if (result != null && result.code == app.globalData.http_ok) {
            var items = result.data;
            if(items != null && items.orderGoodItemList != null){
              var goodsItem = items.orderGoodItemList;
              for(var i=0; i<goodsItem.length; i++){
                var goodsSpecsMap = JSON.parse(goodsItem[i].spec);
                var specs = '';
                for(var x in goodsSpecsMap){
                  specs += goodsSpecsMap[x]+' ';
                }
                goodsItem[i].spec = specs;
              }
            }
            _this.setData({
              salesEntiy: items,
            });
          }
        }
      },
      fail: function(res){
        wx.hideLoading();
      }
    });
  },

  /**
   * 订单核销
   */
  requestWriteOff: function(){
    var _this = this;
    if(_this.data.salesEntiy == null){
      return;
    }
    var data = {
      qcode: _this.data.code,
      id: _this.data.salesEntiy.orderGoodId
    }
    wx.showLoading({
      title: app.globalData.loading,
    })
    wx.request({
      url: app.globalData.http_base + '/order/good/writeOff',
      method: 'PUT',
      data: data,
      header: app.globalData.http_header,
      success: function(res) {
        wx.hideLoading();
        if (res != null && res.data != null) {
          var result = res.data;
          if (result != null && result.code == app.globalData.http_ok) {
            wx.showToast({
              title: '核销成功',
              icon: 'success'
            })
            wx.redirectTo({
              url: '../sales/record',
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