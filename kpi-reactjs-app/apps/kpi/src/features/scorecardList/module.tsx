import React from 'react';
import * as Rx from 'src/rx';
import * as R from 'remeda';
import { ScorecardListView } from './components/ScorecardListView';
import {
  getScorecardsList,
  createScorecardsList,
  updateScorecardsList,
} from 'src/services/API-next';
import {
  ScorecardListActions,
  ScorecardListState,
  handle,
  getScorecardListState,
} from './interface';
import { SelectOption } from 'src/types';
import {
  useScorecardListForm,
  ScorecardListFormActions,
  getScorecardListFormState,
} from './scorecardList-form';
import { getRouterState, RouterActions } from 'typeless-router';
import { catchErrorAndShowModal } from 'src/common/utils';
import { GlobalActions, getGlobalState } from '../global/interface';
import { DisplayTransString } from 'src/components/DisplayTransString';
import { useLanguage } from 'src/hooks/useLanguage';
import { BreadcrumbsActions } from 'src/components/Breadcrumbs';

handle
  .epic()
  .on(ScorecardListActions.$mounted, () => {
    const id = R.last(getRouterState().location!.pathname.split('/'));
    if (id === 'new') {
      return Rx.from([
        ScorecardListFormActions.reset(),
        ScorecardListActions.loaded(null),
      ]);
    }
    const lang = useLanguage();
    const { organizationUnits } = getGlobalState();
    return getScorecardsList(Number(id)).pipe(
      Rx.mergeMap(ret => {
        const unit = (organizationUnits || []).find(
          unit => unit.id === ret.unitId
        );
        return [
          BreadcrumbsActions.update({
            en: ret.name.en,
            ar: ret.name.ar,
          }),
          ScorecardListFormActions.changeMany({
            name_ar: ret.name.ar,
            name_en: ret.name.en,
            description_ar: ret.description.ar,
            description_en: ret.description.en,
            unitId: unit
              ? ({
                  label: <DisplayTransString value={unit.name} />,
                  value: unit.id,
                  filterName: unit.name[lang],
                } as SelectOption)
              : undefined,
          }),
          ScorecardListActions.loaded(ret),
        ];
      }),
      catchErrorAndShowModal()
    );
  })
  .on(ScorecardListFormActions.setSubmitSucceeded, () => {
    const { scorecardList } = getScorecardListState();
    const { values } = getScorecardListFormState();
    const { currentPlanId, organizationId } = getGlobalState();

    const mapped = {
      name: {
        ar: values.name_ar,
        en: values.name_en,
      },
      description: {
        ar: values.description_ar,
        en: values.description_en,
      },
      unitId: values.unitId ? values.unitId.value : null,
      organizationId,
      strategicPlanId: currentPlanId,
    };

    return Rx.concatObs(
      Rx.of(ScorecardListActions.setSaving(true)),
      Rx.defer(() => {
        if (scorecardList) {
          return updateScorecardsList(scorecardList.id, {
            id: scorecardList.id,
            ...mapped,
          });
        }
        return createScorecardsList(mapped);
      }).pipe(
        Rx.mergeMap(() => {
          return [
            GlobalActions.showNotification(
              'success',
              scorecardList
                ? 'Scorecard List updated successfully'
                : 'Scorecard List created successfully'
            ),
            RouterActions.push('/settings/scorecards'),
          ];
        }),
        catchErrorAndShowModal()
      ),
      Rx.of(ScorecardListActions.setSaving(false))
    );
  });

const initialState: ScorecardListState = {
  id: '',
  isLoading: true,
  isSaving: false,
  isDeleting: false,
  scorecardList: null,
};

handle
  .reducer(initialState)
  .replace(ScorecardListActions.$init, () => initialState)
  .on(ScorecardListActions.loaded, (state, { scorecard }) => {
    state.scorecardList = scorecard;
    state.isLoading = false;
  })
  .on(ScorecardListActions.setSaving, (state, { isSaving }) => {
    state.isSaving = isSaving;
  });

export default () => {
  useScorecardListForm();
  handle();
  return <ScorecardListView />;
};
