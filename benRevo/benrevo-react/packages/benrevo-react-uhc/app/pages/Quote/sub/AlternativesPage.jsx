import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import {
  Alternatives,
} from '@benrevo/benrevo-react-quote';
import { carrierName, MOTION_INFO_LINK } from '../../../config';

class AlternativesPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    carrier: PropTypes.object.isRequired,
    mainCarrier: PropTypes.object.isRequired,
  };

  render() {
    const {
      carrier,
      mainCarrier,
    } = this.props;
    let multiMode = false;
    if (mainCarrier.carrier) {
      multiMode = carrier.carrier.carrierId !== mainCarrier.carrier.carrierId;
    }
    return (
      <Alternatives
        {...this.props}
        multiMode={multiMode}
        externalRX
        carrierName={carrierName}
        motionLink={MOTION_INFO_LINK}
        smallWidth={1201}
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

export default connect(mapStateToProps, null)(AlternativesPage);
