// pages/service/achieve/detail.js
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
    this.setData({
      currentPage: 1,
      currentTab: 0
    });
    requestAchieve(this,this.data.currentPage);
  },

  /**
   * 监听页面下拉刷新
   */
  onPullDownRefresh: function(){
    this.setData({
      currentPage: 1,
    });
    requestAchieve(this,this.data.currentPage);
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
      requestAchieve(this,this.data.currentPage);
    }
  },
  
})

/**
 * 获取业绩明细
 */
function requestAchieve(_this,page){
  wx.request({
    url: app.globalData.http_base + '/detailed/performanceDetails?length=20'+"&pageNo="+page,
    method: 'GET',
    header: app.globalData.http_header,
    success: function(res) {
      if (res != null && res.data != null) {
        var result = res.data;
        if (result != null && result.code == app.globalData.http_ok) {
          var items = result.data.rows;
          if(app.globalData.debug_mode){
            items = [
              {
                "amount": "88.88",
                "remark": "Timi在天酿酒业购物消费，您获得直接佣金88.88元",
                "time": "2020-12-01 17:18:57"
              },
              {
                "amount": "100.00",
                "remark": "Timi在天酿酒业购物消费，您获得直接佣金100.00元",
                "time": "2020-11-20 10:18:20"
              },
              {
                "amount": "28.88",
                "remark": "Timi在天酿酒业购物消费，您获得直接佣金28.88元",
                "time": "2020-10-30 12:10:26"
              },
              {
                "amount": "10.50",
                "remark": "Timi在天酿酒业购物消费，您获得直接佣金10.50元",
                "time": "2020-10-09 11:28:10"
              },
            ]
          }
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
}