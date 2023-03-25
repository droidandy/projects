import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Dimmer, Loader, Segment, Button, Header, Table, Input, Icon, Breadcrumb } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import Helmet from 'react-helmet';
import moment from 'moment';
import ClientTeam from './components/ClientTeam';
import ClientGAs from './components/ClientGAs';
import {
  RFP_STARTED,
  RFP_SUBMITTED,
  QUOTED,
  PENDING_APPROVAL,
  ON_BOARDING,
  SOLD,
  CLOSED,
} from '../constants';
import StatusChangeModal from './components/StatusChangeModal';
import ChangeBrokerageModal from './components/ChangeBrokerageModal';

const possibleStates = [RFP_STARTED, RFP_SUBMITTED, QUOTED, PENDING_APPROVAL, ON_BOARDING, SOLD, CLOSED];

class PlanData extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    loadingbrClientsPage: PropTypes.bool.isRequired,
    loadingClientTeams: PropTypes.bool.isRequired,
    giveAccessToClient: PropTypes.func.isRequired,
    changeSelectedClient: PropTypes.func.isRequired,
    currentBroker: PropTypes.object.isRequired,
    selectedClient: PropTypes.object.isRequired,
    getClientTeam: PropTypes.func.isRequired,
    addbrClientTeam: PropTypes.func.isRequired,
    removebrClientTeam: PropTypes.func.isRequired,
    changebrClientTeam: PropTypes.func.isRequired,
    saveClientTeam: PropTypes.func.isRequired,
    savingClients: PropTypes.bool,
    brClientTeam: PropTypes.array.isRequired,
    gaClientTeams: PropTypes.array.isRequired,
    brokerages: PropTypes.array.isRequired,
    selectedBrokerage: PropTypes.object.isRequired,
    moveReason: PropTypes.string.isRequired,
    moveCheck: PropTypes.bool.isRequired,
    moveClient: PropTypes.func.isRequired,
    changeReason: PropTypes.func.isRequired,
    changeMoveCheck: PropTypes.func.isRequired,
    changeBrokerage: PropTypes.func.isRequired,
    changeClientStatus: PropTypes.func.isRequired,
    gaList: PropTypes.array.isRequired,
    gaClientTeamAdd: PropTypes.func.isRequired,
    gaClientTeamAddMember: PropTypes.func.isRequired,
    gaClientTeamRemoveMember: PropTypes.func.isRequired,
    gaClientTeamChangeMember: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      statusModalOpen: false,
      moveModalOpen: false,
      stateOfInterest: '',
    };
    this.saveAndContinue = this.saveAndContinue.bind(this);
    this.closeStatusModal = this.closeStatusModal.bind(this);
    this.openStatusModal = this.openStatusModal.bind(this);
    this.toggleMoveModal = this.toggleMoveModal.bind(this);
  }

  componentWillMount() {
    const { getClientTeam, selectedClient } = this.props;
    getClientTeam(selectedClient.id);
  }

  closeStatusModal() {
    this.setState({ statusModalOpen: false, stateOfInterest: '' });
  }

  openStatusModal(current) {
    this.setState({ statusModalOpen: true, stateOfInterest: current });
  }

  saveAndContinue() {
    const { saveClientTeam } = this.props;
    saveClientTeam();
  }

  toggleMoveModal() {
    this.setState({ moveModalOpen: !this.state.moveModalOpen });
  }

  render() {
    const { currentBroker, selectedClient, giveAccessToClient, loadingbrClientsPage, changeSelectedClient,
      brClientTeam, removebrClientTeam, addbrClientTeam, changebrClientTeam,
      savingClients, brokerages, selectedBrokerage, moveReason,
      moveClient, changeReason, changeMoveCheck, moveCheck, changeBrokerage, changeClientStatus,
      gaClientTeams, loadingClientTeams, gaList, gaClientTeamAdd, gaClientTeamAddMember, gaClientTeamRemoveMember,
      gaClientTeamChangeMember } = this.props;
    return (
      <div className="plans-files plan-data">
        <StatusChangeModal
          modalOpen={this.state.statusModalOpen}
          modalClose={this.closeStatusModal}
          handleStatusChange={changeClientStatus}
          stateOfInterest={this.state.stateOfInterest}
          selectedClient={selectedClient}
        />
        <Helmet
          title="brClients"
          meta={[
            { name: 'description', content: 'Getting Access to GA Clients Page' },
          ]}
        />
        <Grid stackable as={Segment} className="gridSegment">
          <Grid.Row className="header-second">
            <Header as="h1">{currentBroker.name} - {selectedClient.clientName}</Header>
          </Grid.Row>
          <Grid.Row className="header-main">
            <Header as="h2">Request Access to Client Data</Header>
            <div className="divider" />
          </Grid.Row>
          <Grid.Row className="table-row">
            <Dimmer active={loadingbrClientsPage} inverted>
              <Loader indeterminate size="big">Getting information</Loader>
            </Dimmer>
            <Table className="data-table">
              <Table.Header>
                <Table.Row className="data-table-head">
                  <Table.HeaderCell colSpan="4">Client</Table.HeaderCell>
                  <Table.HeaderCell colSpan="1" />
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row className="data-table-body">
                  <Table.Cell collapsing colSpan="4">
                    {currentBroker.name} -
                    <p>{selectedClient.clientName}</p>
                  </Table.Cell>
                  <Table.Cell collapsing colSpan="1" textAlign="right">
                    <Button primary size="tiny" onClick={() => { giveAccessToClient(currentBroker.id, selectedClient.id); }}>Request Access</Button>
                  </Table.Cell>
                  <Table.Cell collapsing colSpan="1" textAlign="right">
                    <Button primary size="tiny" onClick={this.toggleMoveModal}>Move to Another Brokerage</Button>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
            <ChangeBrokerageModal
              modalOpen={this.state.moveModalOpen}
              modalClose={this.toggleMoveModal}
              selectedClient={selectedClient}
              selectedBrokerage={selectedBrokerage}
              brokerages={brokerages}
              changeBrokerage={changeBrokerage}
              moveReason={moveReason}
              changeReason={changeReason}
              moveCheck={moveCheck}
              changeMoveCheck={changeMoveCheck}
              moveClient={moveClient}
              currentBroker={currentBroker}
            />
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={5}>
              <Header as="h3" className="page-section-heading">Client Status</Header>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row textAlign="center">
            <Grid.Column width={16}>
              { possibleStates.map((currentState, i) => (
                <Breadcrumb key={i} className="client-status-breadcrumb">
                  { i < possibleStates.length - 1 && i > 0 && <Icon style={{ backgroundColor: 'transparent' }} name="chevron right" /> }
                  <Breadcrumb.Section>
                    { i < possibleStates.length - 1 &&
                    <Button
                      className="reset-blue"
                      disabled={(i < possibleStates.indexOf(selectedClient.clientState)) && (selectedClient.clientState === SOLD || currentState !== SOLD)}
                      color={(i <= possibleStates.indexOf(selectedClient.clientState) && (selectedClient.clientState === SOLD || currentState !== SOLD)) ? 'green' : 'blue'}
                      basic={(i < possibleStates.indexOf(selectedClient.clientState)) && (selectedClient.clientState === SOLD || currentState !== SOLD)}
                      compact size="mini"
                      onClick={() => { if (!(i <= possibleStates.indexOf(selectedClient.clientState) && currentState !== SOLD)) this.openStatusModal(currentState); }}
                    >
                      {currentState.replace(/[_]/g, ' ')}
                    </Button>
                    }
                  </Breadcrumb.Section>
                  { i === possibleStates.length - 2 && `or${' '}`}
                  { i === possibleStates.length - 2 &&
                    <Button
                      className="reset-blue"
                      disabled={(i + 1 < possibleStates.indexOf(selectedClient.clientState))}
                      color={(i + 1 <= possibleStates.indexOf(selectedClient.clientState)) ? 'green' : 'blue'}
                      basic={(i + 1 < possibleStates.indexOf(selectedClient.clientState))}
                      compact size="mini"
                      onClick={() => { if (!(i + 1 <= possibleStates.indexOf(selectedClient.clientState))) this.openStatusModal(possibleStates[i + 1]); }}
                    >
                      {possibleStates[i + 1].replace(/[_]/g, ' ')}
                    </Button>
                  }
                </Breadcrumb>
              ))}
            </Grid.Column>
          </Grid.Row>
          <Grid.Row className="table-row">
            <Grid.Column width={5}>
              <Header as="h3" className="page-section-heading">Information</Header>
            </Grid.Column>
            <Grid.Column width={6}>
              <Header as="h3" className="page-form-set-heading">What is the client&apos;s name?</Header>
              <Input
                fluid
                name="clientName"
                id="clientName"
                value={selectedClient.clientName ? selectedClient.clientName : ''}
                placeholder="Enter the client's name"
                onChange={(e, inputState) => { changeSelectedClient('clientName', inputState.value); }}
                className="plan-form-input"
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row className="table-row">
            <Grid.Column width={5} />
            <Grid.Column width={6}>
              <Header as="h3" className="page-form-set-heading">What is the average age of eligible employees?</Header>
              <Input
                fluid
                name="averageAge"
                type="number"
                id="averageAge"
                value={selectedClient.averageAge ? selectedClient.averageAge : 0}
                placeholder="Enter your client's average age"
                onChange={(e, inputState) => { changeSelectedClient('averageAge', inputState.value); }}
                className="plan-form-input"
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row className="table-row">
            <Grid.Column width={5} />
            <Grid.Column width={6} className="date-picker-container">
              <Header as="h3" className="page-form-set-heading">Effective date</Header>
              <DatePicker
                className="datepicker plan-form-input"
                name="effectiveDate"
                placeholderText="Enter the effective date"
                selected={(selectedClient.effectiveDate) ? moment(Date.parse(selectedClient.effectiveDate)) : null}
                onChange={(date) => { changeSelectedClient('effectiveDate', (date) ? moment(date).format() : ''); }}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <Grid stackable as={Segment} className="gridSegment">
          <Grid.Row className="header-second">
            <Header as="h1">{currentBroker.name} - Client Team</Header>
            <div className="divider" />
          </Grid.Row>
          {loadingClientTeams &&
            <Grid.Row>
              <Loader active>Getting Client Teams</Loader>
            </Grid.Row>
          }
          { !loadingClientTeams &&
            <Grid.Row>
              <ClientTeam title={currentBroker.name || 'Brokerage Team'} team={brClientTeam} onChange={(memIndex, property, value) => { changebrClientTeam(memIndex, property, value); }} addMember={() => (addbrClientTeam(currentBroker.id))} removeMember={(memIndex) => removebrClientTeam(memIndex)} />
              <ClientGAs GAList={gaClientTeams} fullGAList={gaList} gaClientTeamAdd={gaClientTeamAdd} gaClientTeamAddMember={gaClientTeamAddMember} gaClientTeamRemoveMember={gaClientTeamRemoveMember} gaClientTeamChangeMember={gaClientTeamChangeMember} />
            </Grid.Row>
          }
        </Grid>

        <Grid>
          <Grid.Row>
            <Grid.Column width={10} only="computer">
            </Grid.Column>
            <Grid.Column tablet={16} computer={6}>
              <Button disabled={savingClients} primary size="big" onClick={this.saveAndContinue}>{ savingClients ? 'Saving..' : 'Save and Continue' } </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default PlanData;
