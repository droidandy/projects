import * as React from 'react';
import * as R from 'remeda';
import styled from 'styled-components';
import { getBalancedScorecardState } from '../interface';
import { TreeItem } from './TreeItem';
import { getGlobalState } from 'src/features/global/interface';
import { usePerformanceMap } from '../hooks';

interface ItemsTreeViewProps {
  className?: string;
}

const _ItemsTreeView = (props: ItemsTreeViewProps) => {
  const { className } = props;
  const { scorecard, parentTypes } = getBalancedScorecardState.useState();
  const { lookups } = getGlobalState.useState();

  const parentGroups = React.useMemo(() => {
    return R.groupBy(scorecard.scorecardItems, x => x.parentId);
  }, [scorecard]);

  const idMap = React.useMemo(() => {
    return R.indexBy(scorecard.scorecardItems, x => x.id);
  }, [scorecard]);

  const rootItems = React.useMemo(() => {
    return scorecard.scorecardItems.filter(
      x => !x.parentId || !idMap[x.parentId]
    );
  }, [scorecard]);

  const performanceMap = usePerformanceMap(lookups, scorecard);

  return (
    <div className={className}>
      {rootItems.map((item, i) => (
        <TreeItem
          key={i}
          item={item}
          parentGroups={parentGroups}
          performanceMap={performanceMap}
          depth={0}
          parentTypes={parentTypes}
        />
      ))}
    </div>
  );
};

export const ItemsTreeView = styled(_ItemsTreeView)`
  display: block;
  box-shadow: 0px 2px 15px rgba(0, 0, 0, 0.03);
  border-radius: 0px 0px 3px 3px;
  margin-top: 5px;
`;
