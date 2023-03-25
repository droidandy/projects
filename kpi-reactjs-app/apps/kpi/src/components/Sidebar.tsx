import * as React from 'react';
import styled from 'styled-components';
import { DashboardIcon } from 'src/icons/DashboardIcon';
import { MenuItem } from './MenuItem';
import { SettingsIcon } from 'src/icons/SettingsIcon';
import { getRouterState } from 'typeless-router';
import { LeftIcon } from 'src/icons/LeftIcon';
import { getGlobalState, GlobalActions } from 'src/features/global/interface';
import { useActions } from 'typeless';
import { CloseIcon } from 'src/icons/CloseIcon';
import { Trans } from 'react-i18next';
import { StrategicPlanDropdown } from './StrategicPlanDropdown';
import { ResetDataButton } from './ResetDataButton';

interface SidebarProps {
  className?: string;
  mobile?: boolean;
  onClose?: () => any;
}

const Brand = styled.div`
  background-color: #fff;
  justify-content: space-between;
  align-items: center;
  display: flex;
  padding: 0 25px;
  height: 96px;
  color: white;
  font-size: 20px;
`;

const Nav = styled.ul`
  margin: 0;
  list-style: none;
  padding: 15px 0;
  margin: 5px 0;
`;

const Toggle = styled.button`
  display: inline-block;
  padding: 0;
  border: 0;
  background: none;
  outline: none !important;
  box-shadow: none;
  svg {
    height: 26px;
    width: 26px;
    margin-right: -2px;
  }
  g [fill] {
    transition: fill 0.3s ease;
    fill: #5d78ff;
  }
  cursor: pointer;
`;

const menuItems = [
  {
    href: '/',
    exact: true,
    text: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    href: '/strategic-map',
    text: 'Strategic Map',
    icon: <SettingsIcon />,
  },
  {
    href: '/settings',
    text: 'Settings',
    icon: <SettingsIcon />,
  },
];

const Close = styled.button`
  width: 25px;
  height: 25px;
  top: 1px;
  left: 1px;
  box-shadow: none;
  border-radius: 3px;
  border: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.2);
  &:focus {
    outline: none;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const StrategicMapWrapper = styled.div`
  margin: 20px 15px 0;
`;

const ResetButtonWrapper = styled.div`
  margin: 20px 15px 0;
`;

const _Sidebar = (props: SidebarProps) => {
  const { className, mobile, onClose } = props;
  const { location } = getRouterState.useState();
  const { isSidebarExpanded } = getGlobalState.useState();
  const { toggleSidebarExpanded } = useActions(GlobalActions);
  const href = location ? location.pathname : '';
  return (
    <div className={className} style={{ width: isSidebarExpanded ? 255 : 70 }}>
      {mobile && (
        <Close onClick={onClose}>
          <CloseIcon />
        </Close>
      )}
      {!mobile && (
        <Brand>
          {isSidebarExpanded && (
            <img width="180" src={require('../../assets/images/logo.jpg')} />
          )}
          <Toggle onClick={toggleSidebarExpanded}>
            <LeftIcon />
          </Toggle>
        </Brand>
      )}
      {isSidebarExpanded && (
        <>
          <ResetButtonWrapper>
            <ResetDataButton block />
          </ResetButtonWrapper>
          <StrategicMapWrapper>
            <StrategicPlanDropdown />
          </StrategicMapWrapper>
        </>
      )}
      <Nav>
        {menuItems.map((item, i) => (
          <MenuItem
            key={i}
            href={item.href}
            active={
              item.exact ? href === item.href : href.startsWith(item.href)
            }
            icon={item.icon}
          >
            {isSidebarExpanded && <Trans>{item.text}</Trans>}
          </MenuItem>
        ))}
      </Nav>
    </div>
  );
};

export const Sidebar = styled(_Sidebar)`
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  width: 255px;
  transition: all 0.3s ease;
  height: 100%;
  box-shadow: 0px 0px 28px 0px rgba(82, 63, 105, 0.08);
  overflow: hidden;
  ${props =>
    props.mobile &&
    `
    ${Nav} {
      margin-top: 0;
      padding-top: 0;
    }
  `}
`;
