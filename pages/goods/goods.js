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
    goodsNum: 1,
    hide_good_box: true,
    goodsCount: 0,
  },
  // 页面返回
  pageBack: function(){
    wx.navigateBack();
  },
  // 预览图片，放大预览
  previewBanner: function(e) {
    let currentUrl = e.currentTarget.dataset.src
    wx.previewImage({
      current: currentUrl, 
      urls: this.data.bannerItem 
    })
  },
  previewRichImage: function(e) {
    wx.previewImage({
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
    _this.setData({
      goodsCount: wx.getStorageSync('cartCount')
    })
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          statusBarHeight: res.statusBarHeight,
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight,
        });
        _this.busPos = {};
        _this.busPos['x'] = res.windowWidth * 0.5-50;
        _this.busPos['y'] = res.windowHeight * 0.9;
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
              _this.startAnimation();
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

  // 打开关闭shake
  toggleShake() {
    var _this = this;
    _this.setData({
      animation: 'shake-v'
    })
    setTimeout(function() {
      _this.setData({
        animation: ''
      })
    }, 1000)
  },

  // 加入购物车抛物线动画
  startAnimation: function() {
    if (!this.data.hide_good_box) {
      return;
    };
    this.finger = {};
    var topPoint = {};
    this.finger['x'] = 0;
    this.finger['y'] = 150;
    if (this.finger['y'] < this.busPos['y']) {
      topPoint['y'] = this.finger['y'] - 150;
    } else {
      topPoint['y'] = this.busPos['y'] - 150;
    }
    if (this.finger['x'] < this.busPos['x']) {
      topPoint['x'] = Math.abs(this.finger['x'] - this.busPos['x']) / 2 + this.finger['x'];
    } else {
      topPoint['x'] = this.busPos['x'];
      this.finger['x'] = this.busPos['x']
    }
    var that = this;
    that.linePos = that.bezier([that.finger, topPoint, that.busPos], 30);
    var index = 0;
    var bezier_points = that.linePos['bezier_points'];
    that.setData({
      hide_good_box: false,
      bus_x: that.finger['x'],
      bus_y: that.finger['y']
    })
    that.timer = setInterval(function() {
        index++;
        that.setData({
          bus_x: bezier_points[index]['x'],
          bus_y: bezier_points[index]['y']
        })
        if (index >= 25) {
          let newCount = that.data.goodsCount + that.data.goodsNum;
          clearInterval(that.timer);
          that.setData({
            hide_good_box: true,
            goodsCount: newCount,
          });
          that.toggleShake();
        }
    }, 25);
  },

  // 贝塞尔曲线
  bezier: function (points, times) {
    // 0、以3个控制点为例，点A,B,C,AB上设置点D,BC上设置点E,DE连线上设置点F,则最终的贝塞尔曲线是点F的坐标轨迹。
    // 1、计算相邻控制点间距。
    // 2、根据完成时间,计算每次执行时D在AB方向上移动的距离，E在BC方向上移动的距离。
    // 3、时间每递增100ms，则D,E在指定方向上发生位移, F在DE上的位移则可通过AD/AB = DF/DE得出。
    // 4、根据DE的正余弦值和DE的值计算出F的坐标。
    // 邻控制AB点间距
    var bezier_points = [];
    var points_D = [];
    var points_E = [];
    const DIST_AB = Math.sqrt(Math.pow(points[1]['x'] - points[0]['x'], 2) + Math.pow(points[1]['y'] - points[0]['y'], 2));
    // 邻控制BC点间距
    const DIST_BC = Math.sqrt(Math.pow(points[2]['x'] - points[1]['x'], 2) + Math.pow(points[2]['y'] - points[1]['y'], 2));
    // D每次在AB方向上移动的距离
    const EACH_MOVE_AD = DIST_AB / times;
    // E每次在BC方向上移动的距离 
    const EACH_MOVE_BE = DIST_BC / times;
    // 点AB的正切
    const TAN_AB = (points[1]['y'] - points[0]['y']) / (points[1]['x'] - points[0]['x']);
    // 点BC的正切
    const TAN_BC = (points[2]['y'] - points[1]['y']) / (points[2]['x'] - points[1]['x']);
    // 点AB的弧度值
    const RADIUS_AB = Math.atan(TAN_AB);
    // 点BC的弧度值
    const RADIUS_BC = Math.atan(TAN_BC);
    // 每次执行
    for (var i = 1; i <= times; i++) {
      // AD的距离
      var dist_AD = EACH_MOVE_AD * i;
      // BE的距离
      var dist_BE = EACH_MOVE_BE * i;
      // D点的坐标
      var point_D = {};
      point_D['x'] = dist_AD * Math.cos(RADIUS_AB) + points[0]['x'];
      point_D['y'] = dist_AD * Math.sin(RADIUS_AB) + points[0]['y'];
      points_D.push(point_D);
      // E点的坐标
      var point_E = {};
      point_E['x'] = dist_BE * Math.cos(RADIUS_BC) + points[1]['x'];
      point_E['y'] = dist_BE * Math.sin(RADIUS_BC) + points[1]['y'];
      points_E.push(point_E);
      // 此时线段DE的正切值
      var tan_DE = (point_E['y'] - point_D['y']) / (point_E['x'] - point_D['x']);
      // tan_DE的弧度值
      var radius_DE = Math.atan(tan_DE);
      // 地市DE的间距
      var dist_DE = Math.sqrt(Math.pow((point_E['x'] - point_D['x']), 2) + Math.pow((point_E['y'] - point_D['y']), 2));
      // 此时DF的距离
      var dist_DF = (dist_AD / DIST_AB) * dist_DE;
      // 此时DF点的坐标
      var point_F = {};
      point_F['x'] = dist_DF * Math.cos(radius_DE) + point_D['x'];
      point_F['y'] = dist_DF * Math.sin(radius_DE) + point_D['y'];
      bezier_points.push(point_F);
    }
    return {
      'bezier_points': bezier_points
    };
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
