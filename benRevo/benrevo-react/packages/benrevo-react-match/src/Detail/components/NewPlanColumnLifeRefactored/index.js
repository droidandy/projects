import { connect } from 'react-redux';
import { updatePlanField } from '@benrevo/benrevo-react-quote';
import NewPlanColumnLifeRefactored from './NewPlanColumnLifeRefactored';
import { editVolPlanField, getDefaultValuesEditPlanLife } from './../../../actions';

function mapStateToProps(state, ownProps) {
  const { detailedPlan } = ownProps;
  const overviewState = state.get('presentation').get(ownProps.section);
  const currentPlan = detailedPlan.plans[0] || {};
  return {
    newPlan: overviewState.get('newPlan').toJS(),
    planTemplate: overviewState.get('planTemplate').toJS(),
    page: overviewState.get('page').toJS(),
    currentPlan,
    detailedPlan,
    benefitsLoading: state.get('presentation').get('benefitsLoading'),
    quoteType: overviewState.get('openedOption').toJS().quoteType || '',
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updatePlanField: (section, name, value, part, valName, status, planIndex, externalRx) => { dispatch(updatePlanField(section, name, value, part, valName, status, planIndex, externalRx)); },
    editPlanField: (section, name, value, part, valName, typeOfPlan) => { dispatch(editVolPlanField(section, name, value, part, valName, typeOfPlan)); },
    getDefaultValuesEditPlanLife: (section, plan, lengthClasses) => { dispatch(getDefaultValuesEditPlanLife(section, plan, lengthClasses)); },
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(NewPlanColumnLifeRefactored);
