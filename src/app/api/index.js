import request from '@/app/axios/index'
import common from './modules/common'
import message from './modules/message'
import process from './modules/process'
import sharedSpace from './modules/sharedSpace'
import strategy from './modules/strategy'
import systemManage from './modules/systemManage'

const config = {
  ...common,
  ...message,
  ...process,
  ...sharedSpace,
  ...strategy,
  ...systemManage,
}

/**
 *
 * @param {*} funcName 请求名
 * @param {*} data 数据
 * @param {*} baseConfig axios 默认配置
 */
export default function req(funcName, data, baseConfig) {
  return request(config, funcName, data, baseConfig)
}
