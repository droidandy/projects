import * as React from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from './Link';
import { UserDropdown } from './UserDropdown';
import { MainMenu } from './MainMenu';
import { Container } from './Container';

const minimizeTopBar = keyframes`
  from {
    top: -100px;
  }

  to {
    top: 0;
  }
`;

const TopHeader = styled.div`
  background: #0a73a5;
  color: #fff;
  height: 110px;
  display: flex;
  & > ${Container} {
    display: flex;
    align-items: center;
  }

  .kt-header--minimize & {
    position: fixed;
    top: 0px;
    left: 0;
    right: 0;
    z-index: 98;
    height: 60px;
    animation: ${minimizeTopBar} 0.5s ease 1;
    box-shadow: 0 0 40px 0 rgba(82, 63, 105, 0.1);
  }

  .kt-header--minimize & {
    height: 60px;
  }
`;

const TopBar = styled.div`
  display: flex;
  padding: 0;
  align-items: center;
  margin-left: 0;
  margin-right: auto;
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
`;

export const Header = () => {
  return (
    <>
      <TopHeader>
        <Container>
          <Brand>
            <Link>
              <img src={require('../../assets/adfd-logo.png')} />
            </Link>
          </Brand>
          <MainMenu />
          <TopBar>
            <UserDropdown />
          </TopBar>
        </Container>
      </TopHeader>
    </>
  );
};
