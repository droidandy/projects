import { connect } from 'react-redux';
import CurrentBenefits from './CurrentBenefits';

function mapStateToProps(state, ownProps) {
  const { section } = ownProps;

  return {
    section,
  };
}

function mapDispatchToProps() {
  return {};
}
export default connect(mapStateToProps, mapDispatchToProps)(CurrentBenefits);

