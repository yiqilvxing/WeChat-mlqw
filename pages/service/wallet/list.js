// pages/service/wallet/list.js
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    winWidth: 0,
    winHeight: 0,
    type: 0, // 0-小金库，1-余额
    tabItem: ['收入', '支出'],
    currentTab: 0,// 0-收入，1-支出
    detailItem: [],
    currentPage: 1,
    maxPage: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    wx.getSystemInfo({
      success: function(res) {
        _this.setData( {
            winWidth: res.windowWidth,
            winHeight: res.windowHeight
        });
      }
    });
    this.setData({
      type: options.type,
      currentPage: 1,
      currentTab: 0
    });
    requestWalletList(this,this.data.currentPage);
  },

  /**
   * 监听页面下拉刷新
   */
  onPullDownRefresh: function(){
    this.setData({
      currentPage: 1,
    });
    requestWalletList(this,this.data.currentPage);
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
      requestWalletList(this,this.data.currentPage);
    }
  },

  /**
   * Tab滑动切换
   */
  onSwiperChange: function(e){
    var _this = this;
    let index = e.detail.current;
    _this.setData({
      currentPage: 1,
      currentTab: index
    });
    requestWalletList(_this,_this.data.currentPage);
  },

  /**
   * Tab点击切换
   */
  onTabClick: function(e){
    var _this = this;
    let index = e.currentTarget.dataset.index;
    _this.setData({
      currentPage: 1,
      currentTab: index
    });
    requestWalletList(_this,_this.data.currentPage);
  },

  // 查看详情
  startDetail: function(e){
    var index = e.currentTarget.dataset.index;
    var item = this.data.detailItem[index];
    wx.navigateTo({
      url: '../wallet/detail?item='+JSON.stringify(item),
    })
  },

})
/**
 * 获取收支明细
 */
function requestWalletList(_this,page){
  var type = _this.data.type;
  var currentTab = _this.data.currentTab;
  wx.request({
    url: app.globalData.http_base + '/detailed?type='+type+'&income='+currentTab+'&length=20'+"&pageNo="+page,
    method: 'GET',
    header: app.globalData.http_header,
    success: function(res) {
      if (res != null && res.data != null) {
        var result = res.data;
        if (result != null && result.code == app.globalData.http_ok) {
          var detailItem = result.data.rows;
          if(app.globalData.debug_mode){
            if(_this.data.currentTab == 1){
              detailItem = [{
                "id": 202055661111,
                "type": 1,
                "mark": "申请提现10元",
                "num": 1000,
                "isIncome": false,
                "state": 1,
                "createTime": "2020-07-09 12:02:22",
              },{
                "id": 202055661112,
                "type": 1,
                "mark": "申请提现20元",
                "num": 2000,
                "isIncome": false,
                "state": 1,
                "createTime": "2020-07-08 11:05:30",
              },{
                "id": 202055661113,
                "type": 1,
                "mark": "申请提现50元",
                "num": 5000,
                "isIncome": false,
                "state": 1,
                "createTime": "2020-07-06 10:05:56",
              },{
                "id": 202055661114,
                "type": 1,
                "mark": "申请提现30元",
                "num": 3000,
                "isIncome": false,
                "state": 1,
                "createTime": "2020-07-06 06:06:06",
              },{
                "id": 202055661115,
                "type": 1,
                "mark": "申请提现10元",
                "num": 1000,
                "isIncome": false,
                "state": 1,
                "createTime": "2020-07-01 11:11:11",
              }]
            }else{
              detailItem = [{
                "id": 12898092047208444,
                "type": 0,
                "mark": "后台余额充值:1000元",
                "num": 100000,
                "isIncome": true,
                "createTime": "2020-07-15 09:04:51"
              },{
                "id": 12898092047208443,
                "type": 0,
                "mark": "后台余额充值:5000元",
                "num": 500000,
                "isIncome": true,
                "createTime": "2020-07-14 10:04:52"
              },{
                "id": 12898092047208442,
                "type": 0,
                "mark": "后台余额充值:3000元",
                "num": 300000,
                "isIncome": true,
                "createTime": "2020-07-12 16:04:51"
              },{
                "id": 12898092047208441,
                "type": 0,
                "mark": "后台余额充值:1000元",
                "num": 100000,
                "isIncome": true,
                "createTime": "2020-07-11 11:11:11"
              }]
            }
          }
          if(page == 1){
            _this.setData({
              maxPage: result.data.pageSize,
              detailItem: detailItem
            });
          }else{
            _this.setData({
              maxPage: result.data.pageSize,
              detailItem: _this.data.detailItem.concat(detailItem)
            });
          }
        }
      }
    },
    fail: function(res){
      
    }
  });
}