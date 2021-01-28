// pages/order/after/list.js
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    items:[
        {
          "id": 14076120743809024,
          "state": 1,
          "oid": 13002610323865600,
          "description": "描述",
          "images": [
              "https://quanzinw.oss-cn-shenzhen.aliyuncs.com/app/android-317f3846-17f9-4936-92c3-ef7a0eb8cf9a.jpg",
              "https://quanzinw.oss-cn-shenzhen.aliyuncs.com/app/android-317f3846-17f9-4936-92c3-ef7a0eb8cf9a.jpg",
              "https://quanzinw.oss-cn-shenzhen.aliyuncs.com/app/android-317f3846-17f9-4936-92c3-ef7a0eb8cf9a.jpg",
              "https://quanzinw.oss-cn-shenzhen.aliyuncs.com/app/android-317f3846-17f9-4936-92c3-ef7a0eb8cf9a.jpg",
              "https://quanzinw.oss-cn-shenzhen.aliyuncs.com/app/android-317f3846-17f9-4936-92c3-ef7a0eb8cf9a.jpg",
          ],
          "createTime": null,
          "result": null,
          "resultDesc": null,
          "skus": null,
          "modifyTime": "2020-07-18 17:40:01",
          "endTime": null,
          "orderGoodDeliveryType": 0,
          "storeId": 9,
          "orderGoodItem": [
              {
                "cover": "https://quanzinw.oss-cn-shenzhen.aliyuncs.com/web/1602205135645.png",
              },
              {
                "cover": "https://quanzinw.oss-cn-shenzhen.aliyuncs.com/web/1601285065370.png",
              },
          ]
      },
      {
          "id": 14016823611686912,
          "state": 2,
          "oid": 13002610323865612,
          "description": "描述",
          "images": [
              "https://quanzinw.oss-cn-shenzhen.aliyuncs.com/app/android-317f3846-17f9-4936-92c3-ef7a0eb8cf9a.jpg"
          ],
          "createTime": null,
          "result": null,
          "resultDesc": null,
          "skus": null,
          "modifyTime": "2020-07-18 11:10:17",
          "endTime": null,
          "expressSn": null,
          "expressName": null,
          "orderGoodDeliveryType": 0,
          "storeId": 9,
          "orderGoodItem": [
            {
              "cover": "https://quanzinw.oss-cn-shenzhen.aliyuncs.com/web/1602157912218.jpg",
            }
          ]
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  // 售后详情
  startDetail: function(e){
    var index = e.currentTarget.dataset.index;
    var item = this.data.items[index];
    wx.navigateTo({
      url: '../after/detail?item='+JSON.stringify(item),
    })
  },

  // 预览图片，放大预览
  previewBanner: function(e) {
    var _this = this;
    let current = e.currentTarget.dataset.src;
    let urls = e.currentTarget.dataset.urls;
    wx.previewImage({
      current: current, 
      urls: urls 
    })
  },

  
})