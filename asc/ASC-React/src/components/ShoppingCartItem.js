import React from 'react';
// import React, {propTypes, Component} from 'react'; // /addons
import {
  Icon
  // Page
} from 'react-onsenui';

class ShoppingCartItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    return (
      <div style={{alignSelf: 'stretch', position: 'relative'}}>
        <div onClick={this.props.toggleInfo}
        style={{
          alignSelf: 'stretch',
          height: '70px',
          padding: '10px',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'flex-start'
        }} >
          <div style={{height: '50px', width: '70px', backgroundColor: '#6F6F6F', textAlign: 'center', paddingTop: '20px'}}>image</div>
          <div style={{display: 'flex', flexDirection: 'column', padding: '20px 0 0 20px'}}>
            <div style={{color: '#fff'}}>{this.props.itemName}</div>
            <div style={{color: '#999999'}}>{this.props.qty} X ${this.props.price}</div>

          </div>
          <div style={{margin: 'auto 20px auto auto', color: '#999999'}}>${this.props.price * this.props.qty}</div>

        </div>
        {this.props.open
          ? <div className='openShoppingCartItem' style={{alignSelf: 'stretch', backgroundColor: '#9e1c26', height: '70px', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
              <div style={{fontSize: '30px', lineHeight: '35px', padding: '0 20px'}}><Icon icon='md-plus' onClick={() => { this.props.addQty(); console.log('plus 1'); }}/></div>
              <div style={{fontSize: '30px', lineHeight: '35px', padding: '0 20px'}}>{this.props.qty}</div>
              <div style={{fontSize: '30px', lineHeight: '35px', padding: '0 20px'}}><Icon icon='md-minus' onClick={() => { this.props.decreaseQty(); console.log('minus 1'); }} /></div>
              <div style={{fontSize: '30px', lineHeight: '35px', padding: '0 20px', marginLeft: 'auto'}}><Icon icon='md-delete' onClick={() => { this.props.removeItem(); console.log('delete item'); }} /></div>
            </div>
          : null
        }
      </div>

    );
  }
}

ShoppingCartItem.propTypes = {
  itemName: React.PropTypes.string,
  price: React.PropTypes.number,
  qty: React.PropTypes.number
};
ShoppingCartItem.defaultProps = {
  itemName: 'Undefined Shop Item',
  price: 100,
  qty: 1
};

export default ShoppingCartItem;
