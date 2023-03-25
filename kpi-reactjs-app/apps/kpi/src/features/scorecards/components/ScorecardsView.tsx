import React from 'react';
import { getScorecardsState } from '../interface';
import { EmptyScorecardSidebar } from './EmptyScorecardSidebar';
import { EmptyScorecard } from './EmptyScorecard';
import { CreateScorecardModal } from './CreateScorecardModal';
import { ScorecardSidebar } from './ScorecardSidebar';
import { ScorecardsDetails } from './ScorecardsDetails';
import { LoadingDetails } from 'src/components/LoadingDetails';
import { SidebarLayout } from 'src/components/SidebarLayout';
import { useRelatedItemsModule } from 'src/features/relatedItems/module';
import { useResourceForm } from 'src/features/resource/resource-form';
import { useResource } from 'src/features/resource/module';
import { getRouterState } from 'typeless-router';

export function ScorecardsView() {
  useResource();
  useResourceForm();
  useRelatedItemsModule();
  const { isLoaded, scorecard, isLoading } = getScorecardsState.useState();
  const { location } = getRouterState.useState();
  const isFull = location!.search.includes('full=true');

  const getLeft = () => {
    if (isFull) {
      return null;
    }
    if (!isLoaded) {
      return <LoadingDetails />;
    }
    if (scorecard) {
      return <ScorecardSidebar />;
    }
    return <EmptyScorecardSidebar />;
  };

  return (
    <SidebarLayout
      left={getLeft()}
      right={
        !isLoaded || isLoading ? (
          <LoadingDetails />
        ) : scorecard ? (
          <ScorecardsDetails />
        ) : (
          <EmptyScorecard />
        )
      }
    >
      <CreateScorecardModal />
    </SidebarLayout>
  );
}
