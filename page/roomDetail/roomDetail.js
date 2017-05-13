// roomDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    roomId: '',
    curDate: '2017-05-13'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      roomId: options.roomId
    })
  },

  bindDateChange: function (e) {
    this.setData({
      curDate: e.detail.value
    })
  }
})