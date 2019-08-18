import wepy from 'wepy'
export default class extends wepy.mixin {
  config = {};

  data = {
    swiperList: [],
    cateList: [],
    floorList: []
  };

  methods = {
    goGoodsList (url) {
      wepy.navigateTo({
        url:url
      })
    }
  };

  async getSwiperList() {
    var {data: res} = await wepy.get('/home/swiperdata')
    if( res.meta.status !== 200 ) {
      return wepy.baseToast()
    }
    this.swiperList = res.message
    this.$apply()
  }

  async getCateList() {
    var {data: res} = await wepy.get('/home/catitems')
    if( res.meta.status !== 200 ) {
      return wepy.baseToast()
    }
    this.cateList = res.message
    this.$apply()
  }

  async getFloorList() {
    var {data: res} = await wepy.get('/home/floordata')
    if( res.meta.status !== 200 ) {
      return wepy.baseToast()
    }
    this.floorList = res.message
    this.$apply()
  }

  onLoad() {
    this.getSwiperList();
    this.getCateList()
    this.getFloorList()
  }
}

