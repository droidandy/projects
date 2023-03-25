import { getInfoFormState } from './info-form';
import { createSelector } from 'typeless';
import { getGlobalState } from '../global/interface';
import { InitiativeItemType } from 'src/types-next';
import i18n from 'src/i18n';
import { getInitiativesState } from './interface';

export const getCurrentItemTitle = createSelector(
  [getGlobalState, state => state.lang],
  [getInfoFormState, state => state.values.name_ar],
  [getInfoFormState, state => state.values.name_en],
  [getInfoFormState, state => state.values.type],
  [getInitiativesState, state => state.isAdding],
  (lang, name_ar, name_en, type, isAdding) => {
    const name = {
      en: name_en,
      ar: name_ar,
    }[lang];
    if (name) {
      return name;
    }
    switch (type ? type.value : 0) {
      case InitiativeItemType.Activity:
        return i18n.t(isAdding ? 'Create Activity' : 'Activity');
      default:
        return i18n.t(isAdding ? 'Create Initiative' : 'Initiative');
    }
  }
);
