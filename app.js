//app.js
App({
  onLaunch: function () {
  // 获取用户信息
    wx.getSetting({
      success: res => {
        console.log(res)
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
           this.login()
        }else{
          this.login()
        }
      }
    })
  },
  login:function(){
    var that = this;
    wx.login({
      success: function (res) {
        console.log(res)
        var code = res.code; // 微信登录接口返回的 code 参数，下面注册接口需要用到
        wx.getUserInfo({
          success: function (res) {
            that.globalData.userInfo = res.userInfo
            var iv = res.iv;
            var encryptedData = res.encryptedData;
           //下面开始调用注册接口
            that.loginRequest(code,encryptedData,iv)
            if(that.getUserInfoready){
               that.getUserInfoready=res=>{
                var iv = res.iv;
                var encryptedData = res.encryptedData;
                 //下面开始调用注册接口
                 that.loginRequest(code,encryptedData,iv)
               }
            }
           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback=res=>{
                  var iv = res.iv;
                  var encryptedData = res.encryptedData;
                   //下面开始调用注册接口
                   that.loginRequest(code,encryptedData,iv)
                }
              }
          
          }
  })
  }
})
},
  loginRequest:function(code,encryptedData,iv){
    let that = this
    wx.showLoading({
      title: '加载中',
      mask:true
    })
   
    wx.request({
      url: 'https://www.whxnjs.com.cn/m/wx/wxLogin/login',
      data: { code: code, encryptedData: encryptedData, iv: iv,tenantId:1}, // 设置请求的 参数
      header:{'content-type': 'application/json'},
      success: (res) => {
        if(res.data.status=='OK'){
                 //此时得到数据直接进行登录操作
                 that.globalData.member=res.data
                 wx.request({
                   url: that.globalData.URL+'oauth/token?grant_type=password&username='+res.data.data.member.username+'&password=123123&client_id=app&client_secret=123123',
                   method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                   header:{'content-type': 'application/json'},
                   success: function(res){
                    wx.hideLoading()
                      if(res.data.refresh_token){
                     
                       wx.setStorageSync('refresh_token',res.data.refresh_token)
                       wx.setStorageSync('access_token',res.data.access_token)
                       that.globalData.refresh_token=res.data.refresh_token
                       that.globalData.access_token=res.data.access_token
                     }
                   }
                 })
          }

      }
    })
  },

globalData: {
    userInfo: null,
   
    URL:'https://wx.whxnjs.com.cn/api/',
    checkToken:function(token,callback,callbackToken){
      /**
       * @param token 现在存储的token
       * @param callback 需要请求数据的函数
       * @param callbackToken  刷新token的函数
       */
     
      let that =this  //此时的this指向了当前的对象globalData
      let refresh_token = wx.getStorageSync('refresh_token')
      let access_token =wx.getStorageSync('access_token')
      wx.request({
        url: `https://www.whxnjs.com.cn/m/oauth/check_token?token=${access_token}`,
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        success: function(res){
          // success
          if(res.data.error){
            //如果此时使用this一定会指向了当前的函数
            if(callbackToken&&typeof(callbackToken)=='function'){
               callbackToken(refresh_token,callback)
            }
             
          }else 
           if(callback&& typeof(callback)=='function'){
              callback(access_token)
           }
         
        }
      })
    },
    refreshToken:function(refresh_token,callback){
      
      /**
       * @param refresh_token 现在存储的refresh_token
       * @param callback 需要请求数据的函数
       * 
       */
        wx.request({
          url: `https://wx.whxnjs.com.cn/api/oauth/token?grant_type=refresh_token&refresh_token=${refresh_token}&client_id=app&client_secret=123123`,
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          
          success: function(res){
          if(res.data.error){
              wx.setStorageSync('refresh_token','')
              wx.setStorageSync('access_token','')
              
            }else{
                wx.setStorageSync('refresh_token',res.data.refresh_token)
                wx.setStorageSync('access_token',res.data.access_token)
                if(callback&&typeof(callback)=='function'){
                  callback(res.data.access_token)
                }
            }
          }
        })
    }
  }
})