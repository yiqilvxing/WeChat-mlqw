// pages/search/search.js
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyword: '',
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var keyword = this.data.keyword;
    if(keyword == null || keyword.length < 0){
      return;
    }
    var page = this.data.currentPage;
    if(page < this.data.maxPage){
      page++;
      this.setData({
        currentPage: page,
      });
      this.requestGoodsSearch(this.data.currentPage);
    }
  },

  // 搜索输入监听
  bindKeywordInput: function(e){
    this.setData({
      keyword: e.detail.value
    })
  },

  // 搜索监听
  bindKeywordSearch: function(e){
    var page = 1;
    this.setData({
      currentPage: page,
    });
    this.requestGoodsSearch(page);
  },

  // 跳转到商品详情
  startGoodsDetail: function(e) {
    wx.navigateTo({
      url: '../goods/goods?goodsId='+e.currentTarget.dataset.id
    }) 
  },

  /**
   * 商品搜索
   */
  requestGoodsSearch: function(page){
    var _this = this;
    var keyword = _this.data.keyword;
    wx.request({
      url: app.globalData.http_base + '/good/goodList?storeId=+'+app.globalData.qz_store_id+'&pageNo='+page+'&length=20'+'&param='+keyword,
      method: 'GET',
      header: app.globalData.http_header,
      success: function(res) {
        if (res != null && res.data != null) {
          var result = res.data;
          if (result != null && result.code == app.globalData.http_ok) {
            var goodsItem = result.data.rows;
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
    });
  },

})