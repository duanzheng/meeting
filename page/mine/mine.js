// mine.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        recordList: []
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.getPageData();
    },

    getPageData: function () {
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
    },

    cancel: function (e) {
        const that = this;
        const recordId = e.target.id;
        console.log(recordId);
        wx.showModal({
            content: "您确定要取消此次会议吗？",
            confirmText: "确定",
            cancelText: "取消",
            success: function (res) {
                if (res.confirm) {
                    wx.request({
                        url: 'http://127.0.0.1:3000/cancel',
                        data: {
                            id: recordId
                        },
                        success: function (result) {
                            that.removeItem(recordId);
                        }
                    })
                }
            }
        })
    },

    removeItem: function (id) {
        let recordList = this.data.recordList;
        for (const index in recordList) {
            if (recordList[index].recordId == id) {
                recordList.splice(index, 1);
                break;
            }
        }
        this.setData({
            recordList
        })
    }
})