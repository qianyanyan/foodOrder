// pages/mine/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
     userInfo:{},
     vipState:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that  = this;
  
    let refresh_token = wx.getStorageSync('refresh_token')
    let access_token =wx.getStorageSync('access_token')
    app.globalData.checkToken(access_token,that.requestMemerInfo,app.globalData.refreshToken)  //修改之前代码加入callback来进行数据请求
    app.globalData.checkToken(access_token,that.requestMemberVip,app.globalData.refreshToken)  //修改之前代码加入callback来进行数据请求
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
  goMineReserVation:function(){
    wx.navigateTo({
      url:'/pages/mineReservation/index'
    })
   
  },
  goMineVip:function(){
    wx.navigateTo({
      url:'/pages/mineVip/index'
    })
   
  },
  goMineCoupon:function(){
    wx.navigateTo({
      url:'/pages/mineCoupon/index'
    })
   
  },
  goMineAddress:function(){
    wx.navigateTo({
      url:'/pages/addressList/index?from=mine'
    })
   
  },
  goMineOrder:function(){
     wx.switchTab({
       url:"/pages/order/index"
     })
  },
  goBlindPhone:function(){
    wx.navigateTo({
      url:'/pages/blindPhone/index'
    })
  },
  goGetVip:function(){
    let that= this
    wx.navigateTo({
      url:'/pages/getVip/index?memberId='+that.data.userInfo.id
    })
  },
  requestMemerInfo:function(access_token){
    let that  = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'https://www.whxnjs.com.cn/m/app/member/showMemberInfo?memberId='+app.globalData.member.data.member.id,
     
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header:{'content-type': 'application/json',"Authorization":"Bearer "+access_token},
      success: function(res){
        // success
     wx.hideLoading()
        if(res.data.status=='OK'){
 
          that.setData({
             userInfo:res.data.data.member
          })
        }
      }
    })
  },
  requestMemberVip:function(access_token){
    let that  = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url:  app.globalData.URL+'app/card/find_card?memberId='+app.globalData.member.data.member.id,
     
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header:{'content-type': 'application/json',"Authorization":"Bearer "+access_token},
      success: function(res){
        wx.hideLoading()
        console.log(res)
        if(res.data.status=='OK'){
          if(res.data.data!=null){
            //此时有会员卡
            that.setData({
              vipState:true
             })
          }else{
            that.setData({
              vipState:false
             })
          }
             
        }
        // success
      }
    })
  }


})