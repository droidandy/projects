import React from 'react';
import { Container } from 'semantic-ui-react';
import { Link } from 'react-router';
import MenuList from './MenuList';

class Header extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div className="app-header">
        <Container>
          <Link to="/">
            <span className="logo" />
            <span className="logo-name">ADMIN</span>
          </Link>
          <MenuList location={this.props.location} />
        </Container>
      </div>
    );
  }
}

export default Header;
