// pages/me/collect/collect.js
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsItem: [],
    currentPage: 1,
    maxPage: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.requestCollect(this.data.currentPage);
  },

  /**
   * 监听页面下拉刷新
   */
  onPullDownRefresh: function(){
    this.setData({
      currentPage: 1,
    });
    this.requestCollect(this.data.currentPage);
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
      this.requestCollect(this.data.currentPage);
    }
  },

  // 跳转到商品详情
  startGoodsDetail: function(e) {
    wx.navigateTo({
      url: '../../goods/goods?goodsId='+e.currentTarget.dataset.id
    }) 
  },

  /**
   * 获取我的收藏
   */
  requestCollect: function(page){
    var _this = this;
    wx.request({
      url: app.globalData.http_base + '/collection?type=1&pageNo='+page+'&length=20',
      method: 'GET',
      header: app.globalData.http_header,
      success: function(res) {
        wx.stopPullDownRefresh();
        if (res != null && res.data != null) {
          var result = res.data;
          if (result != null && result.code == app.globalData.http_ok) {
            var goodsItem = result.data.rows;
            if(goodsItem != null){
              for(var i=0; i < goodsItem.length; i++){
                goodsItem[i].isCollect = true;
              }
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

  /**
   * 收藏/取消收藏
   */
  updateCollect: function(e){
    var _this = this;
    var index = e.currentTarget.dataset.index;
    var isCollect = _this.data.goodsItem[index].isCollect;
    var data = {
      type: 1,
      skuId: _this.data.goodsItem[index].id
    };
    wx.showLoading({
      title: app.globalData.loading,
    });
    // 取消收藏
    if(isCollect){
      wx.request({
        url: app.globalData.http_base + '/collection',
        method: 'PUT',
        data: data,
        header: app.globalData.http_header,
        success: function(res){
          wx.hideLoading();
          var goodsItem = _this.data.goodsItem;
          goodsItem[index].isCollect = false;
          _this.setData({
            goodsItem: goodsItem
          });
        },
        fail: function(res){
          wx.hideLoading();
        },
      })
    }
    // 收藏
    else{
      wx.request({
        url: app.globalData.http_base + '/collection',
        method: 'POST',
        data: data,
        header: app.globalData.http_header,
        success: function(res){
          wx.hideLoading();
          var goodsItem = _this.data.goodsItem;
          goodsItem[index].isCollect = true;
          _this.setData({
            goodsItem: goodsItem
          });
        },
        fail: function(res){
          wx.hideLoading();
        },
      })
    }
  },

})