import React from 'react';
import SC from 'styled-components';
import Link from 'next/link';
import {Icon} from '../icon';
import { minDevice, maxDevice } from '../../theme';

const Container = SC.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Divider = SC.div`
  background: #777777;
  opacity: 0.2;
  width: 1px;
  height: 36px;
  margin: 0 15px;
  @media (max-width: 475px) {
    display: none;
  }
`;

const Label = SC.div`
  width: 145px;
  font-style: normal;
  font-weight: normal;
  font-size: 8px;
  line-height: 12px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #777777;
`;

const Logo = SC(Link)``;

const Sign = SC(Icon)`
  margin-right: 14px;
`;

const LogoLabel = SC.span`
  font-style: normal;
  font-weight: normal;
  font-size: 20px;
  line-height: 25px;
  color: ${({ color }) => color};
  @media (max-width: 475px) {
    display: none;
  }
`;

const Content = SC.a`
  display: flex;
  align-items: center;
  &:hover {
    cursor: pointer;
  }
`;

export const HeaderLogo = () => (
  <Container>
    <Logo href="/">
      <Content>
        <Sign name="logo" size="36" signColor="#008E5B" color="#000" />
        <LogoLabel color="#000">
          Росимущество
        </LogoLabel>
      </Content>
    </Logo>
    <Divider />
    <Label>
      Дирекция по обеспечению деятельности ФАУГИ
    </Label>
  </Container>
);
