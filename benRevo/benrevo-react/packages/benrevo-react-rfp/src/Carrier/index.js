import { connect } from 'react-redux';
import Carrier from './Carrier';
import { submitRfp, checkTypeOfCensus, getRFPStatus } from './actions';
import { setError, deleteError, setValid, changeSelected, sendRfp, setPageValid, changeShowErrors } from './../actions';
import { selectSelected } from './../selectors';

function mapStateToProps(state) {
  const medicalState = state.get('rfp').get('medical');
  const dentalState = state.get('rfp').get('dental');
  const visionState = state.get('rfp').get('vision');
  const lifeState = state.get('rfp').get('life');
  const stdState = state.get('rfp').get('std');
  const ltdState = state.get('rfp').get('ltd');
  const ratesState = state.get('rfp').get('rates');
  const enrollmentState = state.get('rfp').get('enrollment');
  const commonState = state.get('rfp').get('common');
  const clientsState = state.get('clients');
  const carrierState = state.get('carrier');
  const medicalFiles = state.get('rfpFiles').get('medical');
  const dentalFiles = state.get('rfpFiles').get('dental');
  const visionFiles = state.get('rfpFiles').get('vision');
  const lifeFiles = state.get('rfpFiles').get('life');
  const stdFiles = state.get('rfpFiles').get('std');
  const ltdFiles = state.get('rfpFiles').get('ltd');

  const data = {
    products: clientsState.get('current').get('products').toJS(),
    virginCoverage: clientsState.get('current').get('virginCoverage').toJS(),
    client: clientsState.get('current').toJS(),
    medical: medicalState.toJS(),
    dental: dentalState.toJS(),
    vision: visionState.toJS(),
    life: lifeState.toJS(),
    std: stdState.toJS(),
    ltd: ltdState.toJS(),
    rates: ratesState.toJS(),
    enrollment: enrollmentState.toJS(),
    rfpClient: state.get('rfp').get('client').toJS(),
    medicalPlans: medicalState.get('plans').toJS(),
    dentalPlans: dentalState.get('plans').toJS(),
    visionPlans: visionState.get('plans').toJS(),
    loading: (carrierState) ? carrierState.get('loading') : false,
    submitting: (carrierState) ? carrierState.get('submitting') : false,
    requestError: commonState.get('requestError'),
    alertMsg: carrierState.get('alertMsg'),
    rfpSuccessfullySubmitted: carrierState.get('rfpSuccessfullySubmitted'),
    selected: selectSelected(state),
    rfpSubmitDate: state.get('rfp').get('common').get('rfpLastUpdated'),
    rfpCreated: state.get('rfp').get('common').get('rfpCreated'),
    plansLoaded: carrierState.get('plansLoaded'),
    filesSummary: {
      medical: medicalFiles.get('filesSummary').toJS(),
      life: lifeFiles.get('filesSummary').toJS(),
      std: stdFiles.get('filesSummary').toJS(),
      ltd: ltdFiles.get('filesSummary').toJS(),
    },
    dentalFiles: dentalFiles.get('planFiles').toJS(),
    visionFiles: visionFiles.get('planFiles').toJS(),
    censusType: carrierState.get('censusType').toJS(),
    statusLoaded: carrierState.get('statusLoaded'),
    declinedOutside: clientsState.get('current').get('declinedOutside'),
    submissions: {
      standard: carrierState.get('standard').toJS(),
    },
  };

  return data;
}


function mapDispatchToProps(dispatch) {
  return {
    setValid: (section, valid) => { dispatch(setValid(section, valid)); },
    changeShowErrors: (value) => { dispatch(changeShowErrors(value)); },
    setPageValid: (section, page, valid) => { dispatch(setPageValid(section, page, valid)); },
    setError: (section, type, msg, meta) => { dispatch(setError(section, type, msg, meta)); },
    deleteError: (section, type) => { dispatch(deleteError(section, type)); },
    sendRfp: (section) => { dispatch(sendRfp(section)); },
    submitRfp: () => { dispatch(submitRfp()); },
    checkTypeOfCensus: () => { dispatch(checkTypeOfCensus()); },
    getRFPStatus: () => { dispatch(getRFPStatus()); },
    changeSelected: (data) => { dispatch(changeSelected(data)); },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Carrier);
