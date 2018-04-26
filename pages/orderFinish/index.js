// pages/orderFinish/index.js
const app  = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({
      orderId:options.orderId
    })
    let access_token =wx.getStorageSync('access_token')
    app.globalData.checkToken(access_token,that.requestOrder,app.globalData.refreshToken)  //修改之前代码加入callback来进行数据请求
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
  
  },
  requestOrder:function(access_token){
    let that = this;
    wx.request({
      url:  app.globalData.URL+'app/order/showOrderInfo',
      data: {orderId:that.data.orderId,tenantId:1},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header:{'content-type': 'application/json',"Authorization":"Bearer "+access_token},
      success: function(res){
        // success
        console.log(res)
        if(res.data.status=='OK'){
           if(res.data.data.order){
              //一定要判断当前订单是否存在
              that.setData({
                order:res.data.data
              })
           }
        }
      }
    })
  }
})