import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { getOptions, optionsDelete, changeCurrentPage, changeLoad } from '@benrevo/benrevo-react-quote';
import { getPlansTemplates } from '@benrevo/benrevo-react-match';
import Section from './Section';
import {
  initOptions,
  getAnotherOptions,
} from '../actions';
import { getCLSAQuote, resetZip, clsaModalOpen, clsaModalClose, getNextCLSA, checkUHCAction, getClientAttributes } from '../../Clients/Client/actions';

function mapStateToProps(state, ownProps) {
  const section = ownProps.routes[4].path;
  const { clientId } = ownProps.params;
  const clientsState = state.get('clients');
  // console.log(section);
  const overviewState = state.get('presentation').get(section);
  // console.log(overviewState.toJS());
  // console.log(clientsState.toJS());
  const rfpCarriers = state.get('app').get('rfpcarriers').toJS();
  const clientPageState = state.get('client');

  return {
    clientId,
    section,
    rfpCarriers,
    client: clientsState.get('current').toJS(),
    load: overviewState.get('load').get('options'),
    current: overviewState.get('current').toJS(),
    options: overviewState.get('options').toJS(),
    loading: overviewState.get('loading'),
    loadingOptions: overviewState.get('loadingOptions'),
    violationNotification: overviewState && overviewState.get('violationNotification') && overviewState.get('violationNotification').toJS(),
    clsaData: clientPageState.get('programs').get('clsa').toJS(),
    clsaLoading: clientPageState.get('clsaLoading'),
    clsaZipError: clientPageState.get('clsaZipError'),
    isCLSAModalOpen: clientPageState.get('clsaModalOpen'),
    uhcChecked: clientPageState.get('uhcChecked'),
    uhcQuoted: clientPageState.get('uhcQuoted'),
    clientAttributes: clientPageState.get('clientAttributes').toJS(),
    loadingAttributes: clientPageState.get('loadingAttributes'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getOptions: (section) => { dispatch(getOptions(section)); },
    getAnotherOptions: (section) => { dispatch(getAnotherOptions(section)); },
    // addOption: (option) => { dispatch(addOption(option)); },
    initOptions: (section) => { dispatch(initOptions(section)); },
    changeCurrentPage: (section, page) => { dispatch(changeCurrentPage(section, page)); },
    optionsDelete: (section, id) => { dispatch(optionsDelete(section, id)); },
    getPlansTemplates: (section) => { dispatch(getPlansTemplates(section)); },
    getCLSAQuote: (zip, number, age, programId, section) => { dispatch(getCLSAQuote(zip, number, age, programId, section)); },
    changePage: (clientId, section) => { dispatch(push(`/clients/${clientId}/presentation/${section}/detail`)); },
    resetZip: () => { dispatch(resetZip()); },
    clsaModalOpen: () => { dispatch(clsaModalOpen()); },
    clsaModalClose: () => { dispatch(clsaModalClose()); },
    getNextCLSA: (programId, section) => { dispatch(getNextCLSA(programId, section)); },
    changeLoad: (section, data) => { dispatch(changeLoad(section, data)); },
    checkUHC: (section, id) => { dispatch(checkUHCAction(section, id)); },
    getClientAttributes: () => { dispatch(getClientAttributes()); },
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Section);
