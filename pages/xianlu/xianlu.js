const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banjing: 5,//圆的半径
    xinxi: [],//线路数据信息
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
    console.log('load')
    var that = this
    wx.showLoading({ title: "loading..." });
    var id = options.id//线路ID 
    wx.setNavigationBarTitle({
      title: options.name  //设置标题
    })
    var uid = wx.getStorageSync('uid') || ''//用户OpenID
    wx.request({
      url: app.globalData.dizhi + 'showxianlu.php',
      data: { id: id, uid: uid },
      success: function (res) {
        if (res.data.status.code == 0) {
          var shuzu = res.data.result//线路详细信息
          console.log(shuzu)
          that.setData({
            xinxi: shuzu
          })
          that.changebus();
        }
      },
      complete: function (res) {
        wx.hideLoading()
      }
    })
  },

  changebus: function () {
    //在画布上画出站点及车辆信息
    var shuzu = this.data.xinxi//线路数据的详细信息
    var zhandian = shuzu.stations//线路上的站点信息
    var r = this.data.banjing//圆的半径
    var num = zhandian.length//站点数量
    var windowwidth = app.globalData.screenwidth//屏幕的宽度
    var fen = (windowwidth - r * 2 * 5 - 15) / 4 //两个圆之间的距离
    var arrdian = []//圆心坐标数组
    const ctx = wx.createCanvasContext('firstCanvas')
    ctx.setLineWidth(1)//线宽
    for (var i = 0; i < num; i++) {
      //画站点图
      //72:行间距；50：顶部间距；25：左间距；fen:计算出来的列间距
      var hang = Math.floor(i / 5)//取整，第几行（0开始）
      var ge = i % 5//取余数,每行第几个（0开始）
      var fanzheng = hang % 2//偶数行正序，奇数行倒序
      var gao = hang * 72 + 50//每行的高度,圆心Y坐标

      if (fanzheng == 0) {
        //偶数行，正序
        var kuan = ge * fen + 25//圆心X坐标
        var x = kuan + r + fen//连线终点X
        var m = kuan + r//连线起点X
      } else {
        //奇数行，倒序
        var kuan = (fen * 4 + 25) - ge * fen
        var x = kuan - r - fen
        var m = kuan - r
      }
      if (ge == 4) {//每行最后一个
        m = kuan
        x = kuan
        var y = gao + r + 72//连线终点Y
        var n = gao + r//连线起点Y
      } else {
        var y = gao
        var n = gao
      }
      ctx.beginPath()
      ctx.arc(kuan, gao, r, 0, 2 * Math.PI)//画圆
      arrdian.push(JSON.parse('{"X":"' + kuan + '","Y":"' + gao + '"}'))//将圆心坐标添加到数组
      ctx.setFillStyle('#f00')
      ctx.fill()
      ctx.setStrokeStyle('#8d8d8d')
      ctx.moveTo(m, n)
      if (i != (num - 1)) {
        ctx.lineTo(x, y)
      }
      ctx.stroke()
      ctx.closePath()
      ctx.setFontSize(13)
      var sname = zhandian[i].stationName
      ctx.setFillStyle('black')
      ctx.fillText(sname.substr(0, 5), kuan - 23, gao + 20, 60)
      ctx.fillText(sname.substr(5), kuan - 23, gao + 35, 60)

    }

    var lineid = shuzu.id//线路ID
    wx.request({
      //查询当前线路正在运营的车辆信息
      url: app.globalData.dizhi + 'getrunbus.php',
      data: { id: lineid },
      success: function (res) {
        var che = res.data.result//车辆信息数组
        console.log(che)
        if (typeof (che) != "undefined") {
          for (var i = 0; i < che.length; i++) {
            var nextzhan = che[i].stationSeqNum//下一站序列号
            var busid = che[i].cardId
            var xia = nextzhan - 1//圆圈序列号
            if (xia >= num) { xia = num - 1 }//如果下一站的序列号大于总站数
            x = Number(arrdian[xia].X)//即将到达站点圆心X
            y = Number(arrdian[xia].Y)//即将到达站点圆心Y
            ctx.setStrokeStyle('#f99')//颜色
            ctx.setLineWidth(3)//线宽
            ctx.beginPath()
            ctx.arc(x, y, r + 4, 0, 2 * Math.PI)//画圆，标记即将到达的站点
            ctx.closePath()
            ctx.stroke()
            var qian = xia - 1 //即将到达站点的前一站点
            var lat1 = zhandian[qian].lat//前一站点维度,BD09
            var lng1 = zhandian[qian].lng//前一站点经度,BD09
            var jw = app.bd9_wgs84(lat1, lng1)
            lat1 = jw.lat//前一站点维度,GCJ02
            lng1 = jw.lng//前一站点经度,GCJ02
            var lat2 = zhandian[xia].lat//下一站点纬度BD09坐标系
            var lng2 = zhandian[xia].lng//下一站点BD09经度
            var jw = app.bd9_wgs84(lat2, lng2)
            lat2 = jw.lat//下一站点维度,GCJ02
            lng2 = jw.lng//下一站点经度,GCJ02
            var lat3 = che[i].lat//车辆当前纬度，WGS84
            var lng3 = che[i].lng//车辆当前经度，WGS84
            var jw = app.transform(lat3, lng3)
            lng3 = jw[1]//车辆当前纬度，GCJ02
            lat3 = jw[0]//车辆当前经度，GCJ02
            var chejuli = app.jisuanjuli(lat1, lng1, lat3, lng3)//车驶出上一站点距离
            var zhanjuli = app.jisuanjuli(lat1, lng1, lat2, lng2)//两个站点直距离
            var ji = chejuli / zhanjuli * fen
            if (ji >= fen) { ji = fen - 8 }
            x = Number(arrdian[qian].X) - 10
            y = Number(arrdian[qian].Y) - 20 - r
            if (chejuli < 100) {
            } else {
              hang = Math.floor(xia / 5)//取整，第几行（0开始）
              ge = qian % 5//取余数,每行第几个（0开始）
              fanzheng = hang % 2//偶数行正序，奇数行倒序
              if (fanzheng == 0) {
                x = x + ji
              } else {
                x = x - ji
              }
              if (ge == 4) {
                x = Number(arrdian[qian].X) - 10
                y = y + 60
              }
            }
            ctx.drawImage('../../images/bus.png', x, y, 20, 20)
            ctx.setFillStyle('blue')
            ctx.fillText(busid, x - 15, y, 50)
          }
        }
      },
      complete: function (res) {
        ctx.draw()
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.interval1 = setInterval(this.changebus, 1000 * 20);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log("hide")
    clearInterval(this.interval1);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.interval1);
    console.log("unload")
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
  gotoXL: function (e) {
    wx.switchTab({
      url: '../index/index'
    })
  },
  gotoZD: function (e) {
    var x = this.data.xinxi
    wx.setStorageSync('xinxi', x)
    wx.navigateTo({
      url: '../ditu/ditu'
    })
  },
  gotoYJ: function (e) {
    var x = this.data.xinxi
    wx.setStorageSync('xinxi', x)
    wx.navigateTo({
      url: '../che/che'
    })
  }
})