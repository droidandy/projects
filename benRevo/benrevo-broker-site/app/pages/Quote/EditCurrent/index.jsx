import { connect } from 'react-redux';
import { changeLoad } from '@benrevo/benrevo-react-quote';
import { setError, deleteError, changeShowErrors } from '@benrevo/benrevo-react-rfp';
import EditCurrent from './EditCurrent';
import { selectOtherCarrier } from '../selectors';
import { getCurrentOption, saveCurrentOption } from '../../Rfp/actions';

function mapStateToProps(state, ownProps) {
  const { section } = ownProps;
  const rfpState = state.get('rfp');
  const clientsState = state.get('clients');
  const sectionState = state.get('rfp').get(section);

  return {
    loading: rfpState.get('loading'),
    requestError: rfpState.get('common').get('requestError'),
    plansLoaded: rfpState.get('plansLoaded'),
    virginCoverage: clientsState.get('current').get('virginCoverage').toJS(),
    otherCarrier: selectOtherCarrier(state),
    sectionState: sectionState.toJS(),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getCurrentOption: (section) => { dispatch(getCurrentOption(section)); },
    saveCurrentOption: (section) => { dispatch(saveCurrentOption(section)); },
    changeLoad: (section, data) => { dispatch(changeLoad(section, data)); },
    setError: (section, type, msg, meta) => { dispatch(setError(section, type, msg, meta)); },
    deleteError: (section, type) => { dispatch(deleteError(section, type)); },
    changeShowErrors: (value) => { dispatch(changeShowErrors(value)); },
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(EditCurrent);
