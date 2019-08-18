import wepy from 'wepy'
export default class extends wepy.mixin {
  config = {

  }

  data = {
    value: '',
    searchList: [],
    historyList: []
  }

  methods = {
    // 搜索的时候触发
    onSearch (e) {
      if(this.value.trim().length==0){
        return
      }

      if(this.historyList.indexOf(this.value)==-1){
        this.historyList.unshift(this.value)
      }
      this.historyList = this.historyList.slice(0,10)
      wepy.setStorageSync('historyList',this.historyList)
      wepy.navigateTo({
        url:'/pages/goods_list?query='+this.value
      })
    },
    // 取消搜索时触发
    onCancel () {

    },

    // 当输入框发生变化时触发
    onChange (e) {
      this.value = e.detail
      if(this.value.trim().length ==0 ){
        this.searchList = []
        return 
      }
      this.getSearchsList()
    },

    // 点击商品搜索结果进入商品详情
    goGoodsDetail (id) {
      wepy.navigateTo({
        url:'/pages/goods_detail/main?goods_id='+id
      })
    },

    // 点击tag标签进入商品列表页面
    goGoodsList (query) {
      wepy.navigateTo({
        url:'/pages/goods_list?query='+query
      })
    },

    // 删除搜索历史
    delHistory () {
      this.historyList = []
      wepy.setStorageSync('historyList',this.historyList)
    }

  }

  computed = {
    isShowHistory () {
      // 如果value==0代表输入框为空  此时没有搜索显示搜索历史
      if(this.value.length==0){
        return true
      }
      return false

    }
  }
  // 通过输入框的值获取搜索结果
  async getSearchsList() {
    var {data: res} = await wepy.get('/goods/qsearch?query='+this.value)
    if( res.meta.status !== 200 ) {
      return wepy.baseToast()
    }
    this.searchList = res.message
    this.$apply()
  }

  onLoad () {
    var historyList = wx.getStorageSync('historyList') || []
    this.historyList = historyList
    console.log(historyList)
  }
}
