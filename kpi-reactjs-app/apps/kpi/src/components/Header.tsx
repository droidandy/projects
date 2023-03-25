import * as React from 'react';
import { TopBar } from './TopBar';
import { LangDropdown } from './LangDropdown';
import { UserDropdown } from './UserDropdown';
import { SettingsDropdown } from './SettingsDropdown';
import { styled, keyframes } from 'src/styled';

interface HeaderProps {
  className?: string;
  mobile?: boolean;
}

const minimizeHeader = keyframes`
  from {
    top: -100px;
  }

  to {
    top: 0;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  margin-left: 30px;
  margin-right: 30px;

  .kt-header--minimize & {
    margin-bottom: 10px;
  }
`;

const Img = styled.img`
  height: 75px;

  .kt-header--minimize & {
    height: 55px;
  }
`;

const _Header = (props: HeaderProps) => {
  const { className } = props;
  return (
    <div className={className}>
      {!props.mobile && (
        <>
          <Logo>
            <Img src={require('../../assets/images/logo.jpg')} />
          </Logo>
        </>
      )}
      <TopBar>
        <LangDropdown />
        <UserDropdown />
        <SettingsDropdown />
      </TopBar>
    </div>
  );
};

export const Header = styled(_Header)`
  width: 100%;
  height: 80px;
  background-color: ${props => props.theme.headerBg};
  border-bottom: 1px solid #eff0f6;
  transition: all 0.3s ease;
  justify-content: space-between;
  display: flex;
  ${props =>
    props.mobile &&
    `
    height: 50px;
    border-bottom: none;
  `}

  .kt-header--minimize & {
    position: fixed;
    top: 0px;
    left: 0;
    right: 0;
    z-index: 98;
    height: 60px;
    animation: ${minimizeHeader} 0.5s ease 1;
    box-shadow: 0 0 40px 0 rgba(82, 63, 105, 0.1);
  }
`;
