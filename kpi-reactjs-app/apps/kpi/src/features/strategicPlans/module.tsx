import React from 'react';
import i18n from 'i18next';
import { StrategicPlansView } from './components/StrategicPlansView';
import {
  StrategicPlansActions,
  StrategicPlansState,
  handle,
  getStrategicPlansState,
} from './interface';
import {
  searchStrategicPlans,
  deleteStrategicPlan,
} from 'src/services/API-next';
import { mixinList, defaultListInitialState } from 'src/mixins/listMixin-next';
import { _escapeCsv, _download } from 'src/services/API/_utils';
import { StrategicPlan } from 'src/types-next';
import { GlobalActions } from '../global/interface';

const initialState: StrategicPlansState = {
  ...defaultListInitialState,
  sortBy: 'id',
  filter: {
    name: '',
  },
  appliedFilter: {
    name: '',
  },
};

function exportStrategicPlans(items: StrategicPlan[]) {
  const csv: string[][] = [];
  csv.push([
    i18n.t('ID'),
    i18n.t('Name'),
    i18n.t('Start Date'),
    i18n.t('End Date'),
  ]);
  items.forEach(item => {
    csv.push([
      _escapeCsv(item.id),
      _escapeCsv(item.name[i18n.language]),
      _escapeCsv(item.startYear.toString()),
      _escapeCsv(item.endYear.toString()),
    ]);
  });
  const txt = csv.map(item => item.join(',')).join('\n');
  _download(txt, 'strategicPlans.csv', 'text/csv');
}

mixinList({
  handle,
  initialState,
  Actions: StrategicPlansActions,
  searchCriteria: {
    name: 'string',
    email: 'string',
  },
  getState: getStrategicPlansState,
  search: searchStrategicPlans,
  exportItems: exportStrategicPlans,
  loadedExternalAction: GlobalActions.refreshStrategicPlans,
  deleteItem: deleteStrategicPlan,
});

// --- Module ---
export default () => {
  handle();
  return <StrategicPlansView />;
};
