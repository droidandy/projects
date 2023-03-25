import React from 'react';
import PropTypes from 'prop-types';

class Prequote extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    children: PropTypes.node,
  };

  render() {
    return (
      <div className="prequote-page">
        {this.props.children}
      </div>
    );
  }
}

export default Prequote;
