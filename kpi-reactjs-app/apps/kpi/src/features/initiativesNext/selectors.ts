import { getInfoFormState } from './info-form';
import { createSelector } from 'typeless';
import { getGlobalState } from '../global/interface';
import i18n from 'src/i18n';
import { getInitiativesState } from './interface';

export const getCurrentItemTitle = createSelector(
  [getGlobalState, state => state.lang],
  [getInfoFormState, state => state.values.name_ar],
  [getInfoFormState, state => state.values.name_en],
  [getInitiativesState, state => state.isAdding],
  [getInitiativesState, state => state.isEditing],
  [getInitiativesState, state => state.initiative],
  (lang, name_ar, name_en, isAdding, isEditing, initiative) => {
    if (initiative && !isEditing) {
      return initiative.name[lang];
    }
    const name = {
      en: name_en,
      ar: name_ar,
    }[lang];
    if (name) {
      return name;
    }
    return i18n.t(isAdding ? 'Create Activity' : 'Activity');
  }
);
