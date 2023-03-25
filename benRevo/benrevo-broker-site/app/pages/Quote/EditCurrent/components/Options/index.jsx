import { connect } from 'react-redux';
import { changeShowErrors } from '@benrevo/benrevo-react-rfp';
import CurrentOptions from './CurrentOptions';
import { selectPlansCarrierList } from '../../../../App/selectors';

function mapStateToProps(state, ownProps) {
  const { section } = ownProps;
  const sectionState = state.get('rfp').get(section);
  const commonState = state.get('rfp').get('common');

  return {
    section,
    carrierList: selectPlansCarrierList(state, section),
    formErrors: sectionState.get('formErrors').toJS(),
    showErrors: commonState.get('showErrors'),
    containerId: `edit-current-modal-${section}`,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    changeShowErrors: (value) => { dispatch(changeShowErrors(value)); },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CurrentOptions);

