import React from 'react';
import * as R from 'remeda';
import { Modal } from 'src/components/Modal';
import * as Rx from 'src/rx';
import { ItemSymbol, ItemFormSymbol } from '../symbol';
import {
  createModule,
  useSelector,
  createSelector,
  useActions,
} from 'typeless';
import {
  getScorecardTree,
  toggleExpandedKey,
  getAllExpandedMap,
} from 'src/common/sidebar';
import { getStrategicMapsState, StrategicMapsActions } from '../interface';
import { getGlobalState } from 'src/features/global/interface';
import { useTranslation } from 'react-i18next';
import { TreeSidebar } from 'src/components/TreeSidebar';
import { createForm } from 'typeless-form';
import { validateString } from 'src/common/helper';
import { SaveButtons } from 'src/components/SaveButtons';
import { Button } from 'src/components/Button';
import styled from 'styled-components';
import { AddItemModal, AddItemActions } from './AddItemModal';
import {
  BalancedScorecard,
  BalancedScorecardItemType,
  AppStrategicMapGroup,
} from 'src/types-next';
import { getAllScorecards } from 'src/services/API-next';
import { DetailsSkeleton } from 'src/components/DetailsSkeleton';

const Bottom = styled.div`
  display: flex;
  margin-top: 20px;
  justify-content: space-between;

  ${SaveButtons} {
    margin-top: 0;
  }
`;

function getDisabledMap(groups: AppStrategicMapGroup[]) {
  const map = {} as { [x: string]: true };
  groups.forEach(group => {
    group.columns.forEach(column => {
      column.items.forEach(item => {
        map[item.id] = true;
      });
    });
  });
  return map;
}

export function ItemModal() {
  useItemForm();
  handle();
  const { isVisible, searchTerm, isLoaded } = getItemState.useState();
  const { t } = useTranslation();
  const { close, toggleExpanded, search, expandAll } = useActions(ItemActions);
  const items = useSelector(getTreeItems);
  const {
    values: { selected = {} },
  } = getItemFormState.useState();
  const { change, submit } = useActions(ItemFormActions);
  const { groups } = getStrategicMapsState.useState();
  const { show: showAddItem } = useActions(AddItemActions);

  const disabledMap = React.useMemo(() => {
    return getDisabledMap(groups);
  }, [groups]);

  const isSaveDisabled = React.useMemo(() => {
    return (
      Object.keys(selected).filter(
        x => !x.startsWith('root') && !disabledMap[x]
      ).length === 0
    );
  }, [selected, disabledMap]);

  const isAddDisabled = React.useMemo(() => {
    return Object.keys(selected).length === 0;
  }, [selected]);

  const renderDetails = () => {
    if (!isLoaded) {
      return <DetailsSkeleton />;
    }

    return (
      <ItemFormProvider>
        <div style={{ height: items.length * 29 + 120, maxHeight: '70vh' }}>
          <TreeSidebar
            searchTerm={searchTerm}
            isAdding={false}
            search={search}
            toggleExpanded={toggleExpanded}
            items={items}
            expandAll={expandAll}
            onClick={key => {
              const copy = { ...selected };
              if (copy[key]) {
                delete copy[key];
              } else {
                copy[key] = key;
              }
              change('selected', copy);
            }}
            disabledMap={disabledMap}
          />
        </div>
        <Bottom>
          <Button
            disabled={isAddDisabled}
            onClick={() => {
              const first = Object.keys(selected)[0];
              if (!first) {
                return;
              }
              if (first.startsWith('root')) {
                showAddItem(Number(first.split('_')[1]), null);
              } else {
                const item = _getSelectedItem(first);
                showAddItem(item.balancedScorecardId, item.id);
              }
            }}
          >
            {t('Add Item')}
          </Button>
          <SaveButtons
            onCancel={close}
            onSave={submit}
            isSaveDisabled={isSaveDisabled}
          />
        </Bottom>
      </ItemFormProvider>
    );
  };

  return (
    <Modal size="md" isOpen={isVisible} title={t('Add Item')} close={close}>
      <AddItemModal />
      {renderDetails()}
    </Modal>
  );
}

interface ItemState {
  isLoaded: boolean;
  scorecards: BalancedScorecard[];
  isVisible: boolean;
  searchTerm: string;
  expandedMap: { [x: string]: true };
}

export const [handle, ItemActions, getItemState] = createModule(ItemSymbol)
  .withActions({
    show: null,
    close: null,
    expandAll: null,
    loaded: (scorecards: BalancedScorecard[]) => ({ payload: { scorecards } }),
    search: (searchTerm: string) => ({ payload: { searchTerm } }),
    toggleExpanded: (key: string) => ({ payload: { key } }),
    setExpandedMap: (expandedMap: { [x: string]: true }) => ({
      payload: { expandedMap },
    }),
  })
  .withState<ItemState>();

const initialState: ItemState = {
  isVisible: false,
  isLoaded: false,
  scorecards: [],
  searchTerm: '',
  expandedMap: {},
};

handle
  .reducer(initialState)
  .on(ItemActions.show, state => {
    Object.assign(state, initialState);
    state.isVisible = true;
  })
  .on(ItemActions.loaded, (state, { scorecards }) => {
    state.isLoaded = true;
    state.scorecards = scorecards;
  })
  .on(ItemActions.close, state => {
    state.isVisible = false;
  })
  .on(ItemActions.search, (state, { searchTerm }) => {
    state.searchTerm = searchTerm;
  })
  .on(ItemActions.setExpandedMap, (state, { expandedMap }) => {
    state.expandedMap = expandedMap;
  })
  .on(ItemActions.toggleExpanded, (state, { key }) => {
    state.expandedMap = toggleExpandedKey(state.expandedMap, key);
  })
  .on(StrategicMapsActions.scorecardItemCreated, (state, { item }) => {
    const scorecard = state.scorecards.find(
      x => x.id === item.balancedScorecardId
    )!;
    scorecard.scorecardItems.push(item);
  });
export interface ItemFormValues {
  selected: { [x: string]: string };
}

export const [
  useItemForm,
  ItemFormActions,
  getItemFormState,
  ItemFormProvider,
] = createForm<ItemFormValues>({
  symbol: ItemFormSymbol,
  validator: (errors, values) => {
    validateString(errors, values, 'selected');
  },
});

function _getSelectedItem(selected: string) {
  const type = selected.split('_')[0];
  const id = Number(selected.split('_')[1]);
  const { scorecards } = getItemState();
  for (const scorecard of scorecards) {
    for (const item of scorecard.scorecardItems) {
      if (item.id === id && BalancedScorecardItemType[item.typeId] === type) {
        return item;
      }
    }
  }
  throw new Error('Selected item not found');
}

handle
  .epic()
  .on(ItemActions.show, () => ItemFormActions.reset())
  .on(ItemActions.show, () => {
    const { currentPlanId } = getGlobalState();
    return getAllScorecards(currentPlanId).pipe(
      Rx.map(ret => ItemActions.loaded(ret))
    );
  })
  .on(ItemFormActions.setSubmitSucceeded, () => {
    const disabledMap = getDisabledMap(getStrategicMapsState().groups);
    const {
      values: { selected },
    } = getItemFormState();
    const actions = Object.keys(selected)
      .filter(x => !x.startsWith('root') && !disabledMap[x])
      .map(key => {
        const item = _getSelectedItem(key);
        return StrategicMapsActions.addNewItem(key, item.name);
      });
    return [ItemActions.close(), ...actions];
  })
  .on(ItemActions.expandAll, () => {
    const { scorecards } = getItemState();

    const expanded: any = {};
    scorecards.forEach(scorecard => {
      Object.assign(
        expanded,
        getAllExpandedMap(
          scorecard.scorecardItems,
          null,
          `root_${scorecard.id}`
        )
      );
    });

    return Rx.of(ItemActions.setExpandedMap(expanded));
  });
export const getTreeItems = createSelector(
  [getItemState, state => state.scorecards],
  [getItemFormState, state => state.values.selected],
  [getItemState, state => state.searchTerm],
  [getItemState, state => state.expandedMap],
  [getGlobalState, state => state.lang],
  (scorecards, selected = {}, searchTerm, expandedMap, lang) => {
    return R.flatMap(scorecards, scorecard =>
      getScorecardTree({
        scorecard,
        scorecardItems: scorecard.scorecardItems,
        lang,
        expandedMap,
        selectedKey: key => !!selected[key],
        isAdding: false,
        searchTerm,
        noHref: true,
        noRootSelect: false,
        rootKey: `root_${scorecard.id}`,
      })
    );
  }
);
