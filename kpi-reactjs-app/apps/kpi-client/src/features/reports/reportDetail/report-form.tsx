import { createForm } from 'typeless-form';
import { ReportFormSymbol } from './symbol';

export function validateString(errors: any, values: any, name: string) {
  if (!values[name]) {
    errors[name] = 'This field is required!';
  }
}

export interface ReportPageFormValues {
  name_en: string;
  name_ar: string;
}

export const [
  useReportForm,
  ReportFormActions,
  getReportFormState,
  ReportFormProvider,
] = createForm<ReportPageFormValues>({
  symbol: ReportFormSymbol,
  validator: (errors, values) => {
    validateString(errors, values, 'name_en');
    validateString(errors, values, 'name_ar');
  },
});
