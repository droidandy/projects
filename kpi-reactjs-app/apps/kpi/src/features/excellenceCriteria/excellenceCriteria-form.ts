import { createForm } from 'typeless-form';
import { ExcellenceCriteriaFormSymbol } from './symbol';
import { validateLangString } from 'src/common/helper';
import { SelectOption } from '../../types';

export interface ExcellenceCriteriaFormValues {
  name_en: string;
  name_ar: string;
  parentId: SelectOption | null;
}

export const [
  useExcellenceCriteriaForm,
  ExcellenceCriteriaFormActions,
  getExcellenceCriteriaFormState,
  ExcellenceCriteriaFormProvider,
] = createForm<ExcellenceCriteriaFormValues>({
  symbol: ExcellenceCriteriaFormSymbol,
  validator: (errors, values) => {
    validateLangString(errors, values, 'name');
  },
});
