import { connect } from 'react-redux';
import Home from './Home';

function mapStateToProps(state) {
  const profile = state.get('profile');
  return {
    profile: profile.toJS(),
  };
}
function mapDispatchToProps() {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
