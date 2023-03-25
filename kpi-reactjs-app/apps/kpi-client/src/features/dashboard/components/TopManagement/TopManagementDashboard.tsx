import React from 'react';
import { Container } from 'src/components/Container';
import { KpiCards } from '../KpiCards';
import { ValuesWidget } from '../ValuesWidget';
import { TopManagementSymbol } from '../../symbol';
import { createModule } from 'typeless';
import { PerformanceWidget } from '../PerformanceWidget/PerformanceWidget';

export interface TopManagementState {}

export const [
  handle,
  TopManagementActions,
  getTopManagementState,
] = createModule(TopManagementSymbol)
  .withActions({})
  .withState<TopManagementState>();

export function TopManagementDashboard() {
  handle();
  return (
    <Container>
      <KpiCards />
      <PerformanceWidget />
      <ValuesWidget />
    </Container>
  );
}
