import React from 'react';
import * as Rx from 'src/rx';
import * as R from 'remeda';
import { StrategicPlanView } from './components/StrategicPlanView';
import {
  getStrategicPlanById,
  createStrategicPlan,
  updateStrategicPlan,
  uploadFile,
} from 'src/services/API-next';
import {
  StrategicPlanActions,
  StrategicPlanState,
  handle,
  getStrategicPlanState,
  StrategicPlanIcon,
} from './interface';
import {
  useStrategicPlanForm,
  StrategicPlanFormActions,
  getStrategicPlanFormState,
} from './strategicPlan-form';
import { getRouterState, RouterActions } from 'typeless-router';
import { catchErrorAndShowModal } from 'src/common/utils';
import { StrategicPlan, FileDocument } from 'src/types-next';
import { GlobalActions, getGlobalState } from '../global/interface';
import {
  useStrategicPlanFormValues,
  StrategicPlanFormValuesActions,
} from './components/StrategicPlanForm';
import { BreadcrumbsActions } from 'src/components/Breadcrumbs';

// --- Epic ---
handle
  .epic()
  .on(StrategicPlanActions.$mounted, () => {
    const id = R.last(getRouterState().location!.pathname.split('/'));
    if (id === 'new') {
      return Rx.from([
        StrategicPlanFormActions.reset(),
        StrategicPlanActions.loaded(null),
      ]);
    }
    return getStrategicPlanById(id).pipe(
      Rx.mergeMap(ret => [
        BreadcrumbsActions.update({
          en: ret.name.en,
          ar: ret.name.ar,
        }),
        StrategicPlanFormActions.replace({
          name_ar: ret.name.ar,
          name_en: ret.name.en,
          description_ar: ret.description!.ar,
          description_en: ret.description!.en,
          startYear: ret.startYear,
          endYear: ret.endYear,
          vision_ar: ret.vision ? ret.vision.text!.ar : '',
          vision_en: ret.vision ? ret.vision.text!.en : '',
          mission_ar: ret.mission ? ret.mission.text!.ar : '',
          mission_en: ret.mission ? ret.mission.text!.en : '',
          strengths_ar: ret.strengths ? ret.strengths!.text!.ar : '',
          strengths_en: ret.strengths ? ret.strengths!.text!.en : '',
          weaknesses_ar: ret.strengths ? ret.weaknesses!.text!.ar : '',
          weaknesses_en: ret.weaknesses ? ret.weaknesses!.text!.en : '',
          opportunities_ar: ret.opportunities
            ? ret.opportunities!.text!.ar
            : '',
          opportunities_en: ret.opportunities
            ? ret.opportunities!.text!.en
            : '',
          threats_ar: ret.threats ? ret.threats!.text!.ar : '',
          threats_en: ret.threats ? ret.threats!.text!.en : '',
        }),
        StrategicPlanActions.loaded(ret),
      ]),
      catchErrorAndShowModal()
    );
  })
  .on(StrategicPlanActions.validateForm, () => {
    const { values } = getStrategicPlanState();
    if (values.length) {
      return [StrategicPlanFormActions.submit()];
    } else {
      return [
        StrategicPlanFormActions.submit(),
        StrategicPlanFormValuesActions.submit(),
      ];
    }
  })
  .on(StrategicPlanFormActions.setSubmitSucceeded, () => {
    const {
      strategicPlan,
      icons,
      values: arrayValues,
    } = getStrategicPlanState();
    const { values } = getStrategicPlanFormState();
    const { organizationId } = getGlobalState();
    const vision: StrategicPlanIcon | undefined = icons.find(
      (el: StrategicPlanIcon) => el.field === 'vision'
    );
    const mission: StrategicPlanIcon | undefined = icons.find(
      (el: StrategicPlanIcon) => el.field === 'mission'
    );
    const opportunities: StrategicPlanIcon | undefined = icons.find(
      (el: StrategicPlanIcon) => el.field === 'opportunities'
    );
    const strengths: StrategicPlanIcon | undefined = icons.find(
      (el: StrategicPlanIcon) => el.field === 'strengths'
    );
    const weaknesses: StrategicPlanIcon | undefined = icons.find(
      (el: StrategicPlanIcon) => el.field === 'weaknesses'
    );
    const threats: StrategicPlanIcon | undefined = icons.find(
      (el: StrategicPlanIcon) => el.field === 'threats'
    );

    const mapped: Omit<StrategicPlan, 'id'> = {
      name: {
        ar: values.name_ar,
        en: values.name_en,
      },
      description: {
        ar: values.description_ar,
        en: values.description_en,
      },
      startYear: Number(values.startYear),
      endYear: Number(values.endYear),
      vision: {
        text: {
          ar: values.vision_ar,
          en: values.vision_en,
        },
        iconId: vision ? vision!.iconId : null,
      },
      mission: {
        text: {
          ar: values.mission_ar,
          en: values.mission_en,
        },
        iconId: mission ? mission!.iconId : null,
      },
      values: arrayValues.map(({ iconId, text }) => ({ iconId, text })),
      strengths: {
        text: {
          ar: values.strengths_ar,
          en: values.strengths_en,
        },
        iconId: strengths ? strengths!.iconId : null,
      },
      weaknesses: {
        text: {
          ar: values.weaknesses_ar,
          en: values.weaknesses_en,
        },
        iconId: weaknesses ? weaknesses!.iconId : null,
      },
      opportunities: {
        text: {
          ar: values.opportunities_ar,
          en: values.opportunities_en,
        },
        iconId: opportunities ? opportunities!.iconId : null,
      },
      threats: {
        text: {
          ar: values.threats_ar,
          en: values.threats_en,
        },
        iconId: threats ? threats!.iconId : null,
      },
      organizationId,
    };
    if (arrayValues.length) {
      return Rx.concatObs(
        Rx.of(StrategicPlanActions.setSaving(true)),
        Rx.defer(() => {
          if (strategicPlan) {
            return updateStrategicPlan(strategicPlan.id, {
              id: strategicPlan.id,
              ...mapped,
            });
          }
          return createStrategicPlan(mapped);
        }).pipe(
          Rx.mergeMap(() => {
            return [
              GlobalActions.showNotification(
                'success',
                strategicPlan
                  ? 'Strategic Plan updated successfully'
                  : 'Strategic Plan created successfully'
              ),
              RouterActions.push('/settings/strategic-plans'),
            ];
          }),
          catchErrorAndShowModal()
        ),
        Rx.of(StrategicPlanActions.setSaving(false))
      );
    } else {
      return [
        StrategicPlanFormValuesActions.submit(),
        StrategicPlanFormActions.setSubmitFailed(),
      ];
    }
  })
  .on(StrategicPlanActions.uploadIcon, (item: any) => {
    return Rx.concatObs(
      Rx.defer(() => {
        return uploadFile(item.file);
      }).pipe(
        Rx.mergeMap((result: FileDocument) => {
          const newIcon = {
            field: item.field,
            icon: result,
            iconId: result.id,
          };
          return [StrategicPlanActions.setIcon(newIcon)];
        }),
        catchErrorAndShowModal()
      )
    );
  });

// --- Reducer ---
const initialState: StrategicPlanState = {
  id: '',
  isLoading: true,
  isSaving: false,
  strategicPlan: null,
  icons: [],
  values: [],
};

handle
  .reducer(initialState)
  .replace(StrategicPlanActions.$init, () => initialState)
  .on(StrategicPlanActions.loaded, (state, { strategicPlan }) => {
    state.strategicPlan = strategicPlan;
    if (strategicPlan) {
      state.values = strategicPlan!.values;
      state.icons = [
        {
          icon: strategicPlan.vision ? strategicPlan.vision.icon : null,
          iconId: strategicPlan.vision ? strategicPlan.vision.iconId : null,
          field: 'vision',
        },
        {
          icon: strategicPlan.mission ? strategicPlan.mission.icon : null,
          iconId: strategicPlan.mission ? strategicPlan.mission.iconId : null,
          field: 'mission',
        },
        {
          icon: strategicPlan.opportunities
            ? strategicPlan.opportunities.icon
            : null,
          iconId: strategicPlan.opportunities
            ? strategicPlan.opportunities.iconId
            : null,
          field: 'opportunities',
        },
        {
          icon: strategicPlan.strengths ? strategicPlan.strengths.icon : null,
          iconId: strategicPlan.strengths
            ? strategicPlan.strengths.iconId
            : null,
          field: 'strengths',
        },
        {
          icon: strategicPlan.weaknesses ? strategicPlan.weaknesses.icon : null,
          iconId: strategicPlan.weaknesses
            ? strategicPlan.weaknesses.iconId
            : null,
          field: 'weaknesses',
        },
        {
          icon: strategicPlan.threats ? strategicPlan.threats.icon : null,
          iconId: strategicPlan.threats ? strategicPlan.threats.iconId : null,
          field: 'threats',
        },
      ];
    }
    state.isLoading = false;
  })
  .on(StrategicPlanActions.setSaving, (state, { isSaving }) => {
    state.isSaving = isSaving;
  })
  .on(StrategicPlanActions.clearValueIcon, state => {
    state.icons = [...state.icons].filter(icon => icon.field !== 'values');
  })
  .on(StrategicPlanActions.setIcon, (state, item) => {
    if (state.icons.length) {
      const iconsArray = [...state.icons].filter(
        icon => icon.field !== item.field
      );
      state.icons = [...iconsArray, item];
    } else {
      state.icons = [item];
    }
  })
  .on(StrategicPlanActions.setValues, (state, item) => {
    state.values = [...state.values, item];
  })
  .on(StrategicPlanActions.deleteValue, (state, id) => {
    state.values = [...state.values].filter(el => el.id !== id);
  });

// --- Module ---
export default () => {
  useStrategicPlanForm();
  useStrategicPlanFormValues();
  handle();
  return <StrategicPlanView />;
};
