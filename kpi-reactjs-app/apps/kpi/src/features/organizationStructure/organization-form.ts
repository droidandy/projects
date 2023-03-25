import { createForm } from 'typeless-form';
import { OrganizationStructureFormSymbol } from './symbol';
import { validateLangString } from 'src/common/helper';

export interface OrganizationFormValues {
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
}

export const [
  useOrganizationForm,
  OrganizationFormActions,
  getOrganizationFormState,
  OrganizationFormProvider,
] = createForm<OrganizationFormValues>({
  symbol: OrganizationStructureFormSymbol,
  validator: (errors, values) => {
    validateLangString(errors, values, 'name');
    validateLangString(errors, values, 'description');
  },
});
