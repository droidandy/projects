import React from 'react';
import * as Rx from 'src/rx';
import { ExcellenceView } from './components/ExcellenceView';
import {
  ExcellenceActions,
  ExcellenceState,
  handle,
  getExcellenceState,
} from './interface';
import { defaultListInitialState, mixinList } from 'src/mixins/listMixin-next';
import {
  searchExcellenceRequirements,
  deleteExcellenceRequirement,
} from 'src/services/API-next';
import { catchErrorAndShowModal } from 'src/common/utils';

const initialState: ExcellenceState = {
  ...defaultListInitialState,
  sortBy: 'name',
  filter: {},
  appliedFilter: {},
};

const { epic } = mixinList({
  handle,
  initialState,
  Actions: ExcellenceActions,
  searchCriteria: {
    responsibleUnitId: 'string' || 'number',
  },
  getState: getExcellenceState,
  search: searchExcellenceRequirements,
  exportItems: () => {
    //
  },
});

epic.on(ExcellenceActions.onDelete, ({ item }) => {
  return Rx.concatObs(
    deleteExcellenceRequirement(item.id).pipe(
      Rx.ignoreElements(),
      catchErrorAndShowModal()
    ),
    Rx.of(ExcellenceActions.applyFilter())
  );
});

// --- Module ---
export default () => {
  handle();
  return <ExcellenceView />;
};
