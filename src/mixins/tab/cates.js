import wepy from 'wepy'
export default class extends wepy.mixin {
  config = {

  }

  data = {
    catesList: [],
    active: 0,
    wh:0,
    secondData:[]
  }

  methods = {
    onChange (e) {
      this.secondData = this.catesList[e.detail].children
    },

    goGoodsList (cid) {
      console.log(cid)
      wepy.navigateTo({
        url:'/pages/goods_list?cid='+cid
      })
    }
  }

  async getCatesList() {
    var {data: res} = await wepy.get('/categories')
    if( res.meta.status !== 200 ) {
      return wepy.baseToast()
    }
    this.catesList = res.message
    this.secondData = this.catesList[0].children
    this.$apply()
  }

  async getWindowHeight () {
    var res = await wepy.getSystemInfo()
    console.log(res)
    if(res.errMsg == 'getSystemInfo:ok') {
      this.wh = res.windowHeight
    }
  }

  onLoad () {
    this.getWindowHeight()
    this.getCatesList()
  }
}
