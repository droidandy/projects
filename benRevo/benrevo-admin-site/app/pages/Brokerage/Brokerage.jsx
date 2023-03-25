import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Segment, Header, Form, Table } from 'semantic-ui-react';
// import { Link } from 'react-router';
import Navigation from './../Client/Navigation';
import BrokerageData from './components/BrokerageData';
import { LIST_CLIENTS, LIST_AUTH0 } from './constants';

class Brokerage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    selectedBroker: PropTypes.object.isRequired,
    selectBroker: PropTypes.func.isRequired,
    updateBrokerage: PropTypes.func.isRequired,
    changedBrokerage: PropTypes.object.isRequired,
    brokers: PropTypes.array.isRequired,
    revertChanges: PropTypes.func.isRequired,
    saveChanges: PropTypes.func.isRequired,
    getBrokers: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    getClients: PropTypes.func.isRequired,
    changeBrokers: PropTypes.func.isRequired,
    clients: PropTypes.array.isRequired,
    changeClients: PropTypes.func.isRequired,
    listType: PropTypes.string.isRequired,
    setListType: PropTypes.func.isRequired,
    peopleLoading: PropTypes.bool.isRequired,
    clientsLoading: PropTypes.bool.isRequired,
    getAuth0: PropTypes.func.isRequired,
    auth0List: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);
    this.chooseBroker = this.chooseBroker.bind(this);
    this.seeClients = this.seeClients.bind(this);
    this.seeAuth0 = this.seeAuth0.bind(this);
  }

  componentWillMount() {
    this.props.getBrokers();
  }

  chooseBroker(value) {
    const { brokers, selectBroker } = this.props;
    let selected;
    brokers.map((item) => {
      if (item.id === value) {
        selected = item;
        return true;
      }

      return true;
    });
    selectBroker(selected);
  }

  seeClients(id) {
    const { getClients, setListType } = this.props;
    setListType(LIST_CLIENTS);
    getClients(id);
  }

  seeAuth0(id) {
    const { setListType, getAuth0 } = this.props;
    setListType(LIST_AUTH0);
    getAuth0(id);
  }

  render() {
    const { auth0List, clientsLoading, peopleLoading, listType, changeClients, clients, changeBrokers, loading, revertChanges, saveChanges, changedBrokerage, updateBrokerage, selectedBroker, brokers } = this.props;
    const brokerList = brokers.map((item) => ({
      key: item.id,
      value: item.id,
      text: item.name,
    }));
    return (
      <div>
        <Navigation />
        <Grid stackable container className="brokerage section-wrap">
          <Grid.Row>
            <Grid.Column width={16}>
              <Grid stackable as={Segment} className="gridSegment">
                <Grid.Row className="header-main">
                  <Header as="h2">Edit Brokerage Information</Header>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column width={16}>
                    <Grid>
                      <Grid.Row>
                        <Grid.Column width="4">
                          <span className="header3">Select a Brokerage</span>
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
                                          <Form.Group>
                                            <Form.Dropdown
                                              label="Choose a broker"
                                              placeholder="Choose"
                                              className="search-brokerage-form"
                                              search
                                              selection
                                              options={brokerList}
                                              value={selectedBroker.id ? selectedBroker.id : ''}
                                              onChange={(e, inputState) => this.chooseBroker(inputState.value)}
                                            />
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
                    </Grid>
                    { selectedBroker.id &&
                      <BrokerageData
                        changedBrokerage={changedBrokerage}
                        updateBrokerage={updateBrokerage}
                        selectedBroker={selectedBroker}
                        revertChanges={revertChanges}
                        saveChanges={saveChanges}
                        loading={loading}
                        getClients={this.seeClients}
                        changeBrokers={changeBrokers}
                        clients={clients}
                        changeClients={changeClients}
                        listType={listType}
                        peopleLoading={peopleLoading}
                        clientsLoading={clientsLoading}
                        seeAuth0={this.seeAuth0}
                        auth0List={auth0List}
                      />
                    }
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default Brokerage;
