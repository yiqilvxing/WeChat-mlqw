//app.js

App({
  onLaunch: function () {
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let capsule = wx.getMenuButtonBoundingClientRect();
        if (capsule) {
          this.globalData.Custom = capsule;
          this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
        } else {
          this.globalData.CustomBar = e.statusBarHeight + 50;
        }
      }
    })
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
    debug_mode: true,// 调试模式
    http_base: "https://api.quanzilife.com.cn",// 正式环境
    qz_token: 'eyJhbGciOiJSUzI1NiJ9.eyJpZCI6ODg0LCJleHBpcmVUaW1lIjoxNjE0NDgwMzY3MTQ0LCJpbmZvIjoie1wibW9iaWxlSW5mb1wiOlwibW9iaWxlSW5mb1wiLFwiZGV2aWNlSWRcIjpcImRldmljZUlkXCIsXCJ1c2VyX2FnZW50XCI6XCJVc2VyLUFnZW50XCIsXCJwbGF0Zm9ybVwiOlwicGxhdGZvcm1cIixcInZlcnNpb25Db2RlXCI6XCJ2ZXJzaW9uQ29kZVwifSIsImV4cCI6MTYxNDQ4MDM2N30.Dpi3sbzvXdrnUffvzG_THdUfw1Fi8anr-l15k7C642wzO0-EsbcNDeOk4h7VQ7_VoCv_8h6oiElYkTTlJsuDhRYdvOSn2fEdyQcb-vMFxQfVcHNu32npLvUCFgg8WdiR1J3jW9OqRXg6Y6tiWKTermhMhF7-zDOKruoHbZHGDXI',
   
    // http_base: "http://192.168.7.147:8300",// 测试环境
    // qz_token: 'eyJhbGciOiJSUzI1NiJ9.eyJpZCI6MTcsImV4cGlyZVRpbWUiOjE2MTI2MDQyNDAyODksImluZm8iOiJ7XCJtb2JpbGVJbmZvXCI6XCJtb2JpbGVJbmZvXCIsXCJkZXZpY2VJZFwiOlwiZGV2aWNlSWRcIixcInVzZXJfYWdlbnRcIjpcIlVzZXItQWdlbnRcIixcInBsYXRmb3JtXCI6XCJwbGF0Zm9ybVwiLFwidmVyc2lvbkNvZGVcIjpcInZlcnNpb25Db2RlXCJ9IiwiZXhwIjoxNjEyNjA0MjQwfQ.Lbb9MSA01Js8qc5Rh3vFthVcnZcJkhL6pDZWGqC3ligVQht0lBwPyiGs9OtESgQIqpK749PnaO6L8h6o5a6tVpC_pOdyTTRpclsNm5-9fZcg3foh8kcnAICwemFqOl-CdFGRSWBg7bZp-X0ha4HBWZv1e7CC6H9GzmcflaekGXQ',
    
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
    loading: '正在加载...',
  },

})
