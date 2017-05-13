// search.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        duration: ['一个小时', '两个小时', '三个小时', '四个小时', '五个小时', '六个小时'],
        durationIndex: 0,
        curDate: '2017-05-14',
        startTime: '9:00',
        endTime: '21:00',
    },

    bindDateChange: function (e) {
        this.setData({
            curDate: e.detail.value
        })
    },

    bindStartTime: function (e) {
        this.setData({
            startTime: e.detail.value
        })
    },

    bindEndTime: function (e) {
        this.setData({
            endTime: e.detail.value
        })
    },

    bindDuration: function (e) {
        this.setData({
            durationIndex: e.detail.value
        })
    },

    submit: function () {
        wx.request({
            url: 'http://127.0.0.1:3000/search',
            data: {
                date: this.data.curDate,
                startTime: this.data.startTime,
                endTime: this.data.endTime,
                duration: parseInt(this.data.durationIndex) + 1
            },
            success: function (result) {
                console.log(result);
            }
        })
    }
})