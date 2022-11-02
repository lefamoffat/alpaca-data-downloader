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
  instrumentType: string
}

function toAlpacaTime(timestamp: number, offset?: number) {
  return moment
    .unix(timestamp)
    .add(offset ?? 0, 'days')
    .toISOString()
}

function toAlpacaMarketDataEndpoint({
  startDate: selectedDate,
  ticker,
  days,
  timeframe,
  instrumentType,
}: GetMarketDataParams) {
  const timestamp = moment(selectedDate).unix()
  const shouldOffset = moment.unix(timestamp).isBefore(moment().subtract(days, 'days'))

  const startDate = `start=${toAlpacaTime(timestamp)}`
  const endDate = shouldOffset ? `&end=${toAlpacaTime(timestamp, days)}` : ''

  const cryptoUrl = `https://data.alpaca.markets/v1beta2/crypto/bars?symbols=${ticker}&timeframe=${timeframe}&${startDate}${endDate}`
  const stocksUrl = `https://data.alpaca.markets/v2/stocks/${ticker}/bars?${startDate}${endDate}&timeframe=${timeframe}`

  return instrumentType === 'stocks' ? stocksUrl : cryptoUrl
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

    console.info('Got market data.', response.data)

    return marketDataParams.instrumentType === 'stocks'
      ? response.data?.bars
      : response.data?.bars[marketDataParams.ticker]
  } catch (err) {
    if (err.response?.status === 422) {
      console.log(`\nERROR: ${err.message}`)
      console.log('Try a different input combination, e.g. different startDate and/or days.\n')
    } else {
      console.log(err.message)
    }
  }
}
