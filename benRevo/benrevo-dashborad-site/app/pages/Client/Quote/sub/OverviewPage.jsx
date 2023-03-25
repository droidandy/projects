import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import {
  Overview,
} from '@benrevo/benrevo-react-quote';
import { CARRIER, carrierName } from '../../../../config';

class OverviewPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    carrier: PropTypes.object.isRequired,
    mainCarrier: PropTypes.object.isRequired,
    clearValueCarrier: PropTypes.object,
  };

  render() {
    const {
      carrier,
      mainCarrier,
      clearValueCarrier,
    } = this.props;
    let multiMode = carrier.carrier.carrierId !== mainCarrier.carrier.carrierId;

    if (multiMode && CARRIER === 'ANTHEM' && carrier.carrier.carrierId === clearValueCarrier.carrier.carrierId) multiMode = false;

    return (
      <Overview
        {...this.props}
        multiMode={multiMode}
        carrierName={carrierName}
        multiRider={CARRIER === 'UHC'}
        addNetworkModal={CARRIER === 'ANTHEM'}
      />
    );
  }
}

function mapStateToProps(state, ownProps) {
  const overviewState = state.get('presentation').get(ownProps.section);
  return {
    mainCarrier: overviewState.get('mainCarrier').toJS(),
    clearValueCarrier: overviewState.get('clearValueCarrier').toJS(),
  };
}

export default connect(mapStateToProps, null)(OverviewPage);
