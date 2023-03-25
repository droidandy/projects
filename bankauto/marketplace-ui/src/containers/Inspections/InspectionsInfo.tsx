import React, { FC } from 'react';
import { InspectionPage } from './InspectionPage';
import { EmptyVehicleCard } from './VehicleCard';

export const InspectionsInfo: FC = () => (
  <InspectionPage>
    <EmptyVehicleCard />
  </InspectionPage>
);
