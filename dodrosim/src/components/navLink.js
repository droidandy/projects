import React from 'react';
import SC, { css } from 'styled-components';
import Link from "next/link";

const Item = SC.a`
  position: relative;
  padding: 22px 0;
  font-style: normal;
  font-weight: bold;
  font-size: 12px;
  line-height: 15px;
  text-align: right;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #008E5B;
  margin: 0 13px 0 0;
  &:hover {
    color: #333E66;
  }
  @media (min-width: 870px) {
    ${({ active }) => active  && css`
      color: #333E66;
      &:after {
        content: "";
        position: absolute;
        display: block;
        width: 100%;
        height: 1px;
        bottom: 0;
        left: 0;
        border-radius: 1px 1px 0 0;
        background-color: #333E66;
      }
    `}
    &:hover:after {
      content: "";
      position: absolute;
      display: block;
      width: 100%;
      height: 1px;
      bottom: 0;
      left: 0;
      border-radius: 1px 1px 0 0;
      background-color: #333E66;
    }
  }
`;

export const NavLink = ({ name, active, onClick, ...props }) => (
  <Link {...props} passHref>
    <Item onClick={onClick} active={active}>{name}</Item>
  </Link>
);
