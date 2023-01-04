import { THETA_EXPLORER_URL } from './constants'

export function transactionUrl(transactionId) {
  return THETA_EXPLORER_URL + '/txs/' + transactionId
}

export function accountUrl(accountId) {
  return THETA_EXPLORER_URL + '/account/' + accountId
}

export function formatNumber(number, precision = 0, unit = '') {
  let unit2 = ''
  if (unit == 'auto') {
    if (number >= 1000000000) {
      unit2 = 'B'
    } else if (number >= 1000000) {
      unit2 = 'M'
    } else if (number >= 1000) {
      unit2 = 'K'
    }
  } else {
    unit2 = unit
  }
  let number2 = parseFloat(number)
  if (unit2 == 'B') {
    number2 = number2 / 1000000000
  } else if (unit2 == 'M') {
    number2 = number2 / 1000000
  } else if (unit2 == 'K') {
    number2 = number2 / 1000
  }
  let number3 = parseFloat(number2.toFixed(precision)).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 4 }).replace(/\.0+$/, '')
  return number3 + unit2
}