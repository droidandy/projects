import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import {
  Final,
} from '@benrevo/benrevo-react-quote';
import { CARRIER, carrierName } from '../../../config';

class FinalPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    params: PropTypes.object,
  };

  render() {
    const { params } = this.props;
    const sections = ['medical', 'dental', 'vision'];
    let modalOpen = false;

    for (let i = 0; i < sections.length; i += 1) {
      const section = sections[i];
      const carrier = (this.props[section].selectedPlans.length) ? this.props[section].selectedPlans[0].carrier : '';
      if (this.props[section].selectedPlans.length && carrier !== this.props[section].mainCarrier.carrier.displayName) {
        if (CARRIER === 'ANTHEM' && carrier !== this.props[section].clearValueCarrier.carrier.displayName) {
          modalOpen = true;
          break;
        } else if (CARRIER !== 'ANTHEM') {
          modalOpen = true;
          break;
        }
      }
    }

    return (
      <Final
        carrierName={carrierName}
        modalOpen={modalOpen}
        showAdditionalBundling={CARRIER === 'ANTHEM'}
        showKaiserMessage={CARRIER === 'ANTHEM'}
        baseLink={`/client/${params.clientId}`}
      />
    );
  }
}

function mapStateToProps(state) {
  const presentationState = state.get('presentation');
  return {
    medical: presentationState.get('medical').toJS(),
    dental: presentationState.get('dental').toJS(),
    vision: presentationState.get('vision').toJS(),
  };
}

export default connect(mapStateToProps, null)(FinalPage);

