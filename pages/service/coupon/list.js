// pages/service/coupon/list.js
var util = require('../../../utils/util')
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabItem: ['待使用','已使用','已过期'],
    currentTab: 0,
    couponItems: [],
    winWidth: 0,
    winHeight: 0,
    currentPage: 1,
    maxPage: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    wx.getSystemInfo({
      success: function(res) {
        _this.setData( {
           winWidth: res.windowWidth,
           winHeight: res.windowHeight
        });
      }
    });
    this.requestCoupon(this.data.currentPage);
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
      this.requestCoupon(this.data.currentPage);
    }
  },

  /**
   * Tab滑动切换
   */
  onSwiperChange: function(e){
    var _this = this;
    var index = e.detail.current;
    _this.setData({
      currentTab: index,
      currentPage: 1
    });
    _this.requestCoupon(_this.data.currentPage);
  },

   /**
   * Tab点击切换
   */
  onTabClick: function(e){
    var _this = this;
    var index = e.currentTarget.dataset.index;
    _this.setData({
      currentTab: index,
      currentPage: 1
    });
    _this.requestCoupon(_this.data.currentPage);
  },

  // 查看详情
  startDetail: function(e){
    wx.navigateTo({
      url: '../coupon/detail?id='+e.currentTarget.dataset.id,
    })
  },

  // 立即使用
  startIndex: function(e){
    wx.switchTab({
      url: '../../index/index',
    })
  },

  /**
   * 获取我的优惠券
   */
  requestCoupon: function(page){
    var _this = this;
    var state = _this.data.currentTab;
    wx.request({
      url: app.globalData.http_base + '/coupon/list/'+state+'?pageNo='+page+'&length=20',
      method: 'GET',
      header: app.globalData.http_header,
      success: function(res) {
        if (res != null && res.data != null) {
          var result = res.data;
          if (result != null && result.code == app.globalData.http_ok) {
            var couponItems = result.data.rows;
            if(couponItems != null){
              couponItems.forEach((item) => {
                item.beginTime = util.formatTime(item.beginTime, 'YY-MM-DD')
                item.endTime = util.formatTime(item.endTime, 'YY-MM-DD')
                item.flag = false
              })
              if(page == 1){
                _this.setData({
                  maxPage: result.data.pageSize,
                  couponItems: couponItems
                });
              }else{
                _this.setData({
                  maxPage: result.data.pageSize,
                  couponItems: _this.data.couponItems.concat(couponItems)
                });
              }
            }else{
              _this.setData({
                maxPage: 1,
                couponItems: []
              });
            }
          }else{
            _this.setData({
              maxPage: 1,
              couponItems: []
            });
          }
        }
      },
      fail: function(res){
      },
    });
  },

  
})