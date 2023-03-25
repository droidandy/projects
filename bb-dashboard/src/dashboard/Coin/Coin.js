import React from 'react'
import Panel from '../Panel'
import * as request from 'request-promise-native'
import numeral from 'numeral'
import cryptosMap from '../cryptos.js'
import './Coin.css'
import openSocket from 'socket.io-client';
import { CCC } from '../../ccc-streamer-utilities';

export default class Coin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      coin: {},
      currentPrice: {},
      market: "CCCAGG",
      endpoint: "wss://streamer.cryptocompare.com"
    };
  }

  componentDidMount() {
    const context = this;
    const current = cryptosMap[this.props.crypto];
    const { endpoint, market } = this.state;
    const subscription = [`5~${market}~${current.symbol}~USD`];
    const socket = openSocket(endpoint);
    socket.on('m', function(message) {
      const messageType = message.substring(0, message.indexOf("~"));
      let res = {};
      if (messageType === CCC.STATIC.TYPE.CURRENTAGG) {
        res = CCC.CURRENT.unpack(message);
        context.dataUnpack(res, current.name);
      }
    });
    socket.emit('SubAdd', { subs: subscription } );
    setInterval(this._getCoinData(), 2000)
  }

  dataUnpack(data, name) {
      let { currentPrice } = this.state;
      const to = data['TOSYMBOL'];
      const tsym = CCC.STATIC.CURRENCY.getSymbol(to);
      currentPrice['NAME'] = name;
      for (let key in data) {
          currentPrice[key] = data[key];
      }
      if (currentPrice['LASTTRADEID']) {
          currentPrice['LASTTRADEID'] = parseInt(currentPrice['LASTTRADEID']).toFixed(0);
      }
      currentPrice['CHANGE24HOUR'] = CCC.convertValueToDisplay(tsym, (currentPrice['PRICE'] - currentPrice['OPEN24HOUR']));
      currentPrice['CHANGE24HOURPCT'] = ((currentPrice['PRICE'] - currentPrice['OPEN24HOUR']) / currentPrice['OPEN24HOUR'] * 100).toFixed(2) + "%";
      this.setState({
          currentPrice
      });
    }



  render() {
    const { currentPrice } = this.state;
    let priceColor = "price-unchanged";
    if(currentPrice.FLAGS != 4) {
      priceColor = currentPrice.FLAGS == 1 ? 'price-up' : 'price-down';
    }
    let color24h ="text-success"
    if (this.state.coin.percent_change_24h < 0){
      color24h = "text-danger"

    }
    return (
      <Panel {...this.props} title="" crypto="" >
        <div className="padding">
          <h2 className="m-t-0 m-b-0 f-w-300 ">{currentPrice.NAME}</h2>
          <div className="m-b-2"><i className="fa fa-fw fa-caret-up text-success"></i>
            <span className={priceColor}>{numeral(currentPrice.PRICE).format('0,0.[000000000]')} {currentPrice.TOSYMBOL}</span> |
                                        <small><span className={color24h}> {currentPrice.CHANGE24HOURPCT}</span></small>
          </div>

          <span className="text-nowrap ">
            <span className="label label-gray-lighter m-r-1 label-outline">Mkt cap</span>
            <small className="text-white">{numeral(this.state.coin.market_cap_usd).format('0,0')} USD</small></span>

          <div className="text-nowrap m-t-1 ">
            <span className="label label-gray-lighter m-r-1 label-outline">Volume</span>
            <small className="text-white">{numeral(this.state.coin['24h_volume_usd']).format('0,0')} USD</small></div>

          <div className="text-nowrap m-t-1 ">
            <span className="label label-gray-lighter m-r-1 label-outline">Supply</span>
            <small className="text-white">{numeral(this.state.coin.total_supply).format('0,0')}</small></div>

          <div className="text-nowrap m-t-1 ">
            <span className="label label-gray-lighter m-r-1 label-outline">Rank</span>
            <small className="text-white">{numeral(this.state.coin.rank).format('0o')}</small></div>
        </div>
      </Panel>
    )
  }

  _getCoinData() {
    let that = this
    const id = cryptosMap[this.props.crypto].id
    let options = {
      url: 'https://cors-anywhere.herokuapp.com/https://api.coinmarketcap.com/v1/ticker/'+id,
      json: true,
      headers: {
        'origin': 'null'
      }
    };
    request(options).then(function (response) {
      that.setState({ coin: response[0] })
    }).catch(function (err) {
    });
  }
}