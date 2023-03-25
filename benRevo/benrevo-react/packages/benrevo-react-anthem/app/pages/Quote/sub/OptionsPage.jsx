import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import {
  Options,
} from '@benrevo/benrevo-react-quote';

class OptionsPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    quotesStatus: PropTypes.array.isRequired,
    mainCarrier: PropTypes.object.isRequired,
    clearValueCarrier: PropTypes.object.isRequired,
  };

  render() {
    const {
      mainCarrier,
      clearValueCarrier,
      quotesStatus,
    } = this.props;
    let showEmptyOption = false;
    let hasClearValue = false;

    if (quotesStatus.length) {
      for (let i = 0; i < quotesStatus.length; i +=1 ) {
        const item = quotesStatus[i];

        if (item.carrierName === mainCarrier.carrier.name && item.status === 'NOT_AVAILABLE') {
          showEmptyOption = true;
        }

        if (item.carrierName === clearValueCarrier.carrier.name && item.status === 'AVAILABLE') {
          hasClearValue = true;
        }
      }
    }

    return (
      <Options
        {...this.props}
        showQuotes={false}
        showDtp
        hasClearValue={hasClearValue}
        showEmptyOption={showEmptyOption}
      />
    )
  }
}

function mapStateToProps(state, ownProps) {
  const overviewState = state.get('presentation').get(ownProps.section);
  return {
    quotesStatus: overviewState.get('quotesStatus').toJS(),
    clearValueCarrier: overviewState.get('clearValueCarrier').toJS(),
    mainCarrier: overviewState.get('mainCarrier').toJS(),
  };
}

export default connect(mapStateToProps, null)(OptionsPage);
