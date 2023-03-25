import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import moment from 'moment';
import { Segment, Grid, Header, Button, Table, Loader, Dimmer } from 'semantic-ui-react';
import Navigation from '../../pages/Client/Navigation';

class Accounts extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    children: PropTypes.node,
    loading: PropTypes.bool.isRequired,
    routeError: PropTypes.bool.isRequired,
    requests: PropTypes.array.isRequired,
    selectRequest: PropTypes.func.isRequired,
    requestsGet: PropTypes.func.isRequired,
    gaGets: PropTypes.func.isRequired,
    contactsGets: PropTypes.func.isRequired,
    brokerageGets: PropTypes.func.isRequired,
    showAnError: PropTypes.func.isRequired,
  };

  componentWillMount() {
    const { requestsGet, routeError, showAnError, gaGets, brokerageGets, contactsGets } = this.props;
    requestsGet();
    gaGets();
    contactsGets();
    brokerageGets();

    if (routeError) showAnError();
  }

  createDateString(timestamp) {
    return moment(new Date(timestamp)).format('MM-DD-YYYY');
  }

  createTimeString(timestamp) {
    return moment(new Date(timestamp)).format('hh:mm a');
  }

  render() {
    const { loading, requests, selectRequest, children } = this.props;

    return (
      <div className="accounts">
        <Navigation />
        <Grid stackable container className="requests section-wrap">
          <Grid.Row>
            <Grid.Column width={16}>
              { !children &&
                <Grid stackable as={Segment} className="gridSegment">
                  <Grid.Row className="header-main">
                    <Helmet
                      title="Accounts"
                      meta={[
                        { name: 'description', content: 'Description of Accounts' },
                      ]}
                    />
                    <Header as="h2">New account request</Header>
                    <div className="divider" />
                  </Grid.Row>
                  <Grid.Row className="table-row">
                    <Dimmer active={loading} inverted>
                      <Loader indeterminate size="big">Getting accounts</Loader>
                    </Dimmer>
                    <Table className="data-table" unstackable>
                      <Table.Header>
                        <Table.Row className="data-table-head">
                          <Table.HeaderCell width="2">Date</Table.HeaderCell>
                          <Table.HeaderCell width="1">ID</Table.HeaderCell>
                          <Table.HeaderCell width="4">Information</Table.HeaderCell>
                          <Table.HeaderCell width="4">Brokerage Info</Table.HeaderCell>
                          <Table.HeaderCell width="2">Verified</Table.HeaderCell>
                          <Table.HeaderCell width="3" />
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        { requests.map((item, i) =>
                          <Table.Row key={i} className="data-table-body">
                            <Table.Cell verticalAlign="top">
                              <p>{this.createDateString(item.created)}</p>
                              <p>{this.createTimeString(item.created)}</p>
                            </Table.Cell>
                            <Table.Cell verticalAlign="top">{item.id}</Table.Cell>
                            <Table.Cell verticalAlign="top">
                              <div>{item.gaName}</div>
                              <div>{item.gaAddress}</div>
                              <div>{item.gaCity}{item.gaCity ? ', ' : ''} {item.gaState} {item.gaZip}</div>
                              <div>{item.agentName}</div>
                              <div>{item.agentEmail}</div>
                            </Table.Cell>
                            <Table.Cell verticalAlign="top">
                              <div>{item.brokerName}</div>
                              <div>{item.brokerAddress}</div>
                              <div>{item.brokerCity}, {item.brokerState} {item.brokerZip}</div>
                              <div>{item.brokerEmail}</div>
                            </Table.Cell>
                            <Table.Cell verticalAlign="top">{item.agentVerified ? 'Yes' : 'No'}</Table.Cell>
                            <Table.Cell verticalAlign="top">
                              <Button as={Link} to="/accounts/details" size="medium" primary onClick={() => { selectRequest(item); }}>View details</Button>
                            </Table.Cell>
                          </Table.Row>
                        )}
                      </Table.Body>
                    </Table>
                  </Grid.Row>
                </Grid>
              }
              { children }
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default Accounts;
