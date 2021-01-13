// pages/goods/goods.js
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden: true,
    statusBarHeight: 20,
    goodsEntity: {},
    storeEntity: {},
    goodsDetailRich: '',
    richImages: [],
    bannerItem: [],
    cartShowGoodsEntity: {},
    isSwitchSpec: false,
    joinWrapState: true,
    showWindowType: 0,
    goodsSpecs: [],
    goodsNum: 1
  },
  // 页面返回
  pageBack: function(){
    wx.navigateBack();
  },
  //预览图片，放大预览
  previewBanner: function(e) {
    let currentUrl = e.currentTarget.dataset.src
    wx.previewImage({
      current: currentUrl, 
      urls: this.data.bannerItem 
    })
  },
  previewRichImage: function(e) {
    let currentUrl = e.currentTarget.dataset.src
    wx.previewImage({
      current: currentUrl, 
      urls: this.data.richImages 
    })
  },

  // 跳转到购物车
  startCart: function(e){
    wx.switchTab({
      url: '../cart/cart',
    })
  },

  // 跳转到店铺
  startStore: function(e){
    wx.navigateTo({
      url: '../store/store?storeId='+e.currentTarget.dataset.id
    })
  },

  /* 点击减号 */
  bindMinus: function (e) {
    var num = this.data.goodsNum;
    // 如果大于1时，才可以减  
    if (num > 1) {
      num--;
    }
    this.setData({
      goodsNum: num,
    });
  },
  bindClick: function(e){

  },
  /* 点击加号 */
  bindPlus: function (e) {
    var num = this.data.goodsNum;
    // 不作过多考虑自增1  
    num++;
    this.setData({
      goodsNum: num,
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    var goodsId = options.goodsId;
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          statusBarHeight: res.statusBarHeight
        });
      }
    })
    if(goodsId != null){
      requestGetGoodsDetail(_this,goodsId);
    }
  },

  /**
   * 加入购物车/立即购买
   */
  showCartWindow: function(res){
    var _this = this;
    app.checkUserLogin(function () {
      let type = parseInt(res.currentTarget.dataset.type);
      let goodsSpecs = [];
      var goodsEntity = _this.data.goodsEntity;
      var goodsSpecsMap = JSON.parse(goodsEntity.specs);
      if(goodsSpecsMap != null){
        for(var i in goodsSpecsMap){
          let title = i;
          let items = [];
          for(var j = 0; j < goodsSpecsMap[i].length; j++){
            let state = false;
            if(goodsEntity.spec[i] === goodsSpecsMap[i][j]){
              state = true;
            }
            items.push({
              value: goodsSpecsMap[i][j],
              state: state
            });
          };
          goodsSpecs.push({
            title: title,
            items: items
          });
        };
      }
      _this.setData({
        showWindowType: type,
        goodsSpecs: goodsSpecs
      });
      //初始化动画效果
      var animation = wx.createAnimation({
        duration: 300,
        timingFunction: 'ease',
      });
      _this.setData({
        joinWrapState: false,
        scrollTop: 0
      });
      animation.translateY(-5000).step();
      _this.setData({
        animationData: animation.export(),
      });
    });
  },

  /**
   * 确定（加入购物车/立即购买）
   */
  onCartWindowConfirm: function (res) {
    var _this = this;
    let type = parseInt(res.currentTarget.dataset.type);
    var data = {
      id: _this.data.cartShowGoodsEntity.id,
      num: _this.data.goodsNum
    };
    if(type == 0){// 加入购物车
      wx.showLoading({
        title: app.globalData.loading,
      });
      wx.request({
        url: app.globalData.http_base + '/cart',
        method: 'POST',
        header: app.globalData.http_header,
        data: data,
        success: function(res) {
          wx.hideLoading();
          if (res != null && res.data != null) {
            var result = res.data;
            if (result != null && result.code == app.globalData.http_ok) {
              _this.closeWindow();
              wx.showToast({
                title: '添加成功',
                icon: 'success'
              })
            }else{
              wx.showToast({
                title: '添加失败',
                icon: 'none'
              })
            }
          }
        },
        fail: function(res) {
          wx.hideLoading();
        }
      })
    }else{// 立即购买
      let storeItems = [];
      let goodsItems = [];
      let goosEntity = _this.data.goodsEntity;
      goosEntity.num = _this.data.goodsNum;
      goodsItems.push(goosEntity);
      let storeItem = {
        id: _this.data.storeEntity.id,
        name: _this.data.storeEntity.name,
        items: goodsItems
      };
      storeItems.push(storeItem);
      var goodsStoreItem= JSON.stringify(storeItems);
      _this.closeWindow();
      wx.navigateTo({
        url: '../order/confirm/confirm?goodsStoreItem='+encodeURIComponent(goodsStoreItem)
      })
    }
  },

   /**
   * 关闭弹框
   */
  closeWindow: function(){
    this.setData({
      joinWrapState: true
    });
    //初始化动画效果
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease',
    })
    animation.translateY(5000).step();
    this.setData({
      goodsNum: 1,
      animationData: animation.export(),
    });
  },

  /**
   * 商品分享
   */
  onShareAppMessage: function(res){
    var _this = this;
    app.checkUserLogin(function () {
      var goodsEntity = _this.data.goodsEntity;
      return {
        title: goodsEntity.title,
        desc: goodsEntity.subTitle,
        imageUrl: goodsEntity.cover,
        path: '/pages/goods/goods?goodsId='+goodsEntity.id 
      }
    });
  },

  /**
   * 商品收藏/取消收藏
   */
  goodsCollect: function(res){
    var _this = this;
    app.checkUserLogin(function () {
      var goodsEntity = _this.data.goodsEntity;
      let isCollection = goodsEntity.isCollection;
      let method = isCollection ? 'PUT' : 'POST';
      let data = {
        type: 1,
        skuId: goodsEntity.id
      }
      wx.showLoading({
        title: app.globalData.loading
      });
      wx.request({
        url: app.globalData.http_base + '/collection',
        method: method,
        header: app.globalData.http_header,
        data: data,
        success: function(res){
          wx.hideLoading();
          wx.showToast({
            title: isCollection ? '取消收藏' : '添加收藏',
            icon: 'success'
          })
          if (res != null && res.data != null) {
            var result = res.data;
            if (result != null && result.code == app.globalData.http_ok) {
              goodsEntity.isCollection = !isCollection;
              _this.setData({
                  goodsEntity: goodsEntity
              })
            }
          }
        },
        fail: function(res){
          wx.hideLoading();
        },
      })
    });
  },

  /**
   * 切换规格
   */
  switchGoodsSpec: function(e){
    var _this = this;
    let index = e.currentTarget.dataset.index;
    let index2 = e.currentTarget.dataset.index2;
    let indexes = '';
    var goodsSpecs = _this.data.goodsSpecs;
    let state = e.currentTarget.dataset.state;
    if(!state){
      for(var i = 0; i < goodsSpecs.length; i++){
        if(i == index){
          for(var j = 0; j < goodsSpecs[i].items.length; j++){
            if(j == index2){
              goodsSpecs[i].items[j].state = true;
            }else{
              goodsSpecs[i].items[j].state = false;
            }
          }
        }
      }
    }
    _this.setData({
      goodsSpecs: goodsSpecs,
      isSwitchSpec: true
    });
    for(var i = 0; i < goodsSpecs.length; i++){
      for(var j = 0; j < goodsSpecs[i].items.length; j++){
        if(goodsSpecs[i].items[j].state){
          if(i != 0){
            indexes += "_"
          }
          indexes += j
        }
      }
    }
    wx.request({
      url: app.globalData.http_base + '/good/switchSpec?spuId=' + _this.data.goodsEntity.spuId + "&indexes=" + indexes,
      method: 'GET',
      header: app.globalData.http_header,
      success: function(res) {
        if (res != null && res.data != null) {
          var result = res.data;
          if (result != null && result.code == app.globalData.http_ok) {
            _this.setData({
              cartShowGoodsEntity: result.data,
              isSwitchSpec: false
            })
          }
        }
      },
      fail: function(res) {
        wx.hideLoading();
      }
    });
  },
})

/**
 * 获取商品详情
 */
function requestGetGoodsDetail(_this,goodsId){
  wx.showLoading({
    title: app.globalData.loading
  })
  wx.request({
    url: app.globalData.http_base + '/good/goodDetails?skuId=' + goodsId,
    method: 'GET',
    header: app.globalData.http_header,
    success: function(res) {
      wx.hideLoading();
      if (res != null && res.data != null) {
        var result = res.data;
        if (result != null && result.code == app.globalData.http_ok) {
          requestStoreMessage(_this,result.data.storeId);
          var banner = result.data.images.split(',');
          // 格式化富文本（自适应屏幕大小）
          var rich = result.data.description;
          rich = rich.replace(/\<img/gi, '<img style="max-width:100%;height:auto;display:block;"');
          result.data.num = 1;
          // 规格
          result.data.spec = JSON.parse(result.data.spec);
          _this.setData({
            hidden: false,
            goodsEntity: result.data,
            cartShowGoodsEntity: result.data,
            bannerItem: banner,
            goodsDetailRich: rich
          });
          // 富文本图片点击预览
          var nodes = result.data.description;
          if (nodes.indexOf("src") >= 0) {
            var imgs = [];
            nodes = nodes.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (match, capture) {
              imgs.push(capture);
              _this.setData({
                richImages: imgs
              });
              return '';
            });
            nodes = nodes.replace(/<p(([\s\S])*?)<\/p>/g, function (match, capture){
              return '';
            });
          }
        }
      }
    },
    fail: function(res) {
      wx.hideLoading();
    }
  });
}
/**
 * 获取店铺信息
 */
function requestStoreMessage(_this,storeId){
  wx.request({
    url: app.globalData.http_base + '/currency/store?storeId=' + storeId,
    method: 'GET',
    header: app.globalData.http_header,
    success: function(res) {
      if (res != null && res.data != null) {
        var result = res.data;
        if (result != null && result.code == app.globalData.http_ok) {
          _this.setData({
            storeEntity: result.data
          });
        }
      }
    },
    fail: function(res) {
    }
  });
}
