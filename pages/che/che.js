const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    xinxi: [],
    chenum: 0,//当前线路运营车辆数量
    cheinfo: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var shuzu = wx.getStorageSync('xinxi') || []
    this.setData({ xinxi: shuzu })
    this.getrunbus()
  },
  getrunbus: function () {
    //获取当前线路正在运营车辆信息
    var that = this
    var shuzu = wx.getStorageSync('xinxi') || []
    var id = shuzu.id

    wx.request({
      url: app.globalData.dizhi + 'getrunbus.php',
      data: { id: id },
      success: function (res) {
        var che = res.data.result//车辆信息数组
        console.log(che)
        if (typeof (che) != "undefined") {
          that.setData({ chenum: che.length, cheinfo: che })





        }
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
    this.interval1 = setInterval(this.getrunbus, 1000 * 20);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(this.interval1);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
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

  }
})