import { connect } from 'react-redux';
import CarriersFilter from './CarriersFilter';

function mapStateToProps(state) {
  const compareState = state.get('presentation').get('comparePlans');
  const sectionSelected = compareState.get('sectionSelected');
  const clientPlanCarriersSelected = compareState.get('clientPlanCarriersSelected').toJS();
  const rfpCarriers = state.get('app').get('rfpcarriers').toJS();
  return {
    clientPlanCarriers: rfpCarriers[sectionSelected.toLowerCase()] || [],
    clientPlanCarriersSelected,
  };
}

function mapDispatchToProps() {
  return {
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(CarriersFilter);
