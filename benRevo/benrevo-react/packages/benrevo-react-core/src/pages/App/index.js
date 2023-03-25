/**
 * Created by ryanford on 3/5/17.
 */
import { connect } from 'react-redux';
import { removeToken } from './../../utils/authService/lib';
import { logout, checkRole, sendFeedback } from './../../utils/authService/actions';
import App from './App';
import { toggleMobileNav, openFeedbackModal, closeFeedbackModal } from './actions';

function mapStateToProps(state) {
  const showMobile = state.get('global').get('showMobileNav');
  const checkingRole = state.get('global').get('checkingRole');
  const profile = state.get('profile');
  const notifications = state.get('notifications');
  const feedbackModalOpen = state.get('global').get('feedbackModalOpen');
  return {
    notifications,
    picture: profile.get('picture'),
    name: profile.get('name'),
    brokerageRole: profile.get('brokerageRole').toJS(),
    showMobileNavigation: showMobile,
    checkingRole,
    feedbackModalOpen,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    logout() {
      removeToken();
      dispatch(logout());
    },
    openFeedbackModal: () => { dispatch(openFeedbackModal()); },
    closeFeedbackModal: () => { dispatch(closeFeedbackModal()); },
    toggleMobileNavigation: () => { dispatch(toggleMobileNav()); },
    sendFeedback: (page, data, type, metadata) => { dispatch(sendFeedback(page, data, type, metadata)); },
    checkRole: (skipStatus) => { dispatch(checkRole(skipStatus)); },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
