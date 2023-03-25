import { connect } from 'react-redux';
import RenewalBenefits from './RenewalBenefits';

function mapStateToProps(state, ownProps) {
  const { section } = ownProps;

  return {
    section,
  };
}

function mapDispatchToProps() {
  return {};
}
export default connect(mapStateToProps, mapDispatchToProps)(RenewalBenefits);

