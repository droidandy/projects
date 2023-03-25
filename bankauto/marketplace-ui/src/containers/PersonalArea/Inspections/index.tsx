import React, { FC } from 'react';
import { getInspections, removeInspection, createInspection } from 'api/client/inspections';
import { InspectionsContextProvider } from './InspectionsContext';
import { InspectionsList } from './InspectionsList';

export const InspectionsListContainer: FC = () => {
  return (
    <InspectionsContextProvider value={{ getInspections, removeInspection, createInspection }}>
      <InspectionsList />
    </InspectionsContextProvider>
  );
};
