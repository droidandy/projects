import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Image } from 'semantic-ui-react';
import {
  Quote,
} from '@benrevo/benrevo-react-quote';
import logo from './../../pages/App/logo';
import { carrierName } from '../../config'

class QuotePage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    routes: PropTypes.array.isRequired,
  };

  render() {
    const slotLogos = () => <Grid className="logos">
      <Grid.Row className="logosBlock" centered>
        <Grid.Column width={4} verticalAlign="middle" textAlign="center">
          <Image src={logo.link} centered />
        </Grid.Column>
      </Grid.Row>
    </Grid>;
    return (
      <Quote
        logos={slotLogos()}
        carrierName={carrierName}
        discounts={{
          total: '3%',
          dental: '1%',
          vision: '0.5%',
          life: '0.5%',
          std: '0.5%',
          ltd: '0.5%',
        }}
      />
    );
  }
}

export default QuotePage;
