import { connect } from 'react-redux';
import { changeLoad } from '@benrevo/benrevo-react-quote';
import EditRenewalAncillary from './EditRenewalAncillary';
import { getCurrentAncillaryOption, saveCurrentAncillaryOption } from '../../Rfp/actions';
import { LIFE_SECTION, LTD_SECTION, STD_SECTION, VOL_LIFE_SECTION, VOL_LTD_SECTION, VOL_STD_SECTION } from '../constants';

function mapStateToProps(state, ownProps) {
  const rfpState = state.get('rfp');
  let simpleSection = ownProps.section;

  if (ownProps.section === VOL_LIFE_SECTION) simpleSection = LIFE_SECTION;
  else if (ownProps.section === VOL_STD_SECTION) simpleSection = STD_SECTION;
  else if (ownProps.section === VOL_LTD_SECTION) simpleSection = LTD_SECTION;

  return {
    loading: rfpState.get('loading'),
    requestError: rfpState.get('common').get('requestError'),
    simpleSection,
  };
}


function mapDispatchToProps(dispatch) {
  return {
    getCurrentAncillaryOption: (section, simpleSection, isRenewal, optionId) => { dispatch(getCurrentAncillaryOption(section, simpleSection, isRenewal, optionId)); },
    saveCurrentAncillaryOption: (section, isRenewal, ancillaryType, simpleSection, optionId) => { dispatch(saveCurrentAncillaryOption(section, isRenewal, ancillaryType, simpleSection, optionId)); },
    changeLoad: (section, data) => { dispatch(changeLoad(section, data)); },
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(EditRenewalAncillary);

