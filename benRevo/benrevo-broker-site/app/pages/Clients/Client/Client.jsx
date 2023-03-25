import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Grid, Header, Loader } from 'semantic-ui-react';
import { getInitials } from '../../../utils/query';
import ClientStepCard from './components/ClientStepCard';
import MarketingStatus from './components/MarketingStatus';
import Navigation from '../../../components/Navigation';

class Client extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    children: PropTypes.node,
    getCurrentClient: PropTypes.func.isRequired,
    getValidationStatus: PropTypes.func.isRequired,
    getMarketingStatusList: PropTypes.func.isRequired,
    selectCarrier: PropTypes.func.isRequired,
    addCarrier: PropTypes.func.isRequired,
    updateMarketingStatusItem: PropTypes.func.isRequired,
    clientValidationStatus: PropTypes.object.isRequired,
    marketingStatusList: PropTypes.array.isRequired,
    programs: PropTypes.object.isRequired,
    client: PropTypes.object.isRequired,
    clientId: PropTypes.string.isRequired,
    rfpCarriers: PropTypes.object.isRequired,
    selectedCarriers: PropTypes.object.isRequired,
    loadingValidation: PropTypes.bool.isRequired,
    loadingMarketingStatusList: PropTypes.bool.isRequired,
    clientLoading: PropTypes.bool.isRequired,
    deleteCarrier: PropTypes.func.isRequired,
    getBrokerPrograms: PropTypes.func.isRequired,
    getCarrierEmailsList: PropTypes.func.isRequired,
  };

  static defaultProps = {
    children: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      openModal: false,
    };
    this.modalSection = null;

    this.openAddCarrierModal = this.openAddCarrierModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.addCarrier = this.addCarrier.bind(this);
    this.deleteCarrier = this.deleteCarrier.bind(this);
    this.capitalizeFirstLetter = this.capitalizeFirstLetter.bind(this);
  }

  componentWillMount() {
    const {
      getCurrentClient,
      clientId,
      getValidationStatus,
      getMarketingStatusList,
      client,
      getBrokerPrograms,
      getCarrierEmailsList,
    } = this.props;
    if (!client.id || (client.id && client.id.toString() !== clientId)) getCurrentClient(clientId);
    getCarrierEmailsList();
    getValidationStatus(clientId);
    getMarketingStatusList(clientId);
    if (client && client.brokerId) getBrokerPrograms(client.brokerId);
  }

  componentWillReceiveProps(nextProps) {
    const { client } = nextProps;
    // case where client brokerId data did not load in time for componentWillMount
    if (this.props.client && !this.props.client.brokerId && client && client.brokerId) {
      this.props.getBrokerPrograms(client.brokerId);
    }
  }

  openAddCarrierModal(section) {
    this.modalSection = section;
    this.setState({ openModal: true });
  }

  closeModal() {
    this.setState({ openModal: false });
  }

  addCarrier() {
    const { clientId, addCarrier } = this.props;
    addCarrier(clientId);
    this.setState({ openModal: false });
  }

  deleteCarrier(carrierItem, section) {
    const { clientId, deleteCarrier } = this.props;
    deleteCarrier(clientId, carrierItem, section);
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  render() {
    const {
      client,
      children,
      clientValidationStatus,
      marketingStatusList,
      rfpCarriers,
      selectedCarriers,
      selectCarrier,
      updateMarketingStatusItem,
      clientId,
      loadingValidation,
      loadingMarketingStatusList,
      clientLoading,
      products,
    } = this.props;
    // console.log('client props', this.props);
    const loaded = !clientLoading && rfpCarriers.medical.length > 0 && rfpCarriers.dental.length > 0 && rfpCarriers.vision.length > 0;
    let productString = '';
    Object.keys(client.products).forEach((product) => {
      if (client.products[product]) {
        if (productString.length > 0) {
          productString += `, ${this.capitalizeFirstLetter(product)}`;
        } else {
          productString += this.capitalizeFirstLetter(product);
        }
      }
    });
    return (
      <div className="client-page">
        { !children && <Navigation clientName={client.clientName} /> }
        { !children && client.id && loaded &&
        <Grid stackable container className="section-wrap">
          <Grid.Row>
            <Grid.Column width={16}>
              <div className="client">
                <Helmet
                  title="Client"
                  meta={[
                    { name: 'description', content: 'Description of Client' },
                  ]}
                />
                <Header className="page-title">
                  <Grid className="client-info">
                    <Grid.Row>
                      <Grid.Column computer="10" tablet="10" mobile="16" className="initials">
                        <span className="client-initials">{getInitials(client.clientName)}</span>
                        <span className="client-name">{client.clientName}</span>
                      </Grid.Column>
                      <Grid.Column computer="6" tablet="6" mobile="16">
                        <Grid className="client-details">
                          <Grid.Row>
                            <Grid.Column className="gray left-floated" computer="6">
                              EFFECTIVE DATE
                            </Grid.Column>
                            <Grid.Column computer="10">
                              {client.effectiveDate}
                            </Grid.Column>
                          </Grid.Row>
                          <Grid.Row>
                            <Grid.Column className="gray left-floated" computer="6">
                              PRODUCTS
                            </Grid.Column>
                            <Grid.Column computer="10">
                              {productString}
                            </Grid.Column>
                          </Grid.Row>
                        </Grid>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Header>

                <Grid>
                  { !loadingValidation &&
                  <Grid.Row>
                    <h4 className="intro-text">Track and complete your client from RFP to Presentation.</h4>
                    <Grid.Column width="16" className="step-cards">
                      <ClientStepCard
                        disabled={!client.id}
                        link={`/clients/${client.id}/setup`}
                        header="1. Client Setup"
                        descr="Enter client info and select product to include."
                        status={clientValidationStatus}
                        type="client"
                      />
                      <ClientStepCard
                        disabled={!client.id}
                        link={`/clients/${client.id}/rfp/start`}
                        header="2. RFPs"
                        descr="Create an RFP (Optional)."
                        status={clientValidationStatus}
                        type="rfp"
                      />
                      <ClientStepCard
                        disabled={!client.id}
                        link={`/clients/${client.id}/presentation`}
                        header={'3. Build Presentation'}
                        descr={'Import or enter raw information and select options to show...we\'ll do all the work.'}
                        status={clientValidationStatus}
                        type="presentation"
                      />
                      <ClientStepCard
                        disabled={!client.id}
                        link={`/clients/${client.id}/build/setup`}
                        header="4. Download Presentation"
                        descr="Download a client ready presentation in PowerPoint or PDF."
                        status={clientValidationStatus}
                        type={'download'}
                      />
                    </Grid.Column>
                  </Grid.Row>
                  }
                  { loadingValidation &&
                  <Grid.Row>
                    <Loader indeterminate active={loadingValidation} size="big" />
                  </Grid.Row>
                  }
                  { !loadingMarketingStatusList &&
                  <Grid.Row>
                    <MarketingStatus
                      products={client.products}
                      deleteCarrier={this.deleteCarrier}
                      selectCarrier={selectCarrier}
                      openModal={this.state.openModal}
                      rfpCarriers={rfpCarriers}
                      selectedCarriers={selectedCarriers}
                      marketingStatusList={marketingStatusList}
                      closeModal={this.closeModal}
                      addCarrier={this.addCarrier}
                      openAddCarrierModal={this.openAddCarrierModal}
                      updateMarketingStatusItem={updateMarketingStatusItem}
                      loadingMarketingStatusList={loadingMarketingStatusList}
                      clientId={clientId}
                    />
                  </Grid.Row>
                  }
                  { loadingMarketingStatusList && !loadingValidation &&
                  <Grid.Row>
                    <Loader indeterminate active={loadingMarketingStatusList} size="big" />
                  </Grid.Row>
                  }
                </Grid>
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        }
        { client.id && loaded && children }
        { !loaded &&
        <Loader indeterminate active={!loaded} size="big" />
        }
      </div>
    );
  }
}

export default Client;
