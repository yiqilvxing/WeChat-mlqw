// pages/me/me.js
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin: false,
    userEntity: {},
    orderCount: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options){
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    var isLogin =  app.globalData.isLogin;
    if(isLogin){
     this.setData({
       isLogin: isLogin
     });
    }
    if(isLogin){
      // 获取用户信息
      requestUserMessage(this);
      // 获取订单数量统计
      requestOrderCount(this);
    }
  },

  // 跳转到登录
  startLogin: function(e){
    wx.navigateTo({
      url: '../login/login'
    });
  },

  // 订单列表
  startOrderList: function(e){
    app.checkUserLogin(function () {
      wx.navigateTo({
        url: '../order/list/list?orderState=' + e.currentTarget.dataset.state
      });
    });
  },

  // 售后/退款
  startOrderAfter: function(e){
    app.checkUserLogin(function () {
      wx.navigateTo({
        url: '../order/after/list'
      });
    });
  },

  // 个人资料
  startMeData: function(e){
    app.checkUserLogin(function () {
      wx.navigateTo({
        url: '../me/data/data'
      });
    });
  },

  // 收货地址
  startMeAddress: function(e){
    app.checkUserLogin(function () {
      wx.navigateTo({
        url: '../me/address/address'
      });
    });
  },

  // 我的收藏
  startMeCollect: function(e){
    app.checkUserLogin(function () {
      wx.navigateTo({
        url: '../me/collect/collect'
      });
    });
  },

  // 我的服务
  startServicePage: function(e){
    let key = e.currentTarget.dataset.key;
    let url = null;
    switch (key) {
      case 'wallet':// 我的钱包
        url = '../service/wallet/wallet'
        break;
      case 'vip':// 会员权益
        url = '../service/vip/vip'
        break;
      case 'achieve':// 业绩统计
        url = '../service/achieve/achieve'
        break;
      case 'integral':// 积分商城
        url = '../service/integral/mall'
        break;
      case 'coupon':// 优惠券 
        url = '../service/coupon/list'
        break;
      case 'team':// 我的团队
        url = '../service/team/team'
        break;
      case 'cloud':// 云仓提货
        url = '../service/cloud/cloud'
        break;
      case 'invite':// 邀请好友
        url = '../service/invite/invite'
        break;
      case 'sales':// 订单核销
        url = '../service/sales/sales'
        break;
      case 'cash':// 零钱提现
        url = '../service/cash/cash'
        break;
      case 'upgrade':// 我要升级
        url = '../service/upgrade/upgrade'
        break;
      case 'girls':// 休息一下
        url = '../service/girls/girls'
        break;
      default:
        break;
    }
    if(url != null){
      app.checkUserLogin(function () {
        wx.navigateTo({
          url: url
        });
      });
    }else{
      wx.showModal({
        title: '功能开发中',
        content: '请耐心等待更新哦~',
      })
    }
  },

})
/**
 * 获取用户信息
 */
function requestUserMessage(_this){
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
            userEntity: result.data,
            isLogin: true
          });
        }
      }
    },
    fail: function(res) {
      var userInfo = wx.getStorageSync('userInfo')
      if(userInfo != null){
        _this.setData({
          userEntity: userInfo,
          isLogin: true
        });
      }
    }
  });
}
/**
 * 获取订单数量统计
 */
function requestOrderCount(_this){
  wx.request({
    url: app.globalData.http_base + '/order/good/orderGoodCount',
    method: 'GET',
    header: app.globalData.http_header,
    success: function(res) {
      if (res != null && res.data != null) {
        var result = res.data;
        if (result != null && result.code == app.globalData.http_ok) {
          _this.setData({
            orderCount: result.data,
          });
        }
      }
    },
    fail: function(res) {
    }
  });
}