const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lat: 0,
    lon: 0,
    zhongxin: '',//搜索的名称
    geshu: 0,//附近站点数量
    list: [],//返回的数据
    gg: '暂无通知',
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
    var ming = options.m
    var lat = options.lat
    var lon = options.lon
    if (options.re == 't') {
      //是否需要重新计算经纬度，搜索历史传过来的不需要重新计算
      var jw = app.gcj02_bd09(lat, lon)
      lat = jw[0]
      lon = jw[1]
    }
    var lishi = wx.getStorageSync('lishi') || []//添加到搜索记录
    var chongfu = false
    for (var i = 0; i < lishi.length; i++) {
      if (lishi[i].name == ming) {
        chongfu = true
        lishi[i].lat = lat
        lishi[i].lon = lon
      }
    }
    if (!chongfu) {
      lishi.push({
        name: ming,
        lat: lat,
        lon: lon
      })
    }
    wx.setStorageSync('lishi', lishi)
    wx.request({
      url: app.globalData.dizhi + 'sousuozhandian.php',
      data: { lat: lat, lon: lon, xin: 1 },
      success: function (res) {
        console.log(res.data)
        if (res.data.request == 'f') {
          var shuzu = []
        } else {
          var shuzu = res.data.request
        }
        that.setData({
          zhongxin: ming,
          geshu: shuzu.length,
          list: shuzu,
          gg: res.data.gg,
          lat: lat,
          lon: lon
        })
      }
    })


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
  gotoXianLu: function (e) {
    var id = e.currentTarget.dataset.id
    var shuzu = this.data.list
    var liebiao = shuzu[id]
    var last = JSON.stringify(liebiao);
    wx.navigateTo({
      url: '../zhanxian/zhanxian?p=' + last
    })
  },
  gobuxing: function (e) {
    var that = this
    var d = []
    var id = e.currentTarget.dataset.id
    var shuzu = this.data.list
    var liebiao = shuzu[id]
    //数据库中站点坐标使用BD09坐标系，将其转为大地坐标系后使用
    var jw = app.bd9_wgs84(liebiao.lat, liebiao.lon)
    var j = jw.lng
    var w = jw.lat

    var s = JSON.stringify(liebiao)
    d.push({
      width: 40,
      height: 40,
      iconPath: "/images/p.png",
      id: "10000",
      latitude: w,
      longitude: j,
      callout: {
        content: liebiao.name,
        color: "#b5b1b1",
        fontSize: 12,
        borderRadius: 15,
        bgColor: "#262930",
        padding: 10,
        display: 'ALWAYS'
      }
    })

    wx.getLocation({
      type: 'gcj02',
      success: function (res) {


        wx.navigateTo({
          url: '../buxing/buxing?data=' + JSON.stringify(d[0]) + "&from=zhan&lat=" + res.latitude + "&lon=" + res.longitude + '&list=' + s
        })
      },
      fail: function (res) {
        that.setData({ dwqx: false })
        wx.showModal({
          title: '提示',
          content: '无定位权限无法使用此功能。是否重新设置权限？',
          success: function (res) {
            if (res.confirm) {
              that.regetdw()
            } else if (res.cancel) {
              console.log('用户点击取消')
              return;
            }
          }
        })
      }
    })



  },
  regetdw: function (e) {
    //重新获取权限
    wx.openSetting({
      success: (res) => {
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 2000
        })
      }
    })
  }
})