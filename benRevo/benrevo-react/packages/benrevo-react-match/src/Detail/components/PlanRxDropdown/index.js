import { connect } from 'react-redux';
import PlanRxDropdown from './PlanRxDropdown';
import { setNewRxPlanBenefits, getRxPlansBenefits } from './../../../actions';

function mapStateToProps(state, ownProps) {
  const { section, networkId } = ownProps;
  const presentationState = state.get('presentation');
  // const overviewState = presentationState.get(section);
  return {
    rxPlansForImportBenefits: presentationState.get('rxPlansForImportBenefits').toJS(),
    networkId,
    section,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setNewRxPlanBenefits: (section, pnnId) => { dispatch(setNewRxPlanBenefits(section, pnnId)); },
    getRxPlansBenefits: (networkId) => { dispatch(getRxPlansBenefits(networkId)); },
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(PlanRxDropdown);

