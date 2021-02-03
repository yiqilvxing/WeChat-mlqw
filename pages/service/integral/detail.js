// pages/service/integral/detail.js
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      {
        "id": 56461630187274241,
        "type": 0,
        "mark": "订单56461027310686210 兑换积分 10",
        "num": 10,
        "isIncome": false,
        "orderId": 56461027310686210,
        "createTime": "2020-11-12 14:10:47",
        "modifyTime": "2020-11-12 14:10:47"
      },
      {
        "id": 56461630187274242,
        "type": 1,
        "mark": "订单56461027310686212 获得积分 5",
        "num": 5,
        "isIncome": true,
        "orderId": 56461027310686212,
        "createTime": "2020-11-11 15:31:36",
        "modifyTime": "2020-11-11 15:31:36"
      },
      {
        "id": 56461630187274243,
        "type": 0,
        "mark": "订单56461027310686211 兑换积分 10",
        "num": 10,
        "isIncome": false,
        "orderId": 56461027310686211,
        "createTime": "2020-11-09 18:26:50",
        "modifyTime": "2020-11-09 18:26:50"
      },
      {
        "id": 56461630187274243,
        "type": 1,
        "mark": "订单56461027310686213 获得积分 20",
        "num": 20,
        "isIncome": true,
        "orderId": 56461027310686213,
        "createTime": "2020-11-06 10:22:50",
        "modifyTime": "2020-11-06 10:22:50"
      },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  
})