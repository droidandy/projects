import { createForm } from 'typeless-form';
import { ReportPageFormSymbol } from './symbol';
import { validateString } from 'src/common/helper';

export interface ReportPageFormValues {
    name_en: string;
    name_ar: string;
}

export const [
    useReportPageForm,
    ReportPageFormActions,
    getReportPageFormState,
    ReportPageFormProvider,
] = createForm<ReportPageFormValues>({
    symbol: ReportPageFormSymbol,
    validator: (errors, values) => {
        validateString(errors, values, 'name_en');
        validateString(errors, values, 'name_ar');
    },
});