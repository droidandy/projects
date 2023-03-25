import React from 'react';
import PropTypes from 'prop-types';
import { Tab, Header } from 'semantic-ui-react';
import { LifeStdLtdRates } from '@benrevo/benrevo-react-rfp';

class CurrentAncillaryRates extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    section: PropTypes.string.isRequired,
    ancillaryType: PropTypes.string.isRequired,
  };

  render() {
    const { ancillaryType } = this.props;
    return (
      <Tab.Pane>
        <Header as="h1" className="page-heading">Rates</Header>
        <LifeStdLtdRates
          {...this.props}
          hideButtons
          hideTitle
          withoutRenewal
          showBasic={ancillaryType === 'basicPlan'}
          showVoluntary={ancillaryType === 'voluntaryPlan'}
          hideVoluntary={ancillaryType === 'basicPlan'}
          hideBasic={ancillaryType === 'voluntaryPlan'}
        />
      </Tab.Pane>
    );
  }
}

export default CurrentAncillaryRates;
