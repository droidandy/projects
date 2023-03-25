import { connect } from 'react-redux';
import { changeLoad } from '@benrevo/benrevo-react-quote';
import { setError, deleteError, changeShowErrors } from '@benrevo/benrevo-react-rfp';
import EditCurrentAncillary from './EditCurrentAncillary';
import { getCurrentAncillaryOption, saveCurrentAncillaryOption } from '../../Rfp/actions';
import { LIFE_SECTION, LTD_SECTION, STD_SECTION, VOL_LIFE_SECTION, VOL_LTD_SECTION, VOL_STD_SECTION } from '../constants';

function mapStateToProps(state, ownProps) {
  const rfpState = state.get('rfp');
  let simpleSection = ownProps.section;
  const sectionState = state.get('rfp').get(simpleSection);

  if (ownProps.section === VOL_LIFE_SECTION) simpleSection = LIFE_SECTION;
  else if (ownProps.section === VOL_STD_SECTION) simpleSection = STD_SECTION;
  else if (ownProps.section === VOL_LTD_SECTION) simpleSection = LTD_SECTION;

  return {
    loading: rfpState.get('loading'),
    requestError: rfpState.get('common').get('requestError'),
    plansLoaded: rfpState.get('plansLoaded'),
    simpleSection,
    sectionState: sectionState.toJS(),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getCurrentAncillaryOption: (section, simpleSection) => { dispatch(getCurrentAncillaryOption(section, simpleSection)); },
    saveCurrentAncillaryOption: (section, isRenewal, ancillaryType, simpleSection) => { dispatch(saveCurrentAncillaryOption(section, isRenewal, ancillaryType, simpleSection)); },
    changeLoad: (section, data) => { dispatch(changeLoad(section, data)); },
    setError: (section, type, msg, meta) => { dispatch(setError(section, type, msg, meta)); },
    deleteError: (section, type) => { dispatch(deleteError(section, type)); },
    changeShowErrors: (value) => { dispatch(changeShowErrors(value)); },
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(EditCurrentAncillary);

