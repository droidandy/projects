import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import {
  Overview,
} from '@benrevo/benrevo-react-quote';
import { carrierName, MOTION_INFO_LINK } from '../../../config';

class OverviewPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    carrier: PropTypes.object.isRequired,
    mainCarrier: PropTypes.object.isRequired,
  };

  render() {
    const {
      carrier,
      mainCarrier,
    } = this.props;
    const multiMode = carrier.carrier.carrierId !== mainCarrier.carrier.carrierId;

    return (
      <Overview
        {...this.props}
        multiMode={multiMode}
        carrierName={carrierName}
        motionLink={MOTION_INFO_LINK}
        multiRider
        addNetworkModal={false}
      />
    );
  }
}

function mapStateToProps(state, ownProps) {
  const overviewState = state.get('presentation').get(ownProps.section);
  return {
    mainCarrier: overviewState.get('mainCarrier').toJS(),
  };
}

export default connect(mapStateToProps, null)(OverviewPage);
