import React from 'react';
import PropTypes from 'prop-types';
import { Tab, Header } from 'semantic-ui-react';
import PlanTable from '../../../../Rfp/PlanTable';

class CurrentBenefits extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    section: PropTypes.string.isRequired,
  };

  render() {
    return (
      <Tab.Pane>
        <Header as="h1" className="page-heading">Benefits</Header>
        <PlanTable
          {...this.props}
        />
      </Tab.Pane>
    );
  }
}

export default CurrentBenefits;
