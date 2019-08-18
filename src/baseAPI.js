import wepy from 'wepy'
// 设置请求接口的根域名
const baseURL = 'https://api.zbztb.cn/api/public/v1'

/**
 * 封装全局通用的toast提示 
 */
 wepy.baseToast = function (tit='获取数据失败') {
  wepy.showToast({
    title: tit,
    icon: 'none',
    duration: 2000
  })
 }

 /**
  * 封装get请求
  * 传递url参数的时候需要以 / 开头
  */

wepy.get = function (url,data={}) {
  return wepy.request({
    url: baseURL+url,
    method: 'GET',
    data
  });
}

 /**
  * 封装post请求
  * 传递url参数的时候需要以 / 开头
  */

 wepy.post = function (url,data={}) {
  return wepy.request({
    url: baseURL+url,
    method: 'POST',
    data
  });
}