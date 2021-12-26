/**
 * 拦截器
 */
import qs from 'qs'
import { Message } from 'element-ui'
import { typeTest } from '@/utils/obj-operation'
import router from '@/app/router/index'
function getErrText(data) {
  if (!data || !data.message) {
    return '网络异常'
  }
  if (typeTest(data.message, 'string')) {
    return data.message
  }
  if (typeTest(data.message, 'object')) {
    return data.message
  }
  return null
}

function handleError(msg) {
  if (msg.toLowerCase().indexOf('network') > -1) {
    msg = '网络异常，请检查您的网络配置'
  }
  if (msg.toLowerCase().indexOf('timeout') > -1) {
    msg = '请求超时，请重新尝试'
  }
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
  if (data && data.code) {
    let code = data.code
    switch (code) {
      case -1:
        return data
      case 14001:
        handleError('登录过期，请重新登录')
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
  handleError('网络异常')
  return Promise.reject(err)
}

export { requestInterceptor, responseInterceptor, error }
