// pages/service/vip/vip.js
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.requestVipCards();
  },

  // 跳转到店铺
  startStore: function(e){
    wx.navigateTo({
      url: '../../store/store?storeId='+e.currentTarget.dataset.id
    })
  },

  /**
   * 获取会员权益
   */
  requestVipCards: function(){
    var _this = this;
    wx.showLoading({
      title: app.globalData.loading
    });
    wx.request({
      url: app.globalData.http_base + '/member/membershipInterests',
      method: 'GET',
      header: app.globalData.http_header,
      success: function(res) {
        wx.hideLoading();
        if (res != null && res.data != null) {
          var result = res.data;
          if (result != null && result.code == app.globalData.http_ok) {
            var items = result.data;
            if(app.globalData.debug_mode){
              items = [
                {
                  "currentAmount": 50000,
                  "className": "钻石卡",
                  "discount": 68,
                  "levelupCumulative": 198000,
                  "storeId": 111,
                  "storeLogo": "https://quanzinw.oss-cn-shenzhen.aliyuncs.com/web/1598420567647.png",
                  "storeName": "魅力蔷薇",
                  "backImage": "https://quanzinw.oss-cn-shenzhen.aliyuncs.com/web/1599461485182.png",
                  "canLevelUp": 1
                },
                {
                  "currentAmount": 2999000,
                  "className": "黑金卡",
                  "discount": 88,
                  "levelupCumulative": 5988000,
                  "storeId": 106,
                  "storeLogo": "https://quanzinw.oss-cn-shenzhen.aliyuncs.com/web/1598239885160.png",
                  "storeName": "天酿酒业",
                  "backImage": "https://quanzinw.oss-cn-shenzhen.aliyuncs.com/web/1599461485182.png",
                  "canLevelUp": 1
                }
              ]
            }
            for(var i=0; i<items.length; i++){
              items[i].percent = 100 * items[i].currentAmount / items[i].levelupCumulative;
            }
            _this.setData({
              items: items
            })
          }
        }
      },
      fail: function(res){
        wx.hideLoading();
      },
    });
  },
  
})