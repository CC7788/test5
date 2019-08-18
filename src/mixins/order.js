import wepy from 'wepy'
export default class extends wepy.mixin {
  data = {
    addressInfo: null,
    carts: [],
    isLogin:false
  }

  methods = {
    async chooseAddress () {
      var res = await wepy.chooseAddress().catch(err=>err)
      if(res.errMsg == 'chooseAddress:fail cancel'){
        return wepy.baseToast('取消了选择收货地址')
      }
      wepy.baseToast('选择收货地址成功')
      wepy.setStorageSync('address', res)
    },
    async getuser (userInfo) {
      // 获取用户信息
      if(userInfo.detail.errMsg !== 'getUserInfo:ok'){
        return wepy.baseToast('获取用户信息失败')
      }
      console.log(userInfo)
      // 获取登陆凭证 code
      var loginRes = await wepy.login()
      
      if(loginRes.errMsg !== 'login:ok'){
        return wepy.baseToast('获取用户信息失败')
      }
      console.log(loginRes)
      // 准备登录接口的参数
      const loginParams = {
        code: loginRes.code,
        encryptedData: userInfo.detail.encryptedData,
        iv: userInfo.detail.iv,
        rawData: userInfo.detail.rawData,
        signature: userInfo.detail.signature
      }
      console.log(loginParams)
      var {data: loginSuccessRes} =  await wepy.post('/users/wxlogin',loginParams)
      
      if(loginSuccessRes.meta.status !==200 ){
        return wepy.baseToast('登录失败，请重新登陆!')
      }
      wepy.baseToast('登录成功')
      wepy.setStorageSync('token',loginSuccessRes.message.token)
      this.isLogin = true 
      this.$apply()
      console.log(loginSuccessRes)
    },

    async onSubmit () {
      if(this.total <= 0){
        return wepy.baseToast('请去选择商品购买')
      }
      if(this.addressInfo == null) {
        return wepy.baseToast('请选择收货地址')
      }
      // 创建订单
      const goods = this.carts.map(item=>{
        return {
          goods_id: item.id,
          goods_number: item.count,
          goods_price: item.price
        }
      })
      const createOrderParams = {
        order_price: '0.01',
        consignee_addr: this.addressStr,
        order_detail: JSON.stringify(this.carts),
        goods
      }
      var {data: createRes} = await wepy.post('/my/orders/create',createOrderParams)
      
      if(createRes.meta.status !==200 ) {
        return wepy.baseToast('创建订单失败')
      }
      console.log(createRes)
      // 生成预支付订单
      var { data: payOrderRes } = await wepy.post('/my/orders/req_unifiedorder',{
        order_number:createRes.message.order_number
      })
      if(payOrderRes.meta.status !== 200){
        return wepy.baseToast('生成订单失败')
      }
      console.log(payOrderRes)
      // 调用支付
      var payRes = await wepy.requestPayment(payOrderRes.message.pay).catch(err=>err)
      console.log(payRes)
      if(payRes.errMsg == 'requestPayment:fail cancel'){
        return wepy.baseToast('您已取消支付')
      }
      // 订单状态查询
      var {data:statusRes} = await wepy.post('/my/orders/chkOrder',{
        order_number:createRes.message.order_number
      })
      console.log(statusRes)
      if(statusRes.meta.status !== 200){
        return wepy.baseToast('支付失败')
      }
      wepy.showToast({
        title:'支付成功'
      })
      wepy.navigateTo({
        url:'/pages/orderlist'
      })
    }
  }

  onShow () {
    this.addressInfo = wepy.getStorageSync('address') || null
  }
  onLoad () {
    this.carts = this.$parent.globalData.cart.filter(item=>{
      return item.icCheck
    })
  }
  computed = {
    isChooseAddress () {
      if(this.addressInfo==null){
        return true
      }
      return false
    },
    addressStr () {
      if(this.addressInfo==null){
        return ''
      }
      return this.addressInfo.provinceName+this.addressInfo.cityName+this.addressInfo.countyName
    },

    total () {
      var total = 0
      this.carts.forEach(item=>{
        total+=item.price*item.count
      })
      return total*100
    }
  } 
}
