// roomDetail.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        roomId: '',
        name: '',
        desc: '',
        curDate: '2017-05-13',
        timeList: [],
        selectTimeList: [],
        selectTimeText: '点击时间段选择预订时间',
        theme: ''
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
    getRoomMsg: function () {
        var that = this;
        wx.request({
            url: 'http://127.0.0.1:3000/roomDetail?roomId=' + this.data.roomId + '&date=' + this.data.curDate,
            success: function (result) {
                const roomMsg = result.data;
                console.log(roomMsg);

                var roomRecord = roomMsg.record;
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

                that.setData({
                    name: roomMsg.name,
                    desc: '可容纳：' + roomMsg.fill + '人，可用设备：' + roomMsg.equip,
                    timeList
                })
            }
        });
    },
    themeInput: function (e) {
        this.setData({
            theme: e.detail.value
        })
    },
    tapdate: function (e) {
        console.log(e.target.id);
        const selectId = e.target.id;
        if (selectId) {
            const selectHour = selectId.split('-')[0];
            const selectSection = selectId.split('-')[1];
            const timeList = this.data.timeList;
            for (var item of timeList) {
                if (item.value == selectHour) {
                    if (selectSection == 0) {
                        item.selectAm = !item.selectAm;
                    } else {
                        item.selectPm = !item.selectPm;
                    }
                }
            }

            const selectTimeArray = [];
            for (const item of timeList) {
                if (item.selectAm && item.selectPm) {
                    selectTimeArray.push({
                        startTime: item.value + ':00',
                        endTime: (parseInt(item.value) + 1) + ':00'
                    });
                } else if (item.selectAm) {
                    selectTimeArray.push({
                        startTime: item.value + ':00',
                        endTime: item.value + ':30'
                    });
                } else if (item.selectPm) {
                    selectTimeArray.push({
                        startTime: item.value + ':30',
                        endTime: (parseInt(item.value) + 1) + ':00'
                    })
                }
            }
            const workedTimeList = this.combineTimeData(selectTimeArray);
            let selectTimeText = '预订时间：';
            if (workedTimeList.length > 0) {
                for (const timeItem of workedTimeList) {
                    selectTimeText += timeItem.startTime + '-' + timeItem.endTime + ' ';
                }
            } else {
                selectTimeText = '点击时间段选择预订时间';
            }

            this.setData({
                timeList,
                selectTimeList: workedTimeList,
                selectTimeText
            });
        }
    },
    submit: function () {
        var that = this;
        wx.request({
            url: 'http://127.0.0.1:3000/addRecord',
            data: {
                roomId: this.data.roomId,
                userId: 'Tony段',
                date: this.data.curDate,
                theme: this.data.theme,
                timeList: this.data.selectTimeList
            },
            success: function (result) {
                if (result.success === 1) {
                    
                }
            }
        });
    },
    combineTimeData: function (timeArray) {
        let i = 0;
        while (i < timeArray.length - 1) {
            if (timeArray[i].endTime == timeArray[i + 1].startTime) {
                timeArray[i].endTime = timeArray[i + 1].endTime;
                timeArray.splice(i + 1, 1);
            } else {
                i++
            }
        }
        return timeArray;
    }
})