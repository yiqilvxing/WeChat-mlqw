// pages/me/data/data.js
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.requestUserMessage();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  // 选择图片
  bindSelectImage: function(e){
    var _this = this;
    var user = _this.data.user;
    wx.chooseImage({
      count: 1,
      success: function(res){
        const tempFilePaths = res.tempFilePaths;
        if(tempFilePaths != null && tempFilePaths.length > 0){
          user.avatar = tempFilePaths[0];
          _this.setData({
            user: user
          })
        }
      },
    })
  },

  // 选择生日
  bindDateChange: function(e){
    var _this = this;
    var user = _this.data.user;
    user.birthday = e.detail.value;
    _this.setData({
      user: user
    })
    _this.requestUpdateUserMessage();
  },

  // 选择性别
  bindGenderSelect: function(e){
    var _this = this;
    var user = _this.data.user;
    wx.showActionSheet({
      itemList: ['保密','男','女'],
      success(res) {
        user.gender = res.tapIndex;
        _this.setData({
          user: user
        })
        _this.requestUpdateUserMessage();
      }
    });
  },

  // 选择地区
  bindRegionChange: function(e){
    var _this = this;
    var user = _this.data.user;
    user.province = e.detail.code[0];
    user.city = e.detail.code[1];
    user.area = e.detail.code[2];
    user.address = e.detail.value[0] + ' ' + e.detail.value[1] + ' ' + e.detail.value[2];
    _this.setData({
      user: user
    })
    _this.requestUpdateUserMessage();
  },

  /**
   * 获取用户信息
   */
  requestUserMessage: function(){
    var _this = this;
    wx.request({
      url: app.globalData.http_base + '/member/getUserInfo',
      method: 'GET',
      header: app.globalData.http_header,
      success: function(res) {
        if (res != null && res.data != null) {
          var result = res.data;
          if (result != null && result.code == app.globalData.http_ok) {
            result.data.levelStore = "美丽蔷薇";
            wx.setStorageSync('userInfo', result.data);
            _this.setData({
              user: result.data,
            });
          }
        }
      },
      fail: function(res) {
        var userInfo = wx.getStorageSync('userInfo')
        if(userInfo != null){
          _this.setData({
            user: userInfo,
          });
        }
      }
    });
  },

  /**
   * 修改用户信息
   */
  requestUpdateUserMessage: function(){
    var _this = this;
    wx.showLoading({
      title: '修改中...',
    })
    wx.request({
      url: app.globalData.http_base + '/member/edit',
      method: 'PUT',
      data: _this.data.user,
      header: app.globalData.http_header,
      success: function(res) {
        wx.hideLoading();
        if (res != null && res.data != null) {
          var result = res.data;
          if (result != null && result.code == app.globalData.http_ok) {
            wx.showToast({
              title: '修改成功',
              icon: 'success'
            })
          }else{
            wx.showToast({
              title: result.msg,
              icon: 'none'
            })
          }
        }
      },
      fail: function(res){
        wx.hideLoading();
      }
    });
  },

})

