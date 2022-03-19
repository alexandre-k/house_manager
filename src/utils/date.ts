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
  const month = dayjs(currentUnixDate).month() + 1
  return t('chart.months.' + month.toString())
}

type Range = {
    start: number,
    end: number
}

// const manipulateDate = (startDate: dayjs.Dayjs, step: number, diff: number, stepType: string): dayjs.Dayjs => {
//   if (step > 0) {
//     return dayjs(startDate).add(diff, stepType)
//   }
//   if (step < 0) {
//     return dayjs(startDate).subtract(diff, stepType)
//   }
//   return startDate
// }

export const getTimestamp = (date?: string) => {
  if (date === undefined) {
    return dayjs().valueOf()
  } else {
    return dayjs(date).valueOf()
  }
}

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

// export const generateRange = (start: number, step: number, stepType: string) => {
//   let lastDay: string
//   let day: string
//   const startDate = manipulateDate(dayjs(start), step, tDetails[stepType].length, tDetails[stepType].unit)
//   switch (stepType) {
//     case 'day':
//       day = pad(startDate.date())
//       lastDay = pad(startDate.date())
//       break
//     case 'week':
//       day = pad(startDate.date())
//       lastDay = pad(dayjs(startDate).add(7, 'day').date())
//       break
//     default: {
//       day = '01'
//       lastDay = dayjs(startDate).daysInMonth().toString()
//       break
//     }
//   }
//   const year = startDate.year()
//   const month = pad(startDate.month() + 1)
//   return {
//     start: Date.parse(
//       year + '-' + month + '-' + day + 'T01:00:00'),
//     end: Date.parse(
//       year + '-' + month + '-' + lastDay + 'T23:00:00')
//   }
// }
