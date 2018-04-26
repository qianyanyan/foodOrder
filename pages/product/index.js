// pages/product/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      productActiveId:0,//此时先默认写一个
      productList:[],
      scollHeight:0,
      spName:"",
      cartList:[],
      maskShow:false,
      cartItemShow:false,
      canBuyBtn:true,
      size:10, //一次最多加载10个
      p:1,
      allPrice:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     //获取设备的高度
     console.log(options)
     let method=''
     if(options.method=='takeWay'){
         method ='TAKE_OUT'
     }else{
         method ='ON_THE_SPOT'
     }
     let that = this
      wx.getSystemInfo({
        success:function(res){
          that.setData({
            scollHeight:res.windowHeight-85-80 ,  //其中85为顶部商铺信息的高度，65为底部购物车的高度
            shopId:options.shopid,
            method:method
          })
        }
      })
      let refresh_token = wx.getStorageSync('refresh_token')
      let access_token =wx.getStorageSync('access_token')
       app.globalData.checkToken(access_token,that.requestShopMsg,app.globalData.refreshToken)  //修改之前代码加入callback来进行数据请求
       //app.globalData.checkToken(access_token,that.requestShopProduct,app.globalData.refreshToken)  //修改之前代码加入callback来进行数据请求
    //   app.globalData.checkToken(access_token,that.requestShopCart,app.globalData.refreshToken)  //修改之前代码加入callback来进行数据请求
},
  requestShopMsg:function(access_token){
    let that = this
    //取得商铺信息
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
       url:'http://192.168.2.54:8082/api/app/product/list?shopId='+that.data.shopId+'&tenantId=1&type='+that.data.method,
       method:"GET",
       header:{'content-type': 'application/json',"Authorization":"Bearer"+access_token},
       success:function(res){
        wx.hideLoading()
        
         if(res.data.status=='OK'){
           if(res.data.data.productCategories){
             let productList = [];
            for(let j=0;j<res.data.data.productList.length;j++){
              for(let i=0;i<res.data.data.productCategories.length;i++){
                res.data.data.productCategories[i].active=false;
                res.data.data.productCategories[0].active=true;
                if(res.data.data.productCategories[i].active==true){
                  for(let k=0;k<res.data.data.productList[j].productCategories.length;k++){
                    if(res.data.data.productList[j].productCategories[k].id==res.data.data.productCategories[i].key){
                         res.data.data.productList[j].buyNum=0
                         productList.push(res.data.data.productList[j])
                     }
                  }
                   
                }
          }
            }
           that.setData({
                  shop:res.data.data.shop,
                  productCategories:res.data.data.productCategories,
                  productList:res.data.data.productList,
                  cartItems:res.data.data.cartItems,
                  shopProductList:productList
              })
           }
         }
        },
       fail:function(err){
          wx.hideLoading()
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
  productNameActive:function(e){
    let that = this;
    let obj= that.getShowProductList(e.target.dataset.id)
     console.log(obj)
     that.setData({
       productCategories:obj.productCategories,
       shopProductList:obj.productList
     })
  },
  getShowProductList:function(id){
    /**
     * 展示某一个分类下面的商品
     */
    let that = this;
    let obj={
      productList:[],
      productCategories:[]
    };
    let productCategories = that.data.productCategories
    for(let i=0;i<productCategories.length;i++){
         productCategories[i].active=false
       if(productCategories[i].key==id){
          productCategories[i].active=true;
        }
    }

    obj.productCategories=productCategories
    for(let j=0;j<that.data.productList.length;j++){
          for(let k=0;k<that.data.productList[j].productCategories.length;k++){
               if(that.data.productList[j].productCategories[k].id==id){
                    that.data.productList[j].buyNum=0
                    obj.productList.push(that.data.productList[j])
               }
          }
    }
    
    return obj
  },
  /**
   * 步进器的加号
   * 先判断当前的商品有没有规格
   * 如果没有规格则直接添加到购物车
   * 如果有规格则先要展示规格，选择完毕之后在进行添加到购物车
   */
  stepperAdd:function(e){
    let that = this;
    that.setData({
      stepperAddId:e.target.dataset.id
    })
    
    let access_token =wx.getStorageSync('access_token')
    app.globalData.checkToken(access_token,that.requestStepperAdd,app.globalData.refreshToken)  //修改之前代码加入callback来进行数据请求
  },
  requestStepperAdd:function(access_token){
    let that= this;
    wx.request({
      url:  app.globalData.URL+'app/product/listProductItems?productId='+that.data.stepperAddId,
      header:{'content-type': 'application/json',"Authorization":"Bearer "+access_token},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        let spName=''
        if(res.data.status=='OK'){
          if(res.data.data.productSpec.length!=0){  //此时商品是有规格的
            for(let i=0;i<res.data.data.productSpec.length;i++){
              for(let j=0;j<res.data.data.productSpec[i].specificationValues.length;j++){
                    res.data.data.productSpec[i].specificationValues[0].active=true
               }
              }
              for(let i=0;i<res.data.data.productSpec.length;i++){
                for(let j=0;j<res.data.data.productSpec[i].specificationValues.length;j++){
                      if(res.data.data.productSpec[i].specificationValues[j].active==true){
                          spName+= res.data.data.productSpec[i].specificationValues[j].name
                      }
                   }
                }
                that.setData({
                productSp:res.data.data.productSpec,
                maskShow:true,
                spName:spName,
                spPrice:res.data.data.productItem.price,
                spProductId:res.data.data.productItem.id,
                productSpId:res.data.data.productItem.product.id
              })
          }else{
             //此时没有规格直接添加到购物车
             let obj = {
              cartProductItemId:res.data.data.productItem.id,
              cartProdcutName:res.data.data.productItem.product.name,
              cartProductId:res.data.data.productItem.product.id,
              cartProductSp:res.data.data.productItem.product.standard,
              cartProductPrice:res.data.data.productItem.product.price
             }
          }
          
        }
      }
    })
  },
  getCartProduct:function(){

  },
    /**
   * 步进器的减号
   * 先判断当前的商品有没有规格
   * 如果没有规格则直接购物车商品减去
   * 如果有规格则需要弹窗让其到购物车自己去删除
   */
  stepperLess:function(e){
    let that = this;
    that.setData({
      stepperLessId:e.target.dataset.id
    })
    let access_token =wx.getStorageSync('access_token')
    app.globalData.checkToken(access_token,that.requestStepperLess,app.globalData.refreshToken)  //修改之前代码加入callback来进行数据请求
  },
  requestStepperLess:function(access_token){
    let that = this;
    wx.request({
      url:  app.globalData.URL+'app/product/listProductItems?productId='+that.data.stepperLessId,
      header:{'content-type': 'application/json',"Authorization":"Bearer "+access_token},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        let spName=''
        if(res.data.status=='OK'){
          if(res.data.data.productSpec.length!=0){  //此时商品是有规格的,需要去购物车删除
              wx.showToast({
                title: '需要到购物车进行删除商品',
                icon: 'none', // loading
                duration: 1500,
                mask: true
              })
          }else{
            
          }
          
        }
      }
    })
  },
  //这个方法一定是建立在有当前的规格并且规格弹出
  choiceSp:function(e){
    let that = this;
    let activeSP=[];
    if(that.data.productSp){
      console.log(that.data.productSp)
       for(let i=0;i<that.data.productSp.length;i++){
             for(let j=0;j<that.data.productSp[i].specificationValues.length;j++){
              if(that.data.productSp[i].specification.id==e.target.dataset.parentid){
                 that.data.productSp[i].specificationValues[j].active=false
                 if(that.data.productSp[i].specificationValues[j].id==e.target.dataset.id){
                    that.data.productSp[i].specificationValues[j].active=true
                 }
              }
             }
       }
      
       for(let i=0;i<that.data.productSp.length;i++){
        for(let j=0;j<that.data.productSp[i].specificationValues.length;j++){
                 if(that.data.productSp[i].specificationValues[j].active==true){
                      activeSP.push(that.data.productSp[i].specificationValues[j].id)
                 }
        }
     }
     that.setData({
      requsetActiveSP:activeSP
    })
      let access_token =wx.getStorageSync('access_token')
      app.globalData.checkToken(access_token,that.requestActiveSp,app.globalData.refreshToken)  //修改之前代码加入callback来进行数据请求 
    }
   
  },
  requestActiveSp:function(access_token){
    let that = this;
    wx.request({
      url:  app.globalData.URL+'app/product/queryProductItem?specValueIds='+that.data.requsetActiveSP+'&productId='+that.data.productSpId,
      header:{'content-type': 'application/json',"Authorization":"Bearer "+access_token},
      
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        // success
        if(res.data.status=='OK'){
                let spName='';
                 for(let i=0;i<that.data.productSp.length;i++){
                   for(let j=0;j<that.data.productSp[i].specificationValues.length;j++){
                           if(that.data.productSp[i].specificationValues[j].active==true){
                                spName+=that.data.productSp[i].specificationValues[j].name
                           }
                   }
               }
                that.setData({
                 spPrice:res.data.data.productItem.price,
                 spName:spName,
                 productSp:that.data.productSp,
                 spProductId:res.data.data.productItem.id
                })
         }else{
           wx.showToast({
             title:'网络请求失败了,请重试!',
             icon:'none',
             mask:true
            })
         }
      },
      fail:function(err){
              console.log(err)
              wx.showToast({
               title:'网络请求失败了,请重试!',
               icon:'none',
               mask:true
              })
      }
    })
  },
  addCart:function(e){
       let that = this;
       that.setData({
         spProductId:e.target.dataset.id
       })
      
   
  },
  requestAddCart:function(access_token){
    let that = this;
  
  },
  //计算当前的cartItem的选中的规格
  choiceSP:function(){
    let that = this;
      for(let j=0;j<that.data.cartItem.length;j++){
        if(that.data.cartItem[j].sp){
          that.data.cartItem[j].chooiceSp=''
            for(let k=0;k<that.data.cartItem[j].sp.length;k++){
                  for(let i=0;i<that.data.cartItem[j].sp[k].data.length;i++){
                         if(that.data.cartItem[j].sp[k].data[i].active==true){
                            
                               //此时找到了选中的规格
                            that.data.cartItem[j].chooiceSp +=that.data.cartItem[j].sp[k].data[i].sP
                         }
                  }      
            }
        }
    }
    return that.data.cartItem
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
  hideMask:function(){
    let that = this;
    that.setData({
      productSp:null,
      maskShow:false,
      cartItemShow:false,
    })
  },
  showCartItm:function(){
    let that = this;
    that.setData({
      cartItemShow:true,
      maskShow:true,
      productSp:null,
    })
  },
 
  //购物车结算
  goCartDetail:function(){
    let that = this;
    if(that.data.cartList.length==0){
      wx.showToast({
        title:'请选择商品',
        icon:'loading',
        duration:2000,
        mask:true
      })
      return 
    }
  
    wx.navigateTo({
      url:"/pages/cartDetail/index?shopId="+that.data.shopId+'&method='+that.data.method,
     
    })
  },
  moreProduct:function(e){
    let that= this;
    let p=1;
    // console.log()
  //  let height=0; //初始化当前的元素高度
    wx.createSelectorQuery().selectAll('.product').boundingClientRect(function(rects){
      rects.forEach(function(rect){
        // rect.id      // 节点的ID
        // rect.dataset // 节点的dataset
        // rect.left    // 节点的左边界坐标
        // rect.right   // 节点的右边界坐标
        // rect.top     // 节点的上边界坐标
        // rect.bottom  // 节点的下边界坐标
        // rect.width   // 节点的宽度
        // rect.height  // 节点的高度
      that.setData({
        height:rect.height
      })
      })
    }).exec()
    //console.log(that.data.height)
    let pageSize = Math.ceil(that.data.scollHeight/that.data.height)//当前滚动的容器里面能展示几个商品 向上取整
    console.log(pageSize)
    if(pageSize!=NaN){
        if(e.detail.scrollTop>((10-pageSize)*that.data.height)*p){ //判断当前的页面滚动以及每一页滚动的高度
               //取数据
                wx.showLoading({
                  title: '加载中',
                })
                wx.request({
                  url: app.globalData.URL+'app/product/list?p='+(that.data.p+p)+'&size='+that.data.size+'&categoryId='+that.data.productActiveId,
                  method:'GET',
                  header:{'content-type': 'application/json',"Authorization":"Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsic3ByaW5nLWJvb3QtYXBwbGljYXRpb24iXSwic2NvcGUiOlsicmVhZCJdLCJqdGkiOiIzYzdlNTMxYy04OWZlLTRmYjctYTkxMS1lOWNiZTZhZmM1ZjAiLCJjbGllbnRfaWQiOiJhcGkifQ.Hscgj0DzQACanASNOkby6cQrLt21lPVe-W9NLoQFisMOTX-8FLEiAC55nmpOJrf4wALJSEi0JgIKKA70lq45xC57pLT1_uc6DDBRD0sZOFcH68ggIqKrB6ehX6H8mElKLXY8Fs-fgJOuFyIN6ZB_E6ZG-S_Cq2fVEzLBk8VVpN4"},
                  success:function(res){
                    wx.hideLoading()
                    console.log(res)
                    if(res.data.status=="OK"){
                      for(let i=0;i<res.data.data.productList.length;i++){
                          res.data.data.productList[i].buyNum=0;
                      }
                     that.data.productList.productList(res.data.data.productList)
                      that.setData({
                            productList:that.data.productList
                            
                      })
                      p++
                    }
                    
                  },
                  fail:function(err){
                    wx.hideLoading()
                    throw err
                  }
                })
        }
    }
  },
  clearCart:function(){
    let that = this;
    
   },
  
 cartStepperAdd:function(e){
   let that = this;
   that.setData({
     cartStepperAddId:e.target.dataset.id,
     cartStepperAddProductId:e.target.dataset.productid
   })
  }, 
 cartStepperLess:function(e){
  let that = this;
  that.setData({
    cartStepperLessId:e.target.dataset.id,
    cartStepperLessProductId:e.target.dataset.productid
  })
  
},

})