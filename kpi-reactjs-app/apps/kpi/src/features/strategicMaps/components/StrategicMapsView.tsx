import React from 'react';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { SidebarLayout } from 'src/components/SidebarLayout';
import { LoadingDetails } from 'src/components/LoadingDetails';
import { StrategicMapsSidebar } from './StrategicMapsSidebar';
import { getStrategicMapsState } from '../interface';
import { StrategicMapsPane } from './StrategicMapsPane';
import { ContainerModal } from './ContainerModal';
import { ItemModal } from './ItemModal';
import { useStrategicMapForm } from '../strategicMap-form';
import { TextModal } from './TextModal';
import { ConfigureModal } from './ConfigureModal';

export const StrategicMapsView = () => {
  const { isLoaded } = getStrategicMapsState.useState();
  useStrategicMapForm();

  return (
    <DndProvider backend={HTML5Backend}>
      {isLoaded && (
        <>
          <ContainerModal />
          <ItemModal />
          <TextModal />
          <ConfigureModal />
        </>
      )}
      <SidebarLayout
        left={!isLoaded ? <LoadingDetails /> : <StrategicMapsSidebar />}
        right={!isLoaded ? <LoadingDetails /> : <StrategicMapsPane />}
      />
    </DndProvider>
  );
};
