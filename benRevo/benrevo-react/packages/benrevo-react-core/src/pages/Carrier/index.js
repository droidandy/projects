import { connect } from 'react-redux';
import Carrier from './Carrier';

function mapStateToProps(state) {
  const profile = state.get('profile');
  return {
    profile: profile.toJS(),
  };
}
function mapDispatchToProps() {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Carrier);
