import { connect } from 'react-redux';
import { updateClient } from '@benrevo/benrevo-react-clients';
import { updateForm } from '@benrevo/benrevo-react-rfp';
import {
  getBrokerTeam,
  addBrokerContactsField,
  removeBrokerContactsField,
  updateBrokerContactsFields,
  filterBrokerTeam,
  selectBrokerTeamMember,
  removeMemberFromSelectedList,
  changeNewBroker,
  setSelectedBroker,
  resetSelectedGA,
  setReadyToSave,
  setProducerValue,
  getBrokerage,
  setSelectedBrokerTeam,
  getClientTeam,
  addNewContactField,
} from '../actions';
import Info from './Info';
import { MEDICAL_SECTION } from '../constants';

function mapStateToProps(state) {
  const rfpState = state.get('rfp');
  const clientsState = state.get('clients');
  return {
    client: clientsState.get('current').toJS(),
    clientInfo: rfpState.get('clientInfo').toJS(),
    brokerOfRecord: rfpState.get(MEDICAL_SECTION).get('brokerOfRecord'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateClient: (name, value) => { dispatch(updateClient(name, value)); },
    getBrokerTeam: (brokerId, contactsType) => { dispatch(getBrokerTeam(brokerId, contactsType)); },
    addBrokerContactsField: (contactType, index, fields) => { dispatch(addBrokerContactsField(contactType, index, fields)); },
    removeBrokerContactsField: (index, contactType) => { dispatch(removeBrokerContactsField(index, contactType)); },
    updateBrokerContactsFields: (data, brokerId, index, contactType) => { dispatch(updateBrokerContactsFields(data, brokerId, index, contactType)); },
    filterBrokerTeam: (selected, contactsType, filterType) => { dispatch(filterBrokerTeam(selected, contactsType, filterType)); },
    selectBrokerTeamMember: (id, selected, contactsType, index) => { dispatch(selectBrokerTeamMember(id, selected, contactsType, index)); },
    removeMemberFromSelectedList: (id, contactsType, filterType) => { dispatch(removeMemberFromSelectedList(id, contactsType, filterType)); },
    changeNewBroker: (name, value) => { dispatch(changeNewBroker(name, value)); },
    setSelectedBroker: (broker, brokerType, contactsType) => { dispatch(setSelectedBroker(broker, brokerType, contactsType)); },
    resetSelectedGA: () => { dispatch(resetSelectedGA()); },
    updateForm: (section, name, value) => { dispatch(updateForm(section, name, value)); },
    setReadyToSave: (condition) => { dispatch(setReadyToSave(condition)); },
    setProducerValue: (value) => { dispatch(setProducerValue(value)); },
    getBrokerage: () => { dispatch(getBrokerage()); },
    setSelectedBrokerTeam: (data, contactsType) => { dispatch(setSelectedBrokerTeam(data, contactsType)); },
    getClientTeam: () => { dispatch(getClientTeam()); },
    addNewContactField: (contactType) => { dispatch(addNewContactField(contactType)); },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Info);
