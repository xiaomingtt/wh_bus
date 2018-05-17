const app = getApp()
var amapFile = require('../../js/amap-wx.js');
var config = require('../../js/config.js');
var lonlat;//声明全局变量，纬度，经度
var city;//声明全局变量，城市
var laizi = ''//哪个页面转过来
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tips: {},//高德地图
    longitude: 122.058187,
    latitude: 37.194463,
    dwqx: true, //定位权限
    showdh: true
  },
  closedaohang: function () {
    this.setData({ showdh: false })
  },
  gotowc: function () {
    wx.navigateToMiniProgram({
      appId: 'wx8e581a2d9a18fd3b'
    })
  },
  gotoyijian: function () {
    wx.navigateTo({
      url: '../yijian/yijian'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    laizi = options.from
    wx.getLocation({
      //定位
      type: 'gcj02',
      success: function (res) {
        that.setData({
          longitude: res.longitude,
          latitude: res.latitude
        })
      },
      fail: function (res) {
        that.setData({ dwqx: false })
        wx.showModal({
          title: '获取定位权限失败',
          content: '为给您提供更好的服务，本功能需要使用定位权限。不授权不影响本功能正常使用,但可能造成数据不准确。是否重新设置权限？',
          success: function (res) {
            if (res.confirm) {
              that.regetdw()
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log('ready')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('show')
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  bindInput: function (e) {
    var that = this;
    var lon = that.data.longitude
    var lat = that.data.latitude
    lonlat = lon + ',' + lat
    city = "威海"
    var keywords = e.detail.value;
    var key = config.Config.key;
    var myAmapFun = new amapFile.AMapWX({ key: key });
    myAmapFun.getInputtips({
      keywords: keywords,
      location: lonlat,
      city: city,
      success: function (data) {
        if (data && data.tips) {
          that.setData({
            tips: data.tips
          });
        }
      }
    })
  },
  bindSearch: function (e) {
    var that = this
    var keywords = e.target.dataset.keywords;
    var u = 'https://restapi.amap.com/v3/geocode/geo?address=' + keywords + '&output=JSON&key=a07ec2dc5fdcfaf786df5e4d3a757627&city=威海'
    wx.request({
      url: u,
      success: function (res) {
        var d = res.data
        if (d.status == 1 && d.count == 1) {
          var lonlata = d.geocodes[0].location
          var jw = lonlata.split(',')
          if (laizi == 'zhan') {
            wx.navigateTo({
              url: '../souxianlu/souxianlu?re=t&m=' + keywords + '&lat=' + jw[1] + '&lon=' + jw[0]
            })
          } else {
            that.setglobaldata('t', keywords, jw[1], jw[0]).then((code) => {
              console.log(code)
              wx.switchTab({
                url: '../guihua/guihua'
              })
            }
            )
          }
        }
      }
    })
  },
  regetdw: function (e) {
    //重新获取权限
    var that = this;
    wx.openSetting({
      success: (res) => {
        that.setData({ dwqx: true })
        that.onLoad();
      }
    })
  },
  setglobaldata(r, m, a, o) {
    return new Promise((resolve, reject) => {
      app.globalData.re = r
      app.globalData.m = m
      app.globalData.lat = a
      app.globalData.lon = o
      resolve('ok')
    })
  }
})