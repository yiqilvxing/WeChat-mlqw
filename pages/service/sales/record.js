// pages/service/sales/record.js
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [],
    currentPage: 1,
    maxPage: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取核销记录
    this.requestSalesRecord(this.data.currentPage);    
  },

  /**
   * 监听页面下拉刷新
   */
  onPullDownRefresh: function(){
    this.setData({
      currentPage: 1,
    });
    this.requestSalesRecord(this.data.currentPage);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var page = this.data.currentPage;
    if(page < this.data.maxPage){
      page++;
      this.setData({
        currentPage: page,
      });
      this.requestSalesRecord(this.data.currentPage);
    }
  },

  /**
   * 获取核销记录
   */
  requestSalesRecord: function(page){
    if(app.globalData.debug_mode){
      var items = [{
        "level": 0,
        "name": "Timi",
        "expire_time": "2020-07-09 16:03:02",
        "levelName": "普通会员",
        "avatar": "https://quanzinw.oss-cn-shenzhen.aliyuncs.com/app/1594431389-ios-lifeapp.png",
        "orderGoodId": 10825230026715136,
        "orderGoodItemList": [
            {
              "title": "陈酱九八七 | 天禧酱香型白酒 498元/瓶 6瓶/箱  整箱发货",
              "cover": "https://quanzinw.oss-cn-shenzhen.aliyuncs.com/web/1601285065370.png",
              "num": 1,
              "spec": "498元/瓶 6瓶/箱  整箱发货"
            }
        ]
      }]
      this.setData({
        items: items
      });
      return;
    }
    var _this = this;
    wx.request({
      url: app.globalData.http_base + '/order/good/writeOffList?pageNo'+page+'length=20',
      method: 'GET',
      header: app.globalData.http_header,
      success: function(res) {
        if (res != null && res.data != null) {
          var result = res.data;
          if (result != null && result.code == app.globalData.http_ok) {
            var items = result.data.rows;
            if(items != null && items.orderGoodItemList != null){
              var goodsItem = items.orderGoodItemList;
              for(var i=0;i<goodsItem.length; i++){
                var goodsSpecsMap = JSON.parse(goodsItem[i].spec);
                var specs = '';
                for(var x in goodsSpecsMap){
                  specs += goodsSpecsMap[x]+' ';
                }
                goodsItem[i].spec = specs;
              }
            }
            if(page == 1){
              _this.setData({
                maxPage: result.data.pageSize,
                items: items
              });
            }else{
              _this.setData({
                maxPage: result.data.pageSize,
                items: _this.data.items.concat(items)
              });
            }
          }
        }
      },
      fail: function(res){
      }
    });
  },
 
})