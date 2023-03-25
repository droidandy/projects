import { connect } from 'react-redux';
import CurrentContribution from './CurrentContribution';

function mapStateToProps(state, ownProps) {
  const { section } = ownProps;

  return {
    section,
  };
}

function mapDispatchToProps() {
  return {};
}
export default connect(mapStateToProps, mapDispatchToProps)(CurrentContribution);

