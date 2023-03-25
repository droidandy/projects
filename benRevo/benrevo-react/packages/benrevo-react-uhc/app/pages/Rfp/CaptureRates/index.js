import React from 'react';
import {
  CaptureRates,
} from '@benrevo/benrevo-react-rfp';

class CaptureRatesPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <CaptureRates
        {...this.props}
      />
    );
  }
}

export default CaptureRatesPage;
