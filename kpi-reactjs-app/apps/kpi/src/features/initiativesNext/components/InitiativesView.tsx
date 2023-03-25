import * as React from 'react';
import { getInitiativesState } from '../interface';
import { SidebarLayout } from 'src/components/SidebarLayout';
import { InitiativesSidebar } from './InitiativesSidebar';
import { LoadingDetails } from 'src/components/LoadingDetails';
import { CreateNewPage } from './CreateNewPage';
import { InitiativeDetails } from './Details/InitiativeDetails';
import { useRelatedItemsModule } from 'src/features/relatedItems/module';
import { CreateInitiative } from './Create/CreateInitiative';
import { ActivityModal } from './ActivityModal';
import { RelatedItemModal } from './RelatedItemModal';
import { RiskManagementModal } from './RiskManagementModal';
import { ViewActivityModal } from './ViewActivityModal';
import { AmountModal } from './AmountModal';

export function InitiativesView() {
  useRelatedItemsModule();
  const {
    isLoaded,
    isLoading,
    isAdding,
    isEditing,
    initiativeId,
  } = getInitiativesState.useState();

  const getDetails = () => {
    if (!isLoaded || isLoading) {
      return <LoadingDetails />;
    }
    if (isAdding || isEditing) {
      return <CreateInitiative />;
    }
    if (initiativeId) {
      return <InitiativeDetails />;
    }
    return <CreateNewPage />;
  };
  return (
    <SidebarLayout
      left={!isLoaded ? <LoadingDetails /> : <InitiativesSidebar />}
      right={getDetails()}
    >
      <ActivityModal />
      <RelatedItemModal />
      <RiskManagementModal />
      <ViewActivityModal />
      <AmountModal />
    </SidebarLayout>
  );
}
