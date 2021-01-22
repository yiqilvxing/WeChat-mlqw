// pages/service/girls/girls.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showLoading: true,
    items:[],
    currentPage: 1,
    loadmore: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      currentPage: 1,
    });
    this.requestGirlsImage(this.data.currentPage);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      currentPage: 1,
    });
    this.requestGirlsImage(this.data.currentPage);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var page = this.data.currentPage;
    if(this.data.loadmore){
      page++;
      this.setData({
        currentPage: page,
      });
      this.requestGirlsImage(this.data.currentPage);
    }
  },

  /**
   * 获取图片
   */
  requestGirlsImage: function(page){
    var pageSize = 10;
    var _this = this;
    wx.request({
      url: 'https://gank.io'+'/api/v2/data/category/Girl/type/Girl/page/'+page+'/count/'+pageSize,
      success: (result) => {
        wx.stopPullDownRefresh();
        _this.setData({
          showLoading: false
        })
        var data = result.data.data;
        if(data!=null&&data.length>0){
          _this.setData({
            loadmore: data.length >= pageSize
          })
          if(page==1){
            _this.setData({
              items: data
            })
          }else{
            _this.setData({
              items: _this.data.items.concat(data)
            })
          }
        }else{
          _this.setData({
            loadmore: false
          })
        }
      },
      fail: (res) => {
        wx.stopPullDownRefresh();
        _this.setData({
          showLoading: false
        })
      },
    })
  },
 
})