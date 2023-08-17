import { math } from 'solarwind-common'
import { Ship } from 'solarwind-common/dist/model/ship'
import { StarLocation } from 'solarwind-common/dist/model/star'


type TimeComponents = {
  years: number
  months: number
  days: number
  hours: number
  minutes: number
  seconds: number
}

export const formatDateToString = (date: Date): string => {
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
}

export const calculateArrivalDate = (slw: any, from: StarLocation, to: StarLocation, ffwd?: boolean): Date => {
  if (isNaN(slw)) throw new Error('Fuel ammount must be a number')
  const slwNumber = Number(slw)
  if (slwNumber < 1) throw new Error('Fuel ammount must be greater than 0')
  const distance = math.calculateDistance(from, to)
  const time = (distance * (ffwd ? 1 : (24 * 60 * 60))) / Number(slw)
  console.log('time', time)
  const arrivalTime = new Date(Date.now() + (time * 1000))
  return arrivalTime
}

export const formatRemainigTimeToString = (time: TimeComponents): string => {
  let timeStr = time.days === 0 ? `${time.seconds}s` : ''
  if (time.minutes > 0 && time.months === 0) timeStr = `${time.minutes}m ${timeStr}`
  if (time.hours > 0 && time.years === 0) timeStr = `${time.hours}h ${timeStr}`
  if (time.days > 0) timeStr = `${time.days}d ${timeStr}`
  if (time.months > 0) timeStr = `${time.months}m ${timeStr}`
  if (time.years > 0) timeStr = `${time.years}y ${timeStr}`
  return timeStr
}

export const getTimeTo = (date: Date): TimeComponents =>  {

  const sPerMinute = 60
  const sPerHour = sPerMinute * 60
  const sPerDay = sPerHour * 24
  const sPerMonth = sPerDay * 30
  const sPerYear = sPerDay * 365

  const now = new Date()
  const timeDiff = (date.getTime() - now.getTime()) / 1000
  const years = Math.floor(timeDiff / (sPerDay * 365))
  const months = Math.floor((timeDiff - (years * sPerYear)) / sPerMonth)
  const days = Math.floor((timeDiff - ((years * sPerYear) + (months * sPerMonth))) / sPerDay)
  const hours = Math.floor((timeDiff % sPerDay) / sPerHour)
  const minutes = Math.floor((timeDiff % sPerHour) / sPerMinute)
  const seconds = Math.floor((timeDiff % sPerMinute))

  return { years, months, days, hours, minutes, seconds }

}

export const calculateHarvestAmount = (lastHarvest: Date | number, luminosity: number, numShips?: number): number =>  {

  const now = new Date()
  const secondsPassed = (now.getTime() - new Date(lastHarvest).getTime()) / 1000

  const luminosityLog2 = Math.log2(luminosity)
  const numShipsLog2 = Math.log2(1 + (numShips || 1))
  let multiplier = luminosityLog2 < 0 ? 1 / (1 + Math.abs(luminosityLog2)) : 1 + luminosityLog2
  multiplier = multiplier / numShipsLog2

  return Math.round(secondsPassed * multiplier)

}

export const shortenAddress = (address: string): string => {
  return `${address.slice(0, 24)}...${address.slice(-6)}`
}

export const shortenAddressTo = (address: string, first: number, last: number): string => {
  return `${address.slice(0, first)}...${address.slice(last)}`
}

export const timeUntilArrival = (ship: Ship) => {
  
  const { arrivalTime } = ship
  return arrivalTime ? (new Date(arrivalTime)).getTime() - (new Date()).getTime() : null
  
}