import { fromJS } from 'immutable';
import { SAVE_CLIENT_SUCCEEDED, SAVE_CLIENT_FAILED } from '@benrevo/benrevo-react-clients';
import * as types from '../constants';

export function setLoading(state, condition) {
  const finalState = state;
  return finalState
    .setIn(['clientInfo', 'loading'], fromJS(condition));
}

export function setBrokerage(state, action) {
  const finalState = state;
  const data = action.payload;
  return finalState
    .setIn(['clientInfo', 'brokerages'], fromJS(data))
    .setIn(['clientInfo', 'loading'], fromJS(false));
}

export function setContacts(state, action) {
  const finalState = state;
  const data = action.payload;
  const contactsType = action.contactsType;
  const list = fromJS(data);
  return finalState
    .setIn(['clientInfo', contactsType], list)
    .setIn(['clientInfo', `filtered${contactsType}`], list)
    .setIn(['clientInfo', 'loading'], fromJS(false));
}

export function setSelectedBrokerTeam(state, action) {
  const finalState = state;
  const { data, contactsType } = action.payload;
  return finalState
    .setIn(['clientInfo', contactsType], fromJS(data));
}

export function setGA(state, action) {
  const finalState = state;
  const data = action.payload;

  return finalState
    .setIn(['clientInfo', 'GA'], fromJS(data))
    .setIn(['clientInfo', 'loading'], fromJS(false));
}

export function setSelectedContactsField(state, action) {
  const finalState = state;
  const { fields, index, contactType } = action.payload;
  return finalState
    .setIn(['clientInfo', contactType, index], fromJS(fields));
}

export function removeSelectedContactsField(state, action) {
  const finalState = state;
  const { index, contactType } = action.payload;
  const newContacts = finalState.getIn(['clientInfo', contactType]).delete(index);
  return finalState
    .setIn(['clientInfo', contactType], fromJS(newContacts));
}

export function updateSelectedContactsField(state, action) {
  const finalState = state;
  const { data, brokerId, index, contactType } = action.payload;
  const value = {
    email: data,
    brokerageId: brokerId,
  };
  return finalState
    .setIn(['clientInfo', contactType, index], fromJS(value));
}

export function filterBrokerTeam(state, action) {
  const finalState = state;
  const { selected, contactsType, filterType } = action.payload;
  const selectedList = finalState.getIn(['clientInfo', selected]).toJS();
  const team = finalState.getIn(['clientInfo', contactsType]);
  const filteredTeam = team.toJS().filter((contact) => (
    selectedList.filter((selContact) => contact.authId === selContact.authId).length === 0
  ));
  return finalState
    .setIn(['clientInfo', filterType], fromJS(filteredTeam));
}

export function selectBrokerTeamMember(state, action) {
  const finalState = state;
  const { id, selected, contactsType, index } = action.payload;
  const team = finalState.getIn(['clientInfo', contactsType]).toJS();
  const selectedList = finalState.getIn(['clientInfo', selected]).toJS();
  const filteredTeam = team.filter((contact) => id === contact.authId);
  filteredTeam[0].added = true;
  if (selectedList[index] && !selectedList[index].added && selectedList[index].authId) {
    const deletedList = selected === 'selectedBC' ? 'deletedBC' : 'deletedGAC';
    const toDelete = finalState.getIn(['clientInfo', deletedList]).push(selectedList[index]);
    return finalState
      .setIn(['clientInfo', deletedList], fromJS(toDelete))
      .setIn(['clientInfo', selected, index], fromJS(filteredTeam[0]));
  }
  return finalState
    .setIn(['clientInfo', selected, index], fromJS(filteredTeam[0]));
}

export function removeMemberFromSelectedList(state, action) {
  const finalState = state;
  const { id, contactsType } = action.payload;
  const team = finalState.getIn(['clientInfo', contactsType]).toJS();
  const filteredTeam = finalState.getIn(['clientInfo', contactsType]).delete(id);
  const contactsList = filteredTeam.toJS().length ? filteredTeam : [{}];
  // const filteredTeam = team.filter((contact) => team[id].authId !== contact.authId);
  // const updatedTeam = finalState.getIn(['clientInfo', filterType]).insert(filterType.size, team[id]);

  if (team[id] && !team[id].added) {
    const deletedList = contactsType === 'selectedBC' ? 'deletedBC' : 'deletedGAC';
    const toDelete = finalState.getIn(['clientInfo', deletedList]).push(team[id]);
    return finalState
      .setIn(['clientInfo', deletedList], fromJS(toDelete))
      .setIn(['clientInfo', contactsType], fromJS(contactsList));
      // .setIn(['clientInfo', filterType], fromJS(updatedTeam));
  }

  return finalState
    .setIn(['clientInfo', contactsType], fromJS(contactsList));
    // .setIn(['clientInfo', filterType], fromJS(updatedTeam));
}

export function addNewContactField(state, action) {
  const finalState = state;
  const { contactType } = action.payload;
  const contactsList = finalState.getIn(['clientInfo', contactType]);
  return finalState
    .setIn(['clientInfo', contactType, contactsList.size], fromJS({}));
}

export function resetDeletedList(state) {
  const finalState = state;

  return finalState
    .setIn(['clientInfo', 'deletedBC'], fromJS([]))
    .setIn(['clientInfo', 'deletedGAC'], fromJS([]));
}

export function changeNewBroker(state, action) {
  const finalState = state;
  const { name, value } = action.payload;
  return finalState
    .setIn(['clientInfo', 'newBroker', 'values', name], fromJS(value));
}

export function setSelectedBroker(state, action) {
  const finalState = state;
  const { broker, brokerType, contactsType } = action.payload;
  if (contactsType) {
    const selectedType = contactsType === 'brokerContacts' ? 'selectedBC' : 'selectedGAC';
    const filteredList = finalState.getIn(['clientInfo', selectedType]).toJS().filter((el) => !el.added);
    return finalState
      .setIn(['clientInfo', brokerType], fromJS(broker))
      .setIn(['clientInfo', contactsType], fromJS([]))
      .setIn(['clientInfo', selectedType], fromJS(filteredList));
  }
  return finalState
    .setIn(['clientInfo', brokerType], fromJS(broker));
}

export function setNewBroker(state) {
  const finalState = state;
  const clearedBC = finalState.getIn(['clientInfo', 'selectedBC']).clear();
  const clearedNewBC = finalState.getIn(['clientInfo', 'newBrokerContacts']).clear();
  return finalState
    .setIn(['clientInfo', 'selectedBC'], fromJS(clearedBC))
    .setIn(['clientInfo', 'newBrokerContacts'], fromJS(clearedNewBC));
}

export function resetSelectedGA(state) {
  const finalState = state;
  const GAContacts = finalState.getIn(['clientInfo', 'GAContacts']).clear();
  const selectedGAC = finalState.getIn(['clientInfo', 'selectedGAC']).clear();
  return finalState
    .setIn(['clientInfo', 'GAContacts'], fromJS(GAContacts))
    .setIn(['clientInfo', 'selectedGAC'], fromJS(selectedGAC))
    .setIn(['clientInfo', 'selectedGA'], fromJS(null));
}

export function setReadyToSave(state, action) {
  const finalState = state;
  const { condition } = action.payload;
  if (condition) {
    return finalState
      .setIn(['clientInfo', 'newBroker', 'readyToSave'], fromJS(condition));
  }
  return finalState
    .setIn(['clientInfo', 'newBroker', 'readyToSave'], fromJS(condition))
    .setIn(['clientInfo', 'newBroker', 'values', 'name'], fromJS(''))
    .setIn(['clientInfo', 'newBroker', 'values', 'address'], fromJS(''))
    .setIn(['clientInfo', 'newBroker', 'values', 'city'], fromJS(''))
    .setIn(['clientInfo', 'newBroker', 'values', 'state'], fromJS(''))
    .setIn(['clientInfo', 'newBroker', 'values', 'zip'], fromJS(''));
}

export function setProducerValue(state, action) {
  const finalState = state;
  const { value } = action.payload;
  return finalState
    .setIn(['clientInfo', 'producer', 'name'], fromJS(value))
    .setIn(['clientInfo', 'selectedBroker', 'producer'], fromJS(value));
}

export function resetNewContacts(state) {
  const finalState = state;
  const defaultValue = [{
    email: null,
    brokerageId: null,
  }];
  return finalState
    .setIn(['clientInfo', 'newBrokerContacts'], fromJS(defaultValue))
    .setIn(['clientInfo', 'newGAContacts'], fromJS(defaultValue));
}

export function saveClient(state) {
  return state
    .setIn(['clientInfo', 'clientSaveInProgress'], true);
}

export function saveClientSucceeded(state) {
  return state
    .setIn(['clientInfo', 'clientSaveInProgress'], false);
}

export function saveClientFailed(state) {
  return state
    .setIn(['clientInfo', 'clientSaveInProgress'], false);
}

export function reducer(state = [], action) {
  switch (action.type) {
    case types.BROKERAGE_GET: return setLoading(state, true);
    case types.BROKERAGE_GET_SUCCESS: return setBrokerage(state, action);
    case types.BROKERAGE_GET_ERROR: return setLoading(state, false);
    case types.GA_GET: return setLoading(state, true);
    case types.GA_GET_SUCCESS: return setGA(state, action);
    case types.GA_GET_ERROR: return setLoading(state, false);
    case types.BROKER_TEAM_GET: return setLoading(state, true);
    case types.BROKER_TEAM_GET_SUCCESS: return setContacts(state, action);
    case types.BROKER_TEAM_GET_ERROR: return setLoading(state, false);
    case types.ADD_BROKER_CONTACT_FIELD: return setSelectedContactsField(state, action);
    case types.REMOVE_BROKER_CONTACT_FIELD: return removeSelectedContactsField(state, action);
    case types.UPDATE_BROKER_CONTACT_FIELDS: return updateSelectedContactsField(state, action);
    case types.FILTER_BROKER_TEAM: return filterBrokerTeam(state, action);
    case types.SELECT_BROKER_TEAM_MEMBER: return selectBrokerTeamMember(state, action);
    case types.REMOVE_BROKER_TEAM_MEMBER_FROM_LIST: return removeMemberFromSelectedList(state, action);
    case types.CHANGE_NEW_BROKER: return changeNewBroker(state, action);
    case types.SET_SELECTED_BROKER: return setSelectedBroker(state, action);
    case types.CREATE_BROKER_SUCCESS: return setNewBroker(state);
    case types.RESET_SELECTED_GA: return resetSelectedGA(state);
    case types.SAVE_CLIENT: return saveClient(state, action);
    case SAVE_CLIENT_SUCCEEDED: return saveClientSucceeded(state, action);
    case SAVE_CLIENT_FAILED: return saveClientFailed(state, action);
    case types.SET_READY_TO_SAVE: return setReadyToSave(state, action);
    case types.SET_PRODUCER_VALUE: return setProducerValue(state, action);
    case types.SET_SELECTED_BROKER_TEAM: return setSelectedBrokerTeam(state, action);
    case types.RESET_DELETED_LIST: return resetDeletedList(state);
    case types.RESET_NEW_CONTACTS: return resetNewContacts(state);
    case types.ADD_NEW_CONTACT_FIELD: return addNewContactField(state, action);
    default:
      return state;
  }
}
