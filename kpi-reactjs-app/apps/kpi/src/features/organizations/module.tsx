import React from 'react';
import i18n from 'i18next';
import { OrganizationsView } from './components/OrganizationsView';
import {
  OrganizationsActions,
  OrganizationsState,
  handle,
  getOrganizationsState,
} from './interface';
import { searchOrganizations, deleteOrganization } from 'src/services/API-next';
import { _escapeCsv, _download } from 'src/services/API/_utils';
import { mixinList, defaultListInitialState } from 'src/mixins/listMixin-next';
import { Organization } from 'src/types-next';

const initialState: OrganizationsState = {
  ...defaultListInitialState,
  sortBy: 'name',
  filter: {
    name: '',
  },
  appliedFilter: {
    name: '',
  },
};

function exportOrganizations(items: Organization[]) {
  const csv: string[][] = [];
  csv.push([i18n.t('ID'), i18n.t('Name')]);
  items.forEach(item => {
    csv.push([_escapeCsv(item.id), _escapeCsv(item.name[i18n.language])]);
  });
  const txt = csv.map(item => item.join(',')).join('\n');
  _download(txt, 'organizations.csv', 'text/csv');
}

mixinList({
  handle,
  initialState,
  Actions: OrganizationsActions,
  searchCriteria: {
    name: 'string',
  },
  getState: getOrganizationsState,
  search: searchOrganizations,
  exportItems: exportOrganizations,
  deleteItem: deleteOrganization,
});

// --- Module ---
export default () => {
  handle();
  return <OrganizationsView />;
};
