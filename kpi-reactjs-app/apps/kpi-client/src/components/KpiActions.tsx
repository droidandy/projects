import * as React from 'react';
import styled from 'styled-components';
import { Kpi } from 'shared/types';
import { useActions } from 'typeless';
import { KpiDetailsActions } from 'src/features/kpiDetails/interface';
import { PerformanceIcon } from 'src/icons/PerformanceIcon';
import { FileIcon } from './FileIcon';
import { CommentIcon } from './CommentIcon';
import { HistoryIcon } from 'src/icons/HistoryIcon';

interface KpiActionsProps {
  className?: string;
  kpi: Kpi;
}

const _KpiActions = (props: KpiActionsProps) => {
  const { className, kpi } = props;
  const { show: showDetails } = useActions(KpiDetailsActions);
  return (
    <div className={className}>
      <a onClick={() => showDetails(kpi, 'performance')}>
        <PerformanceIcon />
      </a>
      <a onClick={() => showDetails(kpi, 'details')}>
        <FileIcon />
      </a>
      <a onClick={() => showDetails(kpi, 'discussion')}>
        <CommentIcon />
      </a>
      <a onClick={() => showDetails(kpi, 'history')}>
        <HistoryIcon />
      </a>
    </div>
  );
};

export const KpiActions = styled(_KpiActions)`
  display: flex;
  align-items: center;
  justify-content: center;
  a {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  svg {
    margin: 0 5px;
  }
`;
