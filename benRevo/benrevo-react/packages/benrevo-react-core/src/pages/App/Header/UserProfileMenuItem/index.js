import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { removeToken } from './../../../../utils/authService/lib';
import { logout } from './../../../../utils/authService/actions';
import { selectEmail, selectPicture, selectBrokerage } from './../../../../utils/authService/selectors';
import UserProfileMenu from './UserProfileMenu';

function mapStateToProps() {
  return createStructuredSelector({
    email: selectEmail(),
    picture: selectPicture(),
    brokerage: selectBrokerage(),
  });
}


export function mapDispatchToProps(dispatch) {
  return {
    logout() {
      removeToken();
      dispatch(logout());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserProfileMenu);
