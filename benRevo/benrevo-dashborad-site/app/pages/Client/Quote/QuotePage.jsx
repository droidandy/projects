import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Image } from 'semantic-ui-react';
import {
  Quote,
} from '@benrevo/benrevo-react-quote';
import {
  ClearValue,
} from '@benrevo/benrevo-react-core';
import logo from './../../../pages/App/Header/logo';
import { CARRIER, carrierName } from '../../../config';

class QuotePage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    routes: PropTypes.array.isRequired,
    params: PropTypes.object,
  };

  render() {
    const { params } = this.props;
    const slotLogos = () => <Grid className="logos">
      <Grid.Row className="logosBlock" centered>
        <Grid.Column width={4} verticalAlign="middle" textAlign="center">
          <Image style={{ height: 55 }} src={logo.link} centered />
        </Grid.Column>
        { CARRIER === 'ANTHEM' &&
        <Grid.Column width={4}>
          <Image className="quoteSummaryCarrierLogo clearValue" src={ClearValue} />
        </Grid.Column>
        }
      </Grid.Row>
    </Grid>;
    return (
      <Quote
        logos={slotLogos()}
        carrierName={carrierName}
        baseLink={`/client/${params.clientId}`}
        discounts={{
          total: CARRIER === 'UHC' ? '1.5%' : '2%',
          dental: '1%',
          vision: CARRIER === 'UHC' ? '0.5%' : '1%',
        }}
      />
    );
  }
}

export default QuotePage;
