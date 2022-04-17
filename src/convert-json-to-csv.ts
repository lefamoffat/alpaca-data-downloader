const { parse } = require('json2csv')
const fs = require('fs')

import { getMarketData, GetMarketDataParams } from './alpaca/get-market-data'

// const fields = ['time', 'open', 'high', 'low', 'close', 'volume', 'trades', 'volume-weighted']
const fields = ['t', 'o', 'h', 'l', 'c', 'v', 'n', 'vw']
const opts = { fields }

export async function convertJsonToCsv(marketDataParams: GetMarketDataParams) {
  const data = await getMarketData(marketDataParams)

  // END program execution if no data is returned
  if (!data) return

  try {
    const csv = parse(data, opts)
    const { timeframe, ticker } = marketDataParams

    // directory to check if exists
    const dir = `./data/${timeframe}/${ticker}`

    // check if directory exists
    if (!fs.existsSync(dir)) {
      console.log('Directory not found. Creating...')

      fs.mkdirSync(dir, { recursive: true })
    }

    fs.appendFile(`${dir}/${data[1].t}.csv`, csv, function (err) {
      if (err) throw err
      console.log(`Saved ${ticker} data - ${data[1].t}`)
    })
  } catch (err) {
    console.error(err)
  }
}
