const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    longitude: 122.071938,
    latitude: 37.233335,
    markers: [],
    dwqx: true//定位权限
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var shuzu = wx.getStorageSync('xinxi') || []//线路数据详细信息
    var biaoji = []//标记点
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
          content: '为给您提供更好的服务，本功能需要使用定位权限。不授权不影响本功能正常使用。是否重新设置权限？',
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
    var zhandian = shuzu.stations//站点
    for (var i = 0; i < zhandian.length; i++) {
      var j = zhandian[i].lng
      var w = zhandian[i].lat
      var jw = app.bd9_wgs84(w, j)
      j = jw.lng
      w = jw.lat
      biaoji.push({
        width: 40,
        height: 40,
        iconPath: "/images/p.png",
        id: zhandian[i].id,
        latitude: w,
        longitude: j,
        callout: {
          content: zhandian[i].stationName,
          color: "#b5b1b1",
          fontSize: 12,
          borderRadius: 15,
          bgColor: "#262930",
          padding: 10,
          display: 'BYCLICK'
        }
      })
    }
    if (biaoji[0].latitude == biaoji[(biaoji.length - 1)].latitude && biaoji[0].longitude == biaoji[(biaoji.length - 1)].longitude) {
      biaoji[0].iconPath = "/images/qz.png"
      biaoji[(biaoji.length - 1)].iconPath = "/images/qz.png"
    } else {
      biaoji[0].iconPath = "/images/qd.png"
      biaoji[(biaoji.length - 1)].iconPath = "/images/zd.png"
    }
    that.setData({
      markers: biaoji
    })
    that.getrunbus()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  getrunbus: function () {
    //查询当前线路正在运营的车辆信息
    var that = this
    var shuzu = wx.getStorageSync('xinxi') || []
    var lineid = shuzu.id//线路ID
    var l = shuzu.stations.length//站点数量
    wx.request({
      url: app.globalData.dizhi + 'getrunbus.php',
      data: { id: lineid },
      success: function (res) {
        var che = res.data.result//车辆信息数组
        console.log(che)
        if (typeof (che) != "undefined") {
          var biaoji = that.data.markers
          biaoji = biaoji.slice(0, l)//从0位开始截取数组l个元素组成新数组。（从地图标记中取站点标记）
          for (var i = 0; i < che.length; i++) {
            //将车辆信息添加到标记点中
            var j = che[i].lng
            var w = che[i].lat
            var jw = app.transform(w, j)//将车辆WGS84坐标转为GCJ02坐标
            j = jw[1]
            w = jw[0]
            biaoji.push({
              width: 40,
              height: 40,
              iconPath: "/images/bus.png",
              id: che[i].busId,
              latitude: w,
              longitude: j,
              callout: {
                content: che[i].cardId,
                color: "#000",
                fontSize: 12,
                borderRadius: 15,
                bgColor: "#8d8d8d",
                padding: 6,
                display: 'ALWAYS'
              }
            })
          }
          console.log(biaoji)
          that.setData({
            markers: biaoji
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('ditu-show')
    this.interval1 = setInterval(this.getrunbus, 1000 * 20);

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('ditu-hide')
    clearInterval(this.interval1);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('ditu-unload')
    clearInterval(this.interval1);
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
  dianjiqipao: function (e) {
    //点击气泡
    var that = this
    if (that.data.dwqx == false) {
      wx.showModal({
        title: '提示',
        content: '无定位权限，无法使用此功能。',
        showCancel: false
      })
    } else {
      var mid = e.detail.markerId//标记点ID
      var biaoji = that.data.markers
      for (var i = 0; i < biaoji.length; i++) {
        if (biaoji[i].id == mid) {
          var dian = JSON.stringify(biaoji[i])//JSON对象转字符串
        }
      }
      dian = dian.replace('BYCLICK','ALWAYS');
      wx.navigateTo({
        url: '../buxing/buxing?data=' + dian + "&from=ditu&lat=" + that.data.latitude + "&lon=" + that.data.longitude
      })
    }
  }



})