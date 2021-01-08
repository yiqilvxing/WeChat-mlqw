// pages/store/store.js
//获取应用实例
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    storeId: 0,
    storeTitle: {},
    tabImageSize: 180,
    bannerItem: [],
    tabMenuItem: [],
    goodsSpecailItem: [],
    goodsHotItem: []
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onLoad: function (options) {
    var storeId = options.storeId;
    console.log(storeId);
    this.setData({
      storeId: storeId,
      tabImageSize: (wx.getSystemInfoSync().windowWidth - 40) / 2
    });
    requestStoreMessage(this);
    requestGetBanner(this);
    requestGetTabMenu(this);
    requestGetGoodsSpecial(this);
    requestGetGoodsHot(this);
  },

  // 跳转到商品详情
  startGoodsDetail: function(e) {
    // 0:总店 1:商品 2:专区
    let type = e.currentTarget.dataset.type;
    if(type == null){
      wx.navigateTo({
        url: '../goods/goods?goodsId='+e.currentTarget.dataset.id
      }) 
    }else{
      if(type == 0){
        wx.navigateTo({
          url: '../store/store?storeId='+e.currentTarget.dataset.bid
        }) 
      }
      if(type == 1){
        wx.navigateTo({
          url: '../goods/goods?goodsId='+e.currentTarget.dataset.bid
        }) 
      }
    }
  },
})
/**
 * 获取轮播图片
 */
function requestGetBanner(_this){
  wx.request({
    url: app.globalData.http_base + '/banner?storeId=' + _this.data.storeId,
    method: 'GET',
    header: app.globalData.http_header,
    success: function(res) {
      if (res != null && res.data != null) {
        var result = res.data;
        if (result != null && result.code == app.globalData.http_ok) {
          _this.setData({
            bannerItem: result.data
          });
        }
      }
    }
  });
}
/**
 * 获取金刚区
 */
function requestGetTabMenu(_this){
  wx.request({
    url: app.globalData.http_base + '/vajra?storeId=' + _this.data.storeId,
    method: 'GET',
    header: app.globalData.http_header,
    success: function(res) {
      if (res != null && res.data != null) {
        var result = res.data;
        if (result != null && result.code == app.globalData.http_ok) {
          var maxsize = result.data.length > 5 ? 5 : result.data.length;
          var data = [];
          for(var i=0; i<maxsize; i++){
            data.push(result.data[i]);
          }
          _this.setData({
            tabMenuItem: data
          });
        }
      }
    }
  });
}
/**
 * 获取会员特价商品
 */
function requestGetGoodsSpecial(_this){
  wx.request({
    url: app.globalData.http_base + '/good/discountGoods?storeId=' + _this.data.storeId,
    method: 'GET',
    header: app.globalData.http_header,
    success: function(res) {
      if (res != null && res.data != null) {
        var result = res.data;
        if (result != null && result.code == app.globalData.http_ok) {
          _this.setData({
            goodsSpecailItem: result.data
          });
        }
      }
    }
  });
}
/**
 * 获取热门推荐商品
 */
function requestGetGoodsHot(_this){
  wx.request({
    url: app.globalData.http_base + '/good/goodsRecommendList?pageNo=1&length=100&storeId=' + _this.data.storeId,
    method: 'GET',
    header: app.globalData.http_header,
    success: function(res) {
      wx.stopPullDownRefresh();
      wx.hideNavigationBarLoading();
      if (res != null && res.data != null) {
        var result = res.data;
        if (result != null && result.code == app.globalData.http_ok) {
          _this.setData({
            goodsHotItem: result.data.rows
          });
        }
      }
    },
    fail: function(res) {
      wx.stopPullDownRefresh();
      wx.hideNavigationBarLoading();
    }
  });
}
/**
 * 获取店铺信息
 */
function requestStoreMessage(_this){
  wx.request({
    url: app.globalData.http_base + '/currency/store?storeId=' + _this.data.storeId,
    method: 'GET',
    header: app.globalData.http_header,
    success: function(res) {
      if (res != null && res.data != null) {
        var result = res.data;
        if (result != null && result.code == app.globalData.http_ok) {
          var storeTitle = result.data.name;
          _this.setData({
            storeTitle: storeTitle
          });
          wx.setNavigationBarTitle({
            title: storeTitle
          })
        }
      }
    },
    fail: function(res) {
      console.log(res);
    }
  });
}