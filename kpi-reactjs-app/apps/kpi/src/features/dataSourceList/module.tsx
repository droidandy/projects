import React from 'react';
import * as Rx from 'src/rx';
import { DataSourceListView } from './components/DataSourceListView';
import {
  DataSourceListActions,
  DataSourceListState,
  handle,
  getDataSourceListState,
} from './interface';
import { defaultListInitialState, mixinList } from 'src/mixins/listMixin-next';
import { getRouterState } from 'typeless-router';
import { BalancedScorecardItemType } from 'src/types-next';
import { searchResource, deleteResource } from 'src/services/API-next';
import { getGlobalState } from '../global/interface';
import { catchErrorAndShowModal } from 'src/common/utils';
import { BalancedScorecardItemMapping } from 'shared/init-enums';

const initialState: DataSourceListState = {
  ...defaultListInitialState,
  sortBy: 'name',
  filter: { name: '' },
  appliedFilter: { name: '' },
};

const { epic } = mixinList({
  handle,
  initialState,
  Actions: DataSourceListActions,
  searchCriteria: {
    name: 'string',
  },
  getState: getDataSourceListState,
  search: criteria => {
    const { pathname } = getRouterState().location!;
    // pathname can either be `/settings/strategy-items/:type` or
    // `/settings/strategy-items/:type/:id`
    const name = pathname.split(
      '/'
    )[3] as keyof typeof BalancedScorecardItemType;
    const type = BalancedScorecardItemType[name];
    if (!type) {
      return Rx.empty();
    }
    const { currentPlanId } = getGlobalState();
    return searchResource(type, {
      strategicPlanId: currentPlanId,
      slug: BalancedScorecardItemMapping[name],
      ...criteria,
    });
  },
  exportItems: () => {
    //
  },
});

epic.on(DataSourceListActions.onDelete, ({ resource }) => {
  return Rx.concatObs(
    deleteResource(resource.typeId, resource.id).pipe(
      Rx.ignoreElements(),
      catchErrorAndShowModal()
    ),
    Rx.of(DataSourceListActions.applyFilter())
  );
});

// --- Module ---
export default () => {
  handle();
  return <DataSourceListView />;
};
