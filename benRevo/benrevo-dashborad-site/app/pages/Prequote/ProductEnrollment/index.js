import { connect } from 'react-redux';
import {
  selectSectionTitle,
  updatePlanTier,
} from '@benrevo/benrevo-react-rfp';
import ProductEnrollment from './ProductEnrollment';

function mapStateToProps(state, ownProps) {
  const section = ownProps.routes[4].path;
  const infoState = state.get('rfp').get(section);

  return {
    section,
    title: selectSectionTitle(section),
    plans: infoState.get('plans').toJS(),
    tier: infoState.get('tier'),
    formErrors: infoState.get('formErrors').toJS(),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updatePlanTier: (section, planIndex, type, outOfStateType, tierIndex, value, outOfState) => { dispatch(updatePlanTier(section, planIndex, type, outOfStateType, tierIndex, value, outOfState)); },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductEnrollment);
