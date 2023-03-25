import { connect } from 'react-redux';
import SectionRfp from './SectionRfp';

function mapStateToProps(state) {
  const clientsState = state.get('clients');

  return {
    products: clientsState.get('current').get('products').toJS(),
    virginCoverage: clientsState.get('current').get('virginCoverage').toJS(),
  };
}
function mapDispatchToProps() {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(SectionRfp);
