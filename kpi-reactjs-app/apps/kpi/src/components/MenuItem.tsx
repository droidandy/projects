import * as React from 'react';
import styled, { css } from 'styled-components';
import { Link } from 'typeless-router';

interface MenuItemProps {
  className?: string;
  active?: boolean;
  children: React.ReactNode;
  icon: React.ReactNode;
  href: string;
}

const _MenuItem = (props: MenuItemProps) => {
  const { className, children, icon, href } = props;
  return (
    <li className={className}>
      <Link href={href}>
        <i>{icon}</i>
        <span>{children}</span>
      </Link>
    </li>
  );
};

const activeCss = css`
  a {
    background-color: #f6f7fd;
  }
  span {
    color: #5867dd;
  }
  i {
    g [fill] {
      fill: #5d78ff;
    }
  }
`;

export const MenuItem = styled(_MenuItem)`
  transition: background-color 0.3s;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  float: none;
  padding: 0;

  a {
    padding: 9px 25px;
    height: 44px;
    text-decoration: none;
    align-items: stretch;
    margin: 0;
    display: flex;
    flex-grow: 1;
  }
  span {
    color: #313752;
    font-weight: 400;
    display: flex;
    align-items: center;
    flex-grow: 1;
    padding: 0;
    font-size: 13px;
  }
  i {
    margin-left: -2px;
    flex: 0 0 35px;
    display: flex;
    align-items: center;
    line-height: 0;
    color: #494b74;
    svg {
      height: 23px;
      width: 23px;
    }

    g [fill] {
      transition: fill 0.3s ease;
      fill: #c4cff9;
    }
  }

  &:hover {
    ${activeCss}
  }

  ${props => props.active && activeCss}
`;
