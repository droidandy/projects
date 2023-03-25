import { connect } from 'react-redux';
import Header from './Header';

function mapStateToProps(state) {
  const profile = state.get('profile');
  return {
    logo: profile.get('brokerageLogo'),
  };
}

function mapDispatchToProps() {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
