import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Form, Table, Loader } from 'semantic-ui-react';
import { Link } from 'react-router';
import { LIST_CLIENTS, LIST_AUTH0, BCC_EMAILS } from '../constants';
import { selectedCarrier } from '../../../config';

function BrokerageData(props) {
  const { auth0List, seeAuth0, clientsLoading, peopleLoading, listType, changeClients, clients, changeBrokers, getClients, loading, selectedBroker, updateBrokerage, changedBrokerage, revertChanges, saveChanges } = props;
  const anthem = selectedCarrier.value === 'ANTHEM_BLUE_CROSS';
  return (
    <Grid>
      <Grid.Row>
        <Grid.Column width="4">
          <span className="header3">Brokerage Information</span>
        </Grid.Column>
        <Grid.Column width="12">
          <Table className="data-table basic" unstackable>
            <Table.Header>
              <Table.Row className="data-table-head">
                <Table.HeaderCell width="8" />
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row className="data-table-body">
                <Table.Cell verticalAlign="top">
                  <Grid>
                    <Grid.Row>
                      <Grid.Column width={10}>
                        <Form loading={loading}>
                          <Form.Input label="Brokerage Name" value={changedBrokerage.name || selectedBroker.name || ''} onChange={(e) => updateBrokerage(selectedBroker.id, 'name', e.target.value)} />
                          <Form.Input label="Address" value={changedBrokerage.address || selectedBroker.address || ''} onChange={(e) => updateBrokerage(selectedBroker.id, 'address', e.target.value)} />
                          <Form.Group widths="equal">
                            <Form.Input fluid label="City" value={changedBrokerage.city || selectedBroker.city || ''} onChange={(e) => updateBrokerage(selectedBroker.id, 'city', e.target.value)} />
                            <Form.Input fluid label="State" value={changedBrokerage.state || selectedBroker.state || ''} onChange={(e) => updateBrokerage(selectedBroker.id, 'state', e.target.value)} />
                            <Form.Input fluid label="Zip" value={changedBrokerage.zip || selectedBroker.zip || ''} onChange={(e) => { if (!isNaN(e.target.value)) updateBrokerage(selectedBroker.id, 'zip', e.target.value); }} />
                          </Form.Group>
                          { anthem &&
                            <Form.Select label="BCC" placeholder="Select BCC" search options={BCC_EMAILS} value={changedBrokerage.bcc || selectedBroker.bcc} onChange={(e, inputState) => updateBrokerage(selectedBroker.id, 'bcc', inputState.value)} />
                          }
                          <Form.Checkbox label="General Agent" checked={changedBrokerage.generalAgent || selectedBroker.generalAgent} onChange={() => updateBrokerage(selectedBroker.id, 'generalAgent', (changedBrokerage.generalAgent ? !changedBrokerage.generalAgent : !selectedBroker.generalAgent))} />
                          { selectedBroker.broker_token &&
                            <div className="broker-token">
                              <p>Broker Token</p>
                              <p className="token-data">{selectedBroker.broker_token}</p>
                            </div>
                          }
                        </Form>
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                      <Grid.Column width={10}>
                        <Form className="info-action-buttons">
                          <Form.Group>
                            <Form.Button disabled={!changedBrokerage.id} primary onClick={revertChanges}>Revert Changes</Form.Button>
                            <Form.Button disabled={!changedBrokerage.id} primary onClick={saveChanges}>Save</Form.Button>
                          </Form.Group>
                        </Form>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width="4">
          <span className="header3">Personnel Information</span>
        </Grid.Column>
        <Grid.Column width="12">
          <Table className="data-table basic" unstackable>
            <Table.Header>
              <Table.Row className="data-table-head">
                <Table.HeaderCell width="8" />
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row className="data-table-body">
                <Table.Cell verticalAlign="top">
                  <Grid>
                    { selectedBroker.salesFirstName || selectedBroker.presalesFirstName ?
                      <Grid.Row className="selected-broker">
                        <Grid.Column width={4}>
                          { selectedBroker.salesFirstName && <p>Sales:</p> }
                          { selectedBroker.presalesFirstName && <p>PreSales:</p> }
                        </Grid.Column>
                        <Grid.Column width={5}>
                          { selectedBroker.salesFirstName && <p>{`${selectedBroker.salesFirstName} ${selectedBroker.salesLastName}`}</p> }
                          { selectedBroker.presalesFirstName && <p>{`${selectedBroker.presalesFirstName} ${selectedBroker.presalesLastName}`}</p> }
                        </Grid.Column>
                        <Grid.Column width={7}>
                          <p>{selectedBroker.salesEmail}</p>
                          <p>{selectedBroker.presalesEmail}</p>
                        </Grid.Column>
                      </Grid.Row>
                      :
                      <Grid.Row className="selected-broker-empty">
                        <Grid.Column width={10}>
                          <p>No personnel assigned to this brokerage</p>
                        </Grid.Column>
                      </Grid.Row>
                    }
                  </Grid>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width="4">
          <span className="header3">Actions</span>
        </Grid.Column>
        <Grid.Column width="12">
          <Table className="data-table basic" unstackable>
            <Table.Header>
              <Table.Row className="data-table-head">
                <Table.HeaderCell width="8" />
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row className="data-table-body">
                <Table.Cell verticalAlign="top">
                  <Grid>
                    <Grid.Row>
                      <Grid.Column width={10}>
                        <Form>
                          <Form.Group widths="equal">
                            <Form.Button primary onClick={() => { changeBrokers(selectedBroker.id); getClients(selectedBroker.id); }}>See Clients</Form.Button>
                            <Form.Button primary onClick={() => seeAuth0(selectedBroker.id)}>See Auth0 Users</Form.Button>
                          </Form.Group>
                        </Form>
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                      <Grid.Column>
                        <Loader active={(listType === LIST_CLIENTS && clientsLoading) || (listType === LIST_AUTH0 && peopleLoading)} />
                        { clients.length > 0 && listType === LIST_CLIENTS && clients[0].brokerId === selectedBroker.id && !clientsLoading &&
                          clients.map((item, i) => (<p key={i} className="p-client"><Link to="client/plans" onClick={() => { changeClients(item); }}>{item.clientName}</Link></p>))
                        }
                        { auth0List.length > 0 && listType === LIST_AUTH0 && auth0List[0].brokerageId === selectedBroker.id && !peopleLoading &&
                          auth0List.map((item, i) => (
                            <p className="auth-list" key={`authkey${i}`}>{item.fullName || 'Name not available'} - <i>{item.email}</i></p>
                          ))
                        }
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}

BrokerageData.propTypes = {
  selectedBroker: PropTypes.object.isRequired,
  updateBrokerage: PropTypes.func.isRequired,
  changedBrokerage: PropTypes.object.isRequired,
  revertChanges: PropTypes.func.isRequired,
  saveChanges: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  getClients: PropTypes.func.isRequired,
  changeBrokers: PropTypes.func.isRequired,
  clients: PropTypes.array.isRequired,
  changeClients: PropTypes.func.isRequired,
  listType: PropTypes.string.isRequired,
  peopleLoading: PropTypes.bool.isRequired,
  clientsLoading: PropTypes.bool.isRequired,
  seeAuth0: PropTypes.func.isRequired,
  auth0List: PropTypes.array.isRequired,
};

export default BrokerageData;
