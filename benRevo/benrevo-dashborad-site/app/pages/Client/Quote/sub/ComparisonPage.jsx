import React from 'react';
import {
  Comparsion,
} from '@benrevo/benrevo-react-quote';

class ComparisonPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <Comparsion
        { ...this.props }
      />
    )
  }
}

export default ComparisonPage;
