// mine.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        recordList: [
            {
                theme: '茶话会',
                date: '05-14',
                startTime: '13:00',
                endTime: '14:30',
                roomName: '冥王星'
            }
        ]
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        const that = this;
        wx.request({
            url: 'http://127.0.0.1:3000/getRecordByUser',
            data: {
                userId: "Tony段"
            },
            success: function (result) {
                console.log(result);
                that.setData({
                    recordList: result.data
                });
            }
        })
    }
})