import React from 'react';
import * as Rx from 'src/rx';
import * as R from 'remeda';
import { SiteSettingView } from './components/SiteSettingView';
import {
  createSiteSetting,
  getSiteSettings,
  updateSiteSettings,
} from 'src/services/API-next';
import {
  SettingActions,
  SettingState,
  getSettingState,
  handle,
} from './interface';
import {
  SiteSettingFormActions,
  getSiteSettingFormState,
  useSiteSettingForm,
} from './setting-form';
import { getRouterState, RouterActions } from 'typeless-router';
import { Setting } from 'src/types-next';
import { GlobalActions, getGlobalState } from '../global/interface';
import { catchErrorAndShowModal, getSelectOption } from '../../common/utils';
import { settingTypeOptions } from '../../common/options';
import { BreadcrumbsActions } from 'src/components/Breadcrumbs';

// --- Epic ---
handle
  .epic()
  .on(SettingActions.$mounted, () => {
    const id = R.last(getRouterState().location!.pathname.split('/'));
    if (id === 'new') {
      return Rx.from([
        SiteSettingFormActions.reset(),
        SettingActions.loaded(null),
      ]);
    }
    return getSiteSettings(Number(id))
      .pipe(
        Rx.mergeMap(setting => [
          BreadcrumbsActions.update({
            en: setting.name.en,
            ar: setting.name.ar,
          }),
          SiteSettingFormActions.changeMany({
            name_ar: setting.name.ar,
            name_en: setting.name.en,
            description_ar: setting.description.ar,
            description_en: setting.description.en,
            key: setting.key,
            type: getSelectOption(settingTypeOptions, setting.type)!,
            value: setting.value,
          }),
          SettingActions.loaded(setting),
        ])
      )
      .pipe(catchErrorAndShowModal());
  })
  .on(SiteSettingFormActions.setSubmitSucceeded, () => {
    const { setting } = getSettingState();
    const { values: formValues } = getSiteSettingFormState();
	const { organizationId } = getGlobalState();
    const mapped: Omit<Setting, 'id'> = {
	  linkedObjectId: organizationId,
      name: {
        ar: formValues.name_ar,
        en: formValues.name_en,
      },
      description: {
        ar: formValues.description_ar,
        en: formValues.description_en,
      },
      key: formValues.key,
      type: formValues.type.value,
      value:
        formValues.type.value === 'Boolean'
          ? formValues.value.toLowerCase()
          : formValues.value,
    };
    return Rx.concatObs(
      Rx.of(SettingActions.setSaving(true)),
      Rx.defer(() => {
        if (setting) {
          return updateSiteSettings(setting.id, {
            id: setting.id,
            ...mapped,
          });
        }
        return createSiteSetting(mapped);
      }).pipe(
        Rx.mergeMap(() => {
          return [
            GlobalActions.showNotification(
              'success',
              setting
                ? 'Site Setting updated successfully'
                : 'Site Setting created successfully'
            ),
            RouterActions.push('/settings/site-settings'),
          ];
        }),
        catchErrorAndShowModal()
      ),
      Rx.of(SettingActions.setSaving(false))
    );
  });

// --- Reducer ---
const initialState: SettingState = {
  id: 0,
  isLoading: true,
  isSaving: false,
  setting: null,
};

handle
  .reducer(initialState)
  .replace(SettingActions.$init, () => initialState)
  .on(SettingActions.loaded, (state, { setting }) => {
    state.setting = setting;
    state.isLoading = false;
  })
  .on(SettingActions.setSaving, (state, { isSaving }) => {
    state.isSaving = isSaving;
  });

// --- Module ---
export default () => {
  useSiteSettingForm();
  handle();
  return <SiteSettingView />;
};
