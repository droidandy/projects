import { connect } from 'react-redux';
import { info } from 'react-notification-system-redux';
import { updateClient, selectDirectToPresentation } from '@benrevo/benrevo-react-clients';
import Options from './Options';
import { optionCheck, getOptions, optionsSelect, optionsDelete, getQuotesStatus, downloadQuote, createDTPClearValue, getDTPClearValueStatus, downloadPPT } from '../actions';

function mapStateToProps(state, ownProps) {
  const clientsState = state.get('clients');
  const overviewState = state.get('presentation').get(ownProps.section);
  const quoteState = state.get('presentation').get('quote');

  return {
    client: clientsState.get('current').toJS(),
    qualification: quoteState.get('qualification').toJS(),
    qualificationLoading: quoteState.get('qualificationLoading'),
    loading: overviewState.get('loading'),
    current: overviewState.get('current').toJS(),
    options: overviewState.get('options').toJS(),
    selected: overviewState.get('selected'),
    quotesStatus: overviewState.get('quotesStatus').toJS(),
    load: overviewState.get('load').get('options'),
    mainCarrier: overviewState.get('mainCarrier').toJS(),
    clearValueCarrier: overviewState.get('clearValueCarrier').toJS(),
    quotes: overviewState.get('quotes').toJS(),
    carrierList: overviewState.get('carrierList').toJS(),
    checkedOptions: overviewState.get('checkedOptions').toJS(),
    readonly: state.get('presentation').get('quote').get('readonly'),
    dtp: selectDirectToPresentation(state), // Direct To Presentation flag
  };
}

function mapDispatchToProps(dispatch) {
  return {
    optionCheck: (section, option) => { dispatch(optionCheck(section, option)); },
    optionsSelect: (section, id) => { dispatch(optionsSelect(section, id)); },
    optionsDelete: (section, id) => { dispatch(optionsDelete(section, id)); },
    getOptions: (section) => { dispatch(getOptions(section)); },
    downloadQuote: (section, kaiser) => { dispatch(downloadQuote(section, kaiser)); },
    getQuotesStatus: (section) => { dispatch(getQuotesStatus(section)); },
    info: (notificationOpts) => { dispatch(info(notificationOpts)); },
    createDTPClearValue: () => { dispatch(createDTPClearValue()); },
    getDTPClearValueStatus: () => { dispatch(getDTPClearValueStatus()); },
    updateClient: (name, value) => { dispatch(updateClient(name, value)); },
    downloadPPT: () => { dispatch(downloadPPT()); },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Options);
