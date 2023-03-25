import React from 'react';
import {
  LifeStdLtdRates,
} from '@benrevo/benrevo-react-rfp';

class LifeStdLtdRatesPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <LifeStdLtdRates
        {...this.props}
      />
    );
  }
}

export default LifeStdLtdRatesPage;
