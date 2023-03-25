import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Header, Grid, Segment, Button, Checkbox, Loader } from 'semantic-ui-react';
import FormBase from './../../FormBaseClass';
import ProductsList from './components/ProductsList';

class Products extends FormBase { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    section: PropTypes.string.isRequired,
    declinedOutside: PropTypes.bool,
    clientSaveInProgress: PropTypes.bool,
    carriersLoaded: PropTypes.bool.isRequired,
    showDeclined: PropTypes.bool.isRequired,
    products: PropTypes.object.isRequired,
    plans: PropTypes.object.isRequired,
    virginCoverage: PropTypes.object.isRequired,
    changeSelectedProducts: PropTypes.func.isRequired,
    changeVirginCoverage: PropTypes.func.isRequired,
    changeCarrier: PropTypes.func.isRequired,
    saveClient: PropTypes.func.isRequired,
    updateClient: PropTypes.func.isRequired,
    updateCarrier: PropTypes.func.isRequired,
    carrierToDefault: PropTypes.func.isRequired,
    plansToDefault: PropTypes.func.isRequired,
    otherCarrier: PropTypes.object,
  };

  constructor() {
    super();
    this.saveClient = ::this.saveClient;
  }

  saveClient() {
    if (!this.props.clientSaveInProgress) {
      this.props.saveClient();
    }

    this.saveInformationSection();
  }

  render() {
    const { products, changeSelectedProducts, declinedOutside, updateClient, virginCoverage, carriersLoaded, otherCarrier, showDeclined, clientSaveInProgress, changeVirginCoverage, updateCarrier, plansToDefault, carrierToDefault, changeCarrier, plans } = this.props;
    return (
      <div>
        <Helmet
          title="Client Products"
          meta={[
            { name: 'description', content: 'Description of client products' },
          ]}
        />
        <Grid stackable columns={2} as={Segment} className="gridSegment rfp-products">
          <Grid.Row>
            <Grid.Column width={16} textAlign="center" >
              <Header as="h1" className="rfpPageHeading">RFP Products</Header>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row className="rfpRowDivider">
            <Grid.Column width={5}>
              <Header as="h3" className="rfpPageSectionHeading">Products</Header>
            </Grid.Column>
            <Grid.Column width={11}>
              <Header as="h3" className="rfpPageFormSetHeading">Please select which product(s) to include in the RFP. <br /> You should include at least one product.</Header>
              <ProductsList
                carriersLoaded={carriersLoaded}
                products={products}
                plans={plans}
                virginCoverage={virginCoverage}
                changeSelectedProducts={changeSelectedProducts}
                changeVirginCoverage={changeVirginCoverage}
                otherCarrier={otherCarrier}
                updateCarrier={updateCarrier}
                changeCarrier={changeCarrier}
                plansToDefault={plansToDefault}
                carrierToDefault={carrierToDefault}
              />
            </Grid.Column>
          </Grid.Row>
          { showDeclined &&
          <Grid.Row className="anthem" />
          }
          { showDeclined &&
          <Grid.Row className="rfpRowDivider anthem" centered>
            <Grid.Column width="16">
              <Checkbox
                label="I certify that I have not received a DTQ from Anthem for this client for the current effective date due to large claims"
                checked={declinedOutside}
                onChange={(e, inputState) => { updateClient('declinedOutside', inputState.checked); }}
              />
            </Grid.Column>
          </Grid.Row>
          }
          <Grid.Row>
            <div className="pageFooterActions">
              <Button disabled={clientSaveInProgress} onClick={this.saveClient} primary floated={'right'} size="big">Save & Continue</Button>
              <Button onClick={() => { this.changePage('back'); }} floated={'left'} basic size='big'>Back</Button>
              <Loader inline active={clientSaveInProgress} />
            </div>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}


export default Products;
