import * as React from 'react';
import { getInitiativesState } from '../interface';
import { SidebarLayout } from 'src/components/SidebarLayout';
import { InitiativesSidebar } from './InitiativesSidebar';
import { LoadingDetails } from 'src/components/LoadingDetails';
import { CreateNewPage } from './CreateNewPage';
import { InitiativeDetails } from './InitiativeDetails';
import { useRelatedItemsModule } from 'src/features/relatedItems/module';

export function InitiativesView() {
  useRelatedItemsModule();
  const {
    isLoaded,
    isLoading,
    isAdding,
    initiativeId,
  } = getInitiativesState.useState();
  return (
    <SidebarLayout
      left={!isLoaded ? <LoadingDetails /> : <InitiativesSidebar />}
      right={
        !isLoaded || isLoading ? (
          <LoadingDetails />
        ) : initiativeId || isAdding ? (
          <InitiativeDetails />
        ) : (
          <CreateNewPage />
        )
      }
    >
      <div />
    </SidebarLayout>
  );
}
