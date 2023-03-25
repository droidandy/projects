/*
 *
 * ClientPage
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { Image } from 'semantic-ui-react';
import { ClientPage } from '@benrevo/benrevo-react-clients';
import { MouseImg } from '@benrevo/benrevo-react-core';
import Anthem from './tutorialAnthem';

export class Clients extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const clearValueBanner = () =>
      <div className="clear-value-banner">
        <div className="clear-value-left"></div>
        <div className="clear-value-right">
          <span>Submit an RFP and receive instant rates</span>
          <Image src={MouseImg} />
          <div>Instant. Simple. Streamlined.</div>
        </div>
      </div>;
    return (
      <ClientPage
        tutorial={Anthem}
        clearValueBanner={clearValueBanner()}
        brokerClientsTimeline
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
