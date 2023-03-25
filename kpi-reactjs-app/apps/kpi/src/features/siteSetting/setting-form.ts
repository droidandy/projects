import { createForm } from 'typeless-form';
import { SettingFormSymbol } from './symbol';
import {
  validateLangString,
  validateOption,
  validateString,
} from 'src/common/helper';
import { SelectOption } from '../../types';
import { KpiSettingType } from '../../types-next';

export interface SiteSettingFormValues {
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  key: string;
  value: string;
  type: SelectOption<KpiSettingType>;
}

export const [
  useSiteSettingForm,
  SiteSettingFormActions,
  getSiteSettingFormState,
  SiteSettingFormProvider,
] = createForm<SiteSettingFormValues>({
  symbol: SettingFormSymbol,
  validator: (errors, values) => {
    validateLangString(errors, values, 'name');
    validateLangString(errors, values, 'description');
    validateOption(errors, values, 'type');
    validateString(errors, values, 'key');
    validateString(errors, values, 'value');
  },
});
