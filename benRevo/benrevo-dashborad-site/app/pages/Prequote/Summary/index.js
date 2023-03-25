import { connect } from 'react-redux';
import { setError, deleteError, setValid, setPageValid, changeShowErrors } from '@benrevo/benrevo-react-rfp';
import Summary from './Summary';
import { downloadOptimizer } from '../actions';

function mapStateToProps(state) {
  const medicalState = state.get('rfp').get('medical');
  const dentalState = state.get('rfp').get('dental');
  const visionState = state.get('rfp').get('vision');
  const lifeState = state.get('rfp').get('life');
  const stdState = state.get('rfp').get('std');
  const ltdState = state.get('rfp').get('ltd');
  const clientsState = state.get('clients');
  const carrierState = state.get('carrier');

  return {
    products: clientsState.get('current').get('products').toJS(),
    virginCoverage: clientsState.get('current').get('virginCoverage').toJS(),
    client: clientsState.get('current').toJS(),
    rfpClient: state.get('rfp').get('client').toJS(),
    loadingOptimizer: state.get('rfp').get('loadingOptimizer'),
    medical: medicalState.toJS(),
    dental: dentalState.toJS(),
    vision: visionState.toJS(),
    life: lifeState.toJS(),
    std: stdState.toJS(),
    ltd: ltdState.toJS(),
    loading: (carrierState) ? carrierState.get('loading') : false,
    rfpCreated: state.get('rfp').get('common').get('rfpCreated'),
    plansLoaded: carrierState.get('plansLoaded'),
    rfpSubmitDate: state.get('rfp').get('common').get('rfpLastUpdated'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setValid: (section, valid) => { dispatch(setValid(section, valid)); },
    changeShowErrors: (value) => { dispatch(changeShowErrors(value)); },
    setPageValid: (section, page, valid) => { dispatch(setPageValid(section, page, valid)); },
    setError: (section, type, msg, meta) => { dispatch(setError(section, type, msg, meta)); },
    deleteError: (section, type) => { dispatch(deleteError(section, type)); },
    downloadOptimizer: () => { dispatch(downloadOptimizer()); },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Summary);
