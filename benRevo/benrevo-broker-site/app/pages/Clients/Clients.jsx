import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Grid, Segment, Header, Button, Table, Image, Dimmer, Loader, Input } from 'semantic-ui-react';
import { Link } from 'react-router';
import { DownImg } from '@benrevo/benrevo-react-core';
import ClientTableItem from './components/ClientTableItem';

class Clients extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    getClients: PropTypes.func.isRequired,
    clientsSort: PropTypes.func.isRequired,
    clients: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object,
    ]).isRequired,
    sort: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
    };
    this.onSearchInputChange = this.onSearchInputChange.bind(this);
  }

  componentWillMount() {
    this.props.getClients();
  }

  onSearchInputChange(value) {
    this.setState({ searchText: value });
  }

  render() {
    const {
      clients,
      clientsSort,
      sort,
      loading,
    } = this.props;

    const search = this.state.searchText.toLowerCase();
    let foundClients = [];
    if (this.props.clients.length) {
      foundClients = this.props.clients.filter((client) => {
        let members = '';
        client.clientMembers.forEach((member, i) => {
          members += member.fullName;
          if (i < client.clientMembers.length - 1) members += ', ';
        });
        if (
          (client.clientName && client.clientName.toLowerCase().indexOf(search) !== -1)
          || (client.effectiveDate && client.effectiveDate.toLowerCase().indexOf(search) !== -1)
          || (client.clientState && client.clientState.toLowerCase().indexOf(search) !== -1)
          || (members.length !== 0 && members.toLowerCase().indexOf(search) !== -1)
        ) {
          return true;
        }
        return false;
      });
    }

    return (
      <Grid stackable container className="section-wrap">
        <Grid.Row>
          <Grid.Column width={16}>
            <div className="clients">
              <Helmet
                title="Clients"
                meta={[
                  { name: 'description', content: 'Description of Clients' },
                ]}
              />
              <Grid stackable as={Segment} className="gridSegment" textAlign="center">
                <Dimmer active={loading && !clients.length} inverted>
                  <Loader indeterminate size="big">Fetching clients</Loader>
                </Dimmer>
                <Grid.Row>
                  <Grid.Column width={16}>
                    <div className="page-heading-top">
                      <Header as="h1" className="page-heading">Clients</Header>
                      <div className="new-client-button">
                        { clients.length > 10 &&
                          <Input icon="search" iconPosition="left" placeholder="Search for a client" value={this.state.searchText} type="text" onChange={(e) => { this.onSearchInputChange(e.target.value); }} />
                        }
                        <Button as={Link} to="/setup" className="new-client-button" size="big" primary>Create New Client</Button>
                      </div>
                    </div>

                    <Table basic stackable sortable className="main-table">
                      <Table.Header>
                        <Table.Row>
                          <Table.HeaderCell
                            sorted={(sort.prop === 'clientName') ? sort.order : 'ascending'}
                            className={(sort.prop !== 'clientName') ? 'sort-inactive' : ''}
                            onClick={() => { clientsSort('clientName'); }}
                          >Client</Table.HeaderCell>
                          <Table.HeaderCell
                            sorted={(sort.prop === 'effectiveDate') ? sort.order : 'ascending'}
                            className={(sort.prop !== 'effectiveDate') ? 'sort-inactive' : ''}
                            onClick={() => { clientsSort('effectiveDate'); }}
                          >Effective Date</Table.HeaderCell>
                          <Table.HeaderCell
                            sorted={(sort.prop === 'clientState') ? sort.order : 'ascending'}
                            className={(sort.prop !== 'clientState') ? 'sort-inactive' : ''}
                            onClick={() => { clientsSort('clientState'); }}
                          >Status</Table.HeaderCell>
                          <Table.HeaderCell>Team</Table.HeaderCell>
                          <Table.HeaderCell width={2} />
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        {foundClients.length > 0 && foundClients.map(
                          (item, i) =>
                            <ClientTableItem
                              key={i}
                              item={item}
                            />
                        )}
                        {!clients.length && !this.props.loading &&
                        <Table.Row>
                          <Table.Cell colSpan={5} textAlign="center" className="table-empty">
                            <div className="table-empty-inner">
                              <div>You currently have no clients</div>
                              <div className="title">Start here</div>
                              <Image src={DownImg} />
                              <div><Link className="main-button" tabIndex={0} rel="button" to="/setup">Create New Client</Link></div>
                            </div>
                          </Table.Cell>
                        </Table.Row>
                        }
                      </Table.Body>
                    </Table>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default Clients;
