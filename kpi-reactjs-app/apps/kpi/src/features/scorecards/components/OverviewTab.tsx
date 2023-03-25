import * as React from 'react';
import styled from 'styled-components';
import { PerformanceHistory } from './PerformanceHistory';
import { getScorecardsState } from '../interface';
import { BalancedScorecardItemType } from 'src/types-next';
import { RealDataTable } from './RealDataTable';
import { DataUsedInCalculation } from './DataUsedInCalculation';
import { RelatedItemsView } from 'src/features/relatedItems/components/RelatedItemsView';
import { PerformanceWidget } from './PerformanceWidget';

interface OverviewTabProps {
  className?: string;
}

const Row = styled.div`
  display: flex;
  margin: 0 -10px;
  margin-bottom: 20px;
`;

const SmallColumn = styled.div`
  width: 232px;
  margin: 0 10px;
  flex-shrink: 0;
`;

const BigColumn = styled.div`
  margin: 0 10px;
  flex-grow: 1;
  width: calc(100% - 232px);
`;

const _OverviewTab = (props: OverviewTabProps) => {
  const { className } = props;
  const { resource } = getScorecardsState.useState();

  return (
    <div className={className}>
      <Row>
        <SmallColumn>
          <PerformanceWidget />
        </SmallColumn>
        <BigColumn>
          <PerformanceHistory />
        </BigColumn>
      </Row>
      <Row>
        <BigColumn>
          {resource && resource.typeId === BalancedScorecardItemType.KPI ? (
            <RealDataTable />
          ) : (
            <DataUsedInCalculation />
          )}
        </BigColumn>
        {resource && (
          <SmallColumn>
            <RelatedItemsView />
          </SmallColumn>
        )}
      </Row>
    </div>
  );
};

export const OverviewTab = styled(_OverviewTab)`
  display: block;
`;
