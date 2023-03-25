import React from 'react';
import { createModule } from 'typeless';
import { RouteConfig, SelectOption } from 'src/types';
import { DashboardSuspense } from 'src/components/DashboardSuspense';
import { ListingProjectSymbol } from './symbol';
import { InitiativeFilters, InitiativeSearchFilter, InitiativeSearchResult, StatusColor } from '../shared/type'
import { SearchResult } from 'shared/API';
import { OrganizationUnit } from 'shared/types';

// --- Actions ---
export const [handle, ListingProjectActions, getListingProjectState] = createModule(
  ListingProjectSymbol
)
  .withActions({
    $mounted: null,
    load: null,
    search: null,
    setIsLoading: (isLoading: boolean) => ({ payload: { isLoading } }),
    changePage: (page: number) => ({ payload: { page } }),
    changeFilter: (filter: InitiativeSearchFilter) => ({ payload: { filter } }),
    loaded: (filters: InitiativeFilters, items: SearchResult<OrganizationUnit>) => ({ payload: { filters, items } }),
    searchResult: (result: InitiativeSearchResult) => ({ payload: { result } }),
    newProject: null,
    clearFilter: null,
    applyFilter: null,
    setIsFilterExpanded: (isFilterExpanded: boolean) => ({
      payload: { isFilterExpanded },
    }),
  })
  .withState<ListingProjectState>();

// --- Routing ---
const ModuleLoader = React.lazy(() => import('./module'));

const ListingProjectRoute = () => (
  <DashboardSuspense>
    <ModuleLoader />
  </DashboardSuspense>
);

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: true,
  path: '/projects/listing',
  component: <ListingProjectRoute />,
};

// --- Types ---
export interface ListingProjectState {
  isLoading: boolean;
  projectCnt: number;
  pageCnt: number;
  pageUnit: number;
  currentPage: number;
  projects: {
    name: string;
    unit: {
      type: string;
      username: string[];
    };
    budget: number;
    startDate: Date | undefined;
    endDate: Date | undefined;
    color: StatusColor;
    progress: {
      title: string;
      percent: number;
    }
  }[];
  filter: InitiativeSearchFilter,
  options: {
    unit: SelectOption[];
    type: SelectOption[];
    status: SelectOption[];
  }
  isFilterExpanded: boolean;
  units: OrganizationUnit[];
}