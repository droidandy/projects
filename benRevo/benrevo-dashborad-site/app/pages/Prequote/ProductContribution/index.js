import { connect } from 'react-redux';
import {
  selectSectionTitle,
  updateForm,
  updatePlanTier,
} from '@benrevo/benrevo-react-rfp';
import ProductContribution from './ProductContribution';

function mapStateToProps(state, ownProps) {
  const section = ownProps.routes[4].path;
  const infoState = state.get('rfp').get(section);
  const clientsState = state.get('clients');

  return {
    section,
    title: selectSectionTitle(section),
    contributionType: infoState.get('contributionType'),
    virginCoverage: clientsState.get('current').get('virginCoverage').toJS(),
    plans: infoState.get('plans').toJS(),
    tier: infoState.get('tier'),
    formErrors: infoState.get('formErrors').toJS(),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateForm: (section, name, value) => { dispatch(updateForm(section, name, value)); },
    updatePlanTier: (section, planIndex, type, outOfStateType, tierIndex, value, outOfState) => { dispatch(updatePlanTier(section, planIndex, type, outOfStateType, tierIndex, value, outOfState)); },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductContribution);
