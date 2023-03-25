import { connect } from 'react-redux';
import {
  selectSectionTitle,
  updateForm,
  updatePlanTier,
  updatePlanBanded,
} from '@benrevo/benrevo-react-rfp';
import ProductRates from './ProductRates';

function mapStateToProps(state, ownProps) {
  const section = ownProps.routes[4].path;
  const infoState = state.get('rfp').get(section);

  return {
    section,
    title: selectSectionTitle(section),
    contributionType: infoState.get('contributionType'),
    plans: infoState.get('plans').toJS(),
    tier: infoState.get('tier'),
    formErrors: infoState.get('formErrors').toJS(),
    rateType: infoState.toJS().rateType,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateForm: (section, name, value) => { dispatch(updateForm(section, name, value)); },
    updatePlanTier: (section, planIndex, type, outOfStateType, tierIndex, value, outOfState) => { dispatch(updatePlanTier(section, planIndex, type, outOfStateType, tierIndex, value, outOfState)); },
    updatePlanBanded: (section, index, path, value) => { dispatch(updatePlanBanded(section, index, path, value)); },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductRates);
