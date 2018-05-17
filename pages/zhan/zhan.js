const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dwqx: false,//是否具有定位权限
    lishi: [],//搜索历史
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
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              that.setData({ dwqx: true })
            },
            fail() {
              that.setData({ dwqx: false })
            }
          })
        } else {
          that.setData({ dwqx: true })
        }
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
    var lishi = wx.getStorageSync('lishi') || []//搜索记录
    this.setData({
      lishi: lishi
    })

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
  sousuozhandian: function (e) {
    // 搜索站点
    wx.navigateTo({
      url: '../sousuo/sousuo?from=zhan',
    })
  },
  dituxuandian: function (e) {
    //地图选点
    var that = this
    if (this.data.dwqx == false) {
      wx.showModal({
        title: '提示',
        content: '无定位权限，无法使用此功能。是否重新设置权限？',
        success: function (res) {
          if (res.confirm) {
            that.regetdw("xd")
          } else if (res.cancel) {
            return;
          }
        }
      })
    }
    wx.chooseLocation({
      success: function (res) {
        var ming = res.name
        var lat = res.latitude
        var lon = res.longitude
        console.log(lon + ',' + lat)
        if (ming == '') { ming = "未知地点" }
        wx.navigateTo({
          url: '../souxianlu/souxianlu?re=t&m=' + ming + '&lat=' + lat + '&lon=' + lon
        })
      },
      fail: function (res) {
        console.log(res)
      }
    })


  },
  bendidingwei: function (e) {
    //本地定位
    var that = this
    if (this.data.dwqx == false) {
      wx.showModal({
        title: '提示',
        content: '无定位权限，无法使用此功能。是否重新设置权限？',
        success: function (res) {
          if (res.confirm) {
            that.regetdw("bd")
          } else if (res.cancel) {
            return;
          }
        }
      })
    }
    wx.getLocation({
      //定位
      type: 'gcj02',
      success: function (res) {
        var ming = "当前位置"
        var lat = res.latitude
        var lon = res.longitude
        wx.request({
          url: 'https://restapi.amap.com/v3/geocode/regeo?key=a07ec2dc5fdcfaf786df5e4d3a757627&location=' + lon + ',' + lat,
          success: function (res) {
            console.log(res.data)
            if (res.data.status == 1 && res.data.info == 'OK') {
              ming = res.data.regeocode.formatted_address
              wx.navigateTo({
                url: '../souxianlu/souxianlu?re=t&m=' + ming + '&lat=' + lat + '&lon=' + lon
              })
            }
          }
        })

      },
      fail: function (res) {

      }
    })
  },
  regetdw: function (e) {
    //重新获取权限
    console.log(e)
    var that = this;
    wx.openSetting({
      success: (res) => {
        that.setData({ dwqx: true })
        if (e == 'xd') {
          that.dituxuandian()
        }
        if (e == 'bd') {
          that.bendidingwei()
        }
      }
    })
  },
  gotoXianLu: function (e) {
    var id = e.currentTarget.dataset.id
    var lishi = wx.getStorageSync('lishi') || []//搜索记录

    wx.navigateTo({
      url: '../souxianlu/souxianlu?re=f&m=' + lishi[id].name + '&lat=' + lishi[id].lat + '&lon=' + lishi[id].lon
    })
  }
})