import React from 'react';
import {
  EnroRates,
} from '@benrevo/benrevo-react-rfp';

class EnroRatesPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <EnroRates
        {...this.props}
      />
    );
  }
}

export default EnroRatesPage;
