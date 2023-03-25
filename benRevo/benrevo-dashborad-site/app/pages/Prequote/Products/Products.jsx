import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Header } from 'semantic-ui-react';
import { ProductsList } from '@benrevo/benrevo-react-rfp';

class Products extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    products: PropTypes.object.isRequired,
    plans: PropTypes.object.isRequired,
    carriersLoaded: PropTypes.bool.isRequired,
    virginCoverage: PropTypes.object.isRequired,
    changeSelectedProducts: PropTypes.func.isRequired,
    changeVirginCoverage: PropTypes.func.isRequired,
    otherCarrier: PropTypes.object,
    updateCarrier: PropTypes.func.isRequired,
    carrierToDefault: PropTypes.func.isRequired,
    plansToDefault: PropTypes.func.isRequired,
    changeCarrier: PropTypes.func.isRequired,
  };

  render() {
    const {
      products,
      changeSelectedProducts,
      virginCoverage,
      otherCarrier,
      changeVirginCoverage,
      updateCarrier,
      plansToDefault,
      carrierToDefault,
      changeCarrier,
      plans,
      carriersLoaded,
    } = this.props;

    return (
      <Grid>
        <Grid.Row>
          <Grid.Column width={16} textAlign="center">
            <Header as="h1" className="title1">Products</Header>
            <div className="title1-description">
              Let{'\''}s go over everything you need to get a quote for your client
            </div>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={16}>
            <Header as="h1" className="title2">Products</Header>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={5} only="computer" />
          <Grid.Column computer={11} tablet={16} mobile={16}>
            <ProductsList
              carriersLoaded={carriersLoaded}
              products={products}
              virginCoverage={virginCoverage}
              changeSelectedProducts={changeSelectedProducts}
              changeVirginCoverage={changeVirginCoverage}
              otherCarrier={otherCarrier}
              updateCarrier={updateCarrier}
              plansToDefault={plansToDefault}
              carrierToDefault={carrierToDefault}
              changeCarrier={changeCarrier}
              plans={plans}
              tableClass="full-celled"
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default Products;
