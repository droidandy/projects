import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Grid, Header, Message, Dimmer, Loader, Table, Segment, Image, Button, Input, Form } from 'semantic-ui-react';
import { Link } from 'react-router';
import { DownImg } from '@benrevo/benrevo-react-core';
import ClientTableItem from './ClientTableItem';
import GAModal from './GAModal';
import Tutorial from '../components/Tutorial';

export class BrokerClients extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    clients: PropTypes.array.isRequired,
    brokerages: PropTypes.array.isRequired,
    sort: PropTypes.object.isRequired,
    selectClient: PropTypes.func.isRequired,
    onClientsSort: PropTypes.func.isRequired,
    changeUserCount: PropTypes.func.isRequired,
    changePage: PropTypes.func.isRequired,
    quoteNewClient: PropTypes.func,
    loginCount: PropTypes.number,
    loading: PropTypes.bool,
    isGALoading: PropTypes.bool,
    requestError: PropTypes.bool,
    rfpRouteFailed: PropTypes.bool,
    presentationRouteFailed: PropTypes.bool,
    onboardingRouteFailed: PropTypes.bool,
    timelineRouteFailed: PropTypes.bool,
    isGA: PropTypes.bool.isRequired,
    tutorial: PropTypes.object.isRequired,
    brokerClientsTimeline: PropTypes.bool.isRequired,
    clearValueBanner: PropTypes.node,
    brokerageFromProfile: PropTypes.string.isRequired,
  };
  constructor(props) {
    super(props);

    this.state = {
      modalOpen: false,
      searchText: '',
      filteredClients: this.props.clients,
    };

    this.onClickNewClient = this.onClickNewClient.bind(this);
    this.onSearchInputChange = this.onSearchInputChange.bind(this);
    this.filterClientsBySearchText = this.filterClientsBySearchText.bind(this);
    this.newClient = this.newClient.bind(this);
    this.modalToggle = this.modalToggle.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.filterClientsBySearchText();

    if (!nextProps.loading && this.props.loading) {
      this.setState({ filteredClients: nextProps.clients });
    }
  }

  onClickNewClient() {
    if (!this.isGA) {
      this.props.quoteNewClient();
      this.props.changePage();
    } else {
      this.modalToggle();
    }
  }

  onSearchInputChange(e) {
    const value = e.target.value.toLowerCase();
    this.setState({ searchText: value }, () => {
      this.filterClientsBySearchText();
    });
  }

  filterClientsBySearchText() {
    const search = this.state.searchText;
    const foundClients = this.props.clients.filter((client) => {
      let members = '';
      client.clientMembers.forEach((member, i) => {
        members += member.fullName;
        if (i < client.clientMembers.length - 1) members += ', ';
      });
      if (
        (client.clientName && client.clientName.toLowerCase().indexOf(search) !== -1)
        || (client.brokerName && client.brokerName.toLowerCase().indexOf(search) !== -1)
        || (client.effectiveDate && client.effectiveDate.toLowerCase().indexOf(search) !== -1)
        || (client.clientState && client.clientState.toLowerCase().indexOf(search) !== -1)
        || (members.length !== 0 && members.toLowerCase().indexOf(search) !== -1)
      ) {
        return true;
      }
      return false;
    });

    this.setState({ filteredClients: foundClients });
  }

  newClient(selectedGABrokerage) {
    this.props.quoteNewClient(selectedGABrokerage);
    this.props.changePage();
  }

  modalToggle() {
    const close = !this.state.modalOpen;
    this.setState({ modalOpen: close });
  }

  get isGA() {
    return this.props.isGA;
  }

  render() {
    const {
      clients,
      requestError,
      sort,
      onClientsSort,
      rfpRouteFailed,
      presentationRouteFailed,
      onboardingRouteFailed,
      timelineRouteFailed,
      loginCount,
      clearValueBanner,
      tutorial,
      brokerClientsTimeline,
      brokerageFromProfile,
    } = this.props;
    const showGAFeatures = this.isGA;
    return (
      <div>
        <Helmet
          title="ClientPage"
          meta={[
            { name: 'description', content: 'Description of ClientPage' },
          ]}
        />
        <Grid stackable container className="clients section-wrap">
          <Grid.Column width={16}>
            <Grid stackable as={Segment} className="gridSegment">
              <Grid.Row>
                <Grid.Column width={16}>
                  {clearValueBanner}
                  {(clients.length > 10 && clearValueBanner) &&
                  <Form className="search-client-form">
                    <Input icon="search" iconPosition="left" placeholder="Search for a client" type="text" fluid onChange={this.onSearchInputChange} />
                  </Form>
                  }
                  <Dimmer active={this.props.loading && !clients.length} inverted>
                    <Loader indeterminate size="big">Fetching clients</Loader>
                  </Dimmer>
                  <Message warning hidden={!requestError}>
                    <Message.Header>There was an error retrieving your clients. Please refresh and try again.</Message.Header>
                  </Message>
                  <Message info hidden={!rfpRouteFailed}>
                    <Message.Header>{'To create an RFP, you need to select a client.'}</Message.Header>
                  </Message>
                  <Message info hidden={!presentationRouteFailed}>
                    <Message.Header>{'To view the presentation, you need to select a client.'}</Message.Header>
                  </Message>
                  <Message info hidden={!onboardingRouteFailed}>
                    <Message.Header>{'To view the On-Boarding, you need to select a client.'}</Message.Header>
                  </Message>
                  <Message info hidden={!timelineRouteFailed}>
                    <Message.Header>{'To view the Timeline, you need to select a client.'}</Message.Header>
                  </Message>
                  <div className="page-heading-top">
                    <Header as="h1" className="page-heading">Clients</Header>
                    <Button disabled={this.props.isGALoading} className="new-client-button" size="big" primary onClick={this.onClickNewClient}>Start New RFP</Button>
                  </div>
                  {(clients.length > 10 && !clearValueBanner) &&
                  <Form className="search-client-form">
                    <Input icon="search" iconPosition="left" placeholder="Search for a client" type="text" fluid onChange={this.onSearchInputChange} />
                  </Form>
                  }

                  <Table basic stackable sortable className={(this.props.loading) ? 'loading main-table' : 'main-table'}>
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell
                          sorted={(sort.prop === 'clientName') ? sort.order : 'ascending'}
                          className={(sort.prop !== 'clientName') ? 'sort-inactive' : ''}
                          onClick={() => { onClientsSort('clientName'); }}
                        >Client</Table.HeaderCell>
                        { showGAFeatures &&
                        <Table.HeaderCell
                          sorted={(sort.prop === 'brokerName') ? sort.order : 'ascending'}
                          className={(sort.prop !== 'brokerName') ? 'sort-inactive' : ''}
                          onClick={() => { onClientsSort('brokerName'); }}
                        >Brokerage</Table.HeaderCell>
                        }
                        <Table.HeaderCell
                          sorted={(sort.prop === 'effectiveDate') ? sort.order : 'ascending'}
                          className={(sort.prop !== 'effectiveDate') ? 'sort-inactive' : ''}
                          onClick={() => { onClientsSort('effectiveDate'); }}
                        >Effective Date</Table.HeaderCell>
                        <Table.HeaderCell
                          sorted={(sort.prop === 'clientState') ? sort.order : 'ascending'}
                          className={(sort.prop !== 'clientState') ? 'sort-inactive' : ''}
                          onClick={() => { onClientsSort('clientState'); }}
                        >Status</Table.HeaderCell>
                        <Table.HeaderCell>Members</Table.HeaderCell>
                        <Table.HeaderCell>Actions</Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {this.state.filteredClients.map(
                        (item, i) =>
                            <ClientTableItem
                              brokerClientsTimeline={brokerClientsTimeline}
                              key={i}
                              showGAFeatures={showGAFeatures}
                              item={item}
                              selectClient={this.props.selectClient}
                            />
                      )}
                      {!this.state.filteredClients.length && !this.props.loading &&
                      <Table.Row>
                        <Table.Cell colSpan={(showGAFeatures) ? 6 : 5} textAlign="center" className="table-empty">
                          <div className="table-empty-inner">
                            <div>You currently have no clients</div>
                            <div className="title">Start here</div>
                            <Image src={DownImg} />
                            <div><a className="main-button" tabIndex={0} rel="button" onClick={this.onClickNewClient}>Start New RFP</a></div>
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      }
                    </Table.Body>
                  </Table>
                  <div className="import-client-button">Already have a client from BenRevo? <Link to="/clients/import" onClick={() => { this.props.selectClient(); }}>Import client</Link></div>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Grid.Column>
          { loginCount === 1 && <Tutorial changeUserCount={this.props.changeUserCount} tutorial={tutorial} /> }
        </Grid>
        { showGAFeatures && <GAModal route="/rfp/client" modalOpen={this.state.modalOpen} modalToggle={this.modalToggle} action={this.newClient} brokerages={this.props.brokerages} brokerageFromProfile={brokerageFromProfile} /> }
      </div>
    );
  }
}

export default BrokerClients;
