// pages/service/invite/poster.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPoster: false,
    showImageSize: 360,
    tabImageSize: 180,
    items: [],
    currentUrl: '',
    userInfo: {},
    showLoading: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo,
      currentPage: 1,
      showImageSize: wx.getSystemInfoSync().windowWidth - 60,
      tabImageSize: (wx.getSystemInfoSync().windowWidth - 40) / 2
    });
    this.requestPoster();
  },

  // 生成海报
  showPoster: function(e){
    this.setData({
      currentUrl: e.currentTarget.dataset.url,
      showPoster: true,
    });
  },

  // 关闭弹框
  closeShowPoster: function(e){
    this.setData({
      showPoster: false,
    });
  },

  /**
   * 获取海报背景图
   */
  requestPoster: function(){
    var _this = this;
    wx.request({
      url: app.globalData.http_base + '/member/storePoster?pageNo=1&length=20',
      method: 'GET',
      header: app.globalData.http_header,
      success: function(res) {
        _this.setData({
          showLoading: false
        })
        if (res != null && res.data != null) {
          var result = res.data;
          if (result != null && result.code == app.globalData.http_ok) {
            var items = result.data.rows;
            items = items.concat(items);
            if(items != null){
              _this.setData({
                items: items
              });
            }
          }
        }
      },
      fail: function(res){
        _this.setData({
          showLoading: false
        })
      },
    });
  },

})