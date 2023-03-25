import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { updateClient, saveNewClient } from '@benrevo/benrevo-react-clients';
import InfoClient from './InfoClient';
import { setError, deleteError, setValid, changeShowErrors } from './../../actions';

function mapStateToProps(state, ownProps) {
  const section = ownProps.section || ownProps.routes[2].path;
  const clientsState = state.get('clients');
  const clientRfp = state.get('rfp').get(section);
  const commonState = state.get('rfp').get('common');

  return {
    clientSaveInProgress: clientsState.get('clientSaveInProgress'),
    clientSaveFailed: clientsState.get('clientSaveFailed'),
    saveInProgress: clientsState.get('clientSaveInProgress'),
    client: clientsState.get('current').toJS(),
    formErrors: clientRfp.get('formErrors').toJS(),
    domesticPartnerCoverages: clientsState.get('domesticPartnerCoverages').toJS(),
    showErrors: commonState.get('showErrors'),
    products: clientsState.get('current').get('products').toJS(),
    virginCoverage: clientsState.get('current').get('virginCoverage').toJS(),
    section,
    prefix: ownProps.prefix,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    saveClient: () => {
      dispatch(saveNewClient());
    },
    updateClient: (name, value) => { dispatch(updateClient(name, value)); },
    setValid: (section, valid) => { dispatch(setValid(section, valid)); },
    setError: (section, type, msg) => { dispatch(setError(section, type, msg)); },
    deleteError: (section, type) => { dispatch(deleteError(section, type)); },
    changeShowErrors: (value) => { dispatch(changeShowErrors(value)); },
    changePage: (page, prefix) => {
      dispatch(push(`${prefix || ''}/rfp/${page}`));
    },
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(InfoClient);
