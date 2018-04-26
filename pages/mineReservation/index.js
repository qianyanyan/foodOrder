// pages/mineReservation/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentPage:1,
    pageSize :10,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.showLoading({
      title: '加载中',
    })
     wx.request({
       url: `${app.globalData.URL}app/appointment/list?currentPage=${that.data.currentPage}&pageSize=${that.data.pageSize}&memberId=${app.globalData.member.data.member.id}`,
      
       method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
       // header: {}, // 设置请求的 header
       header:{'content-type': 'application/json',"Authorization":"Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsic3ByaW5nLWJvb3QtYXBwbGljYXRpb24iXSwic2NvcGUiOlsicmVhZCJdLCJqdGkiOiIzYzdlNTMxYy04OWZlLTRmYjctYTkxMS1lOWNiZTZhZmM1ZjAiLCJjbGllbnRfaWQiOiJhcGkifQ.Hscgj0DzQACanASNOkby6cQrLt21lPVe-W9NLoQFisMOTX-8FLEiAC55nmpOJrf4wALJSEi0JgIKKA70lq45xC57pLT1_uc6DDBRD0sZOFcH68ggIqKrB6ehX6H8mElKLXY8Fs-fgJOuFyIN6ZB_E6ZG-S_Cq2fVEzLBk8VVpN4"},
       success: function(res){
        wx.hideLoading()
        if(res.data.status=='OK'){
              if(res.data.data){
                 //此时有订单
                 that.setData({
                   reservationList:res.data.data.content
                 })
              }
        }
         // success
       }
     })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})