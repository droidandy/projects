import { createForm } from 'typeless-form';
import { OrganizationFormSymbol } from './symbol';
import { validateString } from 'src/common/helper';

export interface OrganizationFormValues {
  name_en: string;
  name_ar: string;
}

export const [
  useOrganizationForm,
  OrganizationFormActions,
  getOrganizationFormState,
  OrganizationFormProvider,
] = createForm<OrganizationFormValues>({
  symbol: OrganizationFormSymbol,
  validator: (errors, values) => {
    validateString(errors, values, 'name_en');
    validateString(errors, values, 'name_ar');
  },
});
