import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { removeToken, logout, selectEmail, selectPicture, selectBrokerage } from '@benrevo/benrevo-react-core';
import UserProfileMenu from './UserProfileMenu';

const mapStateToProps = createStructuredSelector({
  email: selectEmail(),
  picture: selectPicture(),
  brokerage: selectBrokerage(),
});

export function mapDispatchToProps(dispatch) {
  return {
    logout() {
      removeToken();
      dispatch(logout());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserProfileMenu);
