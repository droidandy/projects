import { connect } from 'react-redux';
import CurrentRates from './CurrentRates';

function mapStateToProps(state, ownProps) {
  const { section } = ownProps;

  return {
    section,
  };
}

function mapDispatchToProps() {
  return {};
}
export default connect(mapStateToProps, mapDispatchToProps)(CurrentRates);

