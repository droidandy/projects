import cryptoList from './cryptos.json';

function GetCryptosMap() {
  return cryptoList.slice(0,process.env.REACT_APP_CRYPTO_LIST_MAX).reduce((m, crypto) => {
    m[crypto.name] = crypto
    return m
  }, {})
}

let cryptosMap = GetCryptosMap();
export default cryptosMap;
