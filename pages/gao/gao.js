const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 0,//0威海，1文登
    startnum: 0,//从0号公告开始取
    num: 10,//每次取10条
    hnownum: 0,//威海下次从第几条开始取
    dnownum: 0,//文登下次从第几条开始取
    lists: [],
    items: [],
    showgg: false,//是否显示公告
    ggbody: '',//公告内容
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
  newload: function (kaishi, shuliang, mode) {
    wx.showLoading({ title: "loading..." });
    console.log(mode, kaishi, shuliang)
    var that = this
    if (mode == 'gaoggao') {
      var shuzu = that.data.lists
      var nonum = that.data.hnownum
      if (kaishi == 0) {
        nonum = shuliang
        shuzu = []
      } else {
        nonum = nonum + shuliang
      }
    } else {
      var shuzu = that.data.items
      var donnum = that.data.dnownum
      if (kaishi == 0) {
        donnum = shuliang
        shuzu = []
      } else {
        donnum = donnum + shuliang
      }
    }
    wx.request({
      url: app.globalData.dizhi + mode + '.php',
      data: { ks: kaishi, num: shuliang, mode: 'g' },
      success: function (res) {
        console.log(res.data)
        var newshuzu = shuzu.concat(res.data)
        if (mode == 'gaoggao') {
          that.setData({
            hnownum: nonum,
            lists: newshuzu
          })
        } else {

          that.setData({
            dnownum: donnum,
            items: newshuzu
          })
        }
      },
      complete: function (res) {
        wx.hideLoading()
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.newload(this.data.startnum, this.data.num, 'gaoggao')
    this.newload(this.data.startnum, this.data.num, 'showwdgg')
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
    if (this.data.current == 0) {
      this.newload(this.data.startnum, this.data.num, 'gaoggao')
    } else {
      this.newload(this.data.startnum, this.data.num, 'showwdgg')
    }
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.current == 0) {
      this.newload(this.data.hnownum, this.data.num, 'gaoggao')
    } else {
      this.newload(this.data.dnownum, this.data.num, 'showwdgg')
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  showgonggao: function (e) {
    var id = e.currentTarget.dataset.id
    var city = e.currentTarget.dataset.city
    if (city == 'wh') {
      var shuzu = this.data.lists
      for (var i = 0; i < shuzu.length; i++) {
        if (shuzu[i].id == id) {
          this.setData({
            ggbody: shuzu[i].content,
            showgg: true
          })
          break;
        }
      }
    } else {
      var shuzu = this.data.items
      this.setData({
        ggbody: shuzu[id].content,
        showgg: true
      })
    }
  },
  closegg: function (e) {
    this.setData({
      showgg: false,
      ggbody: ''
    })
  },
  chengecurrent: function (e) {
    this.setData({ current: e.currentTarget.dataset.id })
  },
  xialashuaxin: function (e) {
    this.onPullDownRefresh()
  },
  jixujiazai: function (e) {
    this.onReachBottom()
  }
})