//app.js

App({
  onLaunch: function () {
    // wx.removeStorageSync('userInfo');
    // wx.removeStorageSync('qz_token');

    var userInfo = wx.getStorageSync('userInfo');
    var qz_token = wx.getStorageSync('qz_token');
    
    this.globalData.userInfo = userInfo;
    this.globalData.http_header.qz_token = qz_token;

    if(userInfo || qz_token){
      this.globalData.isLogin = true;
    }
  },
  
  /**
   * 检查用户是否已登录
   */
  checkUserLogin: function(callback){
    if(this.globalData.isLogin){
      callback();
    }else{
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },

  // 全局数据
  globalData: {
    // http_base: "https://api.quanzilife.com.cn",// 正式环境
    http_base: "http://192.168.7.147:8300",// 测试环境
    http_ok: 100,
    http_header: {
      'Content-Type': 'application/json',
      'platform': '3',
      'qz_token': ''
    },
    qz_store_id: 1,
    wx_user_info: null,
    userInfo: null,
    isLogin: false,
  },

})
