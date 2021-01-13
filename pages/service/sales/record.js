// pages/service/sales/record.js
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [],
    currentPage: 1,
    maxPage: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取核销记录
    this.requestSalesRecord(this.data.currentPage);    
  },

  /**
   * 监听页面下拉刷新
   */
  onPullDownRefresh: function(){
    this.setData({
      currentPage: 1,
    });
    this.requestSalesRecord(this.data.currentPage);
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
      this.requestSalesRecord(this.data.currentPage);
    }
  },

  /**
   * 获取核销记录
   */
  requestSalesRecord: function(page){
    var _this = this;
    wx.request({
      url: app.globalData.http_base + '/order/good/writeOffList?pageNo'+page+'length=20',
      method: 'GET',
      header: app.globalData.http_header,
      success: function(res) {
        if (res != null && res.data != null) {
          var result = res.data;
          if (result != null && result.code == app.globalData.http_ok) {
            var items = result.data.rows;
            if(page == 1){
              _this.setData({
                maxPage: result.data.pageSize,
                items: items
              });
            }else{
              _this.setData({
                maxPage: result.data.pageSize,
                items: _this.data.items.concat(items)
              });
            }
          }
        }
      },
      fail: function(res){
      }
    });
  },
 
})