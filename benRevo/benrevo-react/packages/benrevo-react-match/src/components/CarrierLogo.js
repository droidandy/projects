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
import { getCarrier } from '@benrevo/benrevo-react-quote';

class CarrierLogo extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    quoteType: PropTypes.string,
    carrierList: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object,
    ]),
    carrier: PropTypes.string.isRequired,
  };

  static defaultProps = {
    quoteType: 'STANDARD',
  };


  render() {
    let carrier;
    let url;

    if (this.props.carrier !== 'Multiple Carriers') {
      carrier = getCarrier(this.props.carrierList, this.props.carrier);

      if (carrier) url = (this.props.quoteType !== 'KAISER' || this.props.carrier === 'Kaiser') ? carrier.carrier.originalImageUrl : carrier.carrier.originalImageKaiserUrl;
      else url = null;
    } else {
      url = (this.props.quoteType !== 'KAISER' || this.props.carrier === 'Kaiser') ? MultiCarriersImg : MultiCarriersKaiserImg;
    }

    let className = 'carrier-logo ';

    if (this.props.quoteType === 'KAISER' && this.props.carrier !== 'Kaiser') className += 'kaiser-logo';
    else if (this.props.quoteType === 'CLEAR_VALUE') className += 'clear-value-logo';
    return (
      <Image className={className} src={url} />
    );
  }
}

function mapStateToProps(state, ownProps) {
  const rfpCarriers = state.get('app').get('rfpcarriers').toJS();

  return {
    carrierList: rfpCarriers[ownProps.section],
  };
}

function mapDispatchToProps() {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(CarrierLogo);
