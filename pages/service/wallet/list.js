// pages/service/wallet/list.js
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 0, // 0-小金库，1-余额
    tabItem: ['收入', '支出'],
    currentTab: 0,// 0-收入，1-支出
    detailItem: [],
    currentPage: 1,
    maxPage: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type: options.type,
      currentPage: 1,
      currentTab: 0
    });
    requestWalletList(this,this.data.currentPage);
  },

  /**
   * 监听页面下拉刷新
   */
  onPullDownRefresh: function(){
    this.setData({
      currentPage: 1,
    });
    requestWalletList(this,this.data.currentPage);
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
      requestWalletList(this,this.data.currentPage);
    }
  },

  /**
   * Tab点击切换
   */
  onTabClick: function(e){
    var _this = this;
    let index = e.currentTarget.dataset.index;
    _this.setData({
      currentPage: 1,
      currentTab: index
    });
    requestWalletList(_this,_this.data.currentPage);
  },

  // 查看详情
  startDetail: function(e){
    var index = e.currentTarget.dataset.index;
    var item = this.data.detailItem[index];
    wx.navigateTo({
      url: '../wallet/detail?item='+JSON.stringify(item),
    })
  },

})
/**
 * 获取收支明细
 */
function requestWalletList(_this,page){
  var type = _this.data.type;
  var currentTab = _this.data.currentTab;
  if(page==1){
    wx.showLoading({
      title: app.globalData.loading
    })
  }
  wx.request({
    url: app.globalData.http_base + '/detailed?type='+type+'&income='+currentTab+'&length=20'+"&pageNo="+page,
    method: 'GET',
    header: app.globalData.http_header,
    success: function(res) {
      if(page==1){
        wx.hideLoading();
      }
      if (res != null && res.data != null) {
        var result = res.data;
        if (result != null && result.code == app.globalData.http_ok) {
          var detailItem = result.data.rows;
          if(page == 1){
            _this.setData({
              maxPage: result.data.pageSize,
              detailItem: detailItem
            });
          }else{
            _this.setData({
              maxPage: result.data.pageSize,
              detailItem: _this.data.detailItem.concat(detailItem)
            });
          }
        }
      }
    },
    fail: function(res){
      if(page==1){
        wx.hideLoading();
      }
    }
  });
}