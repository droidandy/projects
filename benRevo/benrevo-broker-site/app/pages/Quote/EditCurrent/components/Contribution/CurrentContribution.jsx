import React from 'react';
import PropTypes from 'prop-types';
import { Tab, Header } from 'semantic-ui-react';
import { Contribution } from '@benrevo/benrevo-react-rfp';

class CurrentContribution extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    section: PropTypes.string.isRequired,
  };

  render() {
    return (
      <Tab.Pane>
        <Header as="h1" className="page-heading">Contribution</Header>
        <Contribution
          {...this.props}
          hideButtons
          hideTitle
          withoutValidate
        />
      </Tab.Pane>
    );
  }
}

export default CurrentContribution;
