// pages/me/address/address.js
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.requestAddress();
  },

  /**
   * 获取收货地址
   */
  requestAddress: function(){
    var _this = this;
    wx.request({
      url: app.globalData.http_base + '/address',
      method: 'GET',
      header: app.globalData.http_header,
      success: function(res) {
        if (res != null && res.data != null) {
          var result = res.data;
          if (result != null && result.code == app.globalData.http_ok) {
            var address = result.data;
            if(address != null){
              for(var i=0; i < address.length; i++){
                let mobile = address[i].mobile;
                address[i].mobileShow = mobile.substring(0,3) + "****" + mobile.substring(7,mobile.length);
              }
              _this.setData({
                address: address,
              });
            }
          }
        }
      }
    });
  },

  /**
   * 选择地址
   */
  selectAddress: function(e){
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; 
    var address = e.currentTarget.dataset.item;
    prevPage.setData({
      orderAddress: address
     });
    wx.navigateBack();
  },

  // 新增地址 
  addAddress: function(){
    var _this = this;
    wx.chooseAddress({
      success (res) {
        var data = {
          consignee: res.userName,
          mobile: res.telNumber,
          province: 0,
          city: 0,
          area: 0,
          address: res.provinceName+' '+res.cityName+' '+res.countyName,
          addr: res.detailInfo,
          isDefault: true,
        };
        wx.showLoading({
          title: '正在保存...'
        });
        wx.request({
          url: app.globalData.http_base + '/address',
          method: 'POST',
          data: data,
          header: app.globalData.http_header,
          success: function(res) {
            console.log(res);
            wx.hideLoading();
            if (res != null && res.data != null) {
              var result = res.data;
              if (result != null && result.code == app.globalData.http_ok) {
                _this.requestAddress();
              }
            }
          },
          fail: function(res){
            wx.hideLoading();
          },
        });
      }
    })
  },

  /**
   * 修改地址
   */
  requestAddressEdit: function(e){
    var _this = this;
    var data = _this.data.address[e.currentTarget.dataset.index];
    data.isDefault = true;
    wx.request({
      url: app.globalData.http_base + '/address',
      method: 'PUT',
      data: data,
      header: app.globalData.http_header,
      success: function(res) {
        if (res != null && res.data != null) {
          var result = res.data;
          if (result != null && result.code == app.globalData.http_ok) {
            _this.requestAddress();
            wx.showToast({
              title: '修改成功',
              icon: 'success'
            })
          }else{
            wx.showToast({
              title: result.msg,
              icon: 'none'
            })
          }
        }
      },
    })
  },

  /**
   * 删除地址
   */
  requestAddressDelete: function(e){
    var _this = this;
    var id = _this.data.address[e.currentTarget.dataset.index].id;
    wx.showModal({
      title: '删除地址',
      content: '是否确认删除该地址',
      success(res){
        if (res.confirm) {
          wx.request({
            url: app.globalData.http_base + '/address/' + id,
            method: 'DELETE',
            header: app.globalData.http_header,
            success: function(res) {
              if (res != null && res.data != null) {
                var result = res.data;
                if (result != null && result.code == app.globalData.http_ok) {
                  _this.requestAddress();
                  wx.showToast({
                    title: '删除成功',
                    icon: 'success'
                  })
                }else{
                  wx.showToast({
                    title: result.msg,
                    icon: 'none'
                  })
                }
              }
            },
          })
        }
      }
    })
  },

})