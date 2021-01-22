// pages/order/confirm/confirm.js
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsStoreItem: [],
    goodsPriceTotal: 0,
    goodsCountTotal: 0,
    orderAddress: {},
    orderStore: {},
    orderPlaceBody: [],
    deliveryType: 0, // 配送方式 0快递 1自提
  },

  // 跳转到收银台
  startPay: function(e) {
    wx.redirectTo({
      url: '../pay/pay?orderPayInfo=' + JSON.stringify(e)
    }) 
  },

  // 选择配送方式
  selectDeliveryType: function(e){
    var _this = this;
    if(_this.data.orderAddress != null && _this.data.orderStore != null){
      wx.showActionSheet({
        alertText: '选择配送方式',
        itemList: ['物流快递','门店自提'],
        itemColor: '#000000',
        success(res) {
          _this.setData({
            deliveryType: res.tapIndex
          });
        }
      })
    }
  },
  
  // 选择地址
  selectAddress: function(e){
    if(this.data.deliveryType==0){
      wx.navigateTo({
        url: '../../me/address/address?selectAddress=true',
      })
    }
  },

  /**
   * 提交订单
   */
  submitOrder: function () {
    var _this = this;
    wx.showLoading({
      title: '提交订单中...',
    })  
    wx.request({
      url: app.globalData.http_base + '/order/good',
      method: 'POST',
      header: app.globalData.http_header,
      data: _this.data.orderPlaceBody,
      success: function(res){
        wx.hideLoading();
        if (res != null) {
          var result = res.data;
          if (result != null && result.code == app.globalData.http_ok) {
            _this.startPay(result.data);
          }else{
            wx.showToast({
              title: result.msg,
              icon: 'fail',
            })
          }
        }
      },
      fail: function(res){
        wx.hideLoading();
        wx.showToast({
          title: '下单失败',
          icon: 'none',
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.goodsStoreItem != null){
      var goodsStoreItem = JSON.parse(decodeURIComponent(options.goodsStoreItem));
      this.setData({
        goodsStoreItem: goodsStoreItem
      });
      // 刷新商品合计
      refreshGoodsTotal(this);
      // 获取默认地址
      requestDefaultAddreess(this);
      // 获取默认门店
      requestDefaultStore(this);
    }
  },
})

/**
 * 获取默认门店
 */
function requestDefaultStore(_this){
  wx.request({
    url: app.globalData.http_base + '/currency/store?storeId=' + _this.data.goodsStoreItem[0].id,
    method: 'GET',
    header: app.globalData.http_header,
    success: function(res){
      if (res != null && res.data != null) {
        var result = res.data;
        if (result != null && result.code == app.globalData.http_ok) {
          _this.setData({
            orderStore: result.data
          });
        }
      }
    }
  })
}

/**
 * 获取默认地址
 */
function requestDefaultAddreess(_this){
  wx.showLoading({
    title: app.globalData.loading
  })
  wx.request({
    url: app.globalData.http_base + '/address/isDefault',
    method: 'GET',
    header: app.globalData.http_header,
    success: function(res){
      wx.hideLoading();
      if (res != null && res.data != null) {
        var result = res.data;
        if (result != null && result.code == app.globalData.http_ok) {
          _this.setData({
            orderAddress: result.data
          });
          // 刷新下单实体
          refresOrderPlace(_this);
        }
      }
    },
    fail: function(res){
      wx.hideLoading();
      console.log(res);
    }
  })
}

/**
 * 刷新商品合计
 */
function refreshGoodsTotal(_this){
  var goodsStoreItem = _this.data.goodsStoreItem;
  var priceTotal = 0;
  var countTotal = 0;
  for (var i = 0; i < goodsStoreItem.length; i++) {
    var goodItems = goodsStoreItem[i].items;
    if(goodItems !=null && goodItems.length>0){
      for (var j = 0; j < goodItems.length; j++) {
        var goodEntity = goodItems[j];
        priceTotal += goodEntity.price;
        countTotal += goodEntity.num;
      };
    }
  };
  _this.setData({
    goodsPriceTotal: priceTotal / 100,
    goodsCountTotal: countTotal
  });
}
/**
 * 刷新下单实体
 */
function refresOrderPlace(_this){
  var orderPlaceBody = [];
  var goodsStoreItem = _this.data.goodsStoreItem;
  for (var i = 0; i < goodsStoreItem.length; i++) {
    var storeItem = goodsStoreItem[i];
    var goodsItems = [];
    for(var j = 0; j< storeItem.items.length; j++){
      var goodEntity = storeItem.items[j];
      goodsItems.push({
        skuId: goodEntity.id,
        num: goodEntity.num
      });
    };
    let deliveryId = 0;
    if(_this.data.deliveryType == 0){
      deliveryId = _this.data.orderAddress.id;
    }else{
      deliveryId = _this.data.orderStore.id;
    };
    orderPlaceBody.push({
      storeId: storeItem.id,
      deliveryType: _this.data.deliveryType,
      deliveryId: deliveryId,
      items: goodsItems
    });
  };
  _this.setData({
    orderPlaceBody: orderPlaceBody,
  });
}
