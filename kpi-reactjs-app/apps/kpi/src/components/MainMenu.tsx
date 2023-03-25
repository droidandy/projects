import * as React from 'react';
import styled from 'styled-components';
import { getRouterState, Link } from 'typeless-router';
import { Trans } from 'react-i18next';
import { UnitDropdown } from './UnitDropdown';

interface MainMenuProps {
  className?: string;
}

export const menuItems = [
  {
    href: '/',
    exact: true,
    text: 'Dashboards',
  },
  // {
  //   href: '/my-tasks',
  //   text: 'My Tasks',
  // },
  {
    href: '/unit-reports',
    text: 'Workflow',
  },
  {
    href: '/scorecards',
    text: 'Scorecards',
  },
  {
    href: '/initiatives-next',
    text: 'Initiatives',
  },
  {
    href: '/excellence',
    text: 'Excellence',
  },
  {
    href: '/strategic-maps',
    text: 'Strategic Maps',
  },
  {
    href: '/challenges',
    text: 'Challenges',
  },
  {
    href: '/settings',
    text: 'Settings',
  },
  {
    href: '/reports-page',
    text: 'Reports',
  },
];

const Nav = styled.ul`
  margin: 0;
  padding: 0;
  display: flex;
  list-style: none;
  align-items: stretch;
`;

const NavItem = styled.li<{ active: boolean }>`
  display: flex;
  align-items: center;
  padding: 0px 0.15rem;

  a {
    border-radius: 4px;
    padding: 0.75rem 1.45rem;
    transition: all 0.3s ease;
    cursor: pointer;
    color: #6c6e86;
  }

  &:hover a {
    color: #374afb;
    background-color: #f8f8fb;
  }

  ${props =>
    props.active &&
    `
    && {
      a {
        color: #ffffff;
        background-color: #374afb;
      }
    }
  `}
`;

const _MainMenu = (props: MainMenuProps) => {
  const { location } = getRouterState.useState();
  const href = location ? location.pathname : '';
  const { className } = props;
  return (
    <div className={className}>
      <Nav>
        {menuItems.map((item, i) => (
          <NavItem
            key={i}
            active={
              item.exact
                ? href === item.href
                : href.startsWith(item.href) &&
                  !href.startsWith(item.href + '-')
            }
          >
            <Link href={item.href}>
              <Trans>{item.text}</Trans>
            </Link>
          </NavItem>
        ))}
      </Nav>
      <UnitDropdown />
    </div>
  );
};

export const MainMenu = styled(_MainMenu)`
  display: flex;
  align-items: stretch;
  height: 70px;
  background-color: #fff;
  padding: 0 30px;
  border-bottom: 1px solid #eff0f6;
`;
