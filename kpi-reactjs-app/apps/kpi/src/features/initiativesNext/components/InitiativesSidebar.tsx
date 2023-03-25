import * as React from 'react';
import * as R from 'remeda';
import * as Rx from 'src/rx';
import { SidebarSymbol } from '../symbol';
import {
  createModule,
  createSelector,
  useActions,
  useSelector,
} from 'typeless';
import { getInitiativesState, InitiativesActions } from '../interface';
import { Initiative } from 'src/types-next';
import { getGlobalState } from 'src/features/global/interface';
import { TreeSidebar } from 'src/components/TreeSidebar';
import { getCurrentItemTitle } from '../selectors';
import {
  getInitiativeTree,
  getAllExpandedMap,
  getInitiativeKey,
  toggleExpandedKey,
} from 'src/common/sidebar';

export function InitiativesSidebar() {
  handle();
  const { searchTerm } = getSidebarState.useState();
  const { isAdding, isLoading } = getInitiativesState.useState();
  const { search, toggleExpanded, expandAll } = useActions(SidebarActions);
  const { addNewItem } = useActions(InitiativesActions);
  const items = useSelector(getTreeItems);
  const title = useSelector(getCurrentItemTitle);

  return (
    <TreeSidebar
      searchTerm={searchTerm}
      isAdding={isAdding}
      search={search}
      toggleExpanded={toggleExpanded}
      expandAll={expandAll}
      addNewItem={addNewItem}
      items={items}
      overrideSelectedTitle={isLoading ? undefined : title}
    />
  );
}

export const [handle, SidebarActions, getSidebarState] = createModule(
  SidebarSymbol
)
  .withActions({
    $mounted: null,
    search: (searchTerm: string) => ({ payload: { searchTerm } }),
    toggleExpanded: (key: string) => ({ payload: { key } }),
    setExpandedMap: (expandedMap: { [x: string]: true }) => ({
      payload: { expandedMap },
    }),
    expandAll: null,
  })
  .withState<SidebarState>();

export interface SidebarState {
  searchTerm: string;
  expandedMap: { [x: string]: true };
}

const initialState: SidebarState = {
  expandedMap: {},
  searchTerm: '',
};

handle
  .reducer(initialState)
  .on(SidebarActions.search, (state, { searchTerm }) => {
    state.searchTerm = searchTerm;
  })
  .on(SidebarActions.setExpandedMap, (state, { expandedMap }) => {
    state.expandedMap = expandedMap;
  })
  .on(SidebarActions.toggleExpanded, (state, { key }) => {
    state.expandedMap = toggleExpandedKey(state.expandedMap, key);
  });

handle
  .epic()
  .on(SidebarActions.$mounted, () => {
    const { initiativeId, initiatives } = getInitiativesState();
    if (!initiatives || !initiativeId) {
      return Rx.empty();
    }
    const expandedMap = { ...getSidebarState().expandedMap };
    const map = R.indexBy(initiatives, x => x.id);
    const travel = (item: Initiative) => {
      if (!item.parentId) {
        return;
      }
      const parent = map[item.parentId];
      if (parent) {
        expandedMap[getInitiativeKey(parent)] = true;
        travel(parent);
      }
    };
    const selected = map[initiativeId];
    travel(selected);
    return SidebarActions.setExpandedMap(expandedMap);
  })
  .on(SidebarActions.expandAll, () => {
    const { initiatives } = getInitiativesState();
    return Rx.of(
      SidebarActions.setExpandedMap(getAllExpandedMap(null, initiatives))
    );
  });

export const getTreeItems = createSelector(
  [getInitiativesState, state => state.initiatives],
  [getInitiativesState, state => state.initiativeId],
  [getInitiativesState, state => state.isAdding],
  [getSidebarState, state => state.expandedMap],
  [getSidebarState, state => state.searchTerm],
  [getGlobalState, state => state.lang],
  (initiatives, initiativeId, isAdding, expandedMap, searchTerm, lang) => {
    return getInitiativeTree({
      isNext: true,
      initiatives: initiatives.filter(x => !x.parentId),
      lang,
      expandedMap,
      selectedKey: initiativeId ? `InitiativeItem_${initiativeId}` : null,
      isAdding,
      searchTerm,
    });
  }
);
