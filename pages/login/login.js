// pages/login/login.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: 20,
    joinWrapState: true,
    isRegister: false,
    mobile: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          statusBarHeight: res.statusBarHeight
        });
      }
    })
    // 打开授权弹框
    this.showWindow(options);
  },

  /**
   * 进入首页
   */
  startIndex: function(){
    wx.switchTab({
      url: '../index/index',
    })
  },

  // 手机号码输入框
  bindMobileInput: function (e) {
    this.setData({
      mobile: e.detail.value
    })
  },

  /**
   * 打开授权弹框
   */
  showWindow: function(res){
    var _this = this;
    //初始化动画效果
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease',
    });
    _this.setData({
      joinWrapState: false,
      scrollTop: 0
    });
    animation.translateY(-5000).step();
    _this.setData({
      animationData: animation.export(),
    });
  },

  /**
   * 关闭授权弹框
   */
  closeWindow: function(){
    this.setData({
      joinWrapState: true
    });
    //初始化动画效果
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease',
    })
    animation.translateY(5000).step();
    this.setData({
      goodsNum: 1,
      animationData: animation.export(),
    });
    if(!this.data.isRegister){
      this.pageBack();
    }
  },
  
  // 页面返回
  pageBack: function(){
    wx.navigateBack();
  },

  /**
   * 注册
   */
  startReister: function(){
    var _this = this;
    var mobile = _this.data.mobile;
    var wx_user_info = app.globalData.wx_user_info;
    var data = {
      mobile: _this.data.mobile,
      name: wx_user_info.nickName,
      avatar: wx_user_info.avatarUrl,
      address: wx_user_info.province+" "+wx_user_info.city+" "+wx_user_info.country,
      gender: wx_user_info.gender,
      openid: wx_user_info.openid,
      unionid: wx_user_info.unionid,
    }
    if(mobile == null || mobile.length <= 0){
      wx.showToast({
        title: '请输入手机号码',
        icon: 'none'
      });
      return;
    }
    if(mobile.length != 11){
      wx.showToast({
        title: '请输入正确格式的手机号码',
        icon: 'none'
      });
      return;
    }
    wx.showLoading({
      title: '正在注册...',
    });
    wx.request({
      url: app.globalData.http_base + '/appletsMember/register',
      method: 'POST',
      data: data,
      header: app.globalData.http_header,
      success: function(res) {
        if (res != null && res.data != null) {
          console.log(res.data);
          var result = res.data;
          if (result != null && result.code == app.globalData.http_ok) {
            app.globalData.isLogin = true;
            app.globalData.http_header.qz_token = result.data.qz_token;
            wx.setStorageSync('qz_token', result.data.qz_token);
            _this.startIndex();
          } else {
            wx.showToast({
              title: result.msg,
              icon: 'none'
            });
          }
        }
      }
    });
  },

  /**
   * 微信手机号码一键登录
   */
  onKeyStartLogin: function(e){
    wx.showLoading({
      title: '正在登录...',
    })
    var qz_token = 'eyJhbGciOiJSUzI1NiJ9.eyJpZCI6ODg0LCJleHBpcmVUaW1lIjoxNjExODgyOTgzNjY2LCJpbmZvIjoie1wibW9iaWxlSW5mb1wiOlwibW9iaWxlSW5mb1wiLFwiZGV2aWNlSWRcIjpcImRldmljZUlkXCIsXCJ1c2VyX2FnZW50XCI6XCJVc2VyLUFnZW50XCIsXCJwbGF0Zm9ybVwiOlwicGxhdGZvcm1cIixcInZlcnNpb25Db2RlXCI6XCJ2ZXJzaW9uQ29kZVwifSIsImV4cCI6MTYxMTg4Mjk4M30.FtjI7oLSzrcdnvOQ1mJOHlttoCyaT1Ndzqvkpa2-02vsTOseB8sQC4FiKcYdoTMrjKlxDTOXICIvCpca6AFyXwdJrk98wFyGtTlgpIG4JvSHojHm6N4EHFSwD5lslIkXUhxTJe_--t2NFLhCkimnoN_ytRmYxXwzd-OSpWwnFYY';
    app.globalData.isLogin = true;
    app.globalData.http_header.qz_token = qz_token;
    app.globalData.wx_user_info = e.detail.userInfo;
    wx.setStorageSync('qz_token', qz_token)
    this.startIndex();
    wx.hideLoading();
  },

  /**
   * 登录
   */
  startLogin: function(e){
    // 1、获取微信code  
    // 2、利用code获取微信openid和unionId
    // 3、根据openid和unionId调用后台接口查询用户信息
    // 4、如果用户已注册则直接登录
    // 5、如果用户未注册则引导注册
    app.globalData.wx_user_info = e.detail.userInfo;
    wx.showLoading({
      title: '授权登录中',
    })
    var _this = this;
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.hideLoading();
        var errMsg = res.errMsg;
        if (errMsg != "login:ok") {
          wx.showToast({
            title: '发生未知错误',
            icon: 'none'
          })
        } else {
          _this.getSystemUserInfoByCode(res.code);
        }
      },
      fail: function (res) {
        wx.hideLoading();
        wx.showToast({
          title: '获取openid失败',
          icon: 'none'
        })
      }
    })
  },

  /**
   * 获取用户信息
   */
  getUserInfo: function(e) {
    if (e.detail.errMsg =="getUserInfo:fail auth deny"){
      wx.showToast({
        title: '用户拒绝授权',
        icon: 'none'
      })
    } 
    //授权成功
    else if (e.detail.errMsg =="getUserInfo:ok"){
      // this.startLogin(e);// 圈子你我
      this.onKeyStartLogin(e);// 美丽蔷薇
    }else{
      wx.showToast({
        title: '未知错误',
        icon: 'none'
      })
    }
  },

  /**
   * 用code换取用户信息
   */
  getSystemUserInfoByCode: function(code){
    var _this = this;
    wx.request({
      url: app.globalData.http_base + '/appletsMember/code2Session/' + code,
      method: 'GET',
      header: app.globalData.http_header,
      success: function(res) {
        if (res != null && res.data != null) {
          var result = res.data;
          if (result != null && result.code == app.globalData.http_ok) {
            app.globalData.wx_user_info.openid = result.data.openid;
            app.globalData.wx_user_info.unionid = result.data.unionid;
            var data = {
              openid: result.data.openid,
              unionid: result.data.unionid
            }
            _this.checkUserRegisted(data);
          }
        }
      }
    });
  },

  /**
   * 判断是否已经注册
   */
  checkUserRegisted: function(data){
    wx.showLoading({
      title: '正在登录...',
    })
    var _this = this;
    wx.request({
      url: app.globalData.http_base + '/appletsMember/checkMember',
      method: 'POST',
      data: data,
      header: app.globalData.http_header,
      success: function(res) {
        wx.hideLoading();
        if (res != null && res.data != null) {
          var result = res.data;
          if (result != null && result.code == app.globalData.http_ok) {
            if(result.data.state === 1){
              app.globalData.isLogin = true;
              app.globalData.http_header.qz_token = result.data.qz_token;
              wx.setStorageSync('qz_token', result.data.qz_token);
              _this.startIndex();
            }else{
              _this.setData({
                isRegister: true
              });
              _this.closeWindow();
            }
          }
        }
      },
      fail: function(res){
        wx.hideLoading();
      }
    });
  }

})