import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Helmet from 'react-helmet';
import { Grid, Dimmer, Loader, Segment, Button, Header, Table } from 'semantic-ui-react';
import Navigation from '../Client/Navigation';

class DataAccess extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    loadingDataAccessPage: PropTypes.bool.isRequired,
    getGaClients: PropTypes.func.isRequired,
    removeAccessToClient: PropTypes.func.isRequired,
    gaClients: PropTypes.array.isRequired,
  };

  componentWillMount() {
    const { getGaClients } = this.props;
    getGaClients();
  }
  render() {
    const { gaClients, loadingDataAccessPage, removeAccessToClient } = this.props;
    return (
      <div className="accounts data-access">
        <Navigation />
        <Grid stackable container className="requests section-wrap">
          <Grid.Row>
            <Grid.Column width={16}>
              <Grid stackable as={Segment} className="gridSegment">
                <Grid.Row className="header-main">
                  <Helmet
                    title="Data Access"
                    meta={[
                      { name: 'description', content: 'Access to clients' },
                    ]}
                  />
                  <Header as="h2">Current Client Data Access</Header>
                  <div className="divider" />
                </Grid.Row>
                <Grid.Row className="table-row">
                  <Dimmer active={loadingDataAccessPage} inverted>
                    <Loader indeterminate size="big">Getting clients</Loader>
                  </Dimmer>
                  <Table className="data-table" unstackable>
                    <Table.Header>
                      <Table.Row className="data-table-head">
                        <Table.HeaderCell colSpan="1">Date</Table.HeaderCell>
                        <Table.HeaderCell colSpan="2">Client</Table.HeaderCell>
                        <Table.HeaderCell colSpan="2">Brokerage</Table.HeaderCell>
                        <Table.HeaderCell colSpan="1" />
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      { gaClients.length > 0 && gaClients.map((client, index) =>
                        <Table.Row key={index} className="data-table-body">
                          <Table.Cell collapsing colSpan="1">
                            {moment(Date.parse(client.effectiveDate)).format('MM.DD.YYYY')}
                          </Table.Cell>
                          <Table.Cell collapsing colSpan="2">
                            {client.clientName}
                          </Table.Cell>
                          <Table.Cell collapsing colSpan="2">
                            {client.brokerName}
                          </Table.Cell>
                          <Table.Cell collapsing colSpan="1" textAlign="center">
                            <Button primary size="tiny" onClick={() => { removeAccessToClient(client.id); }}>Remove Access</Button>
                          </Table.Cell>
                        </Table.Row>
                      )}
                    </Table.Body>
                  </Table>
                  { !gaClients.length && !loadingDataAccessPage &&
                  <div className="empty">
                    No clients to remove access
                  </div>
                  }
                </Grid.Row>
              </Grid>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default DataAccess;
