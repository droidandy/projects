import React from 'react';
import SC from 'styled-components';
import Link from 'next/link';
import {Icon} from '../icon';

const Container = SC(Link)``;

const Sign = SC(Icon)`
  margin-right: 14px;
`;

const Label = SC.span`
  font-style: normal;
  font-weight: normal;
  font-size: 20px;
  line-height: 25px;
  color: ${({ color }) => color};
`;

const Content = SC.a`
  display: flex;
  align-items: center;
  &:hover {
    cursor: pointer;
  }
`;

export const Logo = ({signColor = '#008E5B', color = '#000'}) => (
  <Container href="/">
    <Content>
      <Sign name="logo" size="36" signColor={signColor} color={color} />
      <Label color={color}>
        Росимущество
      </Label>
    </Content>
  </Container>
);
