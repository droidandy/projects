import React from 'react';
import * as Rx from 'src/rx';
import * as R from 'remeda';
import { ColorThemeView } from './components/ColorThemeView';
import {
  getColorTheme,
  createColorTheme,
  updateColorTheme,
} from 'src/services/API';
import {
  ColorThemeActions,
  ColorThemeState,
  handle,
  getColorThemeState,
} from './interface';
import {
  useColorThemeForm,
  ColorThemeFormActions,
  getColorThemeFormState,
} from './colorTheme-form';
import { getRouterState, RouterActions } from 'typeless-router';
import { catchErrorAndShowModal } from 'src/common/utils';
import { ColorTheme } from 'src/types-next';
import { GlobalActions } from '../global/interface';
import { ColorThemeProps } from 'src/const';
import { BreadcrumbsActions } from 'src/components/Breadcrumbs';

// --- Epic ---
handle
  .epic()
  .on(ColorThemeActions.$mounted, () => {
    const id = R.last(getRouterState().location!.pathname.split('/'));
    if (id === 'new') {
      return Rx.from([
        ColorThemeFormActions.reset(),
        ColorThemeActions.loaded(null),
      ]);
    }
    return getColorTheme(Number(id)).pipe(
      Rx.mergeMap(ret => [
        BreadcrumbsActions.update({
          en: ret.name.en,
          ar: ret.name.ar,
        }),
        ColorThemeFormActions.replace({
          name_ar: ret.name.ar,
          name_en: ret.name.en,
          ...ColorThemeProps.reduce((colors, prop) => {
            colors[prop] = ret.vars[prop];
            return colors;
          }, {} as any),
        }),
        ColorThemeActions.loaded(ret),
      ]),
      catchErrorAndShowModal()
    );
  })

  .on(ColorThemeFormActions.setSubmitSucceeded, () => {
    const { colorTheme } = getColorThemeState();
    const { values } = getColorThemeFormState();

    const mapped: Omit<ColorTheme, 'id'> = {
      name: {
        ar: values.name_ar,
        en: values.name_en,
      },
      vars: ColorThemeProps.reduce((ret, prop) => {
        ret[prop] = values[prop];
        return ret;
      }, {} as any),
    };
    return Rx.concatObs(
      Rx.of(ColorThemeActions.setSaving(true)),
      Rx.defer(() => {
        if (colorTheme) {
          return updateColorTheme(colorTheme.id, {
            id: colorTheme.id,
            ...mapped,
          });
        }
        return createColorTheme(mapped);
      }).pipe(
        Rx.mergeMap(() => {
          return [
            GlobalActions.showNotification(
              'success',
              colorTheme
                ? 'Color Theme updated successfully'
                : 'Color Theme created successfully'
            ),
            RouterActions.push('/settings/color-themes'),
          ];
        }),
        catchErrorAndShowModal()
      ),
      Rx.of(ColorThemeActions.setSaving(false))
    );
  });

// --- Reducer ---
const initialState: ColorThemeState = {
  id: 0,
  isLoading: true,
  isSaving: false,
  colorTheme: null,
};

handle
  .reducer(initialState)
  .replace(ColorThemeActions.$init, () => initialState)
  .on(ColorThemeActions.loaded, (state, { colorTheme }) => {
    state.colorTheme = colorTheme;
    state.isLoading = false;
  })
  .on(ColorThemeActions.setSaving, (state, { isSaving }) => {
    state.isSaving = isSaving;
  });

// --- Module ---
export default () => {
  useColorThemeForm();
  handle();
  return <ColorThemeView />;
};
