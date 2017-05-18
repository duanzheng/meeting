Page({
    data: {
        dateList: [],
        roomList: [],
        curDate: '05-14',
        classDateSelect: 'select'
    },
    onLoad: function () {
        this.getCurDate();
    },
    disposeDate: function (oriDate) {
        return oriDate < 10 ? '0' + oriDate : oriDate
    },
    getCurDate() {
        const date = new Date();
        const oriDay = date.getDate();
        const month = this.disposeDate(date.getMonth() + 1);
        const day = this.disposeDate(oriDay);
        const curDate = month + '-' + day;
        const dateList = [];

        for (let i = 0; i < 7; i++) {
            dateList.push({
                id: month + '-' + this.disposeDate(oriDay + i),
                text: (i === 0 ? '今天' : '') + month + '-' + this.disposeDate(oriDay + i),
                select: i === 0
            })
        }
        this.setData({
            curDate: curDate,
            dateList
        });
        console.log(dateList);
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
            dateList: oriDateList,
            curDate: selectId
        });
        this.getPageData();
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
        this.getPageData();
    },
    getPageData: function () {
        var that = this;
        // wx.showLoading({
        //     title: '加载中'
        // });
        wx.request({
            url: 'http://127.0.0.1:3000/roomList/' + this.data.curDate,
            success: function (result) {
                // wx.hideLoading();
                that.setRoomListData(result.data)
            }
        });
    },
    setRoomListData: function (roomList) {
        for (var i = 0; i < roomList.length; i++) {
            var roomRecord = roomList[i].record;
            var timeList = [];
            for (var j = 9; j <= 21; j++) {
                var am = false;
                var pm = false;

                for (var k = 0; k < roomRecord.length; k++) {
                    am = am || this.judgeInterval(j, 0, roomRecord[k].startTime, roomRecord[k].endTime);
                    pm = pm || this.judgeInterval(j, 1, roomRecord[k].startTime, roomRecord[k].endTime);
                }
                timeList.push({
                    value: j,
                    am: am,
                    pm: pm
                });
            }
            roomList[i].timeList = timeList;
        }
        this.setData({
            roomList: roomList
        })
    },
    scanCode: function () {
        const that = this;
        wx.scanCode({
            success: function (res) {
                const result = JSON.parse(res.result);
                if (result) {
                    const roomId = result.roomId;
                    wx.navigateTo({
                        url: `../roomDetail/roomDetail?roomId=${roomId}&date=${that.data.curDate}`
                    });
                }
            },
            fail: function (res) {
            }
        })
    }
})

