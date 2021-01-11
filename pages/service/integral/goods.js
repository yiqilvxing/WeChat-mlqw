// pages/service/integral/goods.js
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabImageSize: 180,
    goodsItem: [],
    currentPage: 1,
    maxPage: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      currentPage: 1,
      tabImageSize: (wx.getSystemInfoSync().windowWidth - 62) / 2
    });
    this.requestInteralGoods(this.data.currentPage);
  },

  /**
   * 监听页面下拉刷新
   */
  onPullDownRefresh: function(){
    this.setData({
      currentPage: 1,
    });
    this.requestInteralGoods(this.data.currentPage);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var page = this.data.currentPage;
    if(page < this.data.maxPage){
      page++;
      this.setData({
        currentPage: page,
      });
      this.requestInteralGoods(this.data.currentPage);
    }
  },

  // 跳转到商品详情
  startGoodsDetail: function(e) {
    wx.navigateTo({
      url: '../../goods/goods?goodsId='+e.currentTarget.dataset.id
    }) 
  },

  /**
   * 获取积分商品
   */
  requestInteralGoods: function(page){
    var _this = this;
    var data = {
      pageNo: page,
      length: 20
    };
    wx.request({
      url: app.globalData.http_base + '/skuPoint/skuPointList',
      method: 'POST',
      data: data,
      header: app.globalData.http_header,
      success: function(res) {
        wx.stopPullDownRefresh();
        if (res != null && res.data != null) {
          var result = res.data;
          if (result != null && result.code == app.globalData.http_ok) {
            var goodsItem = result.data.rows;
            if(goodsItem != null){
              if(page == 1){
                _this.setData({
                  maxPage: result.data.pageSize,
                  goodsItem: goodsItem
                });
              }else{
                _this.setData({
                  maxPage: result.data.pageSize,
                  goodsItem: _this.data.goodsItem.concat(goodsItem)
                });
              }
            }
          }
        }
      },
      fail: function(res){
        wx.stopPullDownRefresh();
      },
    });
  },

})