import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { updateForm, updatePlan, setError, deleteError, setValid, addFile, removeFile, addPlanFile, removePlanFile, sendRfp, changeShowErrors } from './../actions';
import Quote from './Quote';

function mapStateToProps(state, ownProps) {
  const section = ownProps.section || ownProps.routes[2].path;
  const infoState = state.get('rfp').get(section);
  const filesState = state.get('rfpFiles').get(section);
  const commonState = state.get('rfp').get('common');
  const clientsState = state.get('clients');

  return {
    client: clientsState.get('current').toJS(),
    plans: infoState.get('plans') ? infoState.get('plans').toJS() : [],
    tierList: infoState.get('tierList'),
    selfFunding: infoState.get('selfFunding'),
    alternativeQuote: infoState.get('alternativeQuote'),
    alongside: infoState.get('alongside'),
    ratingTiers: infoState.get('ratingTiers'),
    takeOver: infoState.get('takeOver'),
    additionalRequests: infoState.get('additionalRequests'),
    diagnosisAndStatus: infoState.get('diagnosisAndStatus'),
    filesSummary: filesState.get('filesSummary').toJS(),
    filesCurrentCarriers: filesState.get('filesCurrentCarriers').toJS(),
    filesClaims: filesState.get('filesClaims').toJS(),
    planFiles: filesState.get('planFiles').toJS(),
    formErrors: infoState.get('formErrors').toJS(),
    carriers: infoState.get('carriers').toJS(),
    products: clientsState.get('current').get('products').toJS(),
    virginCoverage: clientsState.get('current').get('virginCoverage').toJS(),
    showErrors: commonState.get('showErrors'),
    section,
    prefix: ownProps.prefix,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setValid: (section, valid) => { dispatch(setValid(section, valid)); },
    setError: (section, type, msg, meta) => { dispatch(setError(section, type, msg, meta)); },
    deleteError: (section, type, meta) => { dispatch(deleteError(section, type, meta)); },
    updateForm: (section, name, value) => { dispatch(updateForm(section, name, value)); },
    updatePlan: (section, key, value, index) => { dispatch(updatePlan(section, key, value, index)); },
    addFile: (section, name, value) => {
      dispatch(addFile(section, name, value));
    },
    removeFile: (section, name, value) => {
      dispatch(removeFile(section, name, value));
    },
    addPlanFile: (section, files, index) => {
      dispatch(addPlanFile(section, files, index));
    },
    removePlanFile: (section, index, fileIndex) => {
      dispatch(removePlanFile(section, index, fileIndex));
    },
    changeShowErrors: (value) => { dispatch(changeShowErrors(value)); },
    sendRfp: (payload) => { dispatch(sendRfp(payload)); },
    changePage: (page, prefix) => {
      dispatch(push(`${prefix || ''}/rfp/${page}`));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Quote);
