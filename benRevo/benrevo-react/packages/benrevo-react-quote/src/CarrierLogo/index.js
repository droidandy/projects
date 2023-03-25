/**
 *
 * CarrierLogo
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Image } from 'semantic-ui-react';
import { connect } from 'react-redux';
import {
  MultiCarriersImg,
  MultiCarriersKaiserImg,
} from '@benrevo/benrevo-react-core';
import { getCarrier } from '../utils';

class CarrierLogo extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    quoteType: PropTypes.string,
    mainCarrier: PropTypes.object,
    clearValueCarrier: PropTypes.object,
    carrierList: PropTypes.array,
    carrier: PropTypes.string,
  };

  insert(str, index, value) {
    return str.substr(0, index) + value + str.substr(index);
  }

  render() {
    let carrier;
    let url;

    if (this.props.carrier !== 'Multiple Carriers') {
      carrier = getCarrier(this.props.carrierList, this.props.carrier);

      if (!carrier) {
        if (this.props.carrier !== 'Anthem Clear Value') carrier = this.props.mainCarrier;
        else carrier = this.props.clearValueCarrier;
      }

      url = (this.props.quoteType !== 'KAISER') ? carrier.carrier.logoUrl : carrier.carrier.logoWKaiserUrl;
    } else {
      url = (this.props.quoteType !== 'KAISER') ? MultiCarriersImg : MultiCarriersKaiserImg;
    }

    let className = 'carrier-logo ';

    if (this.props.quoteType === 'KAISER') className += 'kaiser-logo';
    else if (this.props.quoteType === 'CLEAR_VALUE') className += 'clear-value-logo';

    return (
      <Image className={className} src={url} />
    );
  }
}

function mapStateToProps(state, ownProps) {
  const overviewState = state.get('presentation').get(ownProps.section);
  return {
    mainCarrier: overviewState.get('mainCarrier').toJS(),
    carrierList: overviewState.get('carrierList').toJS(),
    clearValueCarrier: overviewState.get('clearValueCarrier').toJS(),
  };
}

function mapDispatchToProps() {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(CarrierLogo);
