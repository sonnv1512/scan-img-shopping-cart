import moment from 'moment'
import StatusType from '@/class/StatusType'
export default {
  tableRowClassName({ row, rowIndex }) {
    if (rowIndex % 4 === 1) {
      return 'odd-row'
    } else if (rowIndex % 4 === 3) {
      return 'even-row'
    }
    return ''
  },
  notify(object, content, type) {
    this.$notification[type]({
      message: object || '',
      description: content || ''
    })
  },
  renderDivision() {
    const list = [
      {
        key: 1,
        label: 'Cục số 1'
      },
      {
        key: 2,
        label: 'Cục số 2'
      },
      {
        key: 3,
        label: 'Cục số 3'
      },
      {
        key: 4,
        label: 'Cục số 4'
      }
    ]
    return list
  },
  renderFlowRouteProvince_status() {
    const list = StatusType.paymentStatus
    return list
  },
  FlowRouteProvince_type() {
    const list = [
      {
        key: 0,
        label: 'Luồng xanh Nội tỉnh'
      },
      {
        key: 1,
        label: 'Luồng xanh Quốc gia'
      }
    ]
    return list
  },
  renderRandomStr(length = 10) {
    let result = ''
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const charactersLength = characters.length
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
  },
  customDate(miliseconds, formatString, is) {
    if (is) {
      // nếu true thì miliseconds là múi giờ +0 , nếu múi giờ + 0 thì thay đổi miliseconds
      miliseconds -= -new Date(miliseconds).getTimezoneOffset() * 60000
    }
    var dateFm = new Date(miliseconds)
    var YYYY,
      YY,
      MMMM,
      MMM,
      MM,
      M,
      DDDD,
      DDD,
      DD,
      D,
      hhhh,
      hhh,
      hh,
      h,
      mm,
      m,
      ss,
      s,
      ampm,
      AMPM,
      dMod,
      th
    YY = ((YYYY = dateFm.getFullYear()) + '').slice(-2)
    M = dateFm.getMonth() + 1
    MM = M < 10 ? '0' + M : M
    MMM = (MMMM = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ][M - 1]).substring(0, 3)
    DD = (D = dateFm.getDate()) < 10 ? '0' + D : D
    DDD = (DDDD = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday'
    ][dateFm.getDay()]).substring(0, 3)
    th =
      D >= 10 && D <= 20
        ? 'th'
        : (dMod = D % 10) === 1
          ? 'st'
          : dMod === 2
            ? 'nd'
            : dMod === 3
              ? 'rd'
              : 'th'
    formatString = formatString
      .replace('#YYYY#', YYYY)
      .replace('#YY#', YY)
      .replace('#MMMM#', MMMM)
      .replace('#MMM#', MMM)
      .replace('#MM#', MM)
      .replace('#M#', M)
      .replace('#DDDD#', DDDD)
      .replace('#DDD#', DDD)
      .replace('#DD#', DD)
      .replace('#D#', D)
      .replace('#th#', th)
    h = hhh = dateFm.getHours()
    if (h === 0) h = 24
    if (h > 12) h -= 12
    hh = h < 10 ? '0' + h : h
    hhhh = hhh < 10 ? '0' + hhh : hhh
    AMPM = (ampm = hhh < 12 ? 'am' : 'pm').toUpperCase()
    mm = (m = dateFm.getMinutes()) < 10 ? '0' + m : m
    ss = (s = dateFm.getSeconds()) < 10 ? '0' + s : s
    return formatString
      .replace('#hhhh#', hhhh)
      .replace('#hhh#', hhh)
      .replace('#hh#', hh)
      .replace('#h#', h)
      .replace('#mm#', mm)
      .replace('#m#', m)
      .replace('#ss#', ss)
      .replace('#s#', s)
      .replace('#ampm#', ampm)
      .replace('#AMPM#', AMPM)
  },
  removeVietnameseTones: function(input) {
    if (!input) {
      return null
    }
    let str = input.toLowerCase()
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i')
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
    str = str.replace(/đ/g, 'd')
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A')
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E')
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I')
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O')
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U')
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y')
    str = str.replace(/Đ/g, 'D')
    // Some system encode vietnamese combining accent as individual utf-8 characters
    // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, '') // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, '') // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
    // Remove extra spaces
    // Bỏ các khoảng trắng liền nhau
    str = str.replace(/ + /g, ' ')
    str = str.trim()
    // Remove punctuations
    // Bỏ dấu câu, kí tự đặc biệt
    str = str.replace(
      /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
      ' '
    )
    return str
  },
  sumValueArr(arr = []) {
    return arr.reduce(function(acc, val) { return acc + val }, 0)
  },
  validNumberPlate(str) {
    return str.split('').filter(x => /^[0-9a-zA-Z]+$/.test(x)).join('')
  },
  checkValidEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(email)
  },
  formatDateTime(dateStr, timeStr) {
    return moment(`${dateStr}T${timeStr}:00Z`).toISOString()
    // return moment(`${dateStr} ${timeStr}:00`).format("YYYY-MM-DDTHH:mm:ss.SSSZ")
    // return moment(str).toISOString()
  },
  helloGuys() {
    console.log('hello')
  },
}
