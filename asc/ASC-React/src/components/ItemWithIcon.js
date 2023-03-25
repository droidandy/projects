import React from 'react';

import {
    Icon
} from 'react-onsenui';

class ItemWithIcon extends React.Component {
  constructor(props) {
    super(props);
    this.state = { };
  }
  render() {
    return (
        <div className='itemWithIcon__container' onClick={this.props.onPress ? this.props.onPress : null } >
          {
            this.props.icon ? <Icon className='icon__font' icon={this.props.icon}/> : null
          }
          {
            this.props.title ? <div>{this.props.title}</div> : null
          }
        </div>
    );
  }
}

export default ItemWithIcon;
