/*
 *
 * ClientPage
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { ClientPage } from '@benrevo/benrevo-react-clients';
import tutorial from './tutorial';

export class Clients extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const clearValueBanner = () => null;
    return (
      <ClientPage
        tutorial={tutorial}
        clearValueBanner={clearValueBanner()}
        brokerClientsTimeline={false}
      />
    );
  }
}

function mapStateToProps() {
  return {};
}

function mapDispatchToProps() {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Clients);
