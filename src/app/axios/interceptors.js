/**
 * 拦截器
 */
import qs from 'qs'
import { Message } from 'element-ui'
import { typeTest } from '@/utils/obj-operation'
import router from '@/app/router/index'

function getErrText(data) {
  if (!data || !data.errMsg) {
    let language = localStorage.getItem('language') || 'zh'
    let mes
    if (language == 'zh') {
      mes = '网络异常'
    } else if (language == 'en') {
      mes = 'Network anomalies'
    }
    return mes
  }
  if (typeTest(data.errMsg, 'string')) {
    return data.errMsg
  }
  if (typeTest(data.errMsg, 'object')) {
    return data.errMsg
  }
  return null
}

function handleError(msg) {
  Message.warning(msg)
}

function requestInterceptor(config) {
  if (!config.data) {
    config.data = {}
  }
  if (
    config.method === 'post' &&
    config.headers['Content-Type'] !== 'application/json'
  ) {
    config.data = qs.stringify(config.data)
  }
  return config
}

function responseInterceptor(response) {
  let data = response.data
  // hack iframe 传过来的数据
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data)
    } catch (e) {
      data = {}
      console.log('解析数据出错， come from iframe', e)
    }
  }
  if (data && data.errCode) {
    let errCode = data.errCode
    switch (errCode) {
      case -1:
        return data
      case 14001:
        var language = localStorage.getItem('language') || 'zh'
        var mes
        if (language == 'zh') {
          mes = '登录过期，请重新登录'
        } else if (language == 'en') {
          mes = 'Login expired. Please log in again'
        }
        handleError(mes)
        router.push('/login')
        break
      default:
        // 统一发出错误提示
        var errText = getErrText(data)
        errText && handleError(errText)
        return Promise.reject(data)
    }
  }
  return data
}

function error(err) {
  let language = localStorage.getItem('language') || 'zh'
  let mes
  if (language == 'zh') {
    mes = '网络异常'
  } else if (language == 'en') {
    mes = 'Network anomalies'
  }
  handleError(mes)
  return Promise.reject(err)
}

export { requestInterceptor, responseInterceptor, error }
