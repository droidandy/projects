import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Button, Segment, Header } from 'semantic-ui-react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import AddCarrierContent from '../../../../components/AddCarrier';

class CarrierPageSelect extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    changePage: PropTypes.func.isRequired,
    selectCarrier: PropTypes.func.isRequired,
    rfpCarriers: PropTypes.object.isRequired,
    selectedCarriers: PropTypes.object.isRequired,
    products: PropTypes.object.isRequired,
  };

  constructor() {
    super();

    this.selectCarrier = this.selectCarrier.bind(this);
  }

  selectCarrier(carrier, section) {
    this.props.selectCarrier(carrier, section, this.props.products);
  }

  render() {
    const {
      changePage,
      rfpCarriers,
      selectedCarriers,
      products,
    } = this.props;

    return (
      <Grid container stackable columns={2} className="carrierRfpMainContainer section-wrap">
        <Grid.Row>
          <Grid.Column width={16}>
            <Grid stackable columns={2} as={Segment} className="gridSegment">
              <Grid.Row className="rfpRowDivider">
                <div className="page-heading-top">
                  <Header as="h1" className="page-heading small">Which carriers to you want to submit RFP to?</Header>
                </div>
                <AddCarrierContent
                  selectCarrier={this.selectCarrier}
                  carriers={rfpCarriers}
                  selectedCarriers={selectedCarriers}
                  hideMedical={!products.medical}
                  hideDental={!products.dental}
                  hideVision={!products.vision}
                  hideLife={!products.life}
                  hideStd={!products.std}
                  hideLtd={!products.ltd}
                  hideVolLife
                  hideVolStd
                  hideVolLtd
                  showAll
                />
              </Grid.Row>
              <Grid.Row>
                <div className="pageFooterActions">
                  <Button onClick={() => changePage('send')} primary floated="right" size="big">Save & Continue</Button>
                  <Button onClick={() => changePage('check')} floated="left" size="big" basic>Back</Button>
                </div>
              </Grid.Row>
            </Grid>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default CarrierPageSelect;
