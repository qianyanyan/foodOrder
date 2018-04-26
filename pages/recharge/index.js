// pages/recharge/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
     money:[{id:0,money:100},{id:1,money:200},{id:2,money:300},{id:3,money:400},{id:4,money:500},{id:5,money:600},{id:6}],
     submitBtn:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
     for(let i=0;i<that.data.money.length;i++){
        that.data.money[0].active=true
     }
     that.setData({
       money:that.data.money,
       memberId:options.memberId,
       carId:options.cardId
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
  
  },
  selectMoney:function(e){
    let that = this;
    let submitBtn=true
   for(let i=0;i<that.data.money.length;i++){
       that.data.money[i].active=false
     if(e.target.dataset.id==that.data.money[i].id){
       that.data.money[i].active=true
         if(that.data.money[i].money){
             //此时为其他金额
             submitBtn=false
         }
     }
   }
   that.setData({
     money:that.data.money,
     submitBtn:submitBtn
   })
  },
  otherMoney:function(e){
    let that = this
     that.setData({
       otherMoney:e.detail.value
     })
  },
  recharge:function(){
   let that = this;
   let refresh_token = wx.getStorageSync('refresh_token')
   let access_token =wx.getStorageSync('access_token')
    app.globalData.checkToken(access_token,that.requestRecharge,app.globalData.refreshToken)  //修改之前代码加入callback来进行数据请求
  
  },
  requestRecharge:function(access_token){
    let that = this;
    let money = 0;
    for(let i=0;i<that.data.money.length;i++){
         if(that.data.money[i].active==true){
            if(that.data.money[i].money){
                money=that.data.money[i].money
            }else{
              money = that.data.otherMoney
            }
          }
     }
    wx.request({
      url: 'http://192.168.2.78:8082/api/app/card/editMoney',
      data: {cardId:that.data.carId,memberId:that.data.memberId,money:money,cardConsumType:'RECHARGE',tenantId:1},
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header:{'content-type': 'application/json',"Authorization":"Bearer "+access_token},
      success: function(res){
        // success
        console.log(res)
        if(res.data.status=='OK'){
              if(res.data.data){
               that.pay()
              }
        }
      }
    })
  },
  pay:function(){
    let that = this;
    let access_token =wx.getStorageSync('access_token')
    app.globalData.checkToken(access_token,that.requestPayArgument,app.globalData.refreshToken)  //修改之前代码加入callback来进行数据请求
  },
  requestPayArgument:function(access_token){
    let that = this;
    let money = 0;
    for(let i=0;i<that.data.money.length;i++){
         if(that.data.money[i].active==true){
            if(that.data.money[i].money){
                money=that.data.money[i].money
            }else{
              money = that.data.otherMoney
            }
          }
     }
      wx.request({
        url: 'http://192.168.2.78:8082/api/wx/wxpay/pay',
        data: {tenantId:1,money:money},
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header:{'content-type': 'application/json',"Authorization":"Bearer "+access_token},
        success: function(res){
          // success
          console.log(res)
          // if(res.data.status=='OK'){
          //       if(res.data.data){

          //       }
          // }
        }
      })
  }
})