//index.js

const app = getApp()
//获取应用实例
//引入qq地图小程序定位
var QQMapWX=require('../../lib/qqmap-wx-jssdk1.0/qqmap-wx-jssdk.js')


Page({
  data: {
    
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    shoplist:[],
    p:1,
    size:5,
    maskShow:false
  },
  
  onLoad: function () {
    let that= this
    that.getShopList()
    that.getBanner()
    that.getLocation()
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    }else{

      app.userInfoReadyCallback=res=>{
    
    
    }
  }
   
  },
  onUnload: function () {
  let that = this;
  that.setData({
    maskShow:false
  })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let that = this;
    wx.startPullDownRefresh({
      success:function(){
        //that.getLocation()
        
      }
    })
   
  },

  getShopList:function(){
        let that = this;
      
        //请求店铺列表
        wx.showLoading({
          title: '加载中',
        })
      wx.request({
          url: app.globalData.URL+'/shop/app/defauleShop?tenantId=1',
          method:'GET',
          dataType:'json',
          header:{'content-type': 'application/json'},
          success:(res)=>{
            wx.hideLoading()
           if(res.data.status=='OK'){
              if(res.data.data.shops){
                res.data.data.shops[0].stars = new Array( res.data.data.shops[0].starLevel) 
               that.setData({
                  homeShowShop:res.data.data.shops[0]
                 })
                
              }
               
            }
          },
          fail:(err)=>{
            wx.hideLoading()
            throw err;
          }
        })
  },
  getBanner:function(){
    let that = this;
    
    //请求店铺banner
    wx.showLoading({
      title: '加载中',
    })
   
    wx.request({
      url: app.globalData.URL+'shop/app/shopImg?tenantId=1',
      method:'GET',
      dataType:'json',
      header:{'content-type': 'application/json'},
      success:(res)=>{
        wx.hideLoading()
     
        if(res.data.status=='OK'){
            
              that.setData({
                bannerList:res.data.data
              })
            
        }
      
      },
      fail:(err)=>{
        wx.hideLoading()
        throw err;
      }
    })
  },
  //扫描二维码
  showScan:function(){
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        console.log(res)
      }
    })
  },
  goShop:function(){
    wx.navigateTo({
      url:'/pages/shop/index'
    })
  },
  //打电话
  makePhoneCall:function(e){
 
    let that = this
    wx.makePhoneCall({
      phoneNumber: e.target.dataset.phone
    })
  },
  //跳去外卖的商铺列表页
  goReservation:function(){
    wx.navigateTo({
      url:"/pages/shopList/index?method=reservation"
    })
  },
  //跳去预约的商铺列表页
  goProduct:function(){
    wx.navigateTo({
      url:"/pages/shopList/index?method=takeWay"
    })
  },
  //跳去优惠券
  goCoupon:function(){
    wx.navigateTo({
      url:"/pages/coupon/index"
    })
  },
  showMask:function(){
    let that= this;
    that.setData({
      maskShow:true
    })
  },
  hideMask:function(){
    let that= this;
    that.setData({
      maskShow:false
    })
  },
  goChoice:function(){
    wx.navigateTo({
      url:"/pages/shopList/index?method=Choice"
    })
  },
 getLocation:function(){
   let that = this;
  let repastLocation = new QQMapWX({
    key:'MNEBZ-HWFKX-ZFH43-THAZK-BCUWH-6UBWF'
  });
  //地址逆解析
   wx.getLocation({
   
    altitude:true,
    success:(res)=>{
         that.setData({    
            latitude: res.latitude,
            longitude: res.longitude
          })
      repastLocation.reverseGeocoder({
            location:{
              latitude: res.latitude,
              longitude: res.longitude
             },
             success: function(res) {
              if(res.status==0){
                that.setData({
                  address:res.result.address
                })
               }
              // wx.stopPullDownRefresh()
            },
            fail: function(res) {
              console.log(res);
            },
            complete: function(res) {
              console.log(res);
            }
          })
    },
    fail:(err)=>{
          console.log(err)
          throw err;
    }
  })

 }
})
