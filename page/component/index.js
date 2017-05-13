Page({
    data: {
        dateList: [
            {
                id: 0,
                text: '今天05-13',
                select: true
            },
            {
                id: 1,
                text: '05-14',
                select: false
            },
            {
                id: 2,
                text: '05-15',
                select: false
            },
            {
                id: 3,
                text: '05-16',
                select: false
            },
            {
                id: 4,
                text: '05-17',
                select: false
            },
            {
                id: 5,
                text: '05-18',
                select: false
            },
            {
                id: 6,
                text: '05-19',
                select: false
            },
        ],
        roomList: [],
        curDate: '05-13'
    },
    selectDate: function (e) {
        var selectId = e.currentTarget.id;
        var oriDateList = this.data.dateList;
        for (var i = 0; i < oriDateList.length; i++) {
            if (oriDateList[i].id == selectId) {
                oriDateList[i].select = true;
            } else {
                oriDateList[i].select = false;
            }
        }
        this.setData({
            dateList: oriDateList
        });
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
    onShow: function () {
        var that = this;
        wx.showLoading({
            title: '加载中…'
        });
        wx.request({
            url: 'http://127.0.0.1:3000/roomList/05-13',
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
        });

        var timeList = [];
        for (var i = 9; i <= 21; i++) {
            timeList.push({
                value: i
            });
        }
        this.setData({
            timeList: timeList
        });
    }
})

