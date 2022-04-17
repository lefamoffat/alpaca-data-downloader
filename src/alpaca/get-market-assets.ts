require('dotenv').config()
const axios = require('axios')

type AlpacaAsset = {
  id: string
  class: string
  exchange: string
  symbol: string
  name: string
  status: string
  tradable: boolean
  marginable: boolean
  shortable: boolean
  easy_to_borrow: boolean
  fractionable: boolean
}

export async function getMarketAssets(): Promise<AlpacaAsset[]> {
  console.log('Getting market assets...')

  try {
    const response = await axios({
      method: 'GET',
      url: 'https://paper-api.alpaca.markets/v2/assets',
      headers: {
        'APCA-API-KEY-ID': `${process.env.ALPACA_API_KEY}`,
        'APCA-API-SECRET-KEY': `${process.env.ALPACA_API_SECRET}`,
      },
    })

    return response.data
  } catch (err) {
    throw err
  }
}
