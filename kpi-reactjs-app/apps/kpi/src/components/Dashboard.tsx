import React from 'react';
import { useIsMobile } from 'src/hooks/useIsMobile';
import { DesktopHeader } from './DesktopDashboard';
import styled from 'styled-components';
import { MobileHeader } from './MobileHeader';
import { Breadcrumbs } from './Breadcrumbs';

interface DashboardProps {
  children: React.ReactNode;
}

const Wrapper = styled.div<{ isMobile: boolean }>`
  width: 100%;
  height: 100%;
  ${props =>
    !props.isMobile &&
    `
  display: flex;
  flex-direction: column;
  `}
  ${props =>
    props.isMobile &&
    `
  display: block;
  padding-top: 50px;
  `}
`;

export function Dashboard(props: DashboardProps) {
  const { children } = props;
  const isMobile = useIsMobile();
  return (
    <Wrapper isMobile={isMobile}>
      {isMobile ? <MobileHeader /> : <DesktopHeader />}
      <Breadcrumbs />
      {children}
    </Wrapper>
  );
}
