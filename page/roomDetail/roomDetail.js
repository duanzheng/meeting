// roomDetail.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        roomId: '',
        name: '',
        desc: '',
        curDate: '2017-05-13'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            roomId: options.roomId,
            curDate: '2017-' + options.date
        });
        this.getRoomMsg();
    },

    bindDateChange: function (e) {
        this.setData({
            curDate: e.detail.value
        })
    },

    getRoomMsg: function () {
        var that = this;
        wx.request({
            url: 'http://127.0.0.1:3000/roomDetail?roomId=' + this.data.roomId + '&date=' + this.data.curDate,
            success: function (result) {
                const roomMsg = result.data;
                console.log(roomMsg);
                that.setData({
                    name: roomMsg.name,
                    desc: '可容纳：' + roomMsg.fill + '人，可用设备：' + roomMsg.equip
                })
            }
        });
    }
})