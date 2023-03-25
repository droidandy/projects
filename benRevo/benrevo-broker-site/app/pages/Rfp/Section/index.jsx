import { connect } from 'react-redux';
import SectionPage from './SectionPage';

function mapStateToProps(state) {
  const clientsState = state.get('clients');
  return {
    products: clientsState.get('current').get('products').toJS(),
    virginCoverage: clientsState.get('current').get('virginCoverage').toJS(),
  };
}

export function mapDispatchToProps() {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(SectionPage);
