import wepy from 'wepy'
export default class extends wepy.mixin {
  data = {
    query: '',
    cid: '',
    pagenum: 1,
    pagesize: 10,
    goodsList: [],
    total: 0,
    endHidden: true,
    isLoading: false
  }

  methods = {
    goGoodsDetail (id) {
      wepy.navigateTo({
        url: '/pages/goods_detail/main?goods_id='+id
      })
    }
  }

  onLoad (o) {
    console.log(o)
    this.query = o.query || ''
    this.cid = o.cid || ''
    this.getGoodsList()
  }

  async getGoodsList (cb) {
    this.isLoading = true
    var {data: res} = await wepy.get('/goods/search',{
      query: this.query,
      cid: this.cid,
      pagenum: this.pagenum,
      pagesize: this.pagesize
    })
    if( res.meta.status !== 200 ) {
      return wepy.baseToast()
    }
    this.goodsList = [...this.goodsList,...res.message.goods]
    this.total = res.message.total
    this.isLoading = false
    cb && cb()
    this.$apply()
  }

  onReachBottom () {
    if(this.isLoading){
      return console.log('正在加载数据')
    }
    if(this.pagesize * this.pagenum >= this.total) {
      return this.endHidden = false
    }
    this.pagenum++
    this.getGoodsList()
  }

  onPullDownRefresh () {
    console.log('下拉了')
    this.pagenum = 1
    this.goodsList = []
    this.total = 0
    this.endHidden = true 
    this.isLoading = false
    this.getGoodsList(function(){
      wepy.stopPullDownRefresh()
    })
  }
}
