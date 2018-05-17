const app = getApp()
var time = 0;
var touchDot = 0;//触摸时的原点
var interval = "";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    longitude: 0,//当前经度
    latitude: 0,//当前纬度
    dwqx: false,//定位权限
    shui: '',//设置起点还是终点
    qlat: 0,//起点纬度
    qlon: 0,//起点经度
    qname: '当前位置',//
    zlat: 0,//终点纬度
    zlon: 0,//终点经度
    zname: '',//终点名称
    qlineheight: 6.8,//搜索框内文字行高
    zlineheight: 6.8,//搜索框内文字行高
    buxing: false,//距离较短，建议步行
    bus: false,//显示公交信息
    current: 0,//切换规划方式
    zuikuai: [],//最快捷
    shaohuan: [],//少换乘
    shaozou: [],//少步行
    zuikuailist: [],//最快捷，换乘方案列表
    shaohuanlist: [],//少换乘，换乘方案列表
    shaozoulist: [],//少步行，换乘方案列表
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


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this
    wx.getLocation({
      //定位
      type: 'gcj02',
      success: function (res) {
        console.log(res)
        that.setData({
          longitude: res.longitude,
          latitude: res.latitude,
          qlat: res.latitude,
          qlon: res.longitude,
          dwqx: true
        })
      },
      fail: function (res) {
        wx.showModal({
          title: '获取定位权限失败',
          content: '为给您提供更好的服务，本功能需要使用定位权限。不授权无法正常使用。是否重新设置权限？',
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
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //搜索的数据，需要通过globalData传递过来
    var that = this
    var ming = app.globalData.m
    var re = app.globalData.re
    var lat = app.globalData.lat
    var lon = app.globalData.lon
    if (ming != 'no' && re != 'no' && lat != 0 && lon != 0) {
      var l = app.jisuanstrlength(ming);
      if (l < 12) {
        var lh = 6.8;
      } else {
        var lh = 3.4;
        ming = ming.substr(0, 22)
      }
      if (that.data.shui == 'qi') {
        that.setData({
          qlat: lat,
          qlon: lon,
          qname: ming,
          qlineheight: lh,
          zuikuailist: [],
          shaohuanlist: [],
          shaozoulist: [],
          current: 0,
          zuikuai: [],
          shaohuan: [],
          shaozou: []
        })
      } else {
        that.setData({
          zlat: lat,
          zlon: lon,
          zname: ming,
          zlineheight: lh,
          zuikuailist: [],
          shaohuanlist: [],
          shaozoulist: [],
          current: 0,
          zuikuai: [],
          shaohuan: [],
          shaozou: []
        })
        if (that.data.qlon != 0 && that.data.qlat != 0) {
          //如果已经设置起点，开始搜索
          that.searchbusline(0)
          /*
          setTimeout(function () {
            that.searchbusline(2)
            setTimeout(function () {
              that.searchbusline(3)
            }, 1234)
          }, 1234)
          */
        }
      }
      app.globalData.re = "no"
      app.globalData.m = "no"
      app.globalData.lat = 0
      app.globalData.lon = 0
    }
  },

  searchbusline: function (e) {
    //搜索公交换乘方案
    /***
     * e可取值
     *0：最快捷模式
     *1：最经济模式
     *2：最少换乘模式
     *3：最少步行模式
     *5：不乘地铁模式
    */
    wx.showLoading({
      title: 'search',
      mask: true
    })
    var that = this
    var qlat = that.data.qlat
    var qlon = that.data.qlon
    var zlat = that.data.zlat
    var zlon = that.data.zlon
    console.log("起点", qlat, qlon, "终点", zlat, zlon)
    var juli = app.jisuanjuli(qlat, qlon, zlat, zlon)
    if (juli <= 500) {
      //距离较短，建议步行
      wx.hideLoading()
      that.setData({ buxing: true, bus: false })
    } else {
      var url = "https://restapi.amap.com/v3/direction/transit/integrated?key=a07ec2dc5fdcfaf786df5e4d3a757627&origin=" + qlon + "," + qlat + "&destination=" + zlon + "," + zlat + "&city=威海&cityd=威海&strategy=" + e + "&nightflag=1&extensions=all";
      console.log(url)

      wx.request({
        url: url,
        success: function (res) {
          console.log(res.data)
          var result = res.data
          if (result.status == '1' && result.info == "OK") {//正确返回结果
            if (result.count > 0) {
              var huanchenglist = []//页面上显示的换乘车辆信息
              var transits = result.route.transits//公交换乘方案列表
              for (var i = 0; i < transits.length; i++) {
                var segments = transits[i].segments//本方案换乘路段列表
                var s = ''
                for (var j = 0; j < segments.length; j++) {
                  //从换乘路段列表中提取车辆信息
                  if (segments[j].bus.buslines.length != 0) {
                    var qiche = segments[j].bus.buslines[0].name
                    qiche = qiche.substr(0, qiche.indexOf('('))
                    console.log(qiche)
                    s = s + qiche + '☇'
                  }
                }
                s = s.substr(0, s.length - 1)
                //s = s.substr(0, 18)
                huanchenglist.push(s)
                console.log('-----')
              }
              console.log(huanchenglist)
              if (e == 0) {
                that.setData({
                  buxing: false,
                  bus: true,
                  zuikuai: huanchenglist,
                  zuikuailist: transits
                })
              } else if (e == 2) {
                that.setData({
                  buxing: false,
                  bus: true,
                  shaohuan: huanchenglist,
                  shaohuanlist: transits
                })
              } else if (e == 3) {
                that.setData({
                  buxing: false,
                  bus: true,
                  shaozou: huanchenglist,
                  shaozoulist: transits
                })
              }
            }else{
              wx.hideLoading()
              that.setData({
                buxing: false,
                bus: false
              })
              wx.showModal({
                showCancel: false,
                title: '提示',
                content: '抱歉，没有找到您需要的信息。',
                success: function (res) {
                  if (res.confirm) {
                    return
                  }
                }
              })
            }
          }
        },
        complete: function (res) {
          wx.hideLoading()
        }
      })
    }
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
  regetdw: function (e) {
    //重新获取权限
    var that = this;
    wx.openSetting({
      success: (res) => {
        that.setData({ dwqx: true })
        that.onReady();
      }
    })
  },
  shurudidian: function (e) {
    //搜索地点
    this.setData({
      shui: e.currentTarget.dataset.code
    })
    wx.navigateTo({
      url: '../sousuo/sousuo?from=guihua'
    })
  },
  dituxd: function (e) {
    //地图选点
    var that = this
    wx.chooseLocation({
      //返回火星坐标gcj02
      success: function (res) {
        console.log(res)
        var ming = res.name
        var lat = res.latitude
        var lon = res.longitude

        if (ming == '' || typeof (ming) == 'undefined') { ming = "未知地点" }
        var l = app.jisuanstrlength(ming);
        if (l < 12) {
          var lh = 6.8;
        } else {
          var lh = 3.4;
          ming = ming.substr(0, 22)
        }
        if (e.currentTarget.dataset.code == 'qi') {
          that.setData({
            shui: e.currentTarget.dataset.code,
            qlat: lat,
            qlon: lon,
            qname: ming,
            qlineheight: lh,
            zuikuailist: [],
            shaohuanlist: [],
            shaozoulist: [],
            current: 0,
            zuikuai: [],
            shaohuan: [],
            shaozou: []
          })
        } else {
          that.setData({
            shui: e.currentTarget.dataset.code,
            zlat: lat,
            zlon: lon,
            zname: ming,
            zlineheight: lh,
            zuikuailist: [],
            shaohuanlist: [],
            shaozoulist: [],
            current: 0,
            zuikuai: [],
            shaohuan: [],
            shaozou: []
          })
          if (that.data.qlon != 0 && that.data.qlat != 0) {
            that.searchbusline(0)
            /*
            setTimeout(function () {
              that.searchbusline(2)
              setTimeout(function () {
                that.searchbusline(3)
              }, 1234)
            }, 1234)
            */
          }
        }
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  bendidw: function (e) {
    //本地定位
    var that = this
    var ming = "当前位置"
    var lat = that.data.latitude
    var lon = that.data.longitude
    wx.request({
      url: 'https://restapi.amap.com/v3/geocode/regeo?key=a07ec2dc5fdcfaf786df5e4d3a757627&location=' + lon + ',' + lat,
      success: function (res) {
        console.log(res.data)
        if (res.data.status == 1 && res.data.info == 'OK') {
          ming = res.data.regeocode.formatted_address
          var l = app.jisuanstrlength(ming);
          //根据名称长度设置行高
          if (l < 12) {
            var lh = 6.8;
          } else {
            var lh = 3.4;
            ming = ming.substr(0, 22)
          }
          if (e.currentTarget.dataset.code == 'qi') {
            that.setData({
              shui: e.currentTarget.dataset.code,
              qlat: lat,
              qlon: lon,
              qname: ming,
              qlineheight: lh,
              zuikuailist: [],
              shaohuanlist: [],
              shaozoulist: [],
              current: 0,
              zuikuai: [],
              shaohuan: [],
              shaozou: []
            })
          } else {
            that.setData({
              shui: e.currentTarget.dataset.code,
              zlat: lat,
              zlon: lon,
              zname: ming,
              zlineheight: lh,
              zuikuailist: [],
              shaohuanlist: [],
              shaozoulist: [],
              current: 0,
              zuikuai: [],
              shaohuan: [],
              shaozou: []
            })
            if (that.data.qlon != 0 && that.data.qlat != 0) {
              that.searchbusline(0)
              /*
              setTimeout(function () {
                that.searchbusline(2)
                setTimeout(function () {
                  that.searchbusline(3)
                }, 1234)
              }, 1234)
              */
            }
          }
        }
      }
    })
  },
  gotobuxing: function (e) {
    //步行
    var that = this
    var qlat = that.data.qlat
    var qlon = that.data.qlon
    var zlat = that.data.zlat
    var zlon = that.data.zlon
    console.log("起点", qlat, qlon, "终点", zlat, zlon)
    var d = []
    var jw = app.transform(zlat, zlon)

    d.push({
      width: 40,
      height: 40,
      iconPath: "/images/zd.png",
      id: "11111",
      latitude: zlat,
      longitude: zlon,
      callout: {
        content: that.data.zname,
        color: "#b5b1b1",
        fontSize: 12,
        borderRadius: 15,
        bgColor: "#262930",
        padding: 10,
        display: 'ALWAYS'
      }
    })

    wx.navigateTo({
      url: '../buxing/buxing?data=' + JSON.stringify(d[0]) + "&from=guihua&lat=" + qlat + "&lon=" + qlon
    })

  },
  selectline: function (e) {
    //切换换乘方案
    var id = e.currentTarget.dataset.id
    this.setData({
      current: id
    })
    if (id == '0') {
      var zk = this.data.zuikuailist
      if (zk.length == 0) {
        this.searchbusline(0)
      }
    } else if (id == '1') {
      var sh = this.data.shaohuanlist
      if (sh.length == 0) {
        this.searchbusline(2)
      }
    } else if (id == '2') {
      var sz = this.data.shaozoulist
      if (sz.length == 0) {
        this.searchbusline(3)
      }
    }

  },
  slineitem: function (e) {
    //选择线路
    wx.showLoading({
      title: 'Loading...',
      mask: true
    })
    var ty = e.currentTarget.dataset.type
    var id = e.currentTarget.dataset.id
    if (ty == '0') {
      var shuzu = this.data.zuikuailist
    } else if (ty == '1') {
      var shuzu = this.data.shaohuanlist
    } else if (ty == '2') {
      var shuzu = this.data.shaozoulist
    }
    var data = shuzu[id]
    data = JSON.stringify(data)
    console.log(data)
    wx.navigateTo({
      url: '../gui/gui?data=' + data + '&lat=' + this.data.latitude + '&lon=' + this.data.longitude + '&qd=' + this.data.qlat + ',' + this.data.qlon + ',' + this.data.qname + '&zd=' + this.data.zlat + ',' + this.data.zlon + ',' + this.data.zname
    })
  },

  touchStart: function (e) {
    // 触摸开始事件
    touchDot = e.touches[0].pageX; // 获取触摸时的原点
    // 使用js计时器记录时间    
    interval = setInterval(function () {
      time++;
    }, 100);
  },

  touchEnd: function (e) {
    // 触摸结束事件
    var touchMove = e.changedTouches[0].pageX;
    console.log(touchMove - touchDot, time)
    var current = this.data.current
    // 向左滑动   
    if (touchMove - touchDot <= -100 && time < 50) {
      current++;
      if (current > 2) { current = 0 }
      this.setData({ current: current })
      //执行切换页面的方法
      console.log("向右滑动");

    }
    // 向右滑动   
    if (touchMove - touchDot >= 100 && time < 50) {
      current--;
      if (current < 0) { current = 2 }
      this.setData({ current: current })
      //执行切换页面的方法
      console.log("向左滑动");
    }
    clearInterval(interval); // 清除setInterval
    time = 0;
    var id = current
    if (id == '0') {
      var zk = this.data.zuikuailist
      if (zk.length == 0) {
        this.searchbusline(0)
      }
    } else if (id == '1') {
      var sh = this.data.shaohuanlist
      if (sh.length == 0) {
        this.searchbusline(2)
      }
    } else if (id == '2') {
      var sz = this.data.shaozoulist
      if (sz.length == 0) {
        this.searchbusline(3)
      }
    }
  }
})