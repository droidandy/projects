import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Helmet from 'react-helmet';
import { Link } from 'react-router';
import { Grid, Header, Dimmer, Loader, Table, Segment, Button, Input, Form, Image } from 'semantic-ui-react';
import { TimelineSuccess } from '@benrevo/benrevo-react-core';

export class ManagerClients extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    clients: PropTypes.array.isRequired,
    sort: PropTypes.object.isRequired,
    selectClient: PropTypes.func.isRequired,
    onClientsSort: PropTypes.func.isRequired,
    loading: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.state = {
      searchText: '',
      filteredClients: this.props.clients,
    };

    this.onSearchInputChange = this.onSearchInputChange.bind(this);
    this.filterClientsBySearchText = this.filterClientsBySearchText.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.filterClientsBySearchText();
    if (!nextProps.loading && this.props.loading) {
      this.setState({ filteredClients: nextProps.clients });
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
      if (
        (client.clientName && client.clientName.toLowerCase().indexOf(search) !== -1)
        || (client.effectiveDate && client.effectiveDate.toLowerCase().indexOf(search) !== -1)
        || (client.salesRepName && client.salesRepName.toLowerCase().indexOf(search) !== -1)
      ) {
        return true;
      }
      return false;
    });

    this.setState({ filteredClients: foundClients });
  }

  render() {
    const { clients, sort, onClientsSort, selectClient } = this.props;
    return (
      <div>
        <Helmet
          title="Clients"
          meta={[
            { name: 'description', content: 'Description of Clients' },
          ]}
        />
        <Grid stackable container className="clients section-wrap manager-clients">
          <Grid.Column width={16}>
            <Grid stackable as={Segment} className="gridSegment">
              <Grid.Row>
                <Grid.Column width={16}>
                  <Dimmer active={this.props.loading && !clients.length} inverted>
                    <Loader indeterminate size="big">Fetching clients</Loader>
                  </Dimmer>
                  <div className="page-heading-top">
                    <Header as="h1" className="page-heading">Clients</Header>
                  </div>
                  <Form className="search-client-form">
                    <Input icon="search" iconPosition="left" placeholder="Search for a client" type="text" fluid onChange={this.onSearchInputChange} />
                  </Form>

                  <Table basic stackable sortable className={(this.props.loading) ? 'loading main-table' : 'main-table'}>
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell
                          sorted={(sort.prop === 'clientName') ? sort.order : 'ascending'}
                          className={(sort.prop !== 'clientName') ? 'sort-inactive' : ''}
                          onClick={() => { onClientsSort('clientName'); }}
                        >Client</Table.HeaderCell>
                        <Table.HeaderCell
                          sorted={(sort.prop === 'effectiveDate') ? sort.order : 'ascending'}
                          className={(sort.prop !== 'effectiveDate') ? 'sort-inactive' : ''}
                          onClick={() => { onClientsSort('effectiveDate'); }}
                        >Effective Date</Table.HeaderCell>
                        <Table.HeaderCell>Progress</Table.HeaderCell>
                        <Table.HeaderCell
                          sorted={(sort.prop === 'salesRepName') ? sort.order : 'ascending'}
                          className={(sort.prop !== 'salesRepName') ? 'sort-inactive' : ''}
                          onClick={() => { onClientsSort('salesRepName'); }}
                        >Sales Rep</Table.HeaderCell>
                        <Table.HeaderCell />
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {this.state.filteredClients.map((item, i) =>
                        <Table.Row name={item.clientName} key={i}>
                          <Table.Cell className="client-name">{item.clientName}</Table.Cell>
                          <Table.Cell>{moment(new Date(item.effectiveDate)).format('MM-DD-YYYY')}</Table.Cell>
                          <Table.Cell width={3}>
                            { item.progressPercent < 100 &&
                              <div className="client-progress"><div className="client-progress-fill" style={{ width: `${item.progressPercent}%` }} /></div>
                            }
                            { item.progressPercent === 100 &&
                              <Grid>
                                <Grid.Row>
                                  <Grid.Column width={16} className="completedDate">
                                    <Image src={TimelineSuccess} />
                                    <div className="completed-time">Completed {moment(new Date(item.completedDate) || new Date()).format('MM-DD-YYYY')}</div>
                                  </Grid.Column>
                                </Grid.Row>
                              </Grid>
                            }
                          </Table.Cell>
                          <Table.Cell>{item.salesRepName}</Table.Cell>
                          <Table.Cell width={3}>
                            { item.timelineEnabled &&
                              <Button as={Link} to={`/timeline/${item.id}`} onClick={() => { selectClient(item); }} primary fluid size="medium">View Timeline</Button>
                            }
                            { !item.timelineEnabled &&
                              <Button as={Link} to={`/timeline/${item.id}`} onClick={() => { selectClient(item); }} color="grey" fluid size="medium">Start Timeline</Button>
                            }
                          </Table.Cell>
                        </Table.Row>
                      )}
                      {!this.state.filteredClients.length && !this.props.loading &&
                      <Table.Row>
                        <Table.Cell colSpan="5" textAlign="center" className="clients-empty">
                          <div className="clients-empty-inner">
                            <div>You currently have no clients</div>
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      }
                    </Table.Body>
                  </Table>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default ManagerClients;
