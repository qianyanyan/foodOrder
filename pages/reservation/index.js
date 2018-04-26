// pages/reservation/index.js
const app = getApp()
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
     dateTime:"12:01"
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
       shopId:options.shopid
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
  peoplePickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let choicePeople=''
    for(let i=0;i<that.data.people.length;i++){
      if(i==e.detail.value){
         choicePeople=prople[i]
      }
    }
    this.setData({
      peopleindex: e.detail.value,
      choicePeople:choicePeople
    })
  },
 datePickerChange: function(e) { 
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  timePickerChange:function(e){
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        dateTime: e.detail.value
      })
  },
  /**
   * 选中性别
   * 获取当前点击的图片对象
   * 将所有的图片替换为未选中图片
   * 替换选中图片
   */
  choiceSex:function(e){
    let that = this
    let sex = ''
      for(let i=0;i<that.data.sex.length;i++){
                 that.data.sex[i].img='http://zwhtubiaoku.oss-cn-beijing.aliyuncs.com/icon/noChoice.png'
                 that.data.sex[i].checked=false
                 if(that.data.sex[i].sex==e.target.dataset.sex){
                  that.data.sex[i].img='http://zwhtubiaoku.oss-cn-beijing.aliyuncs.com/icon/choice.png',
                  that.data.sex[i].checked=true
                  sex = that.data.sex[i].cnSex
                 }
    
  }
  that.setData({
    sex:that.data.sex,
    cnSex:sex
  })
},
nameInputChange:function(e){
     let that = this
     that.setData({
      nameValue:e.detail.value
    })
},
mobileInputChange:function(e){
  let that = this
  that.setData({
    mobileValue:e.detail.value
  })
},
addressInputChange:function(e){
  let that = this
  that.setData({
    addressValue:e.detail.value
  })
},
reservationSubmit:function(){
  let that = this
  if(that.data.nameValue!=undefined && that.data.cnSex!=undefined && that.data.addressValue!=undefined && that.data.mobileValue!=undefined ){
    wx.showLoading({
      title: '加载中',
    })
    let access_token =wx.getStorageSync('access_token')
          let refresh_token = wx.getStorageSync('refresh_token')
          app.globalData.checkToken(access_token,refresh_token)
          let access_tokens =wx.getStorageSync('access_token')
    let time = that.data.date+'-'+that.data.dateTime
    wx.request({
    url: `${app.globalData.URL}app/appointment/save`,
    method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    dataType:'json',
    data:{name:that.data.nameValue,sex:that.data.cnSex,address:that.data.addressValue,tel:that.data.mobileValue,peopleNum:that.data.choicePeople,appointmentDate:time,tenantId:1,shopId:that.data.shopId,memberId:app.globalData.member.data.member.id},
    header:{'content-type': 'application/json',"Authorization":"Bearer "+access_tokens},
    success: function(res){
      wx.hideLoading()
       console.log(res)
       if(res.data.status=='OK'){
        if(res.data.data){
            //此时预定成功
            wx.showToast({
              title: '预定成功',
              icon: 'success', // loading
              duration: 1500,
              mask: true
            })
            setTimeout(()=>{
              wx.navigateTo({
                url: '/pages/mineReservation/index',
              })
            },1500)
        }
       }else{
        wx.showToast({
          title: '预定失败,请重试',
          icon: 'none', // loading
          duration: 1500,
          mask: true
        })
       }
    }
})
}else{
  wx.showToast({
    title: '请填写预定信息',
    icon: 'none', // loading
    duration: 1500,
    mask: true
  })
}
}
})