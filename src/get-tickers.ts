const fs = require('fs')

import { getMarketAssets } from './alpaca/get-market-assets'

async function createTickerList(fileName: string, instrumentType: string): Promise<string[]> {
  const assets = await getMarketAssets(instrumentType)

  console.info('Mapping assets to tickers...', assets)

  const tickers = assets
    .map((asset) => {
      if (instrumentType === 'stocks') {
        if (
          asset.tradable == true &&
          asset.fractionable == true &&
          asset.shortable == true &&
          asset.marginable == true
        ) {
          return asset.symbol
        }
      } else {
        if (asset.tradable == true && asset.fractionable == true) {
          return asset.symbol
        }
      }
    })
    .filter((ticker) => ticker != undefined) as string[]

  if (tickers.length === 0) {
    throw new Error('No tickers returned.')
  }

  console.info(`Writing ${tickers.length} tickers to ${fileName}...`)

  try {
    // fs.appendFile(fileName, tickers)
    fs.appendFile(fileName, tickers.join(','), (err) => {
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

export async function getTickers(instrumentType: string): Promise<string[]> {
  const fileName = `${instrumentType}-ticker-list.txt`

  try {
    // check if file is exists - if not -> create
    if (!fs.existsSync(fileName)) {
      console.log('File not found. Creating...')
      const tickers = await createTickerList(fileName, instrumentType)

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
