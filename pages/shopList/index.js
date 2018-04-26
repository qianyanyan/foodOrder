// pages/shopList/index.js
var QQMapWX=require('../../lib/qqmap-wx-jssdk1.0/qqmap-wx-jssdk.js')

const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    page:1,
    size:6,
    maskShow:false,
    shopShow:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that= this
    wx.getSystemInfo({
      success:function(res){
        that.setData({
          scollHeight:res.windowHeight-38 ,  //其中38为顶部地址信息的高度
          
        })
      }
    })
    if(options){
      that.setData({
        method:options.method
      })
    }
    
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
                  let refresh_token = wx.getStorageSync('refresh_token')
                  let access_token =wx.getStorageSync('access_token')
                  app.globalData.checkToken(access_token,that.getShopList,app.globalData.refreshToken)  //修改之前代码加入callback来进行数据请求
                  //that.getShopList();
                 }
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
    let  that = this;
    that.setData({
        maskShow:false,
        shopShow:false,
    })
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
  moreShop:function(e){
  
    let that = this;
    console.log(that.data.page)
    if(e.detail.scrollTop>((((that.data.page-1)*(that.data.size-1)))*85)+42){
      that.setData({
       
        page:that.data.page+1
       }) 
        let refresh_token = wx.getStorageSync('refresh_token')
        let access_token =wx.getStorageSync('access_token')
        app.globalData.checkToken(access_token,that.getMoreShopList,app.globalData.refreshToken)  //修改之前代码加入callback来进行数据请求
    }
  },
  getMoreShopList:function(access_token){
    let that = this;
     /**
     * @param currentPage 当前分页
     * @param pageSize  分页的数量
     * @param Authorization  授权
     * @param lng2  经度
     * @param lat2  纬度
     */
    //p 和size全部为初始值
    //console.log(that.data.page+1)
    wx.request({
      url: app.globalData.URL+'shop/app/list?currentPage='+Number(that.data.page)+'&pageSize='+Number(that.data.size)+'&lng2='+that.data.longitude+'&lat2='+that.data.latitude+'&tenantId=1',
      method:'GET',
      dataType:'json',
      header:{'content-type': 'application/json',"Authorization":"Bearer "+access_token},
      success:(res)=>{
        console.log(res)
        wx.hideLoading()
       if(res.data.status=="OK"){
          for(let i=0;i<res.data.data.shops.length;i++){
            res.data.data.shops[i].stars = new Array( res.data.data.shops[i].starLevel)
            that.data.shoplist.push(res.data.data.shops[i])
          }   
        console.log(that.data.shoplist,)
        for(let j=0;j< that.data.shoplist.length;j++){
          that.data.shoplist[j].stars = new Array( that.data.shoplist[j].starLevel)
        }
          that.setData({
            shoplist:that.data.shoplist,
          })   
        }
      },
      fail:(err)=>{
        wx.hideLoading()
        throw err;
      }
    })
  },
  getShopList:function(access_token){
    let that = this;
    //请求店铺列表
    wx.showLoading({
      title: '加载中',
    })
    /**
     * @param currentPage 当前分页
     * @param pageSize  分页的数量
     * @param Authorization  授权
     * @param lng2  经度
     * @param lat2  纬度
     */
    //p 和size全部为初始值
    wx.request({
      url: app.globalData.URL+'shop/app/list?currentPage='+Number(that.data.page)+'&pageSize='+Number(that.data.size)+'&lng2='+that.data.longitude+'&lat2='+that.data.latitude+'&tenantId=1',
      method:'GET',
      dataType:'json',
      header:{'content-type': 'application/json',"Authorization":"Bearer "+access_token},
      success:(res)=>{
        console.log(res)
        wx.hideLoading()
       if(res.data.status=="OK"){
          for(let i=0;i<res.data.data.shops.length;i++){
            res.data.data.shops[i].stars = new Array( res.data.data.shops[i].starLevel)
          }   
          
          that.setData({
            shoplist:res.data.data.shops,
            homeShowShop:res.data.data.shops[0]
           })   
        }
      },
      fail:(err)=>{
        wx.hideLoading()
        throw err;
      }
    })
},

//展示特定的商铺
showSpecificShop:function(e){
  console.log(e.target.dataset)
  let that = this;
  for(let i=0;i<that.data.shoplist.length;i++){
          if(that.data.shoplist[i].id==e.target.dataset.id){
                console.log(that.data.shoplist[i])
                that.data.shoplist[i].stars  =  new Array( that.data.shoplist[i].starLevel)
                that.setData({
                  maskShow:true,
                  shopShow:true,
                  showShopList:that.data.shoplist[i]
                })
           }
  }
},
 //打电话
 makePhoneCall:function(e){
 
  let that = this
  wx.makePhoneCall({
    phoneNumber: e.target.dataset.phone
  })
},
goReservation:function(e){
 
  wx.navigateTo({
    url:"/pages/reservation/index?shopid="+e.target.dataset.id
  })
},
closeMask:function(){
  let  that = this;
  that.setData({
      maskShow:false,
      shopShow:false,
  })
},
gotakeWay:function(e){
 
  wx.navigateTo({
    url:"/pages/product/index?shopid="+e.target.dataset.id+'&method=takeWay'
  })
},
goChoice:function(e){
 
  wx.navigateTo({
    url:"/pages/product/index?shopid="+e.target.dataset.id+'&method=choice'
  })
},
})