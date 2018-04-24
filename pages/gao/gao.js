const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startnum: 0,//从0号公告开始取
    num: 10,//每次取10条
    nownum: 0,//下次从第几条开始取
    lists: [],
    showgg: false,//是否显示公告
    ggbody: ''//公告内容
  },
  newload: function (kaishi, shuliang) {
    var that = this
    var shuzu = that.data.lists
    wx.showLoading({ title: "loading..." });
    var nonum = that.data.nownum
    if (kaishi == 0) {
      nonum = shuliang
      shuzu = []
    } else {
      nonum = nonum + shuliang
    }
    wx.request({
      url: app.globalData.dizhi + 'gaoggao.php',
      data: { ks: kaishi, num: shuliang },
      success: function (res) {
        console.log(res.data)
        var newshuzu = shuzu.concat(res.data)
        that.setData({
          nownum: nonum,
          lists: newshuzu
        })
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
    this.newload(this.data.startnum, this.data.num)
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
    this.newload(this.data.startnum, this.data.num)
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.newload(this.data.nownum, this.data.num)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  showgonggao: function (e) {
    var id = e.currentTarget.dataset.id
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
  },
  closegg: function (e) {
    this.setData({
      showgg: false,
      ggbody: ''
    })
  }
})