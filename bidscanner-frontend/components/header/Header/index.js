// @flow
import React, { Component } from 'react';
import Container from 'components/styled/Container';
import { Flex, Box } from 'grid-styled';
import styled from 'styled-components';

import Logo from 'components/styled/Logo';

import UserNavigation from 'components/header/Header/UserNavigation';
import GuestNavigation from 'components/header/Header/GuestNavigation';
import SearchContainer from 'containers/header/Header/SearchContainer';
import Account from 'components/header/Header/Account';

const myprops = {
  newDealsNumber: 8,
};

const Description = styled.div`
  font-size: 14px;
  line-height: 16px;
`;

const RightWrapper = styled(Flex)`
  @media (max-width: 830px) {
    flex-direction: column;
    align-items: flex-start;
  }
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
    const { showText, showSearch = true, data, showServices } = this.props;
    const signedIn = data && !data.error && !data.loading && data.me;
    return (
      <header>
        <Container>
          <Flex justify="space-between" align="center" mt={1} wrap>
            <Box w={showSearch ? [1, 1, 1 / 5, 1 / 5] : [1, 2 / 5, 2 / 5]}>
              <Logo />
              {showText && (
                <Description>
                  the marketplace for <b>industrial</b>
                  <br />goods and services
                </Description>
              )}
            </Box>
            <RightWrapper
              w={showSearch ? [1, 1, 4 / 5, 4 / 5] : [1, 1 / 2, 2 / 5]}
              justify="space-between"
              align="center"
            >
              <Box
                order={[2, 2, 1]}
                w={showSearch ? [1, 1 / 2, 1 / 2] : []}
                mt={[1, 1, 0]}
                pl={[1, 1, 0]}
                pr={[1, 1, 0]}
              >
                {showSearch && <SearchContainer />}
              </Box>
              <Flex order={[1, 1, 2]} align="center" mt={[1, 1, 0]} justify="space-between">
                {signedIn ? <UserNavigation {...myprops} /> : <GuestNavigation showServices={showServices} />}
                {signedIn && <Account {...{ firstName: data.me.first_name, imgSrc: '/static/26-26.png' }} />}
              </Flex>
            </RightWrapper>
          </Flex>
        </Container>
      </header>
    );
  }
}
