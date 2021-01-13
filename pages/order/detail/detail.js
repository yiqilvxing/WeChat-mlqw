// pages/order/detail/detail.js
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
    var orderId = options.orderId;
    if(orderId != null){
      requestGetOrderDetail(this,orderId);
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 操作栏
   */
  onOrderOperation: function(e){
    var _this = this;
    var orderId = _this.data.item.id;
    var state = _this.data.item.state;
    switch(state){
      case 0:// 待支付
        requestReplacePay(_this, orderId);
        break;
      case 1:// 待发货
        break;
      case 2:// 待收货
        break;
      case 3:// 已收货
        break;
      case 4:// 已完成
        break;
      case 5:// 已失效
        requestOrderDelete(_this, orderId);
        break;
    };
  },

})

/**
 * 获取订单详情
 */
function requestGetOrderDetail(_this,orderId){
  wx.showLoading({
    title: app.globalData.loading
  })
  wx.request({
    url: app.globalData.http_base + '/order/good/orderDetail?orderGoodId=' + orderId,
    method: 'GET',
    header: app.globalData.http_header,
    success: function(res) {
      wx.hideLoading();
      if (res != null && res.data != null) {
        var result = res.data;
        if (result != null && result.code == app.globalData.http_ok) {
          _this.setData({
            item: result.data
          });
        }
      }
    },
    fail: function(res) {
      wx.hideLoading();
    }
  });
}
/**
 * 去支付
 */
function requestReplacePay(_this,id){
  var data = {
    id: id
  }
  wx.showLoading({
    title: app.globalData.loading
  });
  wx.request({
    url: app.globalData.http_base + '/order/good/again',
    method: 'POST',
    header: app.globalData.http_header,
    data: data,
    success: function(res) {
      wx.hideLoading();
      if (res != null) {
        var result = res.data;
        if (result != null && res.code == app.globalData.http_ok) {
          wx.navigateTo({
            url: '../pay/pay?orderPayInfo=' + JSON.stringify(result)
          }) 
        } else {
          wx.showToast({
            title: result.msg,
            icon: 'none'
          })
        }
      }
    },
    fail: function(res) {
      wx.hideLoading();
    }
  });
}

/**
* 删除订单
*/
function requestOrderDelete(_this,id){
wx.showModal({
  title: '订单删除',
  content: '确定删除该订单吗？',
  success: function (sm) {
    if (sm.confirm) {
      wx.showLoading({
        title: '删除中...'
      });
      wx.request({
        url: app.globalData.http_base + '/order/good/'+id,
        method: 'DELETE',
        header: app.globalData.http_header,
        success: function(res) {
          wx.hideLoading();
          if (res != null && res.data.code == app.globalData.http_ok) {
            wx.showToast({
              title: '删除成功',
              icon: 'success'
            })
            wx.navigateBack();
          }else{
            wx.showToast({
              title: '删除失败',
              icon: 'none'
            })
          }
        },
        fail: function(res) {
          wx.hideLoading();
          console.log(res);
        }
      });
    }else{
      //
    }
  }
})
}

/**
* 取消订单
*/
function requestOrderRevoke(_this,id){
wx.showModal({
  title: '订单取消',
  content: '确定取消该订单吗？',
  success: function (sm) {
    if (sm.confirm) {
      wx.showLoading({
        title: '取消中...'
      });
      wx.request({
        url: app.globalData.http_base + '/order/good/cancelOrderGood/'+id,
        method: 'PUT',
        header: app.globalData.http_header,
        success: function(res) {
          wx.hideLoading();
          console.log(res);
          if (res != null && res.data.code == app.globalData.http_ok) {
            requestGetOrderDetail(_this,_this.data.item.id);
            wx.showToast({
              title: '取消成功',
              icon: 'success'
            })
          }else{
            wx.showToast({
              title: '取消失败',
              icon: 'none'
            })
          }
        },
        fail: function(res) {
          wx.hideLoading();
          console.log(res);
        }
      });
    }else{
      //
    }
  }
})
}