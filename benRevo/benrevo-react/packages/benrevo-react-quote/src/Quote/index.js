import { connect } from 'react-redux';
import QuotePresentation from './QuotePresentation';
import { inviteClient, getProducts, changeCurrentPage, downloadLifeQuote, downloadModLetter } from '../actions';

function mapStateToProps(state) {
  const clients = state.get('clients');
  const profile = state.get('profile');
  const presentationState = state.get('presentation');
  const quote = presentationState.get('quote');
  const documentsState = state.get('presentation').get('documents');

  return {
    client: clients.get('current').toJS(),
    profile: profile.toJS(),
    productSummary: quote.get('quoteProducts'),
    err: presentationState.get('quote').get('err'),
    errMsg: presentationState.get('quote').get('errMsg'),
    medical: presentationState.get('medical').toJS(),
    dental: presentationState.get('dental').toJS(),
    vision: presentationState.get('vision').toJS(),
    loading: presentationState.get('quote').get('loading'),
    totalAll: presentationState.get('final').get('totalAll'),
    documents: documentsState.get('data').toJS(),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    inviteClient: (email) => { dispatch(inviteClient(email)); },
    getProducts: (section) => { dispatch(getProducts(section)); },
    changeCurrentPage: (section, page) => { dispatch(changeCurrentPage(section, page)); },
    downloadLifeQuote: (quotes) => { dispatch(downloadLifeQuote(quotes)); },
    downloadModLetter: () => { dispatch(downloadModLetter()); },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(QuotePresentation);
