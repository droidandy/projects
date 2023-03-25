import { connect } from 'react-redux';
import App from './App';
import { toggleMobileNav } from './actions';

function mapStateToProps(state) {
  const showMobile = state.get('app').get('showMobileNav');
  return {
    showMobileNavigation: showMobile,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    toggleMobileNavigation: () => { dispatch(toggleMobileNav()); },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
