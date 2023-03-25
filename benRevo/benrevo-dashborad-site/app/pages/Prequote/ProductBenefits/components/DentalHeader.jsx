import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';

class ProductDentalBenefitsHeader extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    title: PropTypes.string.isRequired,
    info: PropTypes.string.isRequired,
    long: PropTypes.bool,
  };

  render() {
    const {
      long,
      title,
      info,
    } = this.props;

    return (
      <Grid.Row className="benefits-part ">
        <Grid.Column width={4} className="labelColumn" verticalAlign="top">
          <span>{title}</span>
        </Grid.Column>
        <Grid.Column width={long ? 11 : 8} className="infoColumn network" verticalAlign="top">
          <span>{info}</span>
        </Grid.Column>
      </Grid.Row>
    );
  }
}

export default ProductDentalBenefitsHeader;
