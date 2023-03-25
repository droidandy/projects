/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Segment, Header, Form, Loader, Message, Icon, Divider } from 'semantic-ui-react';
import { Link } from 'react-router';
import Navigation from './Navigation';

export class ClientPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    selectError: PropTypes.bool.isRequired,
    getBrokers: PropTypes.func.isRequired,
    changeCarrier: PropTypes.func.isRequired,
    changeBrokers: PropTypes.func.isRequired,
    changeClients: PropTypes.func.isRequired,
    getClients: PropTypes.func.isRequired,
    getClientsByName: PropTypes.func.isRequired,
    clientNameSearchText: PropTypes.string.isRequired,
    updateClientNameSearchText: PropTypes.func.isRequired,
    carriers: PropTypes.array.isRequired,
    brokers: PropTypes.array.isRequired,
    clients: PropTypes.array.isRequired,
    selectedCarrier: PropTypes.object.isRequired,
    selectedBroker: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.changeBrokers = this.changeBrokers.bind(this);
  }

  componentWillMount() {
    this.props.getBrokers();
  }

  changeBrokers(e, inputState) {
    this.props.changeBrokers(inputState.value);
  }

  render() {
    const {
      loading,
      selectError,
      carriers,
      brokers,
      clients,
      selectedCarrier,
      selectedBroker,
      changeCarrier,
      changeClients,
      getClients,
      getClientsByName,
      clientNameSearchText,
      updateClientNameSearchText,
    } = this.props;

    const carrierList = carriers.map((item) => ({
      key: item.carrierId,
      value: item.carrierId,
      text: item.displayName,
    }));

    const brokerList = brokers.map((item) => ({
      key: item.id,
      value: item.id,
      text: item.name,
    }));

    return (
      <div>
        <Navigation />
        <Grid stackable container className="clients section-wrap">
          <Grid.Row>
            <Grid.Column width={16}>
              <Grid stackable as={Segment} className="gridSegment">
                <Grid.Row className="header-main">
                  <Header as="h2">Select a client</Header>
                </Grid.Row>
                <Grid.Row>
                  <Message warning hidden={!selectError}>
                    <Message.Header>
                      <Icon name="warning circle" />You need to choose a client and a carrier.</Message.Header>
                  </Message>
                  <div className="select-form">
                    <Form onSubmit={(e) => { e.preventDefault(); }}>
                      <Form.Group>
                        <Form.Input className="client-search" icon="search" iconPosition="left" placeholder="Search by Client Name" type="text" value={clientNameSearchText} onChange={(e) => { updateClientNameSearchText(e.target.value); }} />
                        <Form.Button primary size="tiny" onClick={() => { if (clientNameSearchText) getClientsByName(clientNameSearchText); }}>Search</Form.Button>
                      </Form.Group>
                      <Divider horizontal className="no-grey-background">Or</Divider>
                      <Form.Group>
                        <Form.Dropdown
                          label="Choose a carrier"
                          placeholder="Choose"
                          search
                          selection
                          options={carrierList}
                          value={selectedCarrier.carrierId}
                          onChange={(e, inputState) => { changeCarrier(inputState.value); }}
                        />
                        <Form.Dropdown
                          label="Choose a broker"
                          placeholder="Choose"
                          search
                          selection
                          options={brokerList}
                          value={selectedBroker.id}
                          onChange={this.changeBrokers}
                        />
                        <Form.Button primary size="tiny" onClick={() => { getClients(selectedBroker.id); }}>Get Client</Form.Button>
                      </Form.Group>
                    </Form>
                  </div>
                </Grid.Row>
                <Grid.Row>
                  { (clients.length > 0 || loading) && <div className="clients-header">RESULTS</div> }

                  <div className="clients-list">
                    <Loader inline active={loading} />
                    {clients.map(
                      (item, i) => <Link key={i} to="/client/plans" onClick={() => { changeClients(item); }}>{item.brokerName} - {item.clientName}</Link>
                    )}
                  </div>
                </Grid.Row>
              </Grid>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default ClientPage;
