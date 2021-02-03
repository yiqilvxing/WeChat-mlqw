// pages/service/upgrade/upgrade.js
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: 20,
    currentTab: 0,
    currentItem: {},
    cardViewSize: 160,
    levelItem: [],
    userEntity: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    _this.requestVipLevel();
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          statusBarHeight: res.statusBarHeight,
          userEntity: app.globalData.userInfo,
          cardViewSize: (res.windowWidth - 40) / 2
        });
      }
    })
  },

  // 页面返回
  pageBack: function() {
    wx.navigateBack();
  },

  // 会员选择
  selectVipLevel: function(e){
    var index = e.currentTarget.dataset.index;
    this.setData({
      currentTab: index,
      currentItem: this.data.levelItem[index]
    })
  },

  // 去结算
  submit: function(){
    wx.showModal({
      title: '功能开发中',
      content: '请耐心等待更新哦~',
    })
  },

  // 获取会员等级
  requestVipLevel: function(){
    var _this = this;
    wx.request({
      url: app.globalData.http_base + '/store/interests?storeId=106',
      method: 'GET',
      header: app.globalData.http_header,
      success: function(res) {
        if (res != null && res.data != null) {
          var result = res.data;
          if (result != null && result.code == app.globalData.http_ok) {
            if(result.data!=null){
              for(var i=0; i< result.data.length; i++){
                result.data[i].interests = result.data[i].interests.replace(/\/enter/g,'\n');
              }
            }
            _this.setData({
              levelItem: result.data,
              currentTab: 0,
              currentItem: result.data[0]
            })  
          }
        }
      }
    });
  }
  
})