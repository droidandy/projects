import * as React from 'react';
import styled from 'styled-components';
import { getDashboardsState, DashboardsActions } from '../interface';
import { useActions } from 'typeless';
import { DisplayTransString } from 'src/components/DisplayTransString';
import { TreeItem } from 'src/components/TreeItem';

interface DashboardSidebarProps {
  className?: string;
}

const _DashboardSidebar = (props: DashboardSidebarProps) => {
  const { className } = props;
  const { dashboards, selected } = getDashboardsState.useState();
  const { selectDashboard } = useActions(DashboardsActions);
  return (
    <div className={className}>
      {dashboards.map(item => (
        <TreeItem
          key={item.id}
          depth={0}
          active={selected === item}
          clickable
          onClick={() => selectDashboard(item)}
        >
          <DisplayTransString value={item.name} />
        </TreeItem>
      ))}
    </div>
  );
};

export const DashboardSidebar = styled(_DashboardSidebar)`
  height: 100%;
  padding: 15px 5px;
  background: white;
  text-align: center;
`;
