import * as React from 'react';
import * as R from 'remeda';
import * as Rx from 'src/rx';
import {
  createModule,
  useActions,
  createSelector,
  useSelector,
} from 'typeless';
import { SidebarSymbol } from '../symbol';
import { getScorecardsState, ScorecardsActions } from '../interface';
import { Resource } from 'src/types-next';
import { getGlobalState } from 'src/features/global/interface';
import { TreeSidebar } from 'src/components/TreeSidebar';
import {
  getAllExpandedMap,
  getResourceKey,
  toggleExpandedKey,
  getScorecardTree,
} from 'src/common/sidebar';

export function ScorecardSidebar() {
  handle();
  const { searchTerm } = getSidebarState.useState();
  const { isAdding } = getScorecardsState.useState();
  const { search, toggleExpanded, expandAll } = useActions(SidebarActions);
  const { addNewItem } = useActions(ScorecardsActions);
  const items = useSelector(getTreeItems);

  return (
    <TreeSidebar
      searchTerm={searchTerm}
      isAdding={isAdding}
      search={search}
      toggleExpanded={toggleExpanded}
      expandAll={expandAll}
      addNewItem={addNewItem}
      items={items}
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
    const { scorecard, resourceId, scorecardItems } = getScorecardsState();
    if (!scorecard || !resourceId) {
      return Rx.empty();
    }
    const expandedMap = { ...getSidebarState().expandedMap };
    const map = R.indexBy(scorecardItems, x => x.id);
    const travel = (item: Resource) => {
      if (!item.parentId) {
        expandedMap.root = true;
        return;
      }
      const parent = map[item.parentId];
      if (parent) {
        expandedMap[getResourceKey(parent)] = true;
        travel(parent);
      }
    };
    const selected = map[resourceId];
    if (selected) {
      travel(selected);
    }
    return SidebarActions.setExpandedMap(expandedMap);
  })
  .on(SidebarActions.expandAll, () => {
    const { scorecardItems } = getScorecardsState();
    return Rx.of(
      SidebarActions.setExpandedMap(getAllExpandedMap(scorecardItems, null))
    );
  });

export const getTreeItems = createSelector(
  [getScorecardsState, state => state.scorecard!],
  [getScorecardsState, state => state.scorecardItems!],
  [getScorecardsState, state => state.resourceId],
  [getScorecardsState, state => state.isAdding],
  [getSidebarState, state => state.expandedMap],
  [getSidebarState, state => state.searchTerm],
  [getGlobalState, state => state.lang],
  (
    scorecard,
    scorecardItems,
    resourceId,
    isAdding,
    expandedMap,
    searchTerm,
    lang
  ) => {
    if (!scorecard) {
      return [];
    }
    const resource = scorecardItems.find(x => x.id === resourceId);
    return getScorecardTree({
      scorecard,
      scorecardItems,
      lang,
      expandedMap,
      selectedKey: resource ? getResourceKey(resource) : 'root',
      isAdding,
      searchTerm,
    });
  }
);
