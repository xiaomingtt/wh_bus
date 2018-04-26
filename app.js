//app.js
App({
  onLaunch: function () {
    var that = this

    var uid = wx.getStorageSync('uid') || ''
    if (uid == '') {
      wx.login({
        success: function (res) {
          wx.request({
            url: that.globalData.dizhi + 'login.php',
            data: { code: res.code },
            success: function (res) {
              wx.setStorageSync('uid', res.data)
            }
          })
        }
      })
    }
    wx.getSystemInfo({
      success: function (res) {
        that.globalData.screenwidth = res.windowWidth
        that.globalData.screenheight = res.windowHeight
      }
    })
    //var sss=that.jisuanjuli(37.233335, 122.071938, 37.23345, 122.07303)
    //console.log(sss)
  },
  jisuanjuli: function (lat1, lng1, lat2, lng2) {
    //计算两个坐标点之间的直线距离
    var EARTH_RADIUS = 6371393.0;    //单位M
    var PI = Math.PI;
    var radLat1 = lat1 * PI / 180.0;
    var radLat2 = lat2 * PI / 180.0;
    var a = radLat1 - radLat2;
    var b = (lng1 * PI / 180.0) - (lng2 * PI / 180.0);
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * EARTH_RADIUS;
    s = Math.round(s * 10000) / 10000.0;
    return s;
  },
  bd9_wgs84: function (lat, lng) {
    //百度地图BD09坐标系转WGS84标准坐标系
    var PI = Math.PI;
    var x_pi = PI * 3000.0 / 180.0
    var x = lng - 0.0065
    var y = lat - 0.006
    var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi)
    var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi)
    var jing = z * Math.cos(theta)
    var wei = z * Math.sin(theta)
    var s = '{"lng":"' + jing + '","lat":"' + wei + '"}'
    var a = JSON.parse(s)
    return a;
  },
  gcj02_bd09: function (lat, lon) {
    var baiduFactor = Math.PI * 3000.0 / 180.0;
    var x = lon;
    var y = lat;
    var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * baiduFactor);
    var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * baiduFactor);
    var newLon = z * Math.cos(theta) + 0.0065;
    var newLat = z * Math.sin(theta) + 0.006;
    return [newLat, newLon];
  },

  globalData: {
    dizhi: 'https://kkk.gg/GJC/',
    screenwidth: 0,
    screenheight: 0
  },
  transform: function (wgLat, wgLon) {
    //WGS84坐标转GCJ02坐标
    var that = this

    if (that.outOfChina(wgLat, wgLon)) {
      return [wgLat, wgLon];
    }
    var a = 6378245.0;
    var ee = 0.00669342162296594323;

    var dLat = that.transformLat(wgLon - 105.0, wgLat - 35.0);
    var dLon = that.transformLon(wgLon - 105.0, wgLat - 35.0);
    var radLat = wgLat / 180.0 * Math.PI;
    var magic = Math.sin(radLat);
    magic = 1 - ee * magic * magic;
    var sqrtMagic = Math.sqrt(magic);
    dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * Math.PI);
    dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * Math.PI);
    var mgLat = wgLat + dLat;
    var mgLon = wgLon + dLon;
    return [mgLat, mgLon];

  },
  outOfChina: function (lat, lon) {
    if (lon < 72.004 || lon > 137.8347) {
      return true;
    }
    if (lat < 0.8293 || lat > 55.8271) {
      return true;
    }
    return false;
  },
  transformLat: function (x, y) {
    var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(y * Math.PI) + 40.0 * Math.sin(y / 3.0 * Math.PI)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(y / 12.0 * Math.PI) + 320 * Math.sin(y * Math.PI / 30.0)) * 2.0 / 3.0;
    return ret;
  },
  transformLon: function (x, y) {
    var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(x * Math.PI) + 40.0 * Math.sin(x / 3.0 * Math.PI)) * 2.0 / 3.0;
    ret += (150.0 * Math.sin(x / 12.0 * Math.PI) + 300.0 * Math.sin(x / 30.0 * Math.PI)) * 2.0 / 3.0;
    return ret;
  }
})