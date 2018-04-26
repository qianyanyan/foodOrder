// pages/blindPhone/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    smsCode:false,
    phoneValue:'',
    smsCodeValue:'',
    CountdownTime:60,
    msg:'获取验证码'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
  mobileInput:function(e){
    let that = this
   console.log(e.detail.value)
   that.setData({
     phoneValue:e.detail.value
   })
  },
  smsCodeInput:function(e){
    let that = this
    console.log(e.detail.value)
    that.setData({
      smsCodeValue:e.detail.value
    })
  },
  getSmsCode:function(){
      let that= this;
    if(that.data.smsCode==true){
       return false
     }
     that.Countdown()
  
    if(/^1[345789]\d{9}$/.test(that.data.phoneValue)){
      
      let refresh_token = wx.getStorageSync('refresh_token')
      let access_token =wx.getStorageSync('access_token')
      app.globalData.checkToken(access_token,that.requestSms,app.globalData.refreshToken)  //修改之前代码加入callback来进行数据请求
             
    }
  },
  requestSms:function(access_token){
   let that= this;
    wx.request({
      url:'https://www.whxnjs.com.cn/m/app/member/singleSendSmsCode?mobile='+that.data.phoneValue+'&sendType=bml',
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header:{'content-type': 'application/json',"Authorization":"Bearer "+access_token},
      success: function(res){
        // success
        console.log(res)
        if(res.data.status=='OK'){
            wx.showToast({
              title:'验证码发送成功',
              icon:"none"
            })
        }else{
          wx.showToast({
            title:res.description,
            icon:"none"
          })
         }
      
      }
    })
  },
  Countdown:function(){
    let that= this;
    that.data.CountdownTime--
    if( that.data.CountdownTime>=0){
         if(that.data.register){
          that.setData({
              msg:'获取验证码',
              smsCode:false,
              CountdownTime:60
            })
         }else{
          that.setData({
              msg:`${that.data.CountdownTime}秒重新发送`,
              smsCode:true
            })
            setTimeout(()=>{
              that.Countdown()
            },1000)
         }
    
      
    }else{
      that.setData({
          msg:'获取验证码',
          smsCode:false,
          CountdownTime:60
        })
    }
   
},
blindMobile:function(){
   let that = this;
   if(that.data.phoneValue!='' &&  that.data.smsCodeValue!=''){
    let refresh_token = wx.getStorageSync('refresh_token')
    let access_token =wx.getStorageSync('access_token')
    app.globalData.checkToken(access_token,that.requestBlindPhone,app.globalData.refreshToken)  //修改之前代码加入callback来进行数据请求
           
   }else{
    wx.showToast({
      title:'请输入正确的信息',
      icon:"none"
    })
   }
},
requestBlindPhone:function(access_token){
  let that = this;
  wx.request({
    url: 'https://www.whxnjs.com.cn/m/app/member/bindMobile',
    data: {mobile:that.data.phoneValue,smsCode:that.data.smsCodeValue,tenantId:1},
    method: 'PUT', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    header:{'content-type': 'application/json',"Authorization":"Bearer "+access_token},
    success: function(res){
      // success
      console.log(res)
      if(res.data.status=='OK'){
          wx.setStorageSync('user',res.data.member)
          wx.showModal({
           title:'提示',
           content:'你可以领取会员卡',
           success:function(res){
             if (res.confirm) {
              wx.navigateTo({
                url: '/pages/getVip/index',
              })
             } else if (res.cancel) {
               wx.navigateBack({
                 delta:1, // 回退前 delta(默认为1) 页面
               })
             }
           }
          })
      }else{
         wx.showToast({
           title:res.data.description,
           icon:"none"
         })
      }

    }
  })
}
})