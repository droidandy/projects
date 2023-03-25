import React, { Component } from 'react';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './react-bootstrap-table-all.min.css';
import * as request from "request-promise-native"
import * as numeral from 'numeral';
import Navbar from '../Navbar'
import AddForm from '../AddForm'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import randomId from '../helper'
import './MarketCap.css'

import io from 'socket.io-client';
const socket = io('https://www.livecoinwatch.com');

const GRID_SIZE = 12;
const WIDGET_WIDTH = 4;

export default class MarketCap extends Component {

    constructor() {
        super();

        this.state = {
            coinData: [],
            grid: []
        };
    }

    componentDidMount() {       
        socket.on('all', this.getData);
    }

    getData = (response) => {
        let coinData = response.coins.map(item => {
            let coinDatum = {};
            coinDatum['rank'] = item['rank'];
            coinDatum['symbol'] = item['code'];
            coinDatum['name'] = item['name'];
            coinDatum['market_cap_usd'] = parseInt(item['cap']);
            coinDatum['price_usd'] = parseFloat(item['usd']);
            coinDatum['24h_volume_usd'] = parseFloat(item['vol']);
            coinDatum['circulating_supply'] = parseFloat(item['circulating']);
            coinDatum['id'] = item['lname'];
            coinDatum['percent_change_1h'] = parseFloat(item['hpc']);
            coinDatum['percent_change_24h'] = parseFloat(item['dpc']);
            coinDatum['percent_change_7d'] = parseFloat(item['wpc']);
            return coinDatum;
        });
        this.setState({ coinData });
    }

    formatUSD(cell, row) {
        return '$' + numeral(cell).format('0,0');
    }

    formatPrice(cell, row) {
        return '$' + numeral(cell).format('0.00');
    }

    formatVolume(cell, row) {
        return '$' + numeral(cell).format('0,0');
    }

    formatCirculatingSupply(cell, row) {
        return numeral(cell).format('0,0') + ' ' + row['symbol'];
    }

    formatChange(cell, row) {

        let value = numeral(cell).format('0.0') + '%';

        if (cell >= 0) {
            return '<span style="color:green;">' + value + '</span>';
        } else {
            return '<span style="color:red;">' + value + '</span>';
        }
    }

    render() {
        let options = {
            sortName: 'rank',
            sortOrder: 'asc'
        }
        return(
            <div className="things-box text-color">
                <Navbar _handleOpenModal={this._handleOpenModal.bind(this)}
                        auth={this.props.auth}/>
                <AddForm
                    showModal={this.state.showModal}
                    closeHandler={this._handleCloseModal.bind(this)}
                    addHandler={this._addWidget.bind(this)}
                />
                <div className="content">
                    <BootstrapTable data={this.state.coinData} striped={true} hover={true} options={ options } bordered={false} ref="coinTable">
                        <TableHeaderColumn dataField="rank" isKey={true} dataAlign="center" dataSort={true}>Rank</TableHeaderColumn>
                        <TableHeaderColumn dataField="symbol" dataSort={true}>Symbol</TableHeaderColumn>
                        <TableHeaderColumn dataField="name" dataSort={true}>Name</TableHeaderColumn>
                        <TableHeaderColumn dataField="market_cap_usd" dataFormat={this.formatUSD} dataSort={true}>Market Cap</TableHeaderColumn>
                        <TableHeaderColumn dataField="price_usd" dataFormat={this.formatPrice} dataSort={true}>Price</TableHeaderColumn>
                        <TableHeaderColumn dataField="24h_volume_usd" dataFormat={this.formatVolume} dataSort={true}>Volume</TableHeaderColumn>
                        <TableHeaderColumn dataField="circulating_supply" dataFormat={this.formatCirculatingSupply} dataSort={true}>Circulating Supply</TableHeaderColumn>
                        <TableHeaderColumn dataField="percent_change_1h" dataFormat={this.formatChange} dataAlign="center" dataSort={true}>Change (1h)</TableHeaderColumn>
                        <TableHeaderColumn dataField="percent_change_24h" dataFormat={this.formatChange} dataAlign="center" dataSort={true}>Change (24h)</TableHeaderColumn>
                        <TableHeaderColumn dataField="percent_change_7d" dataFormat={this.formatChange} dataAlign="center" dataSort={true}>Change (7d)</TableHeaderColumn>
                    </BootstrapTable>
                </div>
            </div>

        );
    }

    _addWidget(options){
        const widget = {
            type: options.type,
            crypto: options.crypto,
            key: randomId(),
            x: (this.state.grid.length * WIDGET_WIDTH) % GRID_SIZE,
            width: options.width
        }

        this._saveGridState(this.state.grid.concat(widget))
    }

    _handleOpenModal() {
        this.setState({ showModal: true });
    }

    _handleCloseModal (e) {
        this.setState({ showModal: false });
    }

    _saveGridState = grid_state => {
        this.setState({grid : grid_state})
        var options = {
            method: 'POST',
            url: 'https://swmllargy4.execute-api.us-east-1.amazonaws.com/prod/auth0proxy_auth0proxy',
            headers:
                {
                    'content-type': 'application/json',
                },
            body: { user_id: this.state.profile.sub, grid: grid_state},
            json: true
        };
        request(options)
    }
}

