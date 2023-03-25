import React from 'react';
import { LocationsView } from './components/LocationsView';
import {
  LocationsActions,
  LocationsState,
  handle,
  getLocationsState,
} from './interface';
import { searchLocations, exportLocations } from 'src/services/API';
import { defaultListInitialState, mixinList } from 'src/mixins/listMixin';

// --- Reducer ---
const initialState: LocationsState = {
  ...defaultListInitialState,
  sortBy: 'name',
  filter: {
    name: '',
    address: '',
    poBox: '',
    city: '',
    country: '',
    isHeadquarter: null,
  },
  appliedFilter: {
    name: '',
    address: '',
    poBox: '',
    city: '',
    country: '',
    isHeadquarter: null,
  },
};

mixinList({
  handle,
  initialState,
  Actions: LocationsActions,
  searchCriteria: {
    name: 'string',
    address: 'string',
    poBox: 'string',
    city: 'string',
    country: 'string',
    isHeadquarter: 'bool',
  },
  getState: getLocationsState,
  search: searchLocations,
  exportItems: exportLocations,
});

// --- Module ---
export default () => {
  handle();
  return <LocationsView />;
};
