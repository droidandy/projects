import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import {
  Alternatives,
} from '@benrevo/benrevo-react-quote';

class AlternativesPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
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
    let multiMode = false;
    if (mainCarrier.carrier) {
      multiMode = carrier.carrier.carrierId !== mainCarrier.carrier.carrierId;
      if (multiMode && carrier.carrier.carrierId === clearValueCarrier.carrier.carrierId) multiMode = false;
    }
    return (
      <Alternatives
        { ...this.props }
        multiMode={multiMode}
        externalRX={false}
        smallWidth={1201}
      />
    )
  }
}

function mapStateToProps(state, ownProps) {
  const overviewState = state.get('presentation').get(ownProps.section);
  return {
    mainCarrier: overviewState.get('mainCarrier').toJS(),
    clearValueCarrier: overviewState.get('clearValueCarrier').toJS(),
  };
}

export default connect(mapStateToProps, null)(AlternativesPage);
