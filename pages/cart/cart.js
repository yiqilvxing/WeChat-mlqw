// pages/cart/cart.js
//获取应用实例
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isLogin: false,
    hasData: false,
    goodsStoreItem: [],
    goodsPriceTotal: 0,
    goodsCountTotal: 0
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
      // 获取购物车商品
      requestGetCart(this);
    }
  },

  /**
   * 跳转到首页
   */
  startIndex: function(e){
    wx.switchTab({
      url: '../index/index',
    })
  },

  /**
   * 跳转到登录页
   */
  startLogin: function(e){
    wx.navigateTo({
      url: '../login/login'
    });
  },
  
  /* 点击减号 */
  bindMinus: function (e) {
    var _this = this;
    var goodsStoreItem = _this.data.goodsStoreItem;
    let index = e.currentTarget.dataset.index;
    let index2 = e.currentTarget.dataset.index2;
    var goodsItem = goodsStoreItem[index].items[index2];
    var num = goodsItem.num;
    // 如果大于1时，才可以减  
    if (num > 1) {
      num--;
    }
    goodsItem.num = num;
    _this.setData({
      goodsStoreItem: goodsStoreItem,
    });
    // 编辑购物车商品
    requestEditCart(_this,goodsItem);
    // 刷新商品合计
    refreshGoodsTotal(_this);
  },
  bindClick: function(e){

  },
  /* 点击加号 */
  bindPlus: function (e) {
    var _this = this;
    var goodsStoreItem = _this.data.goodsStoreItem;
    let index = e.currentTarget.dataset.index;
    let index2 = e.currentTarget.dataset.index2;
    var goodsItem = goodsStoreItem[index].items[index2];
    var num = goodsItem.num;

    // 不作过多考虑自增1  
    num++;
    goodsItem.num = num;
    this.setData({
      goodsStoreItem: goodsStoreItem,
    });
    // 编辑购物车商品
    requestEditCart(_this,goodsItem);
    // 刷新商品合计
    refreshGoodsTotal(_this);
  },
  
  // 跳转到商品详情
  startGoodsDetail: function(e) {
    let index = e.currentTarget.dataset.index;
    this.data.goodsStoreItem[index].items.forEach(function (v, i) {
      if (v.isTouchMove){
        v.isTouchMove = false;
      }
    })
    this.setData({
      goodsStoreItem: this.data.goodsStoreItem
    })
    wx.navigateTo({
      url: '../goods/goods?goodsId='+e.currentTarget.dataset.gid
    }) 
  },

  // 跳转到确认订单
  startOrderConfirm: function() {
    var goodsStoreItem= JSON.stringify(this.data.goodsStoreItem);
    wx.navigateTo({
      url: '../order/confirm/confirm?goodsStoreItem='+encodeURIComponent(goodsStoreItem)
    }) 
  },

  //手指触摸动作开始 记录起点X坐标
	touchstart: function (e) {
    //开始触摸时 重置所有删除
    let index = e.currentTarget.dataset.index;
    this.data.goodsStoreItem[index].items.forEach(function (v, i) {
      if (v.isTouchMove)//只操作为true的
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      goodsStoreItem: this.data.goodsStoreItem
    })
  },

  //滑动事件处理
  touchmove: function (e) {
    let index = e.currentTarget.dataset.index,
    index2 = e.currentTarget.dataset.index2,
    startX = this.data.startX,//开始X坐
    startY = this.data.startY,//开始Y坐标
    touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
    touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
    //获取滑动角度
    angle = this.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
    this.data.goodsStoreItem[index].items.forEach(function (v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) 
        return;
      if (i == index2) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    //更新数据
    this.setData({
      goodsStoreItem: this.data.goodsStoreItem
    })
  },

  /**
  * 计算滑动角度
  * @param {Object} start 起点坐标
  * @param {Object} end 终点坐标
  */
  angle: function (start, end) {
    var _X = end.X - start.X,
    _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  
  //删除事件
  deleteItem: function (e) {
    var _this = this;
    let index = e.currentTarget.dataset.index;
    let index2 = e.currentTarget.dataset.index2;
    let id = _this.data.goodsStoreItem[index].items[index2].id;
    wx.showLoading({
      title: '删除中...',
    })
    wx.request({
      url: app.globalData.http_base + '/cart/'+id,
      method: 'DELETE',
      header: app.globalData.http_header,
      success: function(res) {
        wx.hideLoading();
        requestGetCart(_this);
        wx.showToast({
          title: '删除成功',
          icon: 'success'
        });
      },
      fail: function(res) {
        wx.hideLoading();
        wx.showToast({
          title: '删除失败',
          icon: 'none'
        })
      }
    });
  }
})
/**
 * 获取购物车商品
 */
function requestGetCart(_this){
  wx.request({
    url: app.globalData.http_base + '/cart',
    method: 'GET',
    header: app.globalData.http_header,
    success: function(res) {
      if (res != null && res.data != null) {
        var result = res.data;
        if (result != null && result.code == app.globalData.http_ok) {
          let hasData = false;
          if(result.data != null && result.data.length > 0){
            hasData = true;
          }
          _this.setData({
            goodsStoreItem: result.data,
            hasData: hasData
          });
          // 刷新商品合计
          refreshGoodsTotal(_this);
        }
      }
    },
    fail: function(res) {
    }
  });
}
/**
 * 刷新商品合计
 */
function refreshGoodsTotal(_this){
  var goodsStoreItem = _this.data.goodsStoreItem;
  var priceTotal = 0;
  var countTotal = 0;
  if(goodsStoreItem != null && goodsStoreItem.length > 0){
    for (var i = 0; i < goodsStoreItem.length; i++) {
      var goodItems = goodsStoreItem[i].items;
      if(goodItems != null && goodItems.length > 0){
        for (var j = 0; j < goodItems.length; j++) {
          var goodEntity = goodItems[j];
          priceTotal += goodEntity.price;
          countTotal += goodEntity.num;
        };
      }
    };
  }
  _this.setData({
    goodsPriceTotal: priceTotal / 100,
    goodsCountTotal: countTotal
  });
}
/**
 * 编辑购物车商品
 */
function requestEditCart(_this,goodsItem){
  var data = {
    "id": goodsItem.id,
    "num": goodsItem.num
  };
  wx.request({
    url: app.globalData.http_base + '/cart',
    method: 'PUT',
    header: app.globalData.http_header,
    data: data,
    success: function(res) {
      // 
    },
    fail: function(res) {
      // 
    }
  })
}