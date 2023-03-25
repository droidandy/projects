import React from 'react';
import { getBalancedScorecardState } from '../interface';
import styled from 'styled-components';
import { Container } from 'src/components/Container';
import { TopPicker } from './TopPicker';
import { ScorecardStats } from './ScorecardStats';
import { Spinner } from 'src/components/Spinner';
import { OverallStats } from './OverallStats';
import { ItemsTreeView } from './ItemsTreeView';
import { ScorecardHeader } from './ScorecardHeader';
import { KpiDetailsSidePanel } from 'src/features/kpiDetails/components/KpiDetailsSidePanel';
import { TableView } from './TableView';
import { NoItemsView } from './NoItemsView';

const SpinnerWrapper = styled.div`
  margin-top: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const BalancedScorecardView = () => {
  const {
    isLoaded,
    isScorecardLoading,
    isStatsLoading,
    viewMode,
    scorecard,
  } = getBalancedScorecardState.useState();
  const renderContent = () => {
    const loader = (
      <SpinnerWrapper>
        <Spinner black size="40px" />
      </SpinnerWrapper>
    );
    if (!isLoaded) {
      return loader;
    }
    if (isStatsLoading || isScorecardLoading) {
      return (
        <>
          <TopPicker />
          {loader}
        </>
      );
    }
    return (
      <>
        <TopPicker />
        <ScorecardStats />
        <OverallStats />
        {scorecard.scorecardItems.length === 0 ? (
          <NoItemsView />
        ) : (
          <>
            <ScorecardHeader />
            {viewMode === 'table' ? <TableView /> : <ItemsTreeView />}
          </>
        )}
      </>
    );
  };
  return (
    <Container>
      <KpiDetailsSidePanel />
      {renderContent()}
    </Container>
  );
};
