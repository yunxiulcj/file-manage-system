import setConfig from './set-config'

let once = false

export default function () {
  if (once) {
    return
  }
  once = true
  return new Promise(resolve => {
    setConfig()
    resolve()
  })
}
