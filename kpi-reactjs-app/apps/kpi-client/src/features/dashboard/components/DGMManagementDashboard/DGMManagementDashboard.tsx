import { createModule } from 'typeless';
import { DGMDashboardSymbol } from '../../symbol';
import React from 'react';
import { Container } from 'src/components/Container';
import { KpiCards } from '../KpiCards';
import { PerformanceWidget } from '../PerformanceWidget/PerformanceWidget';
import { ProjectsWidget } from '../ProjectsWidget/ProjectsWidget';
import { TwoColGrid } from '../TwoColGrid';
import { ChallengesWidget } from '../ChallengesWidget/ChallengesWidget';
import { MyTasksWidget } from '../MyTasksWidget';

export interface DGMDashboardState {}

export const [handle, DGMDashboardActions, getDGMDashboardState] = createModule(
  DGMDashboardSymbol
)
  .withActions({
    $mounted: null,
    load: null,
  })
  .withState<DGMDashboardState>();

export function DGMManagementDashboard() {
  handle();

  return (
    <Container>
      <KpiCards />
      <PerformanceWidget />
      <ProjectsWidget />
      <TwoColGrid>
        <ChallengesWidget />
        <MyTasksWidget />
      </TwoColGrid>
    </Container>
  );
}

handle.epic();
