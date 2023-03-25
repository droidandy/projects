import { connect } from 'react-redux';
import Details from './Details';
import {
  getClient,
  getActivities,
  getActivity,
  getActivityByType,
  changeOptionsProduct,
  changeActivitySort,
  getOption,
  changeActivity,
  updateActivity,
  createActivity,
  changeAccessStatus,
  removeActivity,
  toggleHistoryEditMode,
  updateHistoryText,
  saveHistoryUpdates,
  getHistoryNotes,
} from './actions';
import { getClients } from './../actions';
import { makeProducts } from '../../App/selectors';
import { sortActivities, makeCarriers } from './selectors';

function mapStateToProps(state, ownProps) {
  const appState = state.get('app');
  const clientsState = state.get('clientDetails');
  const clientsAllState = state.get('clientsList');
  const profileState = state.get('profile');
  const clientId = ownProps.params.clientId;
  return {
    role: profileState.get('brokerageRole').toJS(),
    client: clientsState.get('current').toJS(),
    accessStatus: clientsState.get('accessStatus'),
    mainCarrier: appState.get('mainCarrier').toJS(),
    currentActivity: clientsState.get('currentActivity').toJS(),
    optionDetails: clientsState.get('optionDetails').toJS(),
    optionRiders: clientsState.get('optionRiders').toJS(),
    sort: clientsState.get('sort').toJS(),
    activities: sortActivities(state),
    optionsProduct: clientsState.get('optionsProduct'),
    loading: clientsState.get('loading'),
    clients: clientsAllState.get('clients').toJS(),
    clientId,
    productsList: makeProducts(),
    carriersList: makeCarriers(state),
    historyNotes: clientsState.get('historyNotes'),
    historyEdits: clientsState.get('historyEdits'),
    historyEditMode: clientsState.get('historyEditMode'),
    historySaveLoading: clientsState.get('historySaveLoading'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getClient: (clientId) => { dispatch(getClient(clientId)); },
    getClients: () => { dispatch(getClients()); },
    changeAccessStatus: (status) => { dispatch(changeAccessStatus(status)); },
    getOption: (id) => { dispatch(getOption(id)); },
    getActivity: (id) => { dispatch(getActivity(id)); },
    getActivityByType: (type) => { dispatch(getActivityByType(type)); },
    updateActivity: (id) => { dispatch(updateActivity(id)); },
    removeActivity: (id) => { dispatch(removeActivity(id)); },
    createActivity: () => { dispatch(createActivity()); },
    changeActivity: (key, value) => { dispatch(changeActivity(key, value)); },
    getActivities: (clientId) => { dispatch(getActivities(clientId)); },
    changeOptionsProduct: (clientId, product) => { dispatch(changeOptionsProduct(clientId, product)); },
    changeActivitySort: (prop, order) => { dispatch(changeActivitySort(prop, order)); },
    toggleHistoryEditMode: () => { dispatch(toggleHistoryEditMode()); },
    updateHistoryText: (text) => { dispatch(updateHistoryText(text)); },
    saveHistoryUpdates: () => { dispatch(saveHistoryUpdates()); },
    getHistoryNotes: (clientId) => { dispatch(getHistoryNotes(clientId)); },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Details);
