// pages/addressList/index.js
const app = getApp()
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
      from:options.from
    })
    let access_token =wx.getStorageSync('access_token')
    app.globalData.checkToken(access_token,that.requestAllAddress,app.globalData.refreshToken)  //修改之前代码加入callback来进行数据请求
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
    let that = this;
    let access_token =wx.getStorageSync('access_token')
    app.globalData.checkToken(access_token,that.requestAllAddress,app.globalData.refreshToken)  //修改之前代码加入callback来进行数据请求
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
  useAddress:function(e){
   let that= this;
   that.setData({
     orderUserAddressId:e.target.dataset.id
   })
   wx.setStorageSync('orderUserAddressId',e.target.dataset.id)
   wx.navigateBack({
     delta: 1, // 回退前 delta(默认为1) 页面
   })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  goAdd:function(){
    wx.navigateTo({
      url: '/pages/newAddress/index?method=new',
    })
  },
  goChange:function(e){
    wx.navigateTo({
      url: '/pages/newAddress/index?method=change&addressId='+e.target.dataset.id,
    })
  },
  requestAllAddress:function(access_token){
    let that = this;
    wx.request({
      url: 'https://www.whxnjs.com.cn/m/app/member/showReceivers',
      data: {tenantId:1},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header:{'content-type': 'application/json',"Authorization":"Bearer "+access_token},
      success: function(res){
        // success
        console.log(res)
        if(res.data.status=='OK'){
           //此时请求数据成功
           if(res.data.data.receivers.length!=0){
               for(let i=0;i<res.data.data.receivers.length;i++){
                res.data.data.receivers[i].area=res.data.data.receivers[i].area.replace(/,/g,'')
               }
           }
          that.setData({
            receivers:res.data.data.receivers
           })
        }
      }
    })
  }
})