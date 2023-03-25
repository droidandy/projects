import React from 'react';
import { SiteSettingsPageView } from './components/SiteSettingsView';
import {
  SiteSettingsActions,
  SiteSettingsState,
  handle,
  getSiteSettingsState,
} from './interface';
import { defaultListInitialState, mixinList } from 'src/mixins/listMixin-next';
import { deleteSiteSettings, searchSiteSettings } from 'src/services/API-next';
// --- Reducer ---
const initialState: SiteSettingsState = {
  ...defaultListInitialState,

  sortBy: 'id',
  filter: {
    name: '',
    parentId: null,
  },
  appliedFilter: {
    name: '',
    parentId: null,
  },
};
mixinList({
  handle,
  initialState,
  Actions: SiteSettingsActions,
  searchCriteria: {
    name: 'string',
    parentId: 'string' || 'number',
  },
  getState: getSiteSettingsState,
  search: searchSiteSettings,
  exportItems: () => {
    //
  },
  deleteItem: deleteSiteSettings,
});
// --- Module ---
export default () => {
  handle();
  return <SiteSettingsPageView />;
};
