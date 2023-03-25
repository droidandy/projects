import React from 'react';
import { Link } from 'react-router';
import { loggedIn } from 'utils/authService/lib';
import { Image } from 'semantic-ui-react';
import logo from './logo';
import UserProfileMenuItem from './UserProfileMenuItem';

class HeaderAdmin extends React.Component { // eslint-disable-line react/prefer-stateless-function

  render() {
    return (
      <div className="app-header admin">
        <Image as={Link} to="/" src={logo.link} alt="Logo" className="header-logo" />
        <div className="app-header-text">ADMIN</div>
        { loggedIn() && <UserProfileMenuItem /> }
      </div>
    );
  }
}

export default HeaderAdmin;
