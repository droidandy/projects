import { connect } from 'react-redux';
import CurrentAncillaryRates from './CurrentAncillaryRates';

function mapStateToProps(state, ownProps) {
  const { section } = ownProps;

  return {
    section,
  };
}

function mapDispatchToProps() {
  return {};
}
export default connect(mapStateToProps, mapDispatchToProps)(CurrentAncillaryRates);

