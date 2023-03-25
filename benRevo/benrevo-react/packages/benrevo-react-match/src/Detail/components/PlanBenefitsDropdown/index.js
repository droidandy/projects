import { connect } from 'react-redux';
import PlanBenefitsDropdown from './PlanBenefitsDropdown';
import { setNewPlanBenefits, getPlansBenefits } from './../../../actions';

function mapStateToProps(state, ownProps) {
  const { section, networkId } = ownProps;
  const presentationState = state.get('presentation');
  // const overviewState = presentationState.get(section);
  return {
    plansForImportBenefits: presentationState.get('plansForImportBenefits').toJS(),
    networkId,
    section,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setNewPlanBenefits: (section, pnnId) => { dispatch(setNewPlanBenefits(section, pnnId)); },
    getPlansBenefits: (networkId) => { dispatch(getPlansBenefits(networkId)); },
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(PlanBenefitsDropdown);

