//index.js
//获取应用实例
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabImageSize: 180,
    bannerItem: [],
    tabMenuItem: [],
    goodsSpecailItem: [],
    goodsHotItem: [],
    currentPage: 1,
    maxPage: 1,
    swiperList: [],
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.towerSwiper('swiperList');
    this.setData({
      currentPage: 1,
      tabImageSize: (wx.getSystemInfoSync().windowWidth - 40) / 2
    });
  },

  // cardSwiper
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },
  // towerSwiper
  towerSwiper(name) {
    let list = this.data[name];
    for (let i = 0; i < list.length; i++) {
      list[i].zIndex = parseInt(list.length / 2) + 1 - Math.abs(i - parseInt(list.length / 2))
      list[i].mLeft = i - parseInt(list.length / 2)
    }
    this.setData({
      swiperList: list
    })
  },
  // towerSwiper触摸开始
  towerStart(e) {
    this.setData({
      towerStart: e.touches[0].pageX
    })
  },
  // towerSwiper计算方向
  towerMove(e) {
    this.setData({
      direction: e.touches[0].pageX - this.data.towerStart > 0 ? 'right' : 'left'
    })
  },
  // towerSwiper计算滚动
  towerEnd(e) {
    let direction = this.data.direction;
    let list = this.data.swiperList;
    if (direction == 'right') {
      let mLeft = list[0].mLeft;
      let zIndex = list[0].zIndex;
      for (let i = 1; i < list.length; i++) {
        list[i - 1].mLeft = list[i].mLeft
        list[i - 1].zIndex = list[i].zIndex
      }
      list[list.length - 1].mLeft = mLeft;
      list[list.length - 1].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
    } else {
      let mLeft = list[list.length - 1].mLeft;
      let zIndex = list[list.length - 1].zIndex;
      for (let i = list.length - 1; i > 0; i--) {
        list[i].mLeft = list[i - 1].mLeft
        list[i].zIndex = list[i - 1].zIndex
      }
      list[0].mLeft = mLeft;
      list[0].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      currentPage: 1,
    });
    requestGetBanner(this);
    requestGetTabMenu(this);
    requestGetGoodsSpecial(this);
    requestGetShopHot(this);
    requestGetGoodsHot(this,this.data.currentPage);
  },

  /**
   * 监听页面下拉刷新
   */
  onPullDownRefresh: function(){
    this.setData({
      currentPage: 1,
    });
    requestGetBanner(this);
    requestGetTabMenu(this);
    requestGetGoodsSpecial(this);
    requestGetShopHot(this);
    requestGetGoodsHot(this,this.data.currentPage);
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
      requestGetGoodsHot(this,this.data.currentPage);
    }
  },

  // 跳转到商品搜索
  startSearch: function(e){
    wx.navigateTo({
      url: '../search/search'
    }) 
  },

  // 跳转到店铺首页
  startStore: function(e){
    wx.navigateTo({
      url: '../store/store?storeId='+e.currentTarget.dataset.id
    }) 
  },

  // 跳转到商品详情
  startGoodsDetail: function(e) {
    // 0:总店 1:商品 2:专区
    let type = e.currentTarget.dataset.type;
    if(type == null){
      wx.navigateTo({
        url: '../goods/goods?goodsId='+e.currentTarget.dataset.id
      }) 
    }else{
      if(type == 0){
        wx.navigateTo({
          url: '../store/store?storeId='+e.currentTarget.dataset.bid
        }) 
      }
      if(type == 1){
        wx.navigateTo({
          url: '../goods/goods?goodsId='+e.currentTarget.dataset.bid
        }) 
      }
    }
  },
})
/**
 * 获取轮播图片
 */
function requestGetBanner(_this){
  wx.request({
    url: app.globalData.http_base + '/banner?storeId=' + app.globalData.qz_store_id,
    method: 'GET',
    header: app.globalData.http_header,
    success: function(res) {
      if (res != null && res.data != null) {
        var result = res.data;
        if (result != null && result.code == app.globalData.http_ok) {
          _this.setData({
            bannerItem: result.data
          });
        }
      }
    }
  });
}
/**
 * 获取金刚区
 */
function requestGetTabMenu(_this){
  wx.request({
    url: app.globalData.http_base + '/vajra?storeId=' + app.globalData.qz_store_id,
    method: 'GET',
    header: app.globalData.http_header,
    success: function(res) {
      if (res != null && res.data != null) {
        var result = res.data;
        if (result != null && result.code == app.globalData.http_ok) {
          var maxsize = result.data.length > 4 ? 4 : result.data.length;
          var data = [];
          for(var i=0; i<maxsize; i++){
            data.push(result.data[i]);
          }
          _this.setData({
            tabMenuItem: data
          });
        }
      }
    }
  });
}
/**
 * 获取会员特价商品
 */
function requestGetGoodsSpecial(_this){
  wx.request({
    url: app.globalData.http_base + '/good/discountGoods?storeId=' + app.globalData.qz_store_id,
    method: 'GET',
    header: app.globalData.http_header,
    success: function(res) {
      if (res != null && res.data != null) {
        var result = res.data;
        if (result != null && result.code == app.globalData.http_ok) {
          _this.setData({
            goodsSpecailItem: result.data
          });
        }
      }
    }
  });
}
/**
 * 获取热门推荐商品
 */
function requestGetGoodsHot(_this,page){
  wx.request({
    url: app.globalData.http_base + '/good/goodsRecommendList?pageNo='+page+'&length=20&storeId=' + app.globalData.qz_store_id,
    method: 'GET',
    header: app.globalData.http_header,
    success: function(res) {
      wx.stopPullDownRefresh();
      if (res != null && res.data != null) {
        var result = res.data;
        if (result != null && result.code == app.globalData.http_ok) {
          if(page == 1){
            _this.setData({
              maxPage: result.data.pageSize,
              goodsHotItem: result.data.rows
            });
          }else{
            _this.setData({
              maxPage: result.data.pageSize,
              goodsHotItem: _this.data.goodsHotItem.concat(result.data.rows)
            });
          }
        }
      }
    },
    fail: function(res) {
      wx.stopPullDownRefresh();
    }
  });
}
/**
 * 获取热门店铺
 */
function requestGetShopHot(_this){
  wx.request({
    url: app.globalData.http_base + '/store/hotList',
    method: 'GET',
    header: app.globalData.http_header,
    success: function(res) {
      if (res != null && res.data != null) {
        var result = res.data;
        if (result != null && result.code == app.globalData.http_ok) {
          _this.setData({
            swiperList: result.data
          });
        }
      }
    },
    fail: function(res) {
    }
  });
}