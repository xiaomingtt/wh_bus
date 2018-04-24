//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    xianlu: [],
    showgg: false,//是否显示公告
    gg: '公告',//公告标题
    ggbody: '',//公告内容
    imgUrls: ['https://kkk.gg/WX/images/time.jpg', 'https://kkk.gg/GJC/ad.jpg']//首页底部滑块广告图片
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this
    wx.request({
      url: app.globalData.dizhi + 'showad.php',
      success: function (res) {
        console.log(res.data)
        that.setData({ imgUrls: res.data })
      }
    })
    wx.request({
      url: app.globalData.dizhi + 'gaoggao.php',
      data: { ks: 0, num: 1 },
      success: function (res) {
        var s = res.data
        console.log(s)
        that.setData({
          gg: s[0].title,
          ggbody: s[0].content
        })
      }
    })
  },
  onLoad: function () {
    var that = this
    wx.showLoading({ title: "loading..." });
    var list = []
    list.push(JSON.parse('{"id":207,"lid":203,"lineName":"1路","startStationName":"麦疃后","endStationName":"宝宇商城"}'))
    list.push(JSON.parse('{"id":208,"lid":204,"lineName":"1路","startStationName":"宝宇商城","endStationName":"麦疃后"}'))
    list.push(JSON.parse('{"id":211,"lid":225,"lineName":"2路北行","startStationName":"汽车站义乌小商品","endStationName":"九龙新城小区"}'))
    list.push(JSON.parse('{"id":212,"lid":224,"lineName":"2路北行","startStationName":"九龙新城小区","endStationName":"汽车站义乌小商品"}'))
    list.push(JSON.parse('{"id":209,"lid":210,"lineName":"2路南行","startStationName":"汽车站义乌小商品","endStationName":"九龙新城小区"}'))
    list.push(JSON.parse('{"id":210,"lid":232,"lineName":"2路南行","startStationName":"九龙新城小区","endStationName":"汽车站义乌小商品"}'))
    list.push(JSON.parse('{"id":213,"lid":173,"lineName":"3路","startStationName":"马家汤后村","endStationName":"宝宇商城"}'))
    list.push(JSON.parse('{"id":214,"lid":174,"lineName":"3路","startStationName":"宝宇商城","endStationName":"马家汤后村"}'))
    list.push(JSON.parse('{"id":217,"lid":179,"lineName":"4路","startStationName":"整骨医院","endStationName":"火车站"}'))
    list.push(JSON.parse('{"id":218,"lid":180,"lineName":"4路","startStationName":"火车站","endStationName":"整骨医院"}'))
    list.push(JSON.parse('{"id":215,"lid":267,"lineName":"4路金岭山庄","startStationName":"整骨医院","endStationName":"金岭山庄小区"}'))
    list.push(JSON.parse('{"id":216,"lid":266,"lineName":"4路金岭山庄","startStationName":"金岭山庄小区","endStationName":"整骨医院"}'))
    list.push(JSON.parse('{"id":220,"lid":245,"lineName":"5路北行","startStationName":"整骨医院","endStationName":"整骨医院"}'))
    list.push(JSON.parse('{"id":219,"lid":244,"lineName":"5路南行","startStationName":"整骨医院","endStationName":"整骨医院"}'))
    list.push(JSON.parse('{"id":221,"lid":177,"lineName":"6路","startStationName":"汽车站义乌小商品","endStationName":"韩国之窗壹鹏食品"}'))
    list.push(JSON.parse('{"id":222,"lid":178,"lineName":"6路","startStationName":"韩国之窗壹鹏食品","endStationName":"汽车站义乌小商品"}'))
    list.push(JSON.parse('{"id":223,"lid":211,"lineName":"7路","startStationName":"车管所","endStationName":"汽车站义乌小商品"}'))
    list.push(JSON.parse('{"id":224,"lid":202,"lineName":"7路","startStationName":"汽车站义乌小商品","endStationName":"车管所"}'))
    list.push(JSON.parse('{"id":227,"lid":239,"lineName":"8路北行","startStationName":"长江批发市场","endStationName":"汽车站义乌小商品"}'))
    list.push(JSON.parse('{"id":228,"lid":238,"lineName":"8路北行","startStationName":"汽车站义乌小商品","endStationName":"长江批发市场"}'))
    list.push(JSON.parse('{"id":225,"lid":241,"lineName":"8路南行","startStationName":"长江批发市场","endStationName":"汽车站义乌小商品"}'))
    list.push(JSON.parse('{"id":226,"lid":240,"lineName":"8路南行","startStationName":"汽车站义乌小商品","endStationName":"长江批发市场"}'))
    list.push(JSON.parse('{"id":230,"lid":247,"lineName":"9路北行","startStationName":"百大广场秀嘉鞋城","endStationName":"百大广场秀嘉鞋城"}'))
    list.push(JSON.parse('{"id":229,"lid":246,"lineName":"9路南行","startStationName":"百大广场秀嘉鞋城","endStationName":"百大广场秀嘉鞋城"}'))
    list.push(JSON.parse('{"id":231,"lid":235,"lineName":"10路","startStationName":"麦疃后","endStationName":"文登技师学院"}'))
    list.push(JSON.parse('{"id":232,"lid":234,"lineName":"10路","startStationName":"文登技师学院","endStationName":"麦疃后"}'))
    list.push(JSON.parse('{"id":233,"lid":237,"lineName":"11路","startStationName":"金地小区","endStationName":"北陡埠村"}'))
    list.push(JSON.parse('{"id":234,"lid":236,"lineName":"11路","startStationName":"北陡埠村","endStationName":"金地小区"}'))
    list.push(JSON.parse('{"id":235,"lid":311,"lineName":"D1线","startStationName":"国贸","endStationName":"汤泊温泉"}'))
    list.push(JSON.parse('{"id":236,"lid":310,"lineName":"D1线","startStationName":"汤泊温泉","endStationName":"国贸"}'))

    var uid = wx.getStorageSync('uid') || ''
    wx.request({
      url: app.globalData.dizhi + 'show.php',
      data: { uid: uid },
      success: function (res) {
        console.log(res.data)
        var lista = res.data
        if (lista.length == 0) {
          lista = list
        }
        that.setData({
          xianlu: lista
        })
      },
      complete: function (res) {
        wx.hideLoading()
      }
    })

  },
  onShow: function () {
    setTimeout(function () {
      //延时两秒以后，从数据库中取热门搜索记录
      try {
        wx.removeStorageSync('hot')
      } catch (e) {
      }
      wx.request({
        url: app.globalData.dizhi + 'gethot.php',
        success: function (res) {
          wx.setStorageSync('hot', res.data)
        }
      })
    }, 1500)
  },
  gotoXianLu: function (e) {
    var id = e.currentTarget.dataset.id
    var name = e.currentTarget.dataset.name
    wx.navigateTo({
      url: '../xianlu/xianlu?id=' + id + '&name=' + name
    })
  },
  goSearch: function (e) {
    wx.navigateTo({
      url: '../search/search'
    })
  },
  viewgg: function (e) {
    this.setData({
      showgg: true
    })
  },
  closegg: function (e) {
    this.setData({
      showgg: false
    })
  },
  showmoregg: function (e) {
    this.setData({
      showgg: false
    })
    wx.navigateTo({
      url: '../gao/gao'
    })
  },
  callme: function (e) {
    var id = e.currentTarget.dataset.id
    var img = this.data.imgUrls
    if (img[id].cao == 1) {
      wx.makePhoneCall({
        phoneNumber: img[id].zhi
      })
    }
    if (img[id].cao == 2) {
      wx.setClipboardData({
        data: img[id].zhi,
        success: function (res) {
          wx.showToast({
            title: '复制成功'
          })
        }
      })
    }
    if (img[id].cao == 3) {
      wx.navigateToMiniProgram({
        appId: img[id].zhi
      })
    }
  }
})
