import React from 'react';
import PropTypes from 'prop-types';
import {
  RFP,
} from '@benrevo/benrevo-react-rfp';

class RFPPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <RFP
        { ...this.props }
        carrierName={'UHC'}
      />
    )
  }
}

export default RFPPage;
