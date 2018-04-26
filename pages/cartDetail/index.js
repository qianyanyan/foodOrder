// pages/cartDetail/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */

    data: {
      people:['1-3','3-5','5-8','1-10','1-20'],
      peopleindex: 0,
      choicePeople:'1-3',
      sex:[{"id":0,'sex':'man',"name":'先生','cnSex':'男','img':'http://zwhtubiaoku.oss-cn-beijing.aliyuncs.com/icon/noChoice.png','checked':false},{"id":0,'sex':'woman',"name":'女士','cnSex':'女','img':'http://zwhtubiaoku.oss-cn-beijing.aliyuncs.com/icon/noChoice.png','checked':false}],
      date:"",
      dateTime:"12:01",
      cartList:[],
      note:'',
      taste:''
     },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
    let that = this;
    let date = new Date()
    let time=date.getFullYear()+'-'+(Number(date.getMonth())+1)+'-'+date.getDate()
   that.setData({
       date:time,
       shopId:options.shopId,
       method:options.method
     })
  
    let access_token =wx.getStorageSync('access_token')
    if(options.method!='ON_THE_SPOT'){
      app.globalData.checkToken(access_token,that.requestAllAddress,app.globalData.refreshToken)  //修改之前代码加入callback来进行数据请求
    }
   
    app.globalData.checkToken(access_token,that.requestShopCart,app.globalData.refreshToken)  //修改之前代码加入callback来进行数据请求
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
    let that  =  this
    console.log('这是onShow加载')
     let orderUserAddressId= wx.getStorageSync('orderUserAddressId')
     console.log(orderUserAddressId)
     //这个时候要使用地址，需要在地址列表页把地址ID存起来，之后返回的时候不会加载onload，但是会在onshow中调用
     that.setData({
      orderUserAddressId:orderUserAddressId
     })
     if(orderUserAddressId){
          let access_token =wx.getStorageSync('access_token')
          app.globalData.checkToken(access_token,that.requestChangeAddress,app.globalData.refreshToken)  //修改之前代码加入callback来进行数据请求
          wx.setStorageSync('orderUserAddressId',null)
        }
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
  peoplePickerChange: function(e) {
    let that = this;
    let choicePeople=''
    for(let i=0;i<that.data.people.length;i++){
      if(i==e.detail.value){
         choicePeople=that.data.people[i]
      }
    }
    this.setData({
      peopleindex: e.detail.value,
      choicePeople:choicePeople
    })
  },
  datePickerChange: function(e) { 
    let that = this;
   
    that.setData({
      date: e.detail.value
    })
  },
  timePickerChange:function(e){
     let that = this;
      
      that.setData({
        dateTime: e.detail.value
      })
  },
  taste:function(e){
      let that = this
      that.setData({
        taste: e.detail.value
      })
  },
  note:function(e){
    let that = this
    that.setData({
      note: e.detail.value
    })
  },
  goAddressList:function(){
    wx.navigateTo({
      url:"/pages/addressList/index?from=order",
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
                 if(res.data.data.receivers[i].getDefault==true){
                     that.setData({
                        receiver:res.data.data.receivers[i]
                      })
                 }else{
                   that.setData({
                    receiver:res.data.data.receivers[0]
                   })
                 }
                 
               }
           }else{
             //此时没有地址
            that.setData({
              receiver:null
             })
           }
          
        }
      }
    })
  },
  requestShopCart:function(access_token){
    let that = this
    //取得购物车列表
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url:app.globalData.URL+'app/cart/showCart?shopId='+that.data.shopId+'&tenantId=1&type='+that.data.method,
      method:"GET",
      header:{'content-type': 'application/json',"Authorization":"Bearer "+access_token},
      success:function(res){
       wx.hideLoading()
       if(res.data.status=="OK"){
         if(res.data.data.cartItems.length!=0){
              that.setData({
                cartList:res.data.data.cartItems,
              })
         }
        that.setData({
          allPrice:that.countAllPrice()
        })
     }
      },
      fail:function(err){
       wx.hideLoading()
           throw err
      } 
    })
  },
   //计算购物车中的商品总价
  countAllPrice:function(){
    //计算当前购物车添加购买的商品总价
    let that = this;
    let countAllPrice=0;
    for(let i=0;i<that.data.cartList.length;i++){
       countAllPrice+=Number(that.data.cartList[i].cartItem.productItem.price*that.data.cartList[i].cartItem.quantity)
 
    }
    return countAllPrice.toFixed(2)
   },
   subimt:function(){
     let that = this;
   
         if(that.data.method=='ON_THE_SPOT'){
            let access_token =wx.getStorageSync('access_token')
            app.globalData.checkToken(access_token,that.requestDineOrderSubmit,app.globalData.refreshToken)  //修改之前代码加入callback来进行数据请求
         }else if(that.data.method=='TAKE_OUT'){
          if(that.data.receiver){
            let access_token =wx.getStorageSync('access_token')
            app.globalData.checkToken(access_token,that.requestTakeWayOrderSubmit,app.globalData.refreshToken)  
         }else{
          wx.showToast({
            title:'请先添加地址',
            icon:'none',
            duration:1500,
            mask:true
          })
         }
     }
   },
   requestTakeWayOrderSubmit:function(access_token){
    let that = this;
    let arr=[]
    for(let i=0;i<that.data.cartList.length;i++){
       let obj={}
        obj.productItemId=that.data.cartList[i].cartItem.productItem.id
        obj.quantity=that.data.cartList[i].cartItem.quantity
        obj.price=that.data.cartList[i].cartItem.productItem.price
        console.log(obj)
        arr.push(obj)
        
    }
    wx.request({
      url: app.globalData.URL+'app/order/insertTakeOutOrder',
      data: {tenantId:1,
        consignee:that.data.receiver.consignee,
        phone:that.data.receiver.phone,
        area:that.data.receiver.area,
        address:that.data.receiver.address,
        deliveryDate:that.data.date+' '+that.data.dateTime,
        items:arr,
        amount:that.data.allPrice,
        diners:that.data.choicePeople,
        notes:that.data.note,
        shopId:that.data.shopId,
        taste:that.data.taste,
        type:that.data.method
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header:{'content-type': 'application/json',"Authorization":"Bearer "+access_token},
      success: function(res){
        // success
        console.log(res)
        if(res.data.status=='OK'){
             //此时请求成功
             wx.showToast({
              title:'订单生成',
              icon:'none',
              duration:2000,
              mask:true
            })
            setTimeout(()=>{
              wx.navigateTo({
                url: '/pages/orderFinish/index?orderId='+res.data.data.order.id,
              })
            },2000)
        }
      }
    })
   },
   requestDineOrderSubmit:function(access_token){
    let that = this;
    let arr=[]
    for(let i=0;i<that.data.cartList.length;i++){
       let obj={}
        obj.productItemId=that.data.cartList[i].cartItem.productItem.id
        obj.quantity=that.data.cartList[i].cartItem.quantity
        obj.price=that.data.cartList[i].cartItem.productItem.price
        console.log(obj)
        arr.push(obj)
        
    }
    wx.request({
      url: app.globalData.URL+'app/order/insertOnTheSpotOrder',
      data: {tenantId:1,
        // consignee:that.data.receiver.consignee,
        // phone:that.data.receiver.phone,
        // area:that.data.receiver.area,
        // address:that.data.receiver.address,
        // deliveryDate:that.data.date+' '+that.data.dateTime,
        items:arr,
        amount:that.data.allPrice,
        diners:that.data.choicePeople,
        notes:that.data.note,
        shopId:that.data.shopId,
        taste:that.data.taste,
        type:that.data.method
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header:{'content-type': 'application/json',"Authorization":"Bearer "+access_token},
      success: function(res){
        // success
        console.log(res)
        if(res.data.status=='OK'){
             //此时请求成功
             wx.showToast({
              title:'订单生成',
              icon:'none',
              duration:2000,
              mask:true
            })
            setTimeout(()=>{
              wx.navigateTo({
                url: '/pages/orderFinsh/index?orderId='+res.data.data.order.id,
              })
            },2000)
        }
      }
    })
   },
   requestChangeAddress:function(access_token){
    let that =this;
     wx.request({
       url: 'https://www.whxnjs.com.cn/m/app/member/selectReceiver?tenantId=1&receiverId='+that.data.orderUserAddressId,
       
       method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
       header:{'content-type': 'application/json',"Authorization":"Bearer "+access_token},
       success: function(res){
         // success
          console.log(res)
          if(res.data.status=='OK'){
              if(res.data.data.receiver){
                   res.data.data.receiver.area=res.data.data.receiver.area.replace(/,/g,'')
                    that.setData({
                      receiver:res.data.data.receiver
                    })
              }
          }
       },
       fail:function(err){
        wx.showToast({
          title:'服务开小差了',
          icon:'none'
        })
         throw err
    }
     })
  },

})