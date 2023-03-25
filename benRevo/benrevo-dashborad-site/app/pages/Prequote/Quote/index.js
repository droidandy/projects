import { connect } from 'react-redux';
import { validateQuote, removeQuote, getDownloadedQuotes, selectQuoteType,
  setQuoteType, closeQuoteTypesModal, closeUploadQuotesErrorsModal } from './actions';
import Quote from './Quote';

function mapStateToProps(state) {
  const rfp = state.get('rfp');
  const clientsState = state.get('clients');
  return {
    uploadQuote: rfp.get('uploadQuote'),
    client: clientsState.get('current').toJS(),
  };
}

const mapDispatchToProps = {
  validateQuote,
  removeQuote,
  getDownloadedQuotes,
  selectQuoteType,
  setQuoteType,
  closeQuoteTypesModal,
  closeUploadQuotesErrorsModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(Quote);
