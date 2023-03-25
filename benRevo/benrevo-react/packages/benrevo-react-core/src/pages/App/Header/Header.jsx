import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router';
import { Container, Image } from 'semantic-ui-react';
import MenuList from './MenuList';

const Wrapper = styled.div`
  background: #fff;
  height: 70px;
  padding-top: 15px;
  .ui.menu {margin-top:0; margin-bottom:0; font-family: 'Open Sans';}
  .ui.secondary.menu .item, .ui.secondary.menu .active.item, .ui.secondary.menu a.item:hover {color: #6E7881; font-weight: 600; letter-spacing: .25px;};
`;

class Header extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    location: PropTypes.string.isRequired,
    logo: PropTypes.object.isRequired,
    CARRIER: PropTypes.string,
    openFeedbackModal: PropTypes.func.isRequired,
  };

  render() {
    return (
      <Wrapper>
        <Container>
          <Image as={Link} to="/" src={this.props.logo.link} alt="Logo" className="header-logo" />
          <MenuList
            location={this.props.location}
            CARRIER={this.props.CARRIER}
            openFeedbackModal={this.props.openFeedbackModal}
          />
        </Container>
      </Wrapper>
    );
  }
}

export default Header;
