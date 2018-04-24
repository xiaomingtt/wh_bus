const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    yijian: '',
    dh: ''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('load')
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log('ready')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('show')
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
  inputyijian: function (e) {
    var v = e.detail.value
    var keywords = [/[外]{1}.{0,3}[挂]{1}/, /select/i, /delete/i, /join/i, /create/i, /execute/i, /update/i, ">", "<", "'", "习近平", "李克强", "政府", "法轮", "丝袜", "枪支", "迷药", "贷款", "发票", "代办", "打折", /sm/i, "老虎机", "六合彩", "偏方", "秘方", "代孕", "不孕", "不育", "成人", "小电影", "自慰", "走私", "水货", "外挂", "私服", "国务院", "人大", "政协", "上访", "共产党", "根治", "美女", /[中]{1}.{0,5}[国]{1}/]
    var keywordslen = keywords.length;
    for (var i = 0; i < keywordslen; i++) {
      v = v.replace(keywords[i], "***");
    }
    this.setData({ yijian: v })
  },
  inputdh: function (e) {
    var v = e.detail.value
    var keywords = [/[外]{1}.{0,3}[挂]{1}/, /select/i, /delete/i, /join/i, /create/i, /execute/i, /update/i, ">", "<", "'", "习近平", "李克强", "政府", "法轮", "丝袜", "枪支", "迷药", "贷款", "发票", "代办", "打折", /sm/i, "老虎机", "六合彩", "偏方", "秘方", "代孕", "不孕", "不育", "成人", "小电影", "自慰", "走私", "水货", "外挂", "私服", "国务院", "人大", "政协", "上访", "共产党", "根治", "美女", /[中]{1}.{0,5}[国]{1}/]
    var keywordslen = keywords.length;
    for (var i = 0; i < keywordslen; i++) {
      v = v.replace(keywords[i], "***");
    }
    this.setData({ dh: v })
  },
  tijiao: function (e) {
    var that = this
    var yj = this.data.yijian
    var dh = this.data.dh
    var uid = wx.getStorageSync('uid') || ''
    yj = yj.replace(/(^\s*)|(\s*$)/g, "")
    if (yj.length < 15) {
      wx.showModal({
        title: '提示',
        content: '您的意见对我们非常重要，再说点吧！',
        showCancel: false
      })
      return
    }
    wx.request({
      url: app.globalData.dizhi + 'yijian.php',
      data: { uid: uid, yj: yj, dh: dh },
      success: function (res) {
        if (res.data == 'ok') {
          wx.showModal({
            title: '提示',
            content: '您的意见已经收到，非常感谢！',
            showCancel: false
          })
          that.setData({
            dh: '',
            yijian: ''
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '不好意思，刚才开了个小差，我没听清，请您再说一遍！',
            showCancel: false
          })
        }
      }
    })
  }
})