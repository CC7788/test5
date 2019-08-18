import wepy from 'wepy'
export default class extends wepy.mixin {
  data = {
    cart: []
  }

  methods = {
    onChangeStepper (e) {
      const id = e.target.dataset.id
      const count = e.detail
      this.$parent.updateCount(id,count)
    },

    statusChange (e) {
      const status = e.detail
      const id = e.target.dataset.id 
      this.$parent.updateIsCheck(id,status)
    },

    removeCart (id) {
      console.log(id)
      this.$parent.removeGlobalCart(id)
    },

    onFullChange (e) {
      console.log(e.detail)
      this.$parent.isFull(e.detail)
    },

    // 提交订单
    onClickButton () {
      if(this.amount<=0){
        return wepy.baseToast('请选择要购买的商品')
      }
      wepy.navigateTo({
        url:'/pages/order'
      })
    }
  }

  onShow () {
    this.cart = this.$parent.globalData.cart
    this.$parent.renderGoodsCount()
  }

  computed = {
    isShowEmpty () {
      if(this.cart.length == 0){
        return true
      }
      return false
    },
    amount () {
      var total = 0
      this.cart.forEach(item=>{
        if(item.icCheck){
          total+=item.price*item.count
        }
      })
      return total*100
    },
    isFull () {
      return this.cart.every(item=>item.icCheck)
    }
  }
}