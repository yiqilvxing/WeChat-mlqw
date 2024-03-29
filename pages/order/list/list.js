// pages/order/list/list.js
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollLeft: 0,
    tabItem: ['全部', '待支付', '待发货', '待收货', '已收货', '已完成', '已失效'],
    tabItemState: [-1, 0, 1, 2, 3, 4, 5],
    currentPage: 1,
    maxPage: 1,
    currentTab: 0,
    orderState: -1,
    goodsStoreItem: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    var tabItemState = _this.data.tabItemState;
    let orderState = options.orderState;
    if(orderState == null){
      orderState = -1;
    }
    for(var i=0; i < tabItemState.length; i++){
      if(parseInt(orderState) == tabItemState[i]){
        let index = i;
        let scrollLeft = (index-2) * 50;
        _this.setData({
          scrollLeft: scrollLeft,
          currentTab: index,
          orderState: orderState
        });
      }
    }
    if(_this.data.currentTab==0){
      // 获取订单列表
      requestGetOrderList(_this, orderState);
    }
  },

  /**
   * Tab滑动切换
   */
  onSwiperChange: function(e){
    var _this = this;
    let index = e.detail.current;
    let orderState = _this.data.tabItemState[index];
    let scrollLeft = (index-2) * 50;
    _this.setData({
      currentPage: 1,
      scrollLeft: scrollLeft,
      currentTab: index,
      orderState: orderState
    });
    // 获取订单列表
    requestGetOrderList(_this, orderState);
  },

  /**
   * Tab点击切换
   */
  onTabClick: function(e){
    var _this = this;
    let index = e.currentTarget.dataset.index;
    let orderState = _this.data.tabItemState[index];
    _this.setData({
      currentPage: 1,
      currentTab: index,
      orderState: orderState
    });
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
      requestGetOrderList(this,this.data.orderState);
    }
  },

  /**
   * 操作栏
   */
  onOrderOperation: function(e){
    var _this = this;
    var goodsStoreItem = _this.data.goodsStoreItem;
    let index = e.currentTarget.dataset.index;
    var orderItem = goodsStoreItem[index];
    var state = orderItem.state;
    switch(state){
      case 0:// 待支付
        requestReplacePay(_this, orderItem.orderGoodId);
        break;
      case 1:// 待发货
        break;
      case 2:// 待收货
        break;
      case 3:// 已收货
        break;
      case 4:// 已完成
        break;
      case 5:// 已失效
        requestOrderDelete(_this, orderItem.orderGoodId);
        break;
    };
  },

  // 跳转到订单详情
  startDetail: function(e){
    wx.navigateTo({
      url: '../../order/detail/detail?orderId='+e.currentTarget.dataset.id,
    })
  },

  // 跳转到店铺
  startStore: function(e){
    wx.navigateTo({
      url: '../../store/store?storeId='+e.currentTarget.dataset.id
    })
  },
  
})

/**
 * 获取订单列表
 */
function requestGetOrderList(_this,orderState){
  wx.request({
    url: app.globalData.http_base + '/order/good/orderGoodList?type=1&length=100'+ '&pageNo=' + _this.data.currentPage + '&orderState=' + orderState,
    method: 'GET',
    header: app.globalData.http_header,
    success: function(res) {
      if (res != null && res.data != null) {
        var result = res.data;
        if (result != null && result.code == app.globalData.http_ok) {
          if(_this.data.currentPage == 1){
            _this.setData({
              maxPage: result.data.pageSize,
              goodsStoreItem: result.data.rows
            });
          }else{
            _this.setData({
              maxPage: result.data.pageSize,
              goodsStoreItem: _this.data.goodsStoreItem.concat(result.data.rows)
            });
          }
        }
      }
    },
    fail: function(res) {
    }
  });
}

/**
 * 去支付
 */
function requestReplacePay(_this,id){
    var data = {
      id: id
    }
    wx.showLoading({
      title: app.globalData.loading
    });
    wx.request({
      url: app.globalData.http_base + '/order/good/again',
      method: 'POST',
      header: app.globalData.http_header,
      data: data,
      success: function(res) {
        wx.hideLoading();
        if (res != null) {
          var result = res.data;
          if (result != null && res.code == app.globalData.http_ok) {
            wx.navigateTo({
              url: '../pay/pay?orderPayInfo=' + JSON.stringify(result)
            }) 
          } else {
            wx.showToast({
              title: result.msg,
              icon: 'none'
            })
          }
        }
      },
      fail: function(res) {
        wx.hideLoading();
      }
    });
}

/**
 * 删除订单
 */
function requestOrderDelete(_this,id){
  wx.showModal({
    title: '订单删除',
    content: '确定删除该订单吗？',
    success: function (sm) {
      if (sm.confirm) {
        wx.showLoading({
          title: '删除中...'
        });
        wx.request({
          url: app.globalData.http_base + '/order/good/'+id,
          method: 'DELETE',
          header: app.globalData.http_header,
          success: function(res) {
            wx.hideLoading();
            if (res != null && res.data.code == app.globalData.http_ok) {
              requestGetOrderList(_this,_this.data.orderState);
              wx.showToast({
                title: '删除成功',
                icon: 'success'
              })
            }else{
              wx.showToast({
                title: '删除失败',
                icon: 'none'
              })
            }
          },
          fail: function(res) {
            wx.hideLoading();
          }
        });
      }else{
        //
      }
    }
  })
}

/**
 * 取消订单
 */
function requestOrderRevoke(_this,id){
  wx.showModal({
    title: '订单取消',
    content: '确定取消该订单吗？',
    success: function (sm) {
      if (sm.confirm) {
        wx.showLoading({
          title: '取消中...'
        });
        wx.request({
          url: app.globalData.http_base + '/order/good/cancelOrderGood/'+id,
          method: 'PUT',
          header: app.globalData.http_header,
          success: function(res) {
            wx.hideLoading();
            if (res != null && res.data.code == app.globalData.http_ok) {
              requestGetOrderList(_this,_this.data.orderState);
              wx.showToast({
                title: '取消成功',
                icon: 'success'
              })
            }else{
              wx.showToast({
                title: '取消失败',
                icon: 'none'
              })
            }
          },
          fail: function(res) {
            wx.hideLoading();
          }
        });
      }else{
        //
      }
    }
  })
}

