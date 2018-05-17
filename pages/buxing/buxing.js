const app = getApp()
var amapFile = require('../../js/amap-wx.js');
var config = require('../../js/config.js');
var lonlat;//声明全局变量，纬度，经度
var city;//声明全局变量，城市
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showdh: true,
    imarkers: [],//地图上的标记点
    j: 122.071938,//地图中心点经度
    w: 37.233335,//地图中心点纬度
    distance: '',//距离
    cost: '',//时间
    polyline: [],//线路
    steps: {},//步行信息
    zhan: [],//站点及其附近线路信息，用于跳转到选择线路页面
    tishi: ''
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
    console.log(options)
    var that = this
    var dian = JSON.parse(options.data)
    var lat = options.lat
    var lon = options.lon
    if (options.from == "ditu") {
      //如果从地图页面跳转过来，获取点击的标记点
      var tu = "/images/now.png"
    } else if (options.from == "guihua") {
      var tu = "/images/qd.png"
    } else {
      //从查找站点页面过来
      var tu = "/images/now.png"
      var zhanxiang = JSON.parse(options.list)
      that.setData({ zhan: zhanxiang, tishi: '(点击站点名，查看其附近线路。)' })
    }

    var biaoji = that.data.imarkers
    biaoji.push(dian)
    biaoji.push({
      width: 40,
      height: 40,
      iconPath: tu,
      id: "1",
      latitude: lat,
      longitude: lon,
      callout: {
        content: "我的位置",
        color: "#b5b1b1",
        fontSize: 12,
        borderRadius: 15,
        bgColor: "#262930",
        padding: 10,
        display: 'ALWAYS'
      }
    })
    var qidian = lon + ',' + lat//起点坐标
    var zhongdian = dian.longitude + ',' + dian.latitude//终点坐标

    var key = config.Config.key;
    var myAmapFun = new amapFile.AMapWX({ key: key });
    myAmapFun.getWalkingRoute({
      origin: qidian,
      destination: zhongdian,
      success: function (data) {
        var points = [];
        if (data.paths && data.paths[0] && data.paths[0].steps) {
          var steps = data.paths[0].steps;
          for (var i = 0; i < steps.length; i++) {
            var poLen = steps[i].polyline.split(';');
            for (var j = 0; j < poLen.length; j++) {
              points.push({
                longitude: parseFloat(poLen[j].split(',')[0]),
                latitude: parseFloat(poLen[j].split(',')[1])
              })
            }
          }
        }
        console.log(points)
        that.setData({
          polyline: [{
            points: points,
            color: "#0091ff",
            width: 6
          }],
          imarkers: biaoji,
          j: lon,
          w: lat,
          steps: data.paths[0].steps
        });
        if (data.paths[0] && data.paths[0].distance) {
          that.setData({
            distance: data.paths[0].distance + '米'
          });
        }
        if (data.paths[0] && data.paths[0].duration) {
          that.setData({
            cost: parseInt(data.paths[0].duration / 60) + '分钟'
          });
        }

      },
      fail: function (info) {

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
  dianjiqipao: function (e) {
    var id = e.markerId
    if (id == '10000') {
      var s = this.data.zhan
      s = JSON.stringify(s)
      wx.navigateTo({
        url: '../zhanxian/zhanxian?p=' + s
      })
    }


  }
})