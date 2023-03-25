import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as navigatorActions from '../redux/navigator';
import * as panelActions from '../redux/panel';
import * as registerActions from '../redux/register';
import {
  BottomToolbar
  // Icon
  // Page
} from 'react-onsenui';

// import SplitterButton from './Button';

import ShoppingCartItem from './ShoppingCartItem';

@connect((state) => ({ navigator: state.navigator, panel: state.panel, auth: state.auth, register: state.register, utility: state.utility }),
    (dispatch) => ({ actions: bindActionCreators({...navigatorActions, ...panelActions, ...registerActions}, dispatch) }))

class ShoppingCart extends React.Component {
  constructor(props) {
    super(props);
    this.toggleInfo_1 = this.toggleInfo_1.bind(this);
    this.renderShoppingCartItems = this.renderShoppingCartItems.bind(this);
    this.state = {
      data: [
        {name: 'banana', price: 16, qty: 1, open: true},
        {name: 'tomato', price: 18, qty: 2, open: false},
        {name: 'kiwi', price: 3, qty: 18, open: false}
      ],
      open1: true
    };
  }

  defaultProps = {
    name: 'Stranger'
  }

  renderShoppingCartItems(arr) {
    return arr.map((item, idx) => {
      return <ShoppingCartItem
        key={`cartItem_${idx}`}
        toggleInfo={() => {
          let data = this.state.data;
          data[idx].open = !data[idx].open;
          this.setState({data});
        }}
        addQty={() => {
          let data = this.state.data;
          data[idx].qty ++;
          this.setState({data});
        }}
        decreaseQty={() => {
          let data = this.state.data;
          if (data[idx].qty > 0) {
            data[idx].qty --;
            this.setState({data});
          }
        }}
        removeItem={() => {
          let data = this.state.data;
          data.splice(idx, 1);
          this.setState({data});
        }}

        itemName={item.name}
        price={item.price}
        qty={item.qty}
        open={item.open} />;
    });
  }

  toggleInfo_1() {
    this.setState({open1: !this.state.open1});
  }

  render() {
    let sum = 0;
    this.state.data.forEach((item) => {
      sum += item.price * item.qty;
    });

    return (
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>

        <div style={{alignSelf: 'stretch', height: '44px', padding: '10px', borderBottom: '1px solid rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start'}} >
          <div style={{margin: '0 auto 0 0', fontSize: '15px', lineHeight: '20px', color: '#999999'}}>{this.state.data.length} Items</div>
          <div style={{margin: '0 auto 0 0', fontSize: '20px', lineHeight: '25px', color: '#fff'}}>
            {/* Total: ${this.state.data.length ? this.state.data.reduce((a, b) => { return (a.price + b.price); }) : ''}*/}
             Total: ${sum}
          </div>
        </div>

        {/* <ShoppingCartItem toggleInfo={this.toggleInfo_1} itemName='itemName 1' price={99.65} qty={2} open={this.state.open1}/>*/}
        {/* <ShoppingCartItem itemName='itemName 2' price={9} qty={18} open={false}/>*/}
        {this.renderShoppingCartItems(this.state.data)}

         <BottomToolbar style={{display: 'flex', backgroundColor: '#30322F'}}>
          <div
            onClick={() => { console.log('Applying promocode'); }}
            style={{margin: 'auto', textTransform: 'uppercase', fontSize: '20px', color: '#d21f2d'}}>
            Apply promocode
          </div>
        </BottomToolbar>
      </div>

    );
  }
}

export default ShoppingCart;
