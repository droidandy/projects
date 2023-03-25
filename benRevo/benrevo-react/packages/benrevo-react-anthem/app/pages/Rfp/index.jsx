import React from 'react';
import {
  RFP,
} from '@benrevo/benrevo-react-rfp';

class RFPPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <RFP
        { ...this.props }
        carrierName={'Anthem'}
      />
    )
  }
}

export default RFPPage;
