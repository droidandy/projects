import { createForm } from 'typeless-form';
import { LookupManagementFormSymbol } from './symbol';
import { validateString } from 'src/common/helper';

export interface LookupManagementFormValues {
    name_en: string;
    name_ar: string;
    category: string;
    slug: string;
}

export const [
    useLookupManagementForm,
    LookupManagementFormActions,
    getLookupManagementFormState,
    LookupManagementFormProvider,
] = createForm<LookupManagementFormValues>({
    symbol: LookupManagementFormSymbol,
    validator: (errors, values) => {
        validateString(errors, values, 'name_en');
        validateString(errors, values, 'name_ar');
        validateString(errors, values, 'category');
        validateString(errors, values, 'slug');
    },
});
