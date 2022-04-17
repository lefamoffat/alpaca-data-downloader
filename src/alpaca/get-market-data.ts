require('dotenv').config()
const axios = require('axios')
const moment = require('moment')

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

export type GetMarketDataParams = {
  days: number
  startDate: string
  ticker: string
  timeframe: string
}

function toAlpacaTime(timestamp: number, offset?: number) {
  return moment
    .unix(timestamp)
    .add(offset ?? 0, 'days')
    .toISOString()
}

function toAlpacaMarketDataEndpoint({ startDate: selectedDate, ticker, days, timeframe }: GetMarketDataParams) {
  const timestamp = moment(selectedDate).unix()
  const shouldOffset = moment.unix(timestamp).isBefore(moment().subtract(days, 'days'))

  const startDate = `start=${toAlpacaTime(timestamp)}`
  const endDate = shouldOffset ? `&end=${toAlpacaTime(timestamp, days)}` : ''

  return `https://data.alpaca.markets/v2/stocks/${ticker}/bars?${startDate}${endDate}&timeframe=${timeframe}`
}

export async function getMarketData(marketDataParams: GetMarketDataParams): Promise<AlpacaMarketData[]> {
  console.log('Getting market data...')

  const url = toAlpacaMarketDataEndpoint(marketDataParams)

  try {
    const response = await axios({
      method: 'GET',
      url,
      headers: {
        'APCA-API-KEY-ID': `${process.env.ALPACA_API_KEY}`,
        'APCA-API-SECRET-KEY': `${process.env.ALPACA_API_SECRET}`,
      },
    })

    return response.data?.bars
  } catch (err) {
    throw err
  }
}
