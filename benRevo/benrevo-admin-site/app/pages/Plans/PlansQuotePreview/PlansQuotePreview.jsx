import React from 'react';
import PropTypes from 'prop-types';

class PlansQuotePreview extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    children: PropTypes.node,
  };

  render() {
    return (
      <div className="plans">
        {this.props.children}
      </div>
    );
  }
}

export default PlansQuotePreview;
