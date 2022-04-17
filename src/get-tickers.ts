const fs = require('fs')

import { getMarketAssets } from './alpaca/get-market-assets'

async function createTickerList(fileName: string): Promise<string[]> {
  const assets = await getMarketAssets()

  const tickers = assets
    .map((asset) => {
      if (asset.tradable == true && asset.fractionable == true && asset.shortable == true && asset.marginable == true) {
        return asset.symbol
      }
    })
    .filter((ticker) => ticker != undefined) as string[]

  try {
    // fs.appendFile(fileName, tickers)
    fs.appendFile(fileName, tickers, (err) => {
      if (err) {
        console.log(err)
      } else {
        console.log(`Saved tickers to ${fileName}.`)
      }
    })

    return tickers
  } catch (err) {
    console.log(err)
    throw err
  }
}

export async function getTickers(): Promise<string[]> {
  const fileName = 'ticker-list.txt'

  try {
    // check if file is exists - if not -> create
    if (!fs.existsSync(fileName)) {
      console.log('File not found. Creating...')
      const tickers = await createTickerList(fileName)

      return tickers
    } else {
      // console.log('Getting tickers from file...')
      const tickers = fs.readFileSync(fileName).toString().split(',')

      return tickers
    }
  } catch (err) {
    console.log(err)
    throw err
  }
}
