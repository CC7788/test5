import wepy from 'wepy'
export default class extends wepy.mixin {
  config = {

  }

  data = {
    goods_id: 0,
    goodsInfo: {},
    address: null
  }

  methods = {
    imgPreview(current) {
      wepy.previewImage({
        current: current,
        urls: this.goodsInfo.pics.map(x=>x.pics_big)
      })
    },

    async goAddess () {
      var res = await wepy.chooseAddress().catch(err=>err)
      console.log(res)
      if(res.errMsg !== 'chooseAddress:ok'){
        return wepy.baseToast('获取数据失败')
      }

      this.address = res
      wepy.setStorageSync('address',res)
      this.$apply()
    },

    // 添加到购物车
    addToCar () {
      this.$parent.addToCarts(this.goodsInfo)
      wepy.showToast({
        title: '已添加到购物车',
        icon: 'success'
      })
    }
  }

  onLoad (o) {
    console.log(o)
    this.goods_id = o.goods_id
    this.getGoodsInfo()
  }

  computed = {
    addressStr () {
      if(this.address == null) {
        return '请选择收获地址'
      }
      return this.address.provinceName+this.address.cityName+this.address.countyName
    },
    total () {
      return this.$parent.globalData.total
    }
  }

  async getGoodsInfo() {
    var {data: res} = await wepy.get('/goods/detail',{
      goods_id: this.goods_id
    })
    if( res.meta.status !== 200 ) {
      return wepy.baseToast()
    }
    this.goodsInfo = res.message
    this.$apply()
  }
}
