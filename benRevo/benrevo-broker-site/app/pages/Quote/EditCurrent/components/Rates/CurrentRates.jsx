import React from 'react';
import PropTypes from 'prop-types';
import { Tab, Header } from 'semantic-ui-react';
import { CaptureRates } from '@benrevo/benrevo-react-rfp';

class CurrentRates extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    section: PropTypes.string.isRequired,
  };

  render() {
    return (
      <Tab.Pane>
        <Header as="h1" className="page-heading">Rates</Header>
        <CaptureRates
          {...this.props}
          hideButtons
          hideTitle
          withoutVirgin
          withoutRenewal
          withoutValidate
        />
      </Tab.Pane>
    );
  }
}

export default CurrentRates;
