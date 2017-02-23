# cryptensor
combining tensorflow and cryptocurrencies

UNDER DEVELOPMENT DO NOT USE

USAGE:

install lodash:

npm i --save lodash

convert your data.json data to .csv. This file also scales and prepares the data ranges. By default it will find the min and max of data ranges, then normalizes and scales to 0.25 to 0.75 range. :

npm convert.js

train the model:

python crypto.py