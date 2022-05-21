# https://tcoil.info/how-to-get-list-of-companies-in-sp-500-with-python/

from traceback import print_tb
import pandas as pd


# There are 2 tables on the Wikipedia page
# we want the first table
payload = pd.read_html(
    'https://en.wikipedia.org/wiki/List_of_S%26P_500_companies')
first_table = payload[0]
# second_table = payload[1]

df = first_table

symbols = df['Symbol'].values.tolist()

with open('./etf/sp500-ticker-list.txt', 'w') as f:
    for item in symbols:
        f.write("%s," % item)

print('Got %d tickers' % len(symbols))
