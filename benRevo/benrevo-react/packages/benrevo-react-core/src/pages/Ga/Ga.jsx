import React from 'react';
import PropTypes from 'prop-types';
class Ga extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    children: PropTypes.node,
  };

  componentWillMount() {

  }

  render() {
    return (
      <div className="ga">
        {this.props.children}
      </div>
    );
  }
}

export default Ga;
