import { connect } from 'react-redux';
import RenewalRates from './RenewalRates';

function mapStateToProps(state, ownProps) {
  const { section } = ownProps;

  return {
    section,
  };
}

function mapDispatchToProps() {
  return {};
}
export default connect(mapStateToProps, mapDispatchToProps)(RenewalRates);

