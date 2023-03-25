import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Image } from 'semantic-ui-react';

const LOGOUT = 'Logout';

class UserProfileMenu extends React.Component { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    email: PropTypes.string,
    brokerage: PropTypes.string,
    picture: PropTypes.string,
    logout: PropTypes.func,
  };

  render() {
    const { email, picture, brokerage } = this.props;
    const trigger = (
      <span className="user-profile">
        <span className="user-profile-icon" /> <span className="user-profile-name">{email}</span>
      </span>
    );
    const user = [
      {
        key: 'user',
        text: <span>Signed in as <strong>{email}</strong></span>,
        // image: <Image src={picture} avatar />,
        disabled: true,
      },
      {
        key: 'brokerage',
        text: <span>Brokerage: <strong>{brokerage}</strong></span>,
        disabled: true,
      },
      {
        text: LOGOUT,
        value: LOGOUT,
        icon: 'users',
        onClick: this.props.logout,
      },
    ];
    return (
      <div>
        <Dropdown icon="angle down" inline compact options={user} trigger={trigger} />
      </div>
    );
  }
}

export default UserProfileMenu;
