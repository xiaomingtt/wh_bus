// pages/zhanxian/zhanxian.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ming: '',//站点名
    num: 0,//线路数量
    list: []//线路列表

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var shuzu = JSON.parse(options.p)
    wx.setNavigationBarTitle({
      title: shuzu.name  //设置标题
    })
    this.setData({
      ming: shuzu.name,
      num: shuzu.list.length,
      list: shuzu.list
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
  gotoXianLu: function (e) {
    var id = e.currentTarget.dataset.id
    var name = e.currentTarget.dataset.name
    wx.navigateTo({
      url: '../xianlu/xianlu?id=' + id + '&name=' + name
    })
  }
})