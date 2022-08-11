import dayjs from 'dayjs'

export const removeDay = (date: string) => {
  const splitDate = date.split('-')
  splitDate.pop()
  return splitDate.join('-')
}

export const pad = (num: number): string => {
  const str = num.toString()
  if (str.length === 2) return str
  return '0' + str
}

interface Callback { (t: string): string }

export const formatMonth = (t: Callback, currentUnixDate: number) => {
  const month = dayjs.unix(currentUnixDate).month() + 1
  return t('chart.months.' + month.toString())
}

type Range = {
    start: number,
    end: number
}

export const getTimestamp = (date?: string) => {
  if (date === undefined) {
    return dayjs().valueOf()
  } else {
    return dayjs(date).valueOf()
  }
}

export const dateToUnix = (date: Date) => dayjs(date).unix()

export const unixToDate = (timestamp: number) =>
    dayjs.unix(timestamp).toDate();

export const getDay = (timestamp: number) => dayjs.unix(timestamp).date();
export const getMonth = (timestamp: number) => dayjs.unix(timestamp).month();

export const getDate = (timestamp: number) => dayjs.unix(timestamp);

export const getUnixTimestamp = () => dayjs().unix();

export const displayDate = (date: dayjs.Dayjs) => date.format('DD/MM/YYYY');

export const getBeginningMonthDate = (timestamp: number) =>
    getDate(timestamp).startOf('month').unix();

export const getEndMonthDate = (timestamp: number) =>
    getDate(timestamp).endOf('month').unix()

export const tDetails = {
  day: {
    length: 24,
    unit: 'hour'
  },
  week: {
    length: 7,
    unit: 'day'
  },
  month: {
    length: 1,
    unit: 'month'
  }
}
