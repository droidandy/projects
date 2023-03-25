import React from 'react';
import { FullScreenSpinner } from 'src/components/FullScreenSpinner';
import { getDashboardState } from '../interface';
import { UnreachableCaseError } from 'shared/helper';
import { TopManagementDashboard } from './TopManagement/TopManagementDashboard';
import { UnitDashboard } from './UnitDashboard/UnitDashboard';
import { DGMManagementDashboard } from './DGMManagementDashboard/DGMManagementDashboard';

export const DashboardView = () => {
  const { dashboard } = getDashboardState.useState();

  const renderDetails = () => {
    if (!dashboard) {
      return <FullScreenSpinner />;
    }

    switch (dashboard.type) {
      case 'ExcellenceDashboard':
        throw new Error('Not implemented');
      case 'TopManagement':
        return <TopManagementDashboard />;
      case 'UnitDashboard':
        return <UnitDashboard />;
      case 'DGMManagementDashboard':
        return <DGMManagementDashboard />;
      default:
        throw new UnreachableCaseError(dashboard.type);
    }
  };

  return renderDetails();
};
