require('dotenv').config()
const axios = require('axios')
const moment = require('moment')

function toAlpacaTime(timestamp: number, offset: number) {
  return moment.unix(timestamp).add(offset, 'days').toISOString()
}

function toAlpacaMarketDataEndpoint(timestamp: number, ticker: string, days: number) {
  const daysOffset = days
  const shouldOffset = moment.unix(timestamp).isBefore(moment().subtract(daysOffset, 'days'))
  const startDate = `start=${toAlpacaTime(timestamp, -daysOffset)}`
  const endDate = shouldOffset ? `&end=${toAlpacaTime(timestamp, daysOffset)}` : ''
  const timeframe = '1Hour'

  return `https://data.alpaca.markets/v2/stocks/${ticker}/bars?${startDate}${endDate}&timeframe=${timeframe}`
}

type AlpacaMarketData = {
  t: number
  o: number
  h: number
  l: number
  c: number
  v: number
  n: number
  vw: number
}

export async function getMarketData(ticker: string, startDate: string, bars: number): Promise<AlpacaMarketData[]> {
  console.log('Getting market data...')

  const timestamp = moment(startDate).unix()
  const url = toAlpacaMarketDataEndpoint(timestamp, ticker, bars)

  try {
    const response = await axios({
      method: 'GET',
      url,
      headers: {
        'APCA-API-KEY-ID': `${process.env.ALPACA_API_KEY}`,
        'APCA-API-SECRET-KEY': `${process.env.ALPACA_API_SECRET}`,
      },
    })

    console.log('what is response.data', response.data?.bars[0])

    return response.data?.bars
  } catch (err) {
    throw err
  }
}
