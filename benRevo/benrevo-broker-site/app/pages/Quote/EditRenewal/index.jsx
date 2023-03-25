import { connect } from 'react-redux';
import { changeLoad } from '@benrevo/benrevo-react-quote';
import EditCurrent from './EditRenewal';
import { getCurrentOption, saveCurrentOption } from '../../Rfp/actions';

function mapStateToProps(state) {
  const rfpState = state.get('rfp');

  return {
    loading: rfpState.get('loading'),
    requestError: rfpState.get('common').get('requestError'),
  };
}


function mapDispatchToProps(dispatch) {
  return {
    getCurrentOption: (section, optionId) => { dispatch(getCurrentOption(section, optionId)); },
    saveCurrentOption: (section, optionId, isRenewal) => { dispatch(saveCurrentOption(section, optionId, isRenewal)); },
    changeLoad: (section, data) => { dispatch(changeLoad(section, data)); },
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(EditCurrent);

