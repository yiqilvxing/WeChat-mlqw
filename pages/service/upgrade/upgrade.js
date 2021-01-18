// pages/service/upgrade/upgrade.js
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabTitle: ['金卡','铂金卡','黑金卡','钻石卡'],
    currentTab: 0,
    items: [],
  },

  // Tab滑动切换
  onSwiperChange(e){
    let index = e.detail.current;
    this.setData({
      currentTab: index,
    });
  },
  // Tab点击切换
  onTabClick(e){
    let index = e.currentTarget.dataset.index;
    this.setData({
      currentTab: index,
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  
})