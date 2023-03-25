import { connect } from 'react-redux';
import {
  selectSectionTitle,
} from '@benrevo/benrevo-react-rfp';
import ProductBenefits from './ProductBenefits';
import { changePlanField, selectBenefits } from '../actions';
import { DENTAL_SECTION } from '../constants';

function mapStateToProps(state, ownProps) {
  const section = ownProps.routes[4].path;
  const infoState = state.get('rfp').get(section);

  return {
    section,
    title: selectSectionTitle(section),
    plans: infoState.get('plans').toJS(),
    benefitsPlans: infoState.get('benefits').toJS(),
    selectedBenefits: (section === DENTAL_SECTION) ? infoState.get('selectedBenefits').toJS() : {},
  };
}

function mapDispatchToProps(dispatch) {
  return {
    changePlanField: (section, index, key, type, valueKey, value, planType) => { dispatch(changePlanField(section, index, key, type, valueKey, value, planType)); },
    selectBenefits: (section, planIndex, select) => { dispatch(selectBenefits(section, planIndex, select)); },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductBenefits);
