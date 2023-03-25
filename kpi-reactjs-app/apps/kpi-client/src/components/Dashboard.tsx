import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import styled from 'styled-components';

interface DashboardProps {
  children: React.ReactNode;
}

const Content = styled.div`
  flex: 1 0 0;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export function Dashboard(props: DashboardProps) {
  const { children } = props;
  return (
    <Wrapper>
      <Header />
      <Content>{children}</Content>
      <Footer />
    </Wrapper>
  );
}
