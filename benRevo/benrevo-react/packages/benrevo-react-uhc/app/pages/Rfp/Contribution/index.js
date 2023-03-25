import React from 'react';
import {
  Contribution,
} from '@benrevo/benrevo-react-rfp';

class ContributionPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <Contribution
        {...this.props}
      />
    );
  }
}

export default ContributionPage;
