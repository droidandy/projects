import { connect } from 'react-redux';
import PlanData from './PlanData';
import { giveAccessToClient, changeSelectedClient, getClientTeam, saveClientTeam,
         moveClient, changeReason, changeMoveCheck, changeBrokerage, changeClientStatus, removebrClientTeam, addbrClientTeam, changebrClientTeam,
         gaClientTeamAdd, gaClientTeamAddMember, gaClientTeamRemoveMember, gaClientTeamChangeMember } from '../actions';

function mapStateToProps(state) {
  const overviewState = state.get('plans');
  const baseState = state.get('base');

  return {
    loadingbrClientsPage: overviewState.get('loadingbrClientsPage'),
    loadingClientTeams: overviewState.get('loadingClientTeams'),
    gaList: overviewState.get('gaList').toJS(),
    savingClients: overviewState.get('savingClients'),
    currentBroker: baseState.get('currentBroker').toJS(),
    selectedClient: baseState.get('selectedClient').toJS(),
    brClientTeam: overviewState.get('brClientTeam').toJS(),
    gaClientTeams: overviewState.get('gaClientTeams').toJS(),
    moveReason: overviewState.get('moveReason'),
    moveCheck: overviewState.get('moveCheck'),
    brokerages: baseState.get('brokers').toJS(),
    selectedBrokerage: overviewState.get('selectedBrokerage').toJS(),
    clientTeam: overviewState.get('clientTeam').toJS(),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    changeClientStatus: (newStatus, clientId) => { dispatch(changeClientStatus(newStatus, clientId)); },
    giveAccessToClient: (brokerId, clientId) => { dispatch(giveAccessToClient(brokerId, clientId)); },
    changeSelectedClient: (path, value) => { dispatch(changeSelectedClient(path, value)); },
    getClientTeam: (clientId) => { dispatch(getClientTeam(clientId)); },
    addbrClientTeam: (id) => { dispatch(addbrClientTeam(id)); },
    removebrClientTeam: (memIndex) => { dispatch(removebrClientTeam(memIndex)); },
    changebrClientTeam: (memIndex, property, value) => { dispatch(changebrClientTeam(memIndex, property, value)); },
    saveClientTeam: () => { dispatch(saveClientTeam()); },
    moveClient: (fromID, toID, clientID, newBrokerage, moveReason) => { dispatch(moveClient(fromID, toID, clientID, newBrokerage, moveReason)); },
    changeReason: (reason) => { dispatch(changeReason(reason)); },
    changeMoveCheck: (checked) => { dispatch(changeMoveCheck(checked)); },
    changeBrokerage: (brokerage) => { dispatch(changeBrokerage(brokerage)); },
    gaClientTeamAdd: (gaId) => { dispatch(gaClientTeamAdd(gaId)); },
    gaClientTeamAddMember: (index) => { dispatch(gaClientTeamAddMember(index)); },
    gaClientTeamRemoveMember: (outerIndex, innerIndex) => { dispatch(gaClientTeamRemoveMember(outerIndex, innerIndex)); },
    gaClientTeamChangeMember: (outerIndex, innerIndex, type, value) => { dispatch(gaClientTeamChangeMember(outerIndex, innerIndex, type, value)); },
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(PlanData);
