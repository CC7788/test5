import wepy from 'wepy'
export default class extends wepy.mixin {
  data = {
    active:0,
    allOrderList: [],
    waitOrdetList: [],
    finishOrderList: []
  }

  methods = {
    onTbasChange (e) {
      console.log(e)
      this.active = e.detail.index
      this.getOrderList(this.active+1)
    }
  }

  onLoad () {
    //  传递1 代表获取所有数据
    this.getOrderList(1)
  }

  async getOrderList (index) {
    var {data:res} = await wepy.get('/my/orders/all',{
      type:index
    })
    console.log(res)
    if(res.meta.status !== 200) {
      return wepy.baseToast('获取订单数据失败')
    }
    res.message.orders.forEach(item=>{
      item.order_detail = JSON.parse(item.order_detail)
    })
    if(index == 1){
      console.log(res.message.orders)
      this.allOrderList = res.message.orders
    }else if(index ==2 ){
      this.waitOrdetList = res.message.orders
    }else{
      this.finishOrderList = res.message.orders
    }
    this.$apply()
  }
}
