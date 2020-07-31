export const playtime = (seconds: number, timeView: string): string => {
  let timeStr = ''
  let minutes = Math.floor(seconds / 60)
  let hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  minutes %= 60

  if (timeView === 'days') {
    hours %= 24
    if (days) timeStr += days + 'd '
  }

  if (hours) timeStr += hours + 'h '
  if (minutes) timeStr += minutes + 'm'

  return timeStr.length > 0 ? timeStr : 'N/A'
}

export const formatNumber = (value: string | number): string => {
  if (value == null) {
    return null
  }

  while (/(\d+)(\d{3})/.test(value.toString())) {
    value = value.toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2')
  }

  return String(value)
}

export const round = (input: number, places: number = 2): string => {
  return Number(input).toFixed(places)
}

// source: https://gist.github.com/zenparsing/5dffde82d9acef19e43c
export const dedent = (callSite: any, ...args: string[]) => {
  function format (str: string) {
    let size = -1

    return str.replace(/\n(\s+)/g, (m, m1) => {

      if (size < 0) size = m1.replace(/\t/g, '    ').length

      return '\n' + m1.slice(Math.min(m1.length, size))
    })
  }

  if (typeof callSite === 'string') return format(callSite)

  if (typeof callSite === 'function') return (...args: string[]) => format(callSite(...args))

  const output = callSite
    .slice(0, args.length + 1)
    .map((text: string, i: number) => (i === 0 ? '' : args[i - 1]) + text)
    .join('')

  return format(output)
}
