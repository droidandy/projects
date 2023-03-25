import { createForm } from 'typeless-form';
import { ExcellenceThemeFormSymbol } from './symbol';
import { validateLangString } from 'src/common/helper';

export interface ExcellenceThemeFormValues {
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  [x: string]: any;
}

export const [
  useExcellenceThemeForm,
  ExcellenceThemeFormActions,
  getExcellenceThemeFormState,
  ExcellenceThemeFormProvider,
] = createForm<ExcellenceThemeFormValues>({
  symbol: ExcellenceThemeFormSymbol,
  validator: (errors, values) => {
    validateLangString(errors, values, 'name');
    validateLangString(errors, values, 'description');
  },
});
