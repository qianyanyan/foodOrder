// pages/newAddress/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
     region: ['北京市', '北京市', '东城区'],
     name:'',
     phone:'',
     address:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let method =''
    let addressId=''
   if(options.method=='new'){
       //此时为新增地址
       method=options.method
    }else  if(options.method=='change'){
         //此时为修改地址,可以删除地址
         method=options.method;
         addressId = options.addressId
          let access_token =wx.getStorageSync('access_token')
          app.globalData.checkToken(access_token,that.requestChangeAddress,app.globalData.refreshToken)  //修改之前代码加入callback来进行数据请求
    }
    that.setData({
      method:method,
      addressId:addressId
    })
  
  },
  requestChangeAddress:function(access_token){
    let that =this;
     wx.request({
       url: 'https://www.whxnjs.com.cn/m/app/member/selectReceiver?tenantId=1&receiverId='+that.data.addressId,
       
       method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
       header:{'content-type': 'application/json',"Authorization":"Bearer "+access_token},
       success: function(res){
         // success
          console.log(res)
          if(res.data.status=='OK'){
              if(res.data.data.receiver){
                  res.data.data.receiver.area = res.data.data.receiver.area.split(',')
                  console.log(res.data.data.receiver)
                  that.setData({
                    region: res.data.data.receiver.area,
                    name:res.data.data.receiver.consignee,
                    phone:res.data.data.receiver.phone,
                    address:res.data.data.receiver.address
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
  nameInput:function(e){
   let that = this;
   that.setData({
     name:e.detail.value
   })
  },
  phoneInput:function(e){
    let that = this;
    that.setData({
      phone:e.detail.value
    })
   },
  addressInput:function(e){
    let that = this;
    that.setData({
      address:e.detail.value
    })
   },
   bindRegionChange:function(e){
    let that = this;
    that.setData({
      region:e.detail.value
    })
   },
  addAddress:function(){
    let that = this;
    let getDefault=false;
    wx.showModal({
      title:'提示',
      content:'是否将该地址设为默认地址',
      success:function(res){
        if(res.confirm){
          getDefault=true;
          that.setData({
            getDefault:getDefault
          })
          let access_token =wx.getStorageSync('access_token')
          app.globalData.checkToken(access_token,that.requestAddAddress,app.globalData.refreshToken)  //修改之前代码加入callback来进行数据请求
        }else if(res.cancel){
          getDefault=false
          that.setData({
            getDefault:getDefault
          })
          let access_token =wx.getStorageSync('access_token')
          app.globalData.checkToken(access_token,that.requestAddAddress,app.globalData.refreshToken)  //修改之前代码加入callback来进行数据请求
        }
      }
    })
    
  },
  requestAddAddress:function(access_token){
    let that = this;
   
    if(that.data.name!=''&& that.data.phone!='' && that.data.address!=''){
      let area=that.data.region.join(',')
       wx.request({
          url: 'https://www.whxnjs.com.cn/m/app/member/addReceiver',
          data: {tenantId:1,consignee:that.data.name,phone:that.data.phone,area:area,getDefault:that.data.getDefault,address:that.data.address,},
          method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          header:{'content-type': 'application/json',"Authorization":"Bearer "+access_token},
          success: function(res){
            // success
            console.log(res)
            if(res.data.status=='OK'){
                if(res.data.data.receivers){
                     wx.showToast({
                       title: '添加成功',
                       icon: 'none', // loading
                       duration: 1500,
                       mask: true
                     })
                     setTimeout(()=>{
                      wx.navigateBack({
                        delta:1
                      })
                     },1500)
                 }
            }else{
              wx.showToast({
                title: '添加失败',
                icon: 'none', // loading
                duration: 1500,
                mask: true
              })
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
    }else{
      wx.showToast({
        title: '请输入正确的信息',
        icon: 'none', // loading
        duration: 1500,
        mask: true
      })
     
    }
    
  },
  editAddress:function(){
    let that = this;
    let getDefault=false;
    wx.showModal({
      title:'提示',
      content:'是否将该地址设为默认地址',
      success:function(res){
        if(res.confirm){
          getDefault=true;
          that.setData({
            getDefault:getDefault
          })
          let access_token =wx.getStorageSync('access_token')
          app.globalData.checkToken(access_token,that.requestEditAddress,app.globalData.refreshToken)  //修改之前代码加入callback来进行数据请求
        }else if(res.cancel){
          getDefault=false
          that.setData({
            getDefault:getDefault
          })
          let access_token =wx.getStorageSync('access_token')
          app.globalData.checkToken(access_token,that.requestEditAddress,app.globalData.refreshToken)  //修改之前代码加入callback来进行数据请求
        }
      }
    })
  },
  requestEditAddress:function(access_token){
    let that = this;
    if(that.data.name!=''&& that.data.phone!='' && that.data.address!=''){
      let area=that.data.region.join(',')
       wx.request({
          url: 'https://www.whxnjs.com.cn/m/app/member/editReceiver',
          data: {tenantId:1,consignee:that.data.name,phone:that.data.phone,area:area,getDefault:that.data.getDefault,address:that.data.address,receiverId:that.data.addressId},
          method: 'PUT', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          header:{'content-type': 'application/json',"Authorization":"Bearer "+access_token},
          success: function(res){
            // success
            console.log(res)
            if(res.data.status=='OK'){
                if(res.data.data.receivers){
                     wx.showToast({
                       title: '修改成功',
                       icon: 'none', // loading
                       duration: 1500,
                       mask: true
                     })
                     setTimeout(()=>{
                      wx.navigateBack({
                        delta:1
                      })
                     },1500)
                 }
            }else{
              wx.showToast({
                title: '修改失败',
                icon: 'none', // loading
                duration: 1500,
                mask: true
              })
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
    }else{
      wx.showToast({
        title: '请输入正确的信息',
        icon: 'none', // loading
        duration: 1500,
        mask: true
      })
    }
  },
  deletAddress:function(){
    let that = this;
    let access_token =wx.getStorageSync('access_token')
    app.globalData.checkToken(access_token,that.requestDeletAddress,app.globalData.refreshToken)  //修改之前代码加入callback来进行数据请求
  },
  requestDeletAddress:function(access_token){
    let that = this
    wx.request({
      url: 'https://www.whxnjs.com.cn/m/app/member/deleteReceiver?tenantId=1&receiverId='+that.data.addressId,
     
      method: 'DELETE', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header:{'content-type': 'application/json',"Authorization":"Bearer "+access_token},
      success: function(res){
       if(res.data.status=='OK'){
            if(res.data.data.receivers){
                 wx.showToast({
                   title: '删除成功',
                   icon: 'none', // loading
                   duration: 1500,
                   mask: true
                 })
                 setTimeout(()=>{
                  wx.navigateBack({
                    delta:1
                  })
                 },1500)
             }
        }else{
          wx.showToast({
            title: '删除失败',
            icon: 'none', // loading
            duration: 1500,
            mask: true
          })
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
  }
})