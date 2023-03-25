import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import {
  Final,
} from '@benrevo/benrevo-react-quote';
import { carrierName } from '../../config'

class FinalPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    routes: PropTypes.array.isRequired,
  };

  render() {
    const sections = ['medical', 'dental', 'vision'];
    let modalOpen = false;

    for (let i = 0; i < sections.length; i += 1) {
      const section = sections[i];
      const carrierName = (this.props[section].selectedPlans.length) ? this.props[section].selectedPlans[0].carrier : '';
      if (this.props[section].selectedPlans.length && carrierName !== this.props[section].mainCarrier.carrier.displayName) {
        modalOpen = true;
      }
    }

    return (
      <Final
        carrierName={carrierName}
        modalOpen={modalOpen}
        showAdditionalBundling
        showKaiserMessage={false}
      />
    )
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
