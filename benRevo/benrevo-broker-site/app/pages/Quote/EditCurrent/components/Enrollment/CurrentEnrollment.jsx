import React from 'react';
import PropTypes from 'prop-types';
import { Tab, Header } from 'semantic-ui-react';
import { EnroRates } from '@benrevo/benrevo-react-rfp';

class CurrentEnrollment extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    section: PropTypes.string.isRequired,
  };

  render() {
    return (
      <Tab.Pane>
        <Header as="h1" className="page-heading">Enrollment</Header>
        <EnroRates
          {...this.props}
          hideButtons
          hideTitle
          withoutVirgin
          withoutValidate
        />
      </Tab.Pane>
    );
  }
}

export default CurrentEnrollment;
