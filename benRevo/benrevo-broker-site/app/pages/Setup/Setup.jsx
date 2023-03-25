import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import { Grid, Header, Segment, Input, Button, Loader } from 'semantic-ui-react';
import { ProductsList } from '@benrevo/benrevo-react-rfp';
import {
  CLIENT_NAME,
  EFFECTIVE_DATE,
} from '@benrevo/benrevo-react-clients';
import Navigation from '../../components/Navigation';

class Setup extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    client: PropTypes.object.isRequired,
    clientId: PropTypes.string,
    clientSaveInProgress: PropTypes.bool.isRequired,
    products: PropTypes.object.isRequired,
    plans: PropTypes.object.isRequired,
    virginCoverage: PropTypes.object.isRequired,
    changeSelectedProducts: PropTypes.func.isRequired,
    changeVirginCoverage: PropTypes.func.isRequired,
    updateClient: PropTypes.func.isRequired,
    quoteNewClient: PropTypes.func.isRequired,
    otherCarrier: PropTypes.object,
    updateCarrier: PropTypes.func.isRequired,
    carrierToDefault: PropTypes.func.isRequired,
    plansToDefault: PropTypes.func.isRequired,
    saveClient: PropTypes.func.isRequired,
    changePage: PropTypes.func.isRequired,
    changeCarrier: PropTypes.func.isRequired,
  };

  static defaultProps = {
    otherCarrier: null,
    clientId: '',
  };

  constructor() {
    super();

    this.onRawChangeDate = ::this.onRawChangeDate;
    this.onChangeHandler = ::this.onChangeHandler;
  }

  componentWillMount() {
    if (!this.props.clientId) this.props.quoteNewClient();
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.clientSaveInProgress && this.props.clientSaveInProgress) {
      nextProps.changePage(nextProps.client.id);
    }
  }

  onChangeHandler(e, inputState) {
    this.props.updateClient(e.target.name, inputState.value);
  }

  onRawChangeDate(type, event) {
    const date = event.target.value;

    if (moment(date, ['L', 'l', 'M/D/YY'], true).isValid()) {
      this.props.updateClient(type, (event.target.value) ? moment(event.target.value, ['L', 'l', 'M/D/YY']).format('L') : '');
    }
  }

  render() {
    const {
      client,
      products,
      changeSelectedProducts,
      virginCoverage,
      otherCarrier,
      changeVirginCoverage,
      updateCarrier,
      plansToDefault,
      carrierToDefault,
      updateClient,
      clientSaveInProgress,
      saveClient,
      changeCarrier,
      plans,
    } = this.props;

    return (
      <div>
        <Navigation clientName="Client Setup" />
        <Grid stackable container className="section-wrap setup-page">
          <Grid.Row>
            <Grid.Column width={16}>
              <div className="setup">
                <Helmet
                  title="Client Setup"
                  meta={[
                    { name: 'description', content: 'Description of Client Setup' },
                  ]}
                />
                <Grid stackable as={Segment} className="gridSegment rfp-products">
                  <Grid.Row>
                    <Grid.Column width={16}>
                      <div className="page-heading-top">
                        <Header as="h1" className="page-heading">Client Setup</Header>
                      </div>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row className="rfpRowDivider">
                    <Grid.Column width={5}>
                      <Header as="h3" className="rfpPageSectionHeading">ABOUT YOUR CLIENT</Header>
                    </Grid.Column>
                    <Grid.Column width={6}>
                      <Grid>
                        <Grid.Row>
                          <Grid.Column width={16}>
                            <Header as="h3" className="rfpPageFormSetHeading">Name of client</Header>
                            <Input
                              value={client.clientName}
                              name={CLIENT_NAME}
                              fluid
                              placeholder="Enter the client's name"
                              onChange={this.onChangeHandler}
                            />
                          </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                          <Grid.Column width={16}>
                            <Header as="h3" className="rfpPageFormSetHeading">Effective Date</Header>
                            <DatePicker
                              className="datepicker"
                              placeholderText="Enter the effective date"
                              name={EFFECTIVE_DATE}
                              selected={(client[EFFECTIVE_DATE]) ? moment(client[EFFECTIVE_DATE], ['L']) : null}
                              onChange={(date) => { updateClient(EFFECTIVE_DATE, (date) ? moment(date).format('L') : ''); }}
                              onChangeRaw={(event) => { this.onRawChangeDate(EFFECTIVE_DATE, event); }}
                            />
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>

                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row className="rfpRowDivider">
                    <Grid.Column width={5}>
                      <Header as="h3" className="rfpPageSectionHeading">Products</Header>
                    </Grid.Column>
                    <Grid.Column width={10}>
                      <div />
                      <ProductsList
                        simpleMode
                        carriersLoaded
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
                      />
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column width={16} textAlign="right">
                      <div className="pageFooterActions">
                        <Loader inline active={clientSaveInProgress} />
                        <Button disabled={clientSaveInProgress || !client.clientName || !client[EFFECTIVE_DATE]} onClick={saveClient} primary size="big">Save & Continue</Button>
                      </div>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default Setup;
