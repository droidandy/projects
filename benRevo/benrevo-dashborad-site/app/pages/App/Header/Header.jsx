import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { Image } from 'semantic-ui-react';
import { loggedIn } from 'utils/authService/lib';
import logo from './logo';
import UserProfileMenuItem from './UserProfileMenuItem';

class Header extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    location: PropTypes.string.isRequired,
  };

  render() {
    return (
      <div className="app-header">
        <Image as={Link} to="/" src={logo.link} alt="Logo" className="header-logo" />
        { loggedIn() && <UserProfileMenuItem /> }
      </div>
    );
  }
}

export default Header;
