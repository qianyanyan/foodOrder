// pages/getVip/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sex:[{"id":0,'sex':'man',"name":'先生','cnSex':'男','img':'http://zwhtubiaoku.oss-cn-beijing.aliyuncs.com/icon/noChoice.png','checked':false},{"id":0,'sex':'woman',"name":'女士','cnSex':'女','img':'http://zwhtubiaoku.oss-cn-beijing.aliyuncs.com/icon/noChoice.png','checked':false}],
    date:"",
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this; 
    let date = new Date()
    let time=date.getFullYear()+'-'+Number(date.getMonth())+1+'-'+date.getDate()
       that.setData({
       date:time,
       memberId:options.memberId
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
  datePickerChange: function(e) { 
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
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
nameInput:function(e){
  let that= this;
  that.setData({
    name:e.detail.value
  })
},
mobileInput:function(e){
  let that= this;
  that.setData({
    mobile:e.detail.value
  })
},
getVip:function(){
  let that = this;
  let refresh_token = wx.getStorageSync('refresh_token')
  let access_token =wx.getStorageSync('access_token')
  app.globalData.checkToken(access_token,that.requestGetVip,app.globalData.refreshToken)  //修改之前代码加入callback来进行数据请求
},
requestGetVip:function(access_token){
  let that = this;
  if(that.data.name==undefined || that.data.cnSex==undefined ||that.data.mobile==undefined){
   wx.showToast({
     title: '请填写会员卡信息',
     icon: 'none', // loading
     duration: 1500,
     mask: true
   })
  }else{
    wx.request({
      url: app.globalData.URL+'app/card/get_card',
      header:{'content-type': 'application/json',"Authorization":"Bearer "+access_token},
      data: {tenantId:1,memberId:that.data.memberId,memberName:that.data.name,sex:that.data.cnSex,tel:that.data.mobile,birthday:that.data.date},
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function(res){
        // success
        console.log(res)
        if(res.data.status=='OK'){
          wx.showModal({
            title:'提示',
            content:'领取会员卡成功,是否查看',
            success:function(res){
              if (res.confirm) {
               wx.navigateTo({
                 url: '/pages/mineVip/index',
               })
              } else if (res.cancel) {
                wx.navigateBack({
                  delta: 1, // 回退前 delta(默认为1) 页面
                })
              }
            }
           })
        }else{
          wx.showToast({
            title: '网络错误',
            icon: 'none', // loading
            duration: 1500,
            mask: true
          })
        }
      },
      fail:function(){
        wx.showToast({
          title: '网络错误',
          icon: 'none', // loading
          duration: 1500,
          mask: true
        })
      }
    })
  }
}
})