// pages/service/team/team.js
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: 20,
    bgSize: 375,
    userInfo: {},
    levelItems: [{
      "currentClassName": "VIP",
      "storeName": "天酿",
      "storeLogo": "https://yezhijian-image.oss-cn-hongkong.aliyuncs.com/app/comment.jpg"
    },
    {
      "currentClassName": "水稻",
      "storeName": "小米之家",
      "storeLogo": "https://yezhijian-image.oss-cn-hongkong.aliyuncs.com/app/comment.jpg"
    }],
  },

  // 页面返回
  pageBack: function(){
    wx.navigateBack();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    _this.setData({
      bgSize: wx.getSystemInfoSync().windowWidth,
    });
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          statusBarHeight: res.statusBarHeight
        });
      }
    })
    // 获取团队信息
    _this.requestTeamMessage();
  },

  // 获取团队信息
  requestTeamMessage: function(){
    wx.showLoading({
      title: '正在加载...',
    });
    var _this = this;
    wx.request({
      url: app.globalData.http_base + '/member/findShowByMemberId/'+app.globalData.userInfo.id,
      method: 'GET',
      header: app.globalData.http_header,
      success: function(res) {
        wx.hideLoading();
        if (res != null && res.data != null) {
          var result = res.data;
          if (result != null && result.code == app.globalData.http_ok) {
            var userInfo = result.data;
            userInfo.avatar = userInfo.avatar.replace('/132','/0');
            _this.setData({
              userInfo: userInfo,
              levelItems: userInfo.storeLevelList
            });
          }
        }
      },
      fail: function(res){
        wx.hideLoading();
      },
    });
    
  },

})