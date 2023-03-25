import React from 'react';
import { getDashboardsState } from '../interface';
import { LoadingDetails } from 'src/components/LoadingDetails';
import { SidebarLayout } from 'src/components/SidebarLayout';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardDetails } from './DashboardDetails';

export const DashboardsView = () => {
  const { isLoaded } = getDashboardsState.useState();
  return (
    <SidebarLayout
      // left={!isLoaded ? <LoadingDetails /> : <DashboardSidebar />}
      right={!isLoaded ? <LoadingDetails /> : <DashboardDetails />}
    />
  );
};
