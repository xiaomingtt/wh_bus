// search.js
var WxSearch = require('../../wxSearch/wxSearch.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchList: [],
    kong: false,
    searchtext: ''
  },

  onShow: function () {
    var that = this
    var hot = wx.getStorageSync('hot') || []
    //初始化的时候渲染wxSearchdata
    WxSearch.init(that, 43, hot);
    WxSearch.initMindKeys(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '14', '11', '12', '17', '18', '50', '53', '22', '43', '41', '113', '115', '101', '92', '42', '95', '48', '34', '35', '21', '52', 'K1', 'K2', 'K3', 'D1']);
  },
  wxSearchFn: function (e) {
    var that = this
    WxSearch.wxSearchAddHisKey(that);
  },
  wxSearchInput: function (e) {
    var that = this
    WxSearch.wxSearchInput(e, that);
  },
  wxSerchFocus: function (e) {
    var that = this
    WxSearch.wxSearchFocus(e, that);
  },
  wxSearchBlur: function (e) {
    var that = this
    WxSearch.wxSearchBlur(e, that);
  },
  wxSearchKeyTap: function (e) {
    var that = this
    WxSearch.wxSearchKeyTap(e, that);
  },
  wxSearchDeleteKey: function (e) {
    var that = this
    WxSearch.wxSearchDeleteKey(e, that);
  },
  wxSearchDeleteAll: function (e) {
    var that = this;
    WxSearch.wxSearchDeleteAll(that);
  },
  wxSearchTap: function (e) {
    var that = this
    WxSearch.wxSearchHiddenPancel(that);
  },
  gotoXianLu: function (e) {
    var id = e.currentTarget.dataset.id
    var name = e.currentTarget.dataset.name
    wx.navigateTo({
      url: '../xianlu/xianlu?id=' + id + '&name=' + name
    })
  }

})