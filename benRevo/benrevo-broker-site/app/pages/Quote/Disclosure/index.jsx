import { connect } from 'react-redux';
import Disclosure from './Disclosure';
import { getDisclaimerData, changeDisclaimerDropdownData } from './actions';

function mapStateToProps(state) {
  const overviewState = state.get('presentation');
  return {
    disclaimer: overviewState.get('disclaimer').toJS(),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    disclaimerGet: (section) => { dispatch(getDisclaimerData(section)); },
    changeDropdown: (value) => { dispatch(changeDisclaimerDropdownData(value)); },
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Disclosure);
