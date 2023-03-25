// @flow
import React from 'react';
import styled from 'styled-components';

const Logo = styled.img`
  width: 8em;
  height: 8em;
  border-radius: 4em;
`;

export type LogoProps = {
  logo: string,
};

export default ({ logo }: LogoProps) => <Logo src={logo} alt="sample" />;
