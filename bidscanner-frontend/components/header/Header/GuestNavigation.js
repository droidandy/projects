// @flow
import React, { Component } from 'react';
import { Flex } from 'grid-styled';
import styled from 'styled-components';
import NavigationDropdown from 'components/header/Header/NavigationDropdown';
import SignIn from 'components/signin/SignIn';
import SignUpContainer from 'containers/signup/SignUpContainer';
import Escrow from './icons/escrow.svg';
import Showcase from './icons/showcase.svg';
import Rfq from './icons/rfq.svg';
import Certificate from './icons/certificate.svg';

const servicesLinks = [
  {
    name: 'Showcase products',
    path: '/services/showcase',
    as: '/public/services/showcase',
    imgSrc: Showcase,
  },
  {
    name: 'Post RFQ, get bids',
    path: '/services/rfqs',
    as: '/public/services/rfqs',
    imgSrc: Rfq,
  },
  {
    name: 'Escrow payment',
    path: '/services/escrow',
    as: '/public/services/escrow',
    imgSrc: Escrow,
  },
  {
    name: 'Company certification',
    path: '/services/certification',
    as: '/public/services/certification',
    imgSrc: Certificate,
  },
];

const Button = styled.button`
  border: ${props => props.border || 'none'};
  border-radius: 2px;
  background-color: ${props => props.backgroundColor || 'black'};
  color: ${props => props.color || 'black'};
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 15px;
  &:active,
  &:focus {
    outline: none;
  }

  margin-left: 5px;
  height: 26px;
`;

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signIn: false,
      signUp: false,
    };
  }

  state: {
    signIn: false,
    signUp: false,
  };

  toggleSignIn = () => this.setState(prevState => ({ signIn: !prevState.signIn }));
  toggleSignUp = () => this.setState(prevState => ({ signUp: !prevState.signUp }));

  switchToAnother = () =>
    this.setState(prevState => ({ signIn: !prevState.signIn, signUp: !prevState.signUp }));

  render() {
    const { showServices } = this.props;
    return (
      <Flex align="center" ml="auto" wrap>
        {showServices ? (
          <NavigationDropdown title="services" links={servicesLinks} showServices={showServices} />
        ) : (
          <Button color="white" onClick={this.toggleSignUp}>
            register free
          </Button>
        )}
        <Button backgroundColor="white" border="1px solid black" onClick={this.toggleSignIn}>
          log in
        </Button>
        {this.state.signIn && <SignIn onRequestClose={this.toggleSignIn} switchTo={this.switchToAnother} />}
        {this.state.signUp && (
          <SignUpContainer onRequestClose={this.toggleSignUp} switchTo={this.switchToAnother} />
        )}
      </Flex>
    );
  }
}
