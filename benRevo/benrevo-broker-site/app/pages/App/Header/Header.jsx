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
            <span className="logo" style={this.props.logo && { background: `url("${this.props.logo.replace('.png', '_2x.png')}") no-repeat`, backgroundSize: 'contain' }} />
          </Link>
          <MenuList location={this.props.location} />
        </Container>
      </div>
    );
  }
}

export default Header;
