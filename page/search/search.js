// search.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        duration: ['一个小时', '两个小时', '三个小时', '四个小时', '五个小时', '六个小时'],
        durationIndex: 0,
        curDate: '05-14',
        curFullDate: '2017-05-14',
        startTime: '9:00',
        endTime: '21:00',
        roomList: []
    },

    bindDateChange: function (e) {
        const selectDate = e.detail.value;
        this.setData({
            curDate: selectDate.split('-')[1] + '-' + selectDate.split('-')[2],
            curFullDate: selectDate
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
        const that = this;
        wx.showLoading({
            title: '加载中'
        });
        wx.request({
            url: 'http://127.0.0.1:3000/search',
            data: {
                date: this.data.curDate,
                startTime: this.data.startTime,
                endTime: this.data.endTime,
                duration: parseInt(this.data.durationIndex) + 1
            },
            success: function (result) {
                wx.hideLoading();
                var roomList = result.data;
                for (var i = 0; i < roomList.length; i++) {
                    var roomRecord = roomList[i].record;
                    var timeList = [];
                    for (var j = 9; j <= 21; j++) {
                        var am = false;
                        var pm = false;

                        for (var k = 0; k < roomRecord.length; k++) {
                            am = am || that.judgeInterval(j, 0, roomRecord[k].startTime, roomRecord[k].endTime);
                            pm = pm || that.judgeInterval(j, 1, roomRecord[k].startTime, roomRecord[k].endTime);
                        }
                        timeList.push({
                            value: j,
                            am: am,
                            pm: pm
                        });
                    }
                    roomList[i].timeList = timeList;
                }
                that.setData({
                    roomList: roomList
                })
            }
        })
    },

    //firstTime大于secondTime则返回true
    transformTime: function (oriTime) {
        var timeArray = oriTime.split(':');
        return parseInt(timeArray[0]) + parseInt(timeArray[1]) / 60;
    },

    //minute为0代表0-30分，为1代表30-60分
    judgeInterval: function (hour, minute, startTime, endTime) {
        var ret = false;
        var curStartTime = hour + ':' + (minute == 0 ? '00' : '30');
        var curEndTIme = (minute == 0 ? hour : hour + 1) + ':' + (minute == 0 ? '30' : '00');
        if (this.transformTime(curStartTime) >= this.transformTime(startTime) && this.transformTime(curEndTIme) <= this.transformTime(endTime)) {
            ret = true;
        }
        return ret;
    },
})