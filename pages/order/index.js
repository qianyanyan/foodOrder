// pages/order/index.js
const app= getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
     activeTabbarId:0,
     method:'ON_THE_SPOT'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let access_token =wx.getStorageSync('access_token')
    app.globalData.checkToken(access_token,that.requestAllOrder,app.globalData.refreshToken)  //修改之前代码加入callback来进行数据请求
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
  switchTab:function(e){
    let that = this
    that.setData({
      activeTabbarId:e.target.dataset.id,
      method:e.target.dataset.method
    })
    let access_token =wx.getStorageSync('access_token')
    app.globalData.checkToken(access_token,that.requestAllOrder,app.globalData.refreshToken)  //修改之前代码加入callback来进行数据请求
  },
  requestAllOrder:function(access_token){
    let that = this;
    wx.showLoading({
      title:'加载中'
    })
    wx.request({
      url:  app.globalData.URL+'app/order/listOrders',
      data:{tenantId:1,type:that.data.method},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header:{'content-type': 'application/json',"Authorization":"Bearer "+access_token},
      success: function(res){
        wx.hideLoading()
        // success
        console.log(res)
        if(res.data.status=='OK'){
              if(res.data.data){
                    that.setData({
                      orderList:res.data.data.orderList
                    })
              }
        }
      },
      fail:function(){
        wx.hideLoading()
      }
    })
  },
  cancelOrder:function(e){
    let that = this;
    that.setData({
      activeOrderId:e.target.dataset.id
    })
    let access_token =wx.getStorageSync('access_token')
    app.globalData.checkToken(access_token,that.requestCancleOrder,app.globalData.refreshToken)  //修改之前代码加入callback来进行数据请求
  },
  requestCancleOrder:function(access_token){
   let that = this;
   wx.request({
     url:  app.globalData.URL+'app/order/cancelOrder',
     data: {tenantId:1,orderId:that.data.activeOrderId,type:that.data.method},
     method: 'PUT', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
     header:{'content-type': 'application/json',"Authorization":"Bearer "+access_token},
     success: function(res){
       // success
       if(res.data.status=='OK'){
        if(res.data.data){
              that.setData({
                orderList:res.data.data.orderList
              })
        }
      }
     }
   })
  },
  deletOrder:function(e){
    let that = this;
    that.setData({
      activeOrderId:e.target.dataset.id
    })
    let access_token =wx.getStorageSync('access_token')
    app.globalData.checkToken(access_token,that.requestDeletOrder,app.globalData.refreshToken)  //修改之前代码加入callback来进行数据请求
  },
  requestDeletOrder:function(access_token){
    let that = this;
    wx.request({
      url:  app.globalData.URL+'app/order/deleteOrder',
      data: {tenantId:1,orderId:that.data.activeOrderId,type:that.data.method},
      method: 'PUT', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header:{'content-type': 'application/json',"Authorization":"Bearer "+access_token},
      success: function(res){
        // success
        console.log(res)
        if(res.data.status=='OK'){
          if(res.data.data){
                that.setData({
                  orderList:res.data.data.orderList
                })
          }
    }
      }
    })
   },
   goFinishOrder:function(e){

     wx.navigateTo({
       url: '/pages/orderFinish/index?orderId='+e.target.dataset.id,
     })
   }
})