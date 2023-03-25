import {
  createModule,
  useActions,
  createSelector,
  useSelector,
} from 'typeless';
import * as Rx from 'src/rx';
import { RelatedItemSymbol, RelatedItemFormSymbol } from '../symbol';
import { createForm } from 'typeless-form';
import { validateString } from 'src/common/helper';
import React from 'react';
import { Modal } from 'src/components/Modal';
import { useTranslation } from 'react-i18next';
import { SaveButtons } from 'src/components/SaveButtons';
import { getGlobalState } from 'src/features/global/interface';
import { Initiative, BalancedScorecard } from 'src/types-next';
import {
  getAllExpandedMap,
  getScorecardTree,
  getInitiativeTree,
  toggleExpandedKey,
} from 'src/common/sidebar';
import { TreeSidebar } from 'src/components/TreeSidebar';
import { getRelatedItemsState, RelatedItemsActions } from '../interface';
import {
  createRelatedItem,
  getScorecard,
  getInitiatives,
} from 'src/services/API-next';
import { catchErrorAndShowModal } from 'src/common/utils';
import { DetailsSkeleton } from 'src/components/DetailsSkeleton';

export function RelatedItemModal() {
  useRelatedItemForm();
  handle();
  const { t } = useTranslation();
  const {
    isVisible,
    isSaving,
    searchTerm,
    isLoaded,
  } = getRelatedItemState.useState();
  const { submit } = useActions(RelatedItemFormActions);
  const { close } = useActions(RelatedItemActions);
  const {
    values: { selected },
  } = getRelatedItemFormState.useState();
  const { search, toggleExpanded, expandAll } = useActions(RelatedItemActions);
  const items = useSelector(getTreeItems);
  const { change } = useActions(RelatedItemFormActions);

  const renderDetails = () => {
    if (!isLoaded) {
      return <DetailsSkeleton />;
    }
    return (
      <RelatedItemFormProvider>
        <div style={{ height: items.length * 29 + 120, maxHeight: '70vh' }}>
          <TreeSidebar
            searchTerm={searchTerm}
            isAdding={false}
            search={search}
            items={items}
            toggleExpanded={toggleExpanded}
            expandAll={expandAll}
            onClick={key => {
              if (key !== 'root') {
                change('selected', key);
              }
            }}
          />
        </div>
        <SaveButtons
          onCancel={close}
          onSave={submit}
          isSaving={isSaving}
          isSaveDisabled={!selected}
        />
      </RelatedItemFormProvider>
    );
  };

  return (
    <Modal
      size="md"
      isOpen={isVisible}
      title={t('Add Related Item')}
      close={close}
    >
      {renderDetails()}
    </Modal>
  );
}

export const [handle, RelatedItemActions, getRelatedItemState] = createModule(
  RelatedItemSymbol
)
  .withActions({
    show: null,
    close: null,
    setSaving: (isSaving: boolean) => ({ payload: { isSaving } }),
    loaded: (scorecard: BalancedScorecard, initiatives: Initiative[]) => ({
      payload: { scorecard, initiatives },
    }),
    search: (searchTerm: string) => ({ payload: { searchTerm } }),
    toggleExpanded: (key: string) => ({ payload: { key } }),
    setExpandedMap: (expandedMap: { [x: string]: true }) => ({
      payload: { expandedMap },
    }),
    expandAll: null,
  })
  .withState<RelatedItemState>();

const initialState: RelatedItemState = {
  isSaving: false,
  isVisible: false,
  isLoaded: false,
  searchTerm: '',
  expandedMap: {},
  scorecard: null!,
  initiatives: [],
};

interface RelatedItemState {
  isVisible: boolean;
  isSaving: boolean;
  isLoaded: boolean;
  searchTerm: string;
  expandedMap: { [x: string]: true };
  scorecard: BalancedScorecard;
  initiatives: Initiative[];
}

export interface RelatedItemFormValues {
  selected: string;
}

export const [
  useRelatedItemForm,
  RelatedItemFormActions,
  getRelatedItemFormState,
  RelatedItemFormProvider,
] = createForm<RelatedItemFormValues>({
  symbol: RelatedItemFormSymbol,
  validator: (errors, values) => {
    validateString(errors, values, 'selected');
  },
});

handle
  .epic()
  .on(RelatedItemActions.show, () => RelatedItemFormActions.reset())
  .on(RelatedItemActions.show, () => {
    const { currentPlanId, currentUnitId } = getGlobalState();
    return Rx.forkJoin(
      getScorecard(currentPlanId, currentUnitId),
      getInitiatives(currentPlanId, currentUnitId)
    ).pipe(
      Rx.map(([scorecard, initiatives]) =>
        RelatedItemActions.loaded(scorecard!, initiatives)
      ),
      catchErrorAndShowModal()
    );
  })
  .on(RelatedItemFormActions.setSubmitSucceeded, () => {
    const {
      values: { selected },
    } = getRelatedItemFormState();
    const { type, id } = getRelatedItemsState();
    const [toType, toId] = selected.split('_');
    return Rx.concatObs(
      Rx.of(RelatedItemActions.setSaving(true)),
      createRelatedItem({
        fromObjectType: type,
        fromObjectId: id,
        toObjectType: toType,
        toObjectId: Number(toId),
      }).pipe(
        Rx.mergeMap(ret => [
          RelatedItemsActions.created(ret),
          RelatedItemActions.close(),
        ]),
        catchErrorAndShowModal()
      ),
      Rx.of(RelatedItemActions.setSaving(false))
    );
  })
  .on(RelatedItemActions.expandAll, () => {
    const { scorecard, initiatives } = getRelatedItemState();
    return Rx.of(
      RelatedItemActions.setExpandedMap(
        getAllExpandedMap(scorecard.scorecardItems, initiatives)
      )
    );
  });

handle
  .reducer(initialState)
  .on(RelatedItemActions.loaded, (state, { scorecard, initiatives }) => {
    state.scorecard = scorecard;
    state.initiatives = initiatives;
    state.isLoaded = true;
  })
  .on(RelatedItemActions.show, state => {
    state.isVisible = true;
  })
  .on(RelatedItemActions.close, state => {
    state.isVisible = false;
  })
  .on(RelatedItemActions.setSaving, (state, { isSaving }) => {
    state.isSaving = isSaving;
  })
  .on(RelatedItemActions.search, (state, { searchTerm }) => {
    state.searchTerm = searchTerm;
  })
  .on(RelatedItemActions.setExpandedMap, (state, { expandedMap }) => {
    state.expandedMap = expandedMap;
  })
  .on(RelatedItemActions.toggleExpanded, (state, { key }) => {
    state.expandedMap = toggleExpandedKey(state.expandedMap, key);
  });

export const getTreeItems = createSelector(
  [getRelatedItemState, state => state.isLoaded],
  [getRelatedItemState, state => state.scorecard],
  [getRelatedItemState, state => state.initiatives],
  [getRelatedItemFormState, state => state.values.selected],
  [getRelatedItemState, state => state.searchTerm],
  [getRelatedItemState, state => state.expandedMap],
  [getGlobalState, state => state.lang],
  (
    isLoaded,
    scorecard,
    initiatives,
    selected,
    searchTerm,
    expandedMap,
    lang
  ) => {
    if (!isLoaded) {
      return [];
    }

    return [
      ...getScorecardTree({
        scorecard,
        scorecardItems: scorecard.scorecardItems,
        lang,
        expandedMap,
        selectedKey: selected,
        isAdding: false,
        searchTerm,
        noHref: true,
        noRootSelect: true,
      }),
      ...getInitiativeTree({
        initiatives,
        lang,
        expandedMap,
        selectedKey: selected,
        isAdding: false,
        searchTerm,
        noHref: true,
      }),
    ];
  }
);
