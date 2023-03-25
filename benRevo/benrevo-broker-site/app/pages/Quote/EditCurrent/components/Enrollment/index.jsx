import { connect } from 'react-redux';
import CurrentEnrollment from './CurrentEnrollment';

function mapStateToProps(state, ownProps) {
  const { section } = ownProps;

  return {
    section,
  };
}

function mapDispatchToProps() {
  return {};
}
export default connect(mapStateToProps, mapDispatchToProps)(CurrentEnrollment);

