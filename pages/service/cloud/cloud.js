// pages/service/cloud/cloud.js
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsStoreItem: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取云仓商品
    this.requestCloudGoods();
  },

  // 云仓提货单
  startCloudOrder: function(){
    wx.navigateTo({
      url: '../cloud/order',
    })
  },

  /**
   * 获取云仓商品
   */
  requestCloudGoods: function(){
    var _this = this;
    wx.showLoading({
      title: app.globalData.loading,
    })
    wx.request({
      url: app.globalData.http_base + '/cloud',
      method: 'GET',
      header: app.globalData.http_header,
      success: function(res) {
        wx.hideLoading();
        if (res != null && res.data != null) {
          var result = res.data;
          if (result != null && result.code == app.globalData.http_ok) {
            var goodsStoreItem  = result.data;
            if(app.globalData.debug_mode){
              goodsStoreItem = [
                {
                  "storeId":  106,
                  "storeLogo": "https://quanzinw.oss-cn-shenzhen.aliyuncs.com/web/1598239885160.png",
                  "storeName": "天酿酒业",
                  "skuCloudList": [
                    {
                      "id": 37,
                      "skuCover": "https://quanzinw.oss-cn-shenzhen.aliyuncs.com/web/1601285065370.png",
                      "skuTitle": "陈酱九八七 | 天禧酱香型白酒 498元/瓶 6瓶/箱  整箱发货",
                      "stock": 100,
                      "unit": "箱",
                      "isPickup": true,
                      "expireTime": "2020-09-10 13:55:08"
                    },{
                      "id": 38,
                      "skuCover": "https://quanzinw.oss-cn-shenzhen.aliyuncs.com/web/1602205135645.png",
                      "skuTitle": "陈酱九八七 | 猪年纪念酒 1199元/瓶 6瓶/箱 整箱发货",
                      "stock": 200,
                      "unit": "箱",
                      "isPickup": true,
                      "expireTime": "2020-10-15 14:15:23"
                    }
                  ] 
                }
              ];
            }
            _this.setData({
              goodsStoreItem: goodsStoreItem
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