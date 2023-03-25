import React from 'react';
import PropTypes from 'prop-types';
import { Container } from 'semantic-ui-react';
import { Link } from 'react-router';
import MenuList from './MenuList';

class Header extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    location: PropTypes.string.isRequired,
  };
  render() {
    return (
      <div className={(this.props.location === '/' || this.props.location === '/about') ? 'app-header white' : 'app-header'}>
        <Container>
          <Link to="/">
            <span className="logo" />
          </Link>
          <MenuList location={this.props.location} />
        </Container>
      </div>
    );
  }
}

export default Header;
