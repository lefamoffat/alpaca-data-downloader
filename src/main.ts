const fuzzy = require('fuzzy')
const inquirer = require('inquirer')
inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'))
inquirer.registerPrompt('date', require('inquirer-date-prompt'))

import { convertJsonToCsv } from './convert-json-to-csv'
import { getTickers } from './get-tickers'

type Answers = {
  ticker: string
  timeframe: string
  startDate: string
  days: number
}

async function searchTickers(answers: Answers, input = '') {
  // console.log('\n')
  const tickers = await getTickers()

  return new Promise(async (resolve) => {
    setTimeout(() => {
      const results = fuzzy.filter(input, tickers).map((el) => el.original)

      results.splice(5, 0, new inquirer.Separator())
      results.push(new inquirer.Separator())
      resolve(results)
    }, Math.random() * 470 + 30)
  })
}

// EXECUTION WITH USER INPUT
inquirer
  .prompt([
    {
      // https://github.com/mokkabonna/inquirer-autocomplete-prompt
      type: 'autocomplete',
      name: 'ticker',
      message: 'What ticker?',
      source: searchTickers,
    },
    {
      type: 'list',
      default: '1Hour',
      name: 'timeframe',
      message: 'What timeframe?',
      choices: ['1Day', '1Hour', '15Min', '5Min', '1Min'],
    },
    {
      //https://github.com/haversnail/inquirer-date-prompt
      type: 'date',
      name: 'startDate',
      message: 'What start date?',
    },
    {
      type: 'number',
      name: 'days',
      default: 365,
      message: 'How many days?',
    },
  ])
  .then(async (answers: Answers) => {
    await convertJsonToCsv({
      ticker: answers.ticker.toUpperCase(),
      timeframe: answers.timeframe,
      startDate: answers.startDate,
      days: answers.days,
    })
  })
