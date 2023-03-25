import { connect } from 'react-redux';
import { setError, deleteError, setValid, setPageValid, changeShowErrors } from '@benrevo/benrevo-react-rfp';
import Rater from './Rater';
import { changeSent, changeRater, changeNote, sendToRater } from '../actions';
import { selectRaters } from '../selectors';

function mapStateToProps(state) {
  const raterState = state.get('rfp').get('rater');

  const medicalState = state.get('rfp').get('medical');
  const dentalState = state.get('rfp').get('dental');
  const visionState = state.get('rfp').get('vision');
  const lifeState = state.get('rfp').get('life');
  const stdState = state.get('rfp').get('std');
  const ltdState = state.get('rfp').get('ltd');
  const clientsState = state.get('clients');

  return {
    raters: selectRaters(state),
    history: raterState.get('history').toJS(),
    note: raterState.get('note'),
    sending: raterState.get('sending'),
    sent: raterState.get('sent'),
    selectedRater: raterState.get('selectedRater'),
    medical: medicalState.toJS(),
    dental: dentalState.toJS(),
    vision: visionState.toJS(),
    life: lifeState.toJS(),
    std: stdState.toJS(),
    ltd: ltdState.toJS(),
    products: clientsState.get('current').get('products').toJS(),
    client: clientsState.get('current').toJS(),
    virginCoverage: clientsState.get('current').get('virginCoverage').toJS(),
    rfpCreated: state.get('rfp').get('common').get('rfpCreated'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    sendToRater: () => { dispatch(sendToRater()); },
    changeRater: (id) => { dispatch(changeRater(id)); },
    changeNote: (note) => { dispatch(changeNote(note)); },
    changeSent: (sent) => { dispatch(changeSent(sent)); },
    setValid: (section, valid) => { dispatch(setValid(section, valid)); },
    changeShowErrors: (value) => { dispatch(changeShowErrors(value)); },
    setPageValid: (section, page, valid) => { dispatch(setPageValid(section, page, valid)); },
    setError: (section, type, msg, meta) => { dispatch(setError(section, type, msg, meta)); },
    deleteError: (section, type) => { dispatch(deleteError(section, type)); },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Rater);
