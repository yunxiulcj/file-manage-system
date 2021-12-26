import moment from 'moment'
export default {
  GetDefaultDate (num) {
    let start = moment().subtract(num, 'days').format('YYYY-MM-DD')
    let end = moment().format('YYYY-MM-DD')
    return [start, end]
  }
}
