import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Header } from './Header';
import { MainMenu } from './MainMenu';

const Top = styled.div`
  width: 100%;
`;

export function DesktopHeader() {
  return (
    <Top>
      <Header />
      <MainMenu />
    </Top>
  );
}
