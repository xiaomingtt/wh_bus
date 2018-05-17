const app = getApp()
var mid = 1000//地图标记点ID
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showitem: true,//显示概览
    showmap: false,//显示地图
    markers: [],//地图上的标记点
    j: 122.071938,//地图中心点经度
    w: 37.233335,//地图中心点纬度
    polyline: [],//地图上的线路
    segments: [],//线路概览信息
    current: -1,//详细展示某条概览信息,
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
    var shuzu = JSON.parse(options.data)//换乘方案列表
    var jd = options.lon//中心点（当前点）经度
    var wd = options.lat//中心点（当前点）纬度
    var qi = options.qd//起点信息
    var qd = qi.split(',')
    var zhi = options.zd//终点信息
    var zd = zhi.split(',')


    var arr_step = []//线路概览
    arr_step.push({//添加起点信息到线路概览
      img: '../../images/qd.png',
      txt: qd[2],
      mode: 'qidian',
      walk: [],
      bus: [],
      busid: 0,
      otherbus: ''
    })
    var marks = []//地图上的标记点信息
    var bj = this.addbiaoji('/images/qd.png', qd[2], qd[0], qd[1], '101')
    marks.push(bj)
    var arr_poly = []//地图上显示的线路信息
    var segments = shuzu.segments//路段列表
    for (var i = 0; i < segments.length; i++) {
      var buxing = segments[i].walking//此路段步行信息(JSON)
      var buxingchangdu = buxing.distance//此路段步行距离（米）
      var bxitem = buxing.steps//此段步行信息列表（数组）
      if (typeof (bxitem) != 'undefined') {
        var bxinfo = []
        if (bxitem.length > 0) {
          for (var j = 0; j < bxitem.length; j++) {
            //*************处理步行信息里的线路点start************* */
            var points = [];
            var poLen = bxitem[j].polyline.split(';');
            for (var d = 0; d < poLen.length; d++) {
              points.push({
                longitude: parseFloat(poLen[d].split(',')[0]),
                latitude: parseFloat(poLen[d].split(',')[1])
              })
            }
            arr_poly.push({
              color: '#0000ff',
              points: points,
              width: 6
            })
            //***************处理步行信息里的线路点end******************* */
            bxinfo.push(bxitem[j].instruction)
          }
          arr_step.push({//添加每段步行信息到线路概览
            img: '../../images/walk.png',
            txt: '步行' + buxingchangdu + '米',
            mode: 'buxing',
            walk: bxinfo,
            bus: [],
            busid: 0,
            otherbus: ''
          })
        }
      }
      var bus = segments[i].bus.buslines//此路段公交信息(数组)
      console.log(bus)
      if (bus.length > 0) {
        //将公交线路信息添加到polyline数据中
        var points = [];
        var poLen = bus[0].polyline.split(';');
        for (var d = 0; d < poLen.length; d++) {
          points.push({
            longitude: parseFloat(poLen[d].split(',')[0]),
            latitude: parseFloat(poLen[d].split(',')[1])
          })
        }
        arr_poly.push({
          color: '#00ff00',
          points: points,
          width: 6
        })
        //当前路段公交站点
        var zhan = bus[0].via_stops
        zhan.unshift(bus[0].departure_stop)
        zhan.push(bus[0].arrival_stop)
        //将站点信息添加到地图标记点中
        for (var l = 0; l < zhan.length; l++) {
          var jwd = zhan[l].location.split(',')
          mid++
          var bj = this.addbiaoji('/images/p.png', zhan[l].name, jwd[1], jwd[0], mid)
          marks.push(bj)
          if (l == 0) {
            var x = '上'
          } else if (l == (zhan.length - 1)) {
            var x = '下'
          } else {
            var x = l
          }
          zhan[l].action = x
        }
        var otherbus = ''
        if (bus.length > 1) {
          //此路段不止一条公交线路，获取其他线路名
          otherbus = 'Tip:此路段还可乘坐下列公交线路：'
          for (var y = 1; y < bus.length; y++) {
            otherbus = otherbus + bus[y].name + '、'
          }
          otherbus = otherbus.substr(0, otherbus.length - 1)
        }
        arr_step.push({//添加每段公交信息到线路概览
          img: '../../images/bus.png',
          txt: bus[0].name,
          mode: 'bus',
          walk: [],
          bus: zhan,
          busid: bus[0].id,
          otherbus: otherbus
        })
      }
    }
    arr_step.push({//添加终点信息到线路概览
      img: '../../images/zd.png',
      txt: zd[2],
      mode: 'zhi',
      walk: [],
      bus: [],
      busid: 0,
      otherbus: ''
    })
    console.log(arr_step)
    var bj = this.addbiaoji('/images/zd.png', zd[2], zd[0], zd[1], '109')
    marks.push(bj)//终点信息添加到地图标记点中
    this.setData({
      j: jd,
      w: wd,
      polyline: arr_poly,
      segments: arr_step,
      markers: marks
    })
  },
  addbiaoji: function (img, name, lat, lon, id) {
    //添加标记点
    var biaoji = []
    biaoji.push({
      width: 40,
      height: 40,
      iconPath: img,
      id: id,
      latitude: lat,
      longitude: lon,
      callout: {
        content: name,
        color: "#eeeeee",
        fontSize: 12,
        borderRadius: 15,
        bgColor: "#555555",
        padding: 5,
        display: 'ALWAYS'
      }
    })
    return biaoji[0]
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
    wx.hideLoading()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.hideLoading()
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
  qiehuanview: function (e) {
    //切换地图和概览
    var id = e.currentTarget.dataset.id
    if (id == '0') {
      this.setData({
        showitem: true,
        showmap: false
      })
    } else {
      this.setData({
        showitem: false,
        showmap: true
      })
    }
  },
  gxshowxinxi: function (e) {
    //展示步行或公交详细信息
    console.log(e)
    var mode = e.currentTarget.dataset.moe
    var id = e.currentTarget.dataset.id
    var current = this.data.current
    if (id == current) { id = -1 }
    this.setData({
      current: id
    })
  },
  gotoxianlu: function (e) {
    //跳转到线路页面
    wx.showLoading({
      title: 'Loading...',
      mask: true
    })
    var id = e.currentTarget.dataset.id
    var mode = e.currentTarget.dataset.mo
    if (mode == 'bus') {
      wx.request({
        url: app.globalData.dizhi + 'guihua.php',
        data: { busid: id },
        success: function (res) {
          if (res.data == '0') {
            wx.hideLoading()
            wx.showModal({
              showCancel: false,
              title: '提示',
              content: '抱歉，暂时无法获取本条线路信息。',
              success: function (res) {
                if (res.confirm) {
                  return
                }
              }
            })
          } else {
            var lid = res.data.split('~~~')[0]
            var lname = res.data.split('~~~')[1]
            wx.navigateTo({
              url: '../xianlu/xianlu?id=' + lid + '&name=' + lname
            })
          }
        }
      })
    }
  },
  dianjiqipao: function (e) {
    console.log(e)
  }
})